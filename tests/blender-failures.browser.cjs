const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.QA_URL||'http://127.0.0.1:4173/';
const report=[];
const output=process.env.QA_OUTPUT || path.resolve('../portfolio-blender-review');
fs.mkdirSync(output,{recursive:true});
async function load(browser, configure) {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  if(configure) await configure(page);
  await page.goto(`${base}?nopreload=1&theme=light`,{waitUntil:'networkidle'});
  return {page,errors};
}
async function ready(page) {
  await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='ready',null,{timeout:90000});
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    {
      let attempts=0;
      const {page,errors}=await load(browser,async page=>{
        await page.route('**/models/blender/models.json',async route=>{
          if(++attempts<3) await route.fulfill({status:503,body:'Unavailable'});
          else await route.continue();
        });
      });
      await page.locator('.bw-card [data-inspect-model="industrial-robot-arm"]').last().click();
      await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='error');
      await page.locator('#biRetry').click();
      await ready(page);
      assert.equal(attempts,3,'Failed metadata can be fetched again');
      assert.deepEqual(errors,[],'Metadata retry produces no page errors');
      await page.locator('#biClose').click();
      report.push({scenario:'metadata failure and retry',passed:true});
      await page.close();
    }
    {
      const {page,errors}=await load(browser);
      await page.locator('.bw-card [data-inspect-model="industrial-robot-arm"]').last().click();
      await ready(page);
      assert.equal(await page.locator('#biRotate').isDisabled(),true,'Reduced motion disables automatic rotation');
      await page.emulateMedia({reducedMotion:'no-preference'});
      await page.waitForFunction(()=>!document.querySelector('#biRotate').disabled);
      await page.locator('#biRotate').click();
      assert.equal(await page.locator('#biRotate').getAttribute('aria-pressed'),'true');
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.waitForFunction(()=>document.querySelector('#biRotate').disabled);
      assert.equal(await page.locator('#biRotate').getAttribute('aria-pressed'),'false','Preference changes stop rotation');
      await page.locator('#biViewport canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
      await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='error');
      assert.equal(await page.locator('#biViewport canvas').count(),0,'Lost context is cleaned up');
      await page.locator('#biRetry').click();
      await ready(page);
      assert.equal(await page.locator('#biViewport canvas').count(),1,'Context-loss retry creates one viewer');
      assert.deepEqual(errors,[],'Context recovery produces no page errors');
      await page.locator('#biClose').click();
      report.push({scenario:'reduced-motion changes and WebGL context-loss recovery',passed:true});
      await page.close();
    }
    {
      const {page,errors}=await load(browser,async page=>{
        await page.addInitScript(()=>{
          const getContext=HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext=function(type,...args){
            return /webgl/i.test(type)?null:getContext.call(this,type,...args);
          };
        });
      });
      await page.locator('.bw-card [data-inspect-model="industrial-robot-arm"]').last().click();
      await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='error');
      assert.equal(await page.locator('#biRetry').isVisible(),true,'Unavailable WebGL shows retry');
      assert.equal(await page.locator('#biViewport canvas').count(),0,'No incomplete canvas remains');
      await page.locator('#biClose').click();
      await page.waitForFunction(()=>!window.lenis?.isStopped);
      assert.equal(await page.evaluate(()=>window.lenis?.isStopped),false,'Failed initialization releases scroll lock');
      assert.deepEqual(errors,[],'Unavailable WebGL is handled');
      report.push({scenario:'WebGL unavailable',passed:true});
      await page.close();
    }
    {
      const {page,errors}=await load(browser);
      let failed=false;
      await page.route('**/*.glb',async route=>{if(!failed){failed=true;await route.fulfill({status:503,body:'Temporarily unavailable'});}else await route.continue();});
      await page.locator('.bw-card [data-inspect-model="industrial-robot-arm"]').last().click();
      await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='error');
      assert.equal(await page.locator('#biRetry').isVisible(),true,'Retry available after failed request');
      assert.equal(await page.locator('#blenderInspector canvas').count(),0,'Failed renderer disposed');
      await page.screenshot({path:path.join(output,'network-error.png')});
      await page.locator('#biRetry').click();
      await ready(page);
      assert.equal(await page.locator('#blenderInspector canvas').count(),1,'Retry restores one renderer');
      await page.locator('#biClose').click();
      assert.equal(await page.locator('#blenderInspector canvas').count(),0,'Close disposes retry renderer');
      assert.deepEqual(errors,[],'Error path produces no page errors');
      report.push({scenario:'failed model request and retry',passed:true});
      await page.close();
    }
    {
      const {page,errors}=await load(browser);
      let release;
      const gate=new Promise(resolve=>release=resolve);
      let requested;
      const started=new Promise(resolve=>requested=resolve);
      await page.route('**/*.glb',async route=>{requested();await gate;await route.continue().catch(()=>{});});
      const trigger=page.locator('.bw-card [data-inspect-model="delivery-truck"]').last();
      await trigger.click();
      await started;
      await page.locator('#biClose').click();
      release();
      await page.waitForTimeout(500);
      assert.equal(await page.locator('#blenderInspector').evaluate(el=>el.open),false,'Can close during pending download');
      assert.equal(await page.locator('#blenderInspector canvas').count(),0,'Cancelled renderer disposed');
      assert.equal(await trigger.evaluate(el=>document.activeElement===el),true,'Cancellation restores focus');
      assert.deepEqual(errors,[],'Cancellation produces no page errors');
      await page.unroute('**/*.glb');
      await page.locator('.bw-card [data-inspect-model="industrial-robot-arm"]').last().click();
      await ready(page);
      assert.equal(await page.locator('#blenderInspector canvas').count(),1,'Another model opens after cancellation');
      await page.keyboard.press('Escape');
      report.push({scenario:'close while download pending, then another model',passed:true});
      await page.close();
    }
    fs.writeFileSync(path.join(output,'failure-report.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report));
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
