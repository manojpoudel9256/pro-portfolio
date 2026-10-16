// Optional browser QA. Use QA_MODE=desktop or mobile, QA_BROWSER=chromium or webkit.
// Requires a local HTTP server and Playwright. Artifacts stay outside the site.
const { chromium, webkit } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const OUTPUT = process.env.QA_OUTPUT || path.resolve('../portfolio-blender-review');
fs.mkdirSync(OUTPUT, {recursive:true});
const base = process.env.QA_URL || 'http://127.0.0.1:4173/';
const engine = process.env.QA_BROWSER || 'chromium';
const report = {engine, runs:[]};
const metadata=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../assets/models/blender/models.json'),'utf8'));

async function scrollTo(page, locator) {
  await locator.evaluate(el=>{
    const y=Math.max(0,el.getBoundingClientRect().top+scrollY-88);
    window.lenis?.scrollTo(y,{immediate:true}); window.scrollTo(0,y);
  });
  await page.waitForTimeout(250);
}

async function capture(page, name) {
  const file=path.join(OUTPUT, `${name}.png`);
  await page.screenshot({path:file});
  return file;
}

async function inspect(page) {
  return page.evaluate(()=>{
    const modal=document.querySelector('#blenderInspector');
    return {
      title:modal?.querySelector('h2,h3')?.textContent.trim(),
      text:modal?.innerText,
      canvas:modal?.querySelector('canvas') && {
        width:modal.querySelector('canvas').width,
        height:modal.querySelector('canvas').height,
      },
      buttons:[...modal.querySelectorAll('button')].map(e=>({id:e.id,text:e.innerText,label:e.getAttribute('aria-label'),pressed:e.getAttribute('aria-pressed'),disabled:e.disabled})),
      selects:[...modal.querySelectorAll('select')].map(e=>({id:e.id,value:e.value,options:[...e.options].map(o=>({text:o.text,value:o.value}))})),
      pageWidth:document.documentElement.scrollWidth,
      viewportWidth:innerWidth,
      dialogRect:modal?.getBoundingClientRect().toJSON(),
      scrollY, bodyOverflow:document.body.style.overflow,
      rootOverflow:document.documentElement.style.overflow,
      lenisStopped:window.lenis?.isStopped,
      activeElement:document.activeElement?.id,
    };
  });
}

async function run(browser, {width,height=932,theme='light',lang='en',all=false}) {
  const name=`${engine}-${width}-${theme}-${lang}`;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:width<=768,hasTouch:width<=768,reducedMotion:'reduce'});
  const requests=[],errors=[],failures=[];
  page.on('request',r=>requests.push(r.url()));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
  await page.addInitScript(lang=>localStorage.setItem('pp_lang',lang),lang);
  await page.goto(`${base}?nopreload=1&theme=${theme}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const section=page.locator('#blender-work');
  await section.waitFor();
  await scrollTo(page,section);
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`${name}: page overflow`);
  const cards=section.locator('.bw-card');
  assert.equal(await cards.count(),2,'Two model cards');
  for(let i=0;i<2;i++) {
    await scrollTo(page,cards.nth(i));
    await cards.nth(i).locator('img').evaluate(img=>img.complete?null:new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}));
    await capture(page,`${name}-card-${i+1}`);
  }
  assert.equal(requests.filter(u=>/\.glb(?:[?#]|$)|three\.module|three\.core|GLTFLoader|OrbitControls|blender-viewer/i.test(u)).length,0,`${name}: 3D must be lazy`);
  const thumbnails=await section.locator('img').evaluateAll(els=>els.map(e=>({src:e.currentSrc,complete:e.complete,width:e.naturalWidth,height:e.naturalHeight})));
  assert.ok(thumbnails.length>=2,`${name}: two preview images`);
  assert.ok(thumbnails.every(e=>e.complete&&e.width>0),`${name}: preview images load`);
  await scrollTo(page,section);
  const screenshot=await capture(page,`${name}-section`);
  const count=all?2:1;
  const models=[];
  for(let i=0;i<count;i++) {
    const trigger=cards.nth(i).locator('[data-inspect-model]').last();
    await scrollTo(page,trigger);
    const id=await trigger.getAttribute('data-inspect-model');
    await trigger.click();
    const dialog=page.locator('#blenderInspector');
    await expectReady(page,dialog);
    const detail=await inspect(page);
    const stats=await dialog.locator('.bi-stats [data-bi-value]').evaluateAll(els=>Object.fromEntries(els.map(e=>[e.dataset.biValue,e.textContent.trim()])));
    for(const key of ['triangles','vertices','meshes','materials','textures','size','dimensions']) {
      assert.ok(stats[key]&&stats[key]!=='—',`${name}/${id}: populated ${key}`);
    }
    for(const key of ['triangles','vertices','meshes','materials','textures']) {
      assert.equal(Number(stats[key].replace(/[^\d]/g,'')),metadata[id].stats[key],`${name}/${id}: accurate ${key}`);
    }
    assert.equal(await dialog.evaluate(el=>el.open),true,`${name}/${id}: native dialog open`);
    assert.ok(detail.canvas?.width>0&&detail.canvas?.height>0,`${name}/${id}: canvas ready`);
    assert.equal(detail.pageWidth,width,`${name}/${id}: no page overflow`);
    assert.ok(detail.dialogRect.left>=-1&&detail.dialogRect.right<=width+1,`${name}/${id}: dialog fits`);
    assert.equal(detail.lenisStopped,true,`${name}/${id}: Lenis stopped`);
    const beforeScroll=await page.evaluate(()=>scrollY);
    await page.mouse.move(4,Math.min(300,height/2));
    if(engine==='webkit'&&width<=768) await page.keyboard.press('PageDown');
    else await page.mouse.wheel(0,400);
    await page.waitForTimeout(180);
    assert.equal(await page.evaluate(()=>scrollY),beforeScroll,`${name}/${id}: background scroll locked`);
    await dialog.evaluate(el=>el.scrollTop=0);
    const shot=await capture(page,`${name}-${id}-inspector`);
    let interaction;
    if(i===0) interaction=await controls(page, name, width);
    models.push({id,detail,stats,screenshot:shot,interaction});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(80);
    assert.equal(await dialog.evaluate(el=>el.open),false,`${name}/${id}: Escape closes`);
    assert.equal(await trigger.evaluate(el=>document.activeElement===el),true,`${name}/${id}: focus restored`);
    assert.equal(await page.evaluate(()=>window.lenis?.isStopped),false,`${name}/${id}: Lenis restored`);
    assert.equal(await dialog.locator('canvas').count(),0,`${name}/${id}: renderer disposed`);
  }
  assert.deepEqual(errors,[],`${name}: page errors`);
  report.runs.push({name,thumbnails,screenshot,models,errors,failures,modelRequests:requests.filter(u=>/\.glb(?:[?#]|$)/i.test(u))});
  await page.close();
  fs.writeFileSync(path.join(OUTPUT,`report-${engine}-${process.env.QA_MODE || 'desktop'}.json`),JSON.stringify(report,null,2));
  console.log(`PASS ${name}: ${count} model(s), lazy resources, scroll lock, Escape, focus, layout`);
}

async function expectReady(page, dialog) {
  await dialog.waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#blenderInspector')?.dataset.state==='ready',null,{timeout:90000});
  await page.waitForTimeout(900);
}

async function controls(page, name, width) {
  const dialog=page.locator('#blenderInspector');
  const viewport=page.locator('#biViewport');
  const canvas=viewport.locator('canvas');
  const original=await canvas.screenshot();
  const r=await canvas.boundingBox();
  await page.mouse.move(r.x+r.width*.5,r.y+r.height*.5);
  await page.mouse.down();
  await page.mouse.move(r.x+r.width*.7,r.y+r.height*.58,{steps:14});
  await page.mouse.up();
  await page.waitForTimeout(300);
  const rotated=await canvas.screenshot();
  assert.ok(!original.equals(rotated),`${name}: orbit changes image`);
  if(engine==='webkit'&&width<=768) {
    await canvas.focus(); await page.keyboard.press('+');
  } else await page.mouse.wheel(0,-200);
  await page.waitForTimeout(300);
  const zoomed=await canvas.screenshot();
  assert.ok(!rotated.equals(zoomed),`${name}: zoom changes image`);
  await page.locator('#biReset').click();
  await page.waitForTimeout(300);
  const reset=await canvas.screenshot();
  assert.ok(!zoomed.equals(reset),`${name}: reset changes image`);
  await page.locator('#biWireframe').click();
  assert.equal(await page.locator('#biWireframe').getAttribute('aria-pressed'),'true',`${name}: wireframe toggles on`);
  await page.waitForTimeout(200);
  const wireframe=await canvas.screenshot();
  assert.ok(!reset.equals(wireframe),`${name}: wireframe renders`);
  await page.locator('#biWireframe').click();
  await page.locator('#biEnvironment').selectOption('dark');
  await page.waitForTimeout(200);
  const dark=await canvas.screenshot();
  assert.ok(!reset.equals(dark),`${name}: environment changes`);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForTimeout(150);
  await page.locator('#biRotate').click();
  assert.equal(await page.locator('#biRotate').getAttribute('aria-pressed'),'true',`${name}: rotation toggles on`);
  await page.waitForTimeout(100);
  await page.locator('#biRotate').click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(150);
  const beforeLang=await page.locator('#biStatus').textContent();
  await page.evaluate(()=>window.setLang(document.documentElement.lang==='ja'?'en':'ja'));
  const otherLang=await page.locator('#biStatus').textContent();
  const translated=await dialog.innerText();
  assert.equal(await page.locator('.bi-kicker').textContent(), await page.locator('html').getAttribute('lang') === 'ja' ? '3Dモデルビューア' : 'Interactive model inspector', `${name}: translated inspector heading`);
  await capture(page,`${name}-controls-other-language`);
  for(let i=0;i<14;i++) {
    await page.keyboard.press('Tab');
    assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)||document.activeElement===document.body),true,`${name}: Tab cannot reach background controls`);
  }
  if(width<=430) {
    const small=await dialog.locator('button:visible, select:visible').evaluateAll(els=>els.map(e=>({id:e.id,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(e=>e.h<43||e.w<43));
    assert.deepEqual(small,[],`${name}: touch targets 44px`);
  }
  await page.locator('#biEnvironment').selectOption('studio');
  await page.evaluate(()=>window.setLang(document.documentElement.lang==='ja'?'en':'ja'));
  return {orbit:true,zoom:true,reset:true,wireframe:true,environment:true,rotation:true,focusTrap:true,beforeLang,otherLang};
}

(async()=>{
  const browser=await ({chromium,webkit}[engine]).launch({headless:true});
  try {
    const mode=process.env.QA_MODE || 'desktop';
    if(mode==='desktop') await run(browser,{width:1440,height:1000,all:true});
    if(mode==='mobile') {
      await run(browser,{width:430,theme:'dark',lang:'ja'});
      await run(browser,{width:320,height:740});
    }
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
