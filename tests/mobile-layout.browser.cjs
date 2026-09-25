// Optional visual QA. Requires Playwright and a local server on QA_URL (4173).
// Screenshots and reports go outside the site, to QA_OUTPUT.
const engine = process.env.QA_BROWSER || 'chromium';
const browserType = require('playwright')[engine];
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.QA_OUTPUT || path.resolve('../portfolio-mobile-review');
const base = process.env.QA_URL || 'http://127.0.0.1:4173/';
const sections = [
  ['01-hero','#home'], ['02-selected-work','#work'],
  ['03-finance','.pw-app'], ['04-salary','.pw-app:nth-of-type(3)'],
  ['05-glb-analyzer','.pw-tool'], ['06-glb-optimizer','.pw-tool:last-child'],
  ['07-unreal','#unreal-projects'], ['08-warehouse','.ue-card:last-child'],
  ['09-about','#about-me'], ['10-experience','.xp-item'],
  ['11-language-intro','.lang-cred'], ['12-jlpt','.lc-card'],
  ['13-jlpt-details','.lc-card .lc-tiles'], ['14-jlpt-capabilities','.lc-card .lc-perf'],
  ['15-toeic','.lc-card:last-child'], ['16-toeic-details','.lc-card:last-child .lc-tiles'],
  ['17-certifications','.cert-section'],
  ['18-certificate-two','.cred-card:nth-child(2)'], ['19-certificate-three','.cred-card:nth-child(3)'],
  ['19b-certificate-four','.cred-card:nth-child(4)'],
  ['20-college','.edu-card'], ['21-language-school','.edu-card:last-child'],
  ['22-contact','#contact'], ['23-contact-form','#contactForm'], ['24-footer','.footer-bottom']
];
const report = { engine, configurations: [], desktop: [], interactions: [] };
async function scrollTo(page, locator) {
  await locator.first().evaluate(el => {
    const y = Math.max(0, el.getBoundingClientRect().top + scrollY - 88);
    window.lenis?.scrollTo(y, { immediate: true }); window.scrollTo(0, y);
  });
  await page.waitForTimeout(160);
}
async function load(browser, width, height, theme, lang, mobile = true) {
  const page = await browser.newPage({viewport:{width,height},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(lang=>localStorage.setItem('pp_lang',lang),lang);
  await page.goto(`${base}?nopreload=1&theme=${theme}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  return {page,errors};
}
async function phone(browser, width, height, theme, lang, fullReview) {
  const id=`${width}x${height}-${theme}-${lang}`;
  const dir=path.join(output,id); fs.mkdirSync(dir,{recursive:true});
  const {page,errors}=await load(browser,width,height,theme,lang);
  const captures=[];
  assert.equal(await page.locator('.ue-card video[src]').count(),0,'Videos must not download before interaction');
  const review=fullReview ? sections : sections.filter(([name])=>['01-hero','03-finance','10-experience','12-jlpt','15-toeic','20-college','23-contact-form','24-footer'].includes(name));
  for(const [name,selector] of review) {
    const el=page.locator(selector).first();
    if(!await el.count()) continue;
    await scrollTo(page,el);
    const problems=await page.evaluate(()=>[...document.querySelectorAll('main *')].filter(el=>{
      if(el.closest('.hero-techstrip,.stack,.image-modal,.proj-modal,.text-modal,[aria-hidden="true"]'))return false;
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>68&&s.visibility!=='hidden'&&(r.left < -1||r.right>innerWidth+1);
    }).map(el=>el.className));
    assert.deepEqual(problems,[],`${id}/${name} visible horizontal overflow`);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,`${id}: page overflow`);
    await page.screenshot({path:path.join(dir,`${name}.png`)});
    captures.push(`${id}/${name}.png`);
  }
  // Text must remain readable, and essential controls must be finger-sized.
  assert.equal(await page.locator('.pw-app .pw-desc').first().evaluate(el=>getComputedStyle(el).fontSize),'16px');
  assert.equal(await page.locator('.cf-field input').first().evaluate(el=>getComputedStyle(el).fontSize),'16px');
  for(const selector of ['.pw-fbtn','.cf-topic','.cf-submit','.ue-toggle','.cred-btn','#mobileMenuTrigger']) {
    const heights=await page.locator(selector).evaluateAll(els=>els.map(el=>el.getBoundingClientRect().height));
    assert.ok(heights.every(h=>h>=44),`${id}/${selector}: minimum 44px target`);
  }
  await page.locator('#mobileMenuTrigger').click();
  await page.waitForTimeout(350);
  assert.equal(await page.locator('#mobileMenu').getAttribute('aria-hidden'),'false');
  assert.equal(await page.locator('#main').evaluate(el=>el.inert),true);
  await page.screenshot({path:path.join(dir,'25-menu.png')}); captures.push(`${id}/25-menu.png`);
  await page.locator('.menu-close').click();
  await page.waitForTimeout(350);
  assert.equal(await page.locator('#main').evaluate(el=>el.inert),false);
  assert.deepEqual(errors,[],`${id}: JavaScript errors`);
  report.configurations.push({id,captures,errors,checks:'No horizontal overflow; readable inputs; 44px controls; menu opens/closes; videos stay lazy.'});
  await page.close();
  console.log(`PASS ${id}: ${captures.length} screenshots`);
}
async function interactions(browser) {
  const {page,errors}=await load(browser,430,932,'light','en');
  const dir=path.join(output,'interactions');fs.mkdirSync(dir,{recursive:true});
  await page.locator('#mobileMenuTrigger').click();
  await page.locator('.menu-language-option[data-lang="ja"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'ja');
  await page.locator('.menu-theme').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.locator('.menu-link[href="#work"]').click();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('#mobileMenu').getAttribute('aria-hidden'),'true');
  assert.ok(await page.locator('#work').evaluate(el=>el.getBoundingClientRect().top)>=68,'Section is below fixed header');
  await page.locator('.pw-fbtn[data-filter="apps"]').click();
  assert.equal(await page.locator('.pw-card:visible').count(),2);
  await page.locator('.pw-fbtn[data-filter="all"]').click();
  assert.equal(await page.locator('.pw-card:visible').count(),5);
  await scrollTo(page,page.locator('.pw-app'));
  await page.locator('.pw-app').first().click();
  await page.waitForTimeout(450);
  await page.screenshot({path:path.join(dir,'project-dialog.png')});
  await page.locator('.proj-dialog').evaluate(el=>el.scrollTop=el.scrollHeight);
  const close=await page.locator('.proj-close').boundingBox();
  assert.ok(close.y>=0 && close.y+close.height<=932,'Project close stays on screen');
  await page.screenshot({path:path.join(dir,'project-dialog-scrolled.png')});
  await page.locator('.proj-close').click();
  await scrollTo(page,page.locator('.edu-card:last-child'));
  await page.locator('.edu-card:last-child').click();
  await page.waitForTimeout(400);
  const before=await page.evaluate(()=>scrollY);
  // Mobile WebKit does not expose wheel input; check its native scroll lock
  // and keyboard scroll instead. Chromium additionally exercises a real wheel.
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  if(engine==='webkit') await page.keyboard.press('PageDown');
  else await page.mouse.wheel(0,500);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>scrollY),before,'Photo viewer locks background scrolling');
  await page.screenshot({path:path.join(dir,'school-photo-dialog.png')});
  await page.locator('.image-modal-close').click();
  await scrollTo(page,page.locator('.ue-card'));
  await page.locator('.ue-toggle').first().click();
  await page.waitForFunction(()=>document.querySelector('.ue-card').classList.contains('is-ready') && document.querySelector('.ue-card video').currentTime>1,null,{timeout:15000});
  await page.waitForTimeout(350);
  assert.equal(await page.locator('.ue-card video').first().evaluate(el=>el.controls),true);
  await page.screenshot({path:path.join(dir,'video-player.png')});
  await page.locator('.ue-toggle').first().click();
  assert.equal(await page.locator('.ue-card video').first().evaluate(el=>el.paused),true);
  assert.deepEqual(errors,[]);
  report.interactions=['Language switch','Theme switch','Menu anchor clearance','Project filters','Sticky project close','Photo scroll lock','Video play/close'];
  await page.close(); console.log('PASS mobile interactions');
}
async function desktop(browser,width,theme) {
  const {page,errors}=await load(browser,width,1000,theme,'en',false);
  const dir=path.join(output,`desktop-${width}-${theme}`);fs.mkdirSync(dir,{recursive:true});
  // Freeze only the test capture's moving marquees/clock, identically in both renders.
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important}.logo-track,.ts-track{transform:none!important}#time{visibility:hidden}'});
  await page.evaluate(async()=>{
    for(let y=0;y<document.documentElement.scrollHeight;y+=650){window.lenis.scrollTo(y,{immediate:true});window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}
  });
  await page.waitForTimeout(1300);
  await page.evaluate(()=>{window.lenis.scrollTo(0,{immediate:true});window.scrollTo(0,0);});
  await page.waitForTimeout(200);
  await page.evaluate(()=>window.gsap?.globalTimeline.pause());
  const styles=()=>page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);
    // Chromium's full-page capture intermittently reports auto margins as 0
    // instead of their used value. Compare their actual geometric effect via
    // bounds, while retaining every other computed property and pixel checks.
    return {element:el.tagName+'.'+el.className,properties:{
      bounds:JSON.stringify([r.x,r.y,r.width,r.height]),
      ...Object.fromEntries([...s].filter(key=>!key.startsWith('margin')).map(key=>[key,s.getPropertyValue(key)]))
    }};
  }));
  await page.locator('link[href="mobile-refinements.css"]').evaluate(el=>el.disabled=true);
  const imageBefore=await page.screenshot({path:path.join(dir,'before.png'),fullPage:true});
  const before=await styles();
  await page.locator('link[href="mobile-refinements.css"]').evaluate(el=>el.disabled=false);
  const imageAfter=await page.screenshot({path:path.join(dir,'after.png'),fullPage:true});
  const after=await styles();
  const changes=after.flatMap((item,i)=>Object.keys(item.properties).filter(key=>item.properties[key]!==before[i].properties[key]).map(key=>({element:item.element,key,before:before[i].properties[key],after:item.properties[key]})));
  assert.deepEqual(changes,[],`${width}/${theme}: desktop computed styles changed`);
  assert.ok(imageBefore.equals(imageAfter),`${width}/${theme}: desktop pixels changed`);
  assert.deepEqual(errors,[]);
  report.desktop.push({width,theme,computedStyles:'identical',screenshots:'pixel-identical'});
  await page.close();console.log(`PASS desktop ${width}/${theme}: pixel-identical`);
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await browserType.launch({headless:true});
  try {
    if(process.argv.includes('--desktop')) {
      for(const w of [1024,1440,1920])for(const t of ['light','dark'])await desktop(browser,w,t);
    } else if(process.argv.includes('--interactions')) await interactions(browser);
    else {
      const matrix=process.argv.includes('--small') ? [[320,740,'light','en',false],[320,740,'light','ja',false],[360,800,'dark','ja',true],[390,844,'light','ja',false],[768,1024,'dark','en',false]] : [[430,932,'light','en',true],[430,932,'dark','ja',true]];
      for(const args of matrix)await phone(browser,...args);
    }
  } finally {
    fs.writeFileSync(path.join(output,`report${process.argv.slice(2).join('')||'-iphone'}.json`),JSON.stringify(report,null,2));
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exit(1)});
