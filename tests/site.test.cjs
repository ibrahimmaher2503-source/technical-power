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
test('project categories and pagination return the correct distinct projects',()=>{
 const {run,nodes}=app('projects');
 run('renderProjects("all",1)');let first=nodes.get('#project-results').innerHTML;
 assert.equal((first.match(/<article/g)||[]).length,6);
 run('renderProjects("all",2)');let second=nodes.get('#project-results').innerHTML;
 assert.equal((second.match(/<article/g)||[]).length,6);assert.notEqual(first,second);
 run('renderProjects("water")');let water=nodes.get('#project-results').innerHTML;
 assert.equal((water.match(/<article/g)||[]).length,2);assert.ok(!water.includes('data-category="industrial"'));
});
test('job filters combine department, location, and job type; empty results remain useful',()=>{
 const {run,nodes}=app('careers','','en');run('renderJobs()');assert.equal((nodes.get('#job-results').innerHTML.match(/<details/g)||[]).length,4);
 nodes.get('#job-department').value='engineering';nodes.get('#job-location').value='cairo';run('renderJobs()');assert.equal((nodes.get('#job-results').innerHTML.match(/<details/g)||[]).length,1);
 nodes.get('#job-type').value='part';run('renderJobs()');assert.match(nodes.get('#job-results').innerHTML,/Reset Filters/);
});
test('search handles both languages and never inserts the query as HTML',()=>{
 const {run,nodes}=app('index','','en');run('search("صيانة")');assert.match(nodes.get('#search-results').innerHTML,/Maintenance/);
 run('search("transformer")');assert.match(nodes.get('#search-results').innerHTML,/transformer-supply/);
 run('search("<img src=x onerror=alert(1)>")');assert.doesNotMatch(nodes.get('#search-results').innerHTML,/onerror/);assert.match(nodes.get('#search-results').innerHTML,/No results/);
});
test('unknown detail identifiers fall back safely without echoing input',()=>{
 for(const [page,view] of [['service','servicePage'],['project','projectPage']]) {
  const {run}=app(page,'?id=%3Cscript%3Ealert(1)%3C/script%3E');const html=run(`${view}()`);
  assert.match(html,/<h1>/);assert.doesNotMatch(html,/<script>/);
 }
});
test('forms communicate email drafting and retain native required-field validation',()=>{
 const {run}=app('contact','','en');const html=run('contact()');assert.equal((html.match(/ required/g)||[]).length,5);
 assert.match(html,/type="email"/);assert.match(html,/Your email app will open/);assert.doesNotMatch(html,/successfully sent/i);
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
