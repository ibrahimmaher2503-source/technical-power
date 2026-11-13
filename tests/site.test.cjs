const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8').replace(/render\(\);\s*$/, '');
function app(page='index',query='',locale='ar') {
 const nodes = new Map();
 const context = vm.createContext({location:{pathname:`/${page}.html`,search:query},localStorage:{getItem:()=>locale},URLSearchParams,document:{querySelector:s=>{if(!nodes.has(s))nodes.set(s,{innerHTML:'',value:'all'});return nodes.get(s);},querySelectorAll:()=>[],title:''}});
 vm.runInContext(source,context);
 return {run:code=>vm.runInContext(code,context),nodes};
}
test('all eight pages render complete sections with valid local links and imagery',()=>{
 const views={index:'home',about:'about',services:'servicesPage',service:'servicePage',projects:'projectsPage',project:'projectPage',careers:'careers',contact:'contact'};
 for(const locale of ['ar','en']) for(const [page,view] of Object.entries(views)) {
  const {run}=app(page,'',locale);const html=run(`header()+${view}()+footer()+dialogs()`);
  assert.match(html,/<h1>/);assert.match(html,/site-footer/);assert.ok(html.includes(`lang="${locale}"`));
  assert.ok(!html.includes(` lang="${locale==='ar'?'en':'ar'}"`),`${page}: mixed language content`);
  for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
   const url=match[1];if(/^(https?:|mailto:|tel:)/.test(url))continue;
   assert.ok(fs.existsSync(path.join(__dirname,'../dist',url)),`${page}: missing ${url}`);
  }
 }
});
test('previous work lists only the four supplied entries without invented project metadata',()=>{
 const {run,nodes}=app('projects');
 run('renderProjects("all",1)');let first=nodes.get('#project-results').innerHTML;
 assert.equal((first.match(/<article/g)||[]).length,4);
 for(const name of ['مشروع إسكادا – مزارع توشكى','شركة مياه الشرب بالقاهرة الكبرى','الشركة الوطنية للدواجن','شركة أوراسكوم للإنشاءات'])assert.ok(first.includes(name));
 assert.doesNotMatch(first,/2025|2024|Completed|قيد التنفيذ/);
 run('renderProjects("control")');assert.equal((nodes.get('#project-results').innerHTML.match(/<article/g)||[]).length,1);
 run('renderProjects("clients")');assert.equal((nodes.get('#project-results').innerHTML.match(/<article/g)||[]).length,3);
});
test('careers no longer advertises unconfirmed jobs, locations or benefits',()=>{
 const {run}=app('careers','','en');const html=run('careers()');
 assert.match(html,/opportunities/i);assert.doesNotMatch(html,/Riyadh|Jeddah|Health Insurance|Competitive Rewards|mailto:/);
});
test('search handles both languages and never inserts the query as HTML',()=>{
 const {run,nodes}=app('index','','en');run('search("صيانة")');assert.match(nodes.get('#search-results').innerHTML,/Maintenance/);
 run('search("توشكى")');assert.match(nodes.get('#search-results').innerHTML,/toshka-scada/);
 run('search("<img src=x onerror=alert(1)>")');assert.doesNotMatch(nodes.get('#search-results').innerHTML,/onerror/);assert.match(nodes.get('#search-results').innerHTML,/No results/);
});
test('unknown detail identifiers fall back safely without echoing input',()=>{
 for(const [page,view] of [['service','servicePage'],['project','projectPage']]) {
  const {run}=app(page,'?id=%3Cscript%3Ealert(1)%3C/script%3E');const html=run(`${view}()`);
  assert.match(html,/<h1>/);assert.doesNotMatch(html,/<script>/);
 }
});
test('contact keeps validation but cannot send to an unconfirmed recipient',()=>{
 const {run}=app('contact','','en');const html=run('contact()');assert.equal((html.match(/ required/g)||[]).length,5);
 assert.match(html,/type="email"/);assert.match(html,/type="submit" disabled/);assert.doesNotMatch(html,/info@technicalpower.com|1234 5678|Plot No. 12|mailto:|maps\/search/);
});
test('public content in both languages excludes the previously invented business claims',()=>{
 const views=['home','about','servicesPage','servicePage','projectsPage','projectPage','careers','contact'];
 for(const locale of ['ar','en']){
  const {run}=app('index','',locale);const html=views.map(view=>run(`${view}()`)).join('')+run('footer()');
  assert.doesNotMatch(html,/\+120|\+250|99\.8%|-18%|\+30%|-25%|100%|EATON|legrand|info@technicalpower\.com|1234 5678|أحمد العلي|خالد منصور|عمر الزروقي|Sara Al Ali|Khaled Mansour|Ahmed Al Ali|Omar Al Zurooqi/);
 }
});
test('services include the supplied breaker types, spare parts, retrofit, testing and warranty facts',()=>{
 const {run}=app();const html=run('servicesPage()')+run('servicePage()');
 for(const value of ['ACB','MCCB','VCB','LV','MV','قطع الغيار','الأصلية','البديلة','ميكانيكية','كهربائية','الضمان','دون تغيير اللوحة بالكامل'])assert.ok(html.includes(value),`Missing source fact: ${value}`);
 const about=run('about()');assert.match(about,/2008/);assert.match(about,/15/);
});
test('home groups statistics after the about preview with only the selected language',()=>{
 for(const locale of ['ar','en']) {
  const {run}=app('index','',locale);const html=run('home()');
  assert.equal((html.match(/class="stats-band"/g)||[]).length,1);
  assert.ok(html.indexOf('about-preview')<html.indexOf('stats-band'));
  assert.ok(html.indexOf('stats-band')<html.indexOf('home-service-section'));
  assert.equal(run('bi("العربية","English")'),`<span class="bi " lang="${locale}" dir="${locale==='ar'?'rtl':'ltr'}">${locale==='ar'?'العربية':'English'}</span>`);
 }
});
test('responsive image variants exist and respect their file-size budgets',()=>{
 const images=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/image-sizes.json'),'utf8'));
 assert.equal(images.length,57);
 const budgets={320:22000,640:60000,1280:180000};
 for(const image of images){
  const file=path.join(__dirname,'../dist/assets',image.file);
  assert.equal(fs.statSync(file).size,image.bytes);
  assert.ok(image.bytes<=budgets[image.width],`${image.file} exceeds budget`);
 }
 const {run}=app();const html=run('photo("water","Water treatment plant")');
 assert.match(html,/srcset="assets\/water-small.webp 320w, assets\/water.webp 640w, assets\/water-large.webp 1280w"/);
 assert.match(html,/loading="lazy"/);assert.match(html,/decoding="async"/);
 for(const [,name] of run('home()').matchAll(/src="assets\/([^".]+)\.webp"/g)){
  if(name==='logo')continue;
  for(const suffix of ['-small','','-large'])assert.ok(fs.existsSync(path.join(__dirname,'../dist/assets',`${name}${suffix}.webp`)));
 }
});
test('service and project cards expose one named destination each in both languages',()=>{
 for(const locale of ['ar','en']){
  const {run}=app('index','',locale);
  for(const expression of ['serviceCard(services[0])','serviceCard(services[1],true)','projectCard(projects[0])','projectCard(projects[1],true)']){
   const html=run(expression);
   assert.equal((html.match(/<a /g)||[]).length,1,`${expression}: duplicate keyboard destinations`);
   assert.match(html,/<a class="card-title-link" href="(?:service|project)\.html\?id=[a-z-]+"><span class="bi /);
   assert.match(html,/class="card-action" aria-hidden="true"/);
   if(expression.startsWith('serviceCard')){
    const action=html.match(/<span class="card-action" aria-hidden="true">([\s\S]*?)<\/div><\/article>/)[1];
    assert.doesNotMatch(action,/<svg/,'Service action must remain text-only in every variant');
    assert.match(action,locale==='ar'?/عرض الخدمة/:/Explore Service/);
   }
  }
 }
 for(const page of ['index','about','services','service','projects','project','careers','contact']){
  const html=fs.readFileSync(path.join(__dirname,'../dist',`${page}.html`),'utf8');
  assert.ok(html.indexOf('cards.css')>html.indexOf('style.css'));
 }
});
