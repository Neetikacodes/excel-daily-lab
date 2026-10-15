const $=s=>document.querySelector(s),KEY='edl_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}};
let S=load()||{done:{},att:0,ok:0,tot:0,days:[],last:null};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const fmtD=d=>d.toLocaleDateString('en-CA'),todayS=()=>fmtD(new Date());
const streak=()=>{const d=new Date();if(!S.days.includes(fmtD(d)))d.setDate(d.getDate()-1);let n=0;while(S.days.includes(fmtD(d))){n++;d.setDate(d.getDate()-1)}return n};
const todayCh=()=>CH[((Math.floor((Date.now()-new Date(2026,0,1))/864e5)%30)+30)%30];
const fmt=x=>typeof x==='number'?x.toLocaleString('en-IN'):x;
const bar=p=>`<div class="bar"><i style="width:${p}%"></i></div>`;
const doneN=()=>Object.keys(S.done).filter(k=>S.done[k].s===S.done[k].m).length;
const BADGES=[['First Solve',()=>doneN()>=1],['5 Solved',()=>doneN()>=5],['10 Solved',()=>doneN()>=10],['3-Day Streak',()=>streak()>=3],['Beginner Complete',()=>CH.filter(c=>c.diff==='Beginner').every(c=>S.done[c.id]&&S.done[c.id].s===S.done[c.id].m)],['90% Accuracy (10+ answers)',()=>S.tot>=10&&S.ok/S.tot>=.9]];
function item(c){const d=S.done[c.id],ok=d&&d.s===d.m;return `<div class="item ${ok?'done':''}"><div><b>Day ${c.day}: ${c.title}</b><br><span class="tag">${c.diff}</span><span class="tag">${c.cat}</span><span class="mu">${c.skills}</span></div><div>${d?`Best ${d.s}/${d.m} `:''}<a class="btn" href="#/c/${c.id}">${d?'Retry':'Start'}</a></div></div>`}
let F={q:'',d:'',c:'',s:''};
function view(h){const[,r,a]=h.split('/'),m=$('#main');
 document.querySelectorAll('nav a').forEach(x=>x.classList.toggle('on',x.getAttribute('href')==='#/'+r));
 if(r==='c'&&CH[a-1])return practice(CH[a-1],m);
 if(r==='today')return practice(todayCh(),m);
 if(r==='list'||r==='projects')return list(m,r==='projects');
 if(r==='play')return play(m);if(r==='prog')return prog(m);if(r==='ref')return ref(m);if(r==='about')return about(m);
 home(m)}
function home(m){const l=S.last&&CH[S.last-1],t=todayCh();
 m.innerHTML=`<h1>Excel Daily Lab</h1><p class="mu">Solve real business problems in your browser. No downloads, no login.</p>
 <div class="cards"><div class="card"><b>${doneN()}/30</b>Completed</div><div class="card"><b>${streak()}</b>Day streak</div><div class="card"><b>${S.tot?Math.round(S.ok/S.tot*100):0}%</b>Accuracy</div><div class="card"><b>${Object.values(S.done).reduce((a,d)=>a+d.s*10,0)}</b>Total score</div></div>
 <h2>Today's challenge</h2>${item(t)}${l?`<h2>Resume where you left off</h2>${item(l)}`:''}
 <div class="panel">Progress is saved in this browser only (LocalStorage) and does not sync across devices.</div>`}
function list(m,proj){const cats=[...new Set(CH.map(c=>c.cat))];
 const L=CH.filter(c=>(!proj||c.cat==='Project')&&(!F.d||c.diff===F.d)&&(!F.c||c.cat===F.c)&&(!F.s||(F.s==='done')===!!(S.done[c.id]&&S.done[c.id].s===S.done[c.id].m))&&(!F.q||(c.title+c.skills+c.cat).toLowerCase().includes(F.q.toLowerCase())));
 m.innerHTML=`<h1>${proj?'Business Analyst Projects':'Practice by Category'}</h1><div class="row"><input id="fq" placeholder="Search name, skill, formula" aria-label="Search" value="${F.q}">
 <select id="fd" aria-label="Difficulty"><option value="">All levels</option>${['Beginner','Intermediate','Advanced'].map(x=>`<option ${F.d===x?'selected':''}>${x}</option>`)}</select>
 <select id="fc" aria-label="Category"><option value="">All categories</option>${cats.map(x=>`<option ${F.c===x?'selected':''}>${x}</option>`)}</select>
 <select id="fs" aria-label="Status"><option value="">Any status</option><option value="done" ${F.s==='done'?'selected':''}>Completed</option><option value="todo" ${F.s==='todo'?'selected':''}>Not completed</option></select></div>
 <div id="res">${L.map(item).join('')||'<p>No matches.</p>'}</div>`;
 const up=()=>{F={q:$('#fq').value,d:$('#fd').value,c:$('#fc').value,s:$('#fs').value};const keep=$('#fq').selectionStart;list(m,proj);const q=$('#fq');q.focus();q.setSelectionRange(keep,keep)};
 ['fq','fd','fc','fs'].forEach(i=>$('#'+i).oninput=up)}
let curG=[];
function practice(c,m){S.last=c.id;save();
 const n=c.rows.length,last=n+1,H=c.D.cols.length,HL=String.fromCharCode(65+H),GL=String.fromCharCode(65+c.D.gi);
 const G=curG=[[...c.D.cols,c.D.vn],...c.rows.map(r=>[...r,''])];
 const rf=s=>s.split(c.D.vn+' column').join(`${HL}2:${HL}${last}`).split(c.D.gn+' column').join(`${GL}2:${GL}${last}`);
 m.innerHTML=`<h1>Day ${c.day}: ${c.title}</h1><span class="tag">${c.diff}</span><span class="tag">${c.cat}</span><span class="mu">Skills: ${c.skills}</span>
 <h2>A. Business problem</h2><p>${c.scen}</p><p><b>Objective:</b> ${c.obj}</p>
 <h2>B. Your spreadsheet (${n} rows)</h2><div class="row"><input id="ts" placeholder="Filter rows" aria-label="Filter rows"><span class="mu">Column ${HL} is empty: you build it.</span></div><div class="tw"><table id="tb"></table></div>
 <h2>C. Step 1: build the helper column</h2><p>Type a formula for cell <b>${HL}2</b> that calculates <b>${c.D.vn}</b> (${c.D.how}), then fill it down. Use plain references like D2 (no $).</p>
 <div class="row"><input id="hf" placeholder="=formula for ${HL}2" size="28" aria-label="Helper formula"><button data-a="fill">Fill down</button><span id="hm" class="mu"></span></div>
 <h2>D. Step 2: answer with formulas</h2><p class="mu">Type an Excel formula (starting with =) using ranges like ${HL}2:${HL}${last}. The site evaluates it on the sheet above.</p>
 <div id="tasks">${c.tasks.map((t,i)=>`<div class="task"><label for="q${i}">${i+1}. ${t.q}</label><br><input id="q${i}" autocomplete="off" placeholder="${t.t==='s'?'type the name':'=formula'}" size="34"> <span id="r${i}"></span></div>`).join('')}
 <div class="task"><b>${c.tasks.length+1}. ${c.mc.q}</b><br>${c.mc.o.map((o,i)=>`<label><input type="radio" name="mc" value="${i}"> ${o}</label><br>`).join('')}<span id="rm"></span></div></div>
 <div class="row"><button data-a="chk">Check Answer</button><button class="sec" data-a="hint">Show Hint</button><button class="sec" data-a="f">Show Formula</button><button class="sec" data-a="steps">Show Step-by-Step Solution</button><button class="sec" data-a="int">Show Business Interpretation</button><button class="sec" data-a="out">Show Desired Output</button><button class="sec" data-a="retry">Retry Challenge</button></div><div id="out" aria-live="polite"></div>`;
 const draw=()=>{const q=$('#ts').value.toLowerCase();
  $('#tb').innerHTML=`<thead><tr><th></th>${G[0].map((h,i)=>`<th>${String.fromCharCode(65+i)}<br><small>${h}</small></th>`).join('')}</tr></thead><tbody>${G.slice(1).map((r,k)=>({r,k})).filter(o=>o.r.slice(0,H).join(' ').toLowerCase().includes(q)).map(o=>`<tr><td class="rn">${o.k+2}</td>${o.r.map((y,i)=>`<td${i===H?' style="background:#f3fbf6"':''}>${y}</td>`).join('')}</tr>`).join('')}</tbody>`};
 draw();$('#ts').oninput=draw;
 const o=$('#out'),box=(t,h)=>o.innerHTML=`<div class="panel"><b>${t}</b><br>${h}</div>`;
 const fill=()=>{const f=$('#hf').value.trim(),hm=$('#hm');
  if(f[0]!=='='){hm.textContent='Start with =';return}
  try{const v=[];for(let r=1;r<=n;r++){const ff=f.replace(/([A-Za-z])(\d+)/g,(a,l,d)=>l+(+d+r-1));const x=evalF(ff,G);if(typeof x!=='number'||isNaN(x))throw new Error('Row '+(r+1)+' gave '+x);v.push(x)}
   v.forEach((x,r)=>G[r+1][H]=x);hm.textContent='Filled '+n+' rows.';draw()}catch(e){hm.textContent='Error: '+e.message}};
 m.onclick=e=>{const a=e.target.dataset.a;if(!a)return;
  if(a==='fill')fill();
  if(a==='hint')box('Hints','<ol>'+c.tasks.map(t=>`<li>${t.h}</li>`).join('')+'</ol>');
  if(a==='f')box('Formulas',`Helper (${HL}2, fill down): <code>${c.D.hf}</code><br>`+c.tasks.map((t,i)=>`${i+1}. <code>${rf(t.f)}</code>`).join('<br>'));
  if(a==='steps')box('Step-by-step',`<ol><li>In ${HL}2 type <code>${c.D.hf}</code> and click Fill down.</li>${c.tasks.map(t=>`<li>${t.q} Use <code>${rf(t.f)}</code> → <b>${[].concat(t.a).join(' / ')}</b></li>`).join('')}<li>Recommended action: <b>${c.mc.o[c.mc.a]}</b></li></ol>`);
  if(a==='int')box('Business interpretation',`${c.interp}<br><span class="mu">Limitation: results come from a small sample and one period.</span>`);
  if(a==='out')box('Desired output',`<table><tr><th>Task</th><th>Expected</th></tr>${c.tasks.map((t,i)=>`<tr><td>${i+1}. ${t.q}</td><td>${[].concat(t.a).map(fmt).join(' / ')}</td></tr>`).join('')}</table>`);
  if(a==='retry')practice(c,m);
  if(a==='chk')check(c,box)}}
function check(c,box){const H=c.D.cols.length,filled=curG.slice(1).every(r=>typeof r[H]==='number');let ok=0;
 c.tasks.forEach((t,i)=>{const v=$('#q'+i).value.trim();let g=false,msg='';
  if(t.t==='s'){g=t.a.some(x=>x.toLowerCase()===v.toLowerCase());msg=v===''?'Empty - type the name':g?'':'Not correct - total each group first'}
  else if(v==='')msg='Empty - enter a formula';
  else if(v[0]!=='=')msg='Type a formula starting with =';
  else{try{const r=evalF(v,curG);if(typeof r!=='number')msg='Formula returned '+r;else{g=Math.abs(r-t.a)<=(t.tol||.011);msg=(g?'':'Not correct. ')+'Your result: '+Math.round(r*1e4)/1e4+(g||filled?'':' (fill the helper column first)')}}catch(e){msg=e.message}}
  if(g)ok++;$('#r'+i).innerHTML=g?`<span class="ok">✓ Correct</span> <span class="mu">${msg}</span>`:`<span class="no">✗ ${msg}</span>`});
 const s=document.querySelector('input[name=mc]:checked'),mg=s&&+s.value===c.mc.a;if(mg)ok++;
 $('#rm').innerHTML=mg?'<span class="ok">✓ Correct</span>':s?'<span class="no">✗ Think about which group drives the result</span>':'<span class="no">✗ Select an option</span>';
 const m=c.tasks.length+1;S.att++;S.ok+=ok;S.tot+=m;const d=todayS();if(!S.days.includes(d))S.days.push(d);
 if(!S.done[c.id]||S.done[c.id].s<ok)S.done[c.id]={s:ok,m};save();
 box('Score: '+ok+' / '+m,ok===m?'Perfect! Challenge completed.':'Fix the marked answers and check again, or use Hint / Show Desired Output.')}
const GRID=[['Item','Region','Qty','Price'],['Pen','North',10,5],['Book','South',4,40],['Bag','North',2,120],['Lamp','East',6,35],['Desk','South',1,300],['Mug','North',12,8]];
function play(m){const ex=['=SUM(C2:C7)','=AVERAGE(D2:D7)','=MAX(D2:D7)','=COUNTIF(B2:B7,"North")','=SUMIF(B2:B7,"North",C2:C7)','=IF(D2>4,"High","Low")','=ROUND(AVERAGE(D2:D7),1)','=IFERROR(C2/0,"n/a")','=AND(C2>5,D2<10)'];
 m.innerHTML=`<h1>Excel Formula Playground</h1><div class="panel"><b>Evaluated in your browser by a small, safe parser (no eval).</b> Supported: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, ROUND, IF, AND, OR, IFERROR, COUNTIF, SUMIF, plus + - * / &amp; and comparisons. Other functions (VLOOKUP, XLOOKUP, INDEX/MATCH, text and date functions) are explained in the Formula Reference but are <b>not</b> executed here.</div>
 <div class="tw"><table><tr><th></th>${'ABCD'.split('').map(x=>`<th>${x}</th>`).join('')}</tr>${GRID.map((r,i)=>`<tr><th>${i+1}</th>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table></div>
 <div class="row"><input id="fx" value="=SUM(C2:C7)" size="38" aria-label="Formula"><button id="go">Evaluate</button></div><div class="row">${ex.map(x=>`<button class="sec" data-x='${x}'>${x}</button>`).join('')}</div><div class="panel" id="fr" aria-live="polite">Result appears here.</div>`;
 const go=()=>{try{$('#fr').textContent='Result: '+evalF($('#fx').value,GRID)}catch(e){$('#fr').textContent='Error: '+e.message}};
 $('#go').onclick=go;$('#fx').onkeydown=e=>{if(e.key==='Enter')go()};m.onclick=e=>{if(e.target.dataset.x){$('#fx').value=e.target.dataset.x;go()}}}
function prog(m){const cats=[...new Set(CH.map(c=>c.cat))];
 m.innerHTML=`<h1>Progress and Achievements</h1><div class="cards"><div class="card"><b>${doneN()}/30</b>Completed</div><div class="card"><b>${streak()}</b>Streak</div><div class="card"><b>${S.tot?Math.round(S.ok/S.tot*100):0}%</b>Accuracy</div></div>
 <h2>By category (skill mastery)</h2>${cats.map(k=>{const a=CH.filter(c=>c.cat===k),d=a.filter(c=>S.done[c.id]&&S.done[c.id].s===S.done[c.id].m).length;return `<p>${k}: ${d}/${a.length}${bar(d/a.length*100)}</p>`}).join('')}
 <h2>Badges</h2>${BADGES.map(b=>`<span class="badge ${b[1]()?'on':''}">${b[0]}</span>`).join('')}
 <p class="mu">Progress is stored in this browser only and will not sync across devices.</p><button class="sec" id="rs">Reset all progress</button>`;
 $('#rs').onclick=()=>{if(confirm('Delete all saved progress?')){S={done:{},att:0,ok:0,tot:0,days:[],last:null};save();prog(m)}}}
function ref(m){m.innerHTML=`<h1>Formula Reference</h1><input id="rq" placeholder="Search formulas" aria-label="Search formulas"><div id="rl"></div>`;
 const d=()=>{const q=$('#rq').value.toLowerCase();$('#rl').innerHTML=REF.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<div class="card" style="margin:10px 0"><b style="font-size:17px">${r[0]}</b>Syntax: <code>${r[1]}</code><br>Example: <code>${r[2]}</code><br>Business use: ${r[3]}<br><span class="mu">Common mistake: ${r[4]}</span></div>`).join('')};d();$('#rq').oninput=d}
function about(m){m.innerHTML=`<h1>About Excel Daily Lab</h1><p>Free, static practice site for aspiring Business Analysts. 30 challenges, each with its own generated dataset, tasks, hints, formulas, step-by-step solution and business interpretation. Answer keys are computed from the displayed data.</p><p><b>Be aware:</b> challenges share four dataset types (sales, payroll, stock, expenses) and a common task pattern (totals, averages, COUNTIF/SUMIF, share %, top group); the day titles describe the business theme and skills to practise in Excel. Progress lives in your browser's LocalStorage only.</p>`}
addEventListener('hashchange',()=>{view(location.hash);$('#main').focus()});view(location.hash||'#/home');
