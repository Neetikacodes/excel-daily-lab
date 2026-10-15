// Excel Daily Lab data + logic. Answer keys are COMPUTED from the displayed rows, so they always match.
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const r2=x=>Math.round(x*100)/100;
const DS={
 s:{cols:['Order ID','Region','Product','Qty','Unit Price'],gi:1,vn:'Revenue',gn:'Region',how:'Qty × Unit Price',ctx:'Sales orders from the last month are listed below.',role:'Sales Analyst',v:r=>r[3]*r[4],gen:(r,i)=>['O'+(1001+i),pick(r,['North','South','East','West']),pick(r,['Laptop','Phone','Tablet','Monitor']),1+Math.floor(r()*9),pick(r,[250,400,650,900])]},
 h:{cols:['Emp ID','Dept','Hours','Rate'],gi:1,vn:'Gross Pay',gn:'Dept',how:'Hours × Rate',ctx:'Monthly hours and hourly rates for staff are listed below.',role:'HR Analyst',v:r=>r[2]*r[3],gen:(r,i)=>['E'+(101+i),pick(r,['Sales','Ops','Finance','IT']),120+Math.floor(r()*60),pick(r,[15,18,22,30])]},
 k:{cols:['Item','Category','Units','Unit Cost'],gi:1,vn:'Stock Value',gn:'Category',how:'Units × Unit Cost',ctx:'Current warehouse stock is listed below.',role:'Inventory Analyst',v:r=>r[2]*r[3],gen:(r,i)=>['SKU-'+(200+i),pick(r,['Electronics','Furniture','Stationery','Tools']),Math.floor(r()*200),pick(r,[12,35,60,120])]},
 e:{cols:['Txn','Dept','Category','Amount'],gi:1,vn:'Spend',gn:'Dept',how:'use the Amount column directly',ctx:'Company expense transactions are listed below.',role:'Finance Analyst',v:r=>r[3],gen:(r,i)=>['T'+(500+i),pick(r,['Marketing','Ops','HR','IT']),pick(r,['Travel','Software','Supplies','Training']),(5+Math.floor(r()*90))*10]}
};
const DSK='shkesekhesksehkeseshkekseshekske';
const TITLES=`Sales Performance Analysis|Sales|SUM, AVERAGE, MIN, MAX, SUMIF, COUNTIF
Employee Attendance and Payroll|HR|COUNTIF, IF, overtime
Inventory and Stock Management|Inventory|SUMIF, COUNTIF, stock alerts
Monthly Expense Analysis|Finance|SUMIFS, AVERAGEIF, percentages
Customer Data Cleaning|Data Cleaning|TRIM, PROPER, duplicates
Product Profitability Analysis|Sales|revenue, cost, margin, SUMIFS
Weekly Business MIS Dashboard|Project|KPIs, pivot concepts, charts
Late Delivery Analysis|Operations|date differences, IF, AND
Invoice and Tax Calculations|Finance|percentages, ROUND, totals
Sales Target Achievement|Sales|IF, % achievement, RANK
Customer Repeat-Purchase Analysis|Sales|COUNTIF, COUNTIFS, lookups
Purchase Order Tracking|Procurement|lookups, SUMIFS, status
Vendor Comparison|Procurement|MIN, MAX, price comparison
Monthly Performance Dashboard|Project|KPIs, category comparison
Payroll and Overtime|HR|IF, SUMIFS, payroll
Sales Forecasting Basics|Sales|AVERAGE, trends
Missing and Incorrect Data|Data Cleaning|IFERROR, blank checks
Regional Sales Analysis|Sales|SUMIFS, % contribution
ABC Inventory Classification|Inventory|ranking, cumulative %
Customer Feedback Analysis|Operations|COUNTIF, categorising
Management MIS Report|Project|KPI reporting, summaries
E-commerce Order Analysis|Sales|lookups, order status
Discount and Pricing Analysis|Sales|percentages, nested IF
Sales Commission|Sales|commission slabs, IFS
Budget vs Actual Analysis|Finance|variance, variance %
Duplicate Invoice Detection|Finance|COUNTIF, duplicates
Advanced Lookup Challenge|Data Cleaning|XLOOKUP, INDEX/MATCH
Dynamic Dashboard Challenge|Project|KPIs, chart selection
Complete Business Case Study|Project|cleaning, summarising
Final Analyst Assessment|Project|integrated analysis`.split('\n');
const COMBOS=[['total','avg','max'],['total','count','top'],['sumg','avg','pct'],['total','top','pct'],['max','sumg','count'],['avg','top','sumg']];
const T={
 total:c=>({q:`What is the total ${c.D.vn}?`,a:c.sum,f:`=SUM(${c.D.vn} column)`,h:`First get ${c.D.vn} per row (${c.D.how}), then add them up.`}),
 avg:c=>({q:`Average ${c.D.vn} per row (2 decimals)?`,a:r2(c.sum/c.n),f:`=ROUND(AVERAGE(${c.D.vn} column),2)`,h:`Average of the ${c.D.vn} column.`}),
 max:c=>({q:`Highest single-row ${c.D.vn}?`,a:Math.max(...c.v),f:`=MAX(${c.D.vn} column)`,h:`MAX over the ${c.D.vn} column.`}),
 count:c=>({q:`How many rows have ${c.D.vn} above ${c.thr}?`,a:c.v.filter(x=>x>c.thr).length,f:`=COUNTIF(${c.D.vn} column,">${c.thr}")`,h:`COUNTIF with a ">" criterion.`}),
 sumg:c=>({q:`Total ${c.D.vn} for ${c.D.gn} = ${c.G}?`,a:c.gs[c.G],f:`=SUMIF(${c.D.gn} column,"${c.G}",${c.D.vn} column)`,h:`SUMIF on the ${c.D.gn} column.`}),
 top:c=>({q:`Which ${c.D.gn} has the highest total ${c.D.vn}? (type the name)`,a:c.top,t:'s',f:`=INDEX(names,MATCH(MAX(totals),totals,0))`,h:`SUMIF per ${c.D.gn}, then find the largest.`}),
 pct:c=>({q:`What % of total ${c.D.vn} is ${c.G}? (1 decimal)`,a:Math.round(c.gs[c.G]/c.sum*1000)/10,tol:.06,f:`=ROUND(SUMIF(...)/SUM(...)*100,1)`,h:`Group total ÷ grand total × 100.`})
};
function build(i){
 const [title,cat,skills]=TITLES[i].split('|');const D=DS[DSK[i%DSK.length]];const r=rng(i*97+13);const n=10+(i%5)*3;
 const rows=Array.from({length:n},(_,k)=>D.gen(r,k));const v=rows.map(D.v);const sum=v.reduce((a,b)=>a+b,0);
 const gs={};rows.forEach((x,k)=>gs[x[D.gi]]=(gs[x[D.gi]]||0)+v[k]);
 const gk=Object.keys(gs),mx=Math.max(...Object.values(gs)),top=gk.filter(g=>gs[g]===mx);
 const c={D,rows,v,sum,n,gs,top,G:gk[i%gk.length],thr:Math.max(100,Math.round(sum/n/100)*100)};
 const kinds=[...COMBOS[i%6]];
 if(i>=10)kinds.push(['pct','count','sumg','avg'].find(k=>!kinds.includes(k)));
 if(i>=22)kinds.push(['max','total','pct','count','avg'].find(k=>!kinds.includes(k)));
 const tasks=kinds.map(k=>T[k](c));
 const opts=[`Prioritise ${top[0]} and investigate why it leads`,`Stop investing in ${top[0]}`,`Cut all ${D.gn}s equally`,`No action is needed`];
 const ai=i%4;const o=[...opts.slice(1)];o.splice(ai,0,opts[0]);
 return{id:i+1,day:i+1,title,cat,skills,diff:i<10?'Beginner':i<22?'Intermediate':'Advanced',D,rows,tasks,c,
  mc:{q:'Based on these results, what action would you recommend to the manager?',o,a:ai},
  scen:`You are a ${D.role} working on "${title}". ${D.ctx} Your manager needs accurate numbers to decide where to focus.`,
  obj:`Produce a short, accurate summary of ${D.vn} (${D.how}) and recommend an action.`,
  interp:`${top.join('/')} contributes the most ${D.vn} (${Math.round(gs[top[0]]/sum*1000)/10}% of ${sum}). Tell your manager the leader, its share, and that this is one period of sample data, so confirm the trend before reallocating budget.`};
}
const CH=TITLES.map((_,i)=>build(i));
// ---- Safe formula evaluator (no eval/Function). Subset: SUM AVERAGE MIN MAX COUNT COUNTA ROUND IF AND OR IFERROR COUNTIF SUMIF
class Err{constructor(m){this.m=m}}
function evalF(src,G){
 const t=src.trim().replace(/^=/,'');
 const tk=t.match(/"[^"]*"|[A-Za-z]\d+:[A-Za-z]\d+|[A-Za-z_]+(?=\()|[A-Za-z]\d+|\d+\.?\d*|<=|>=|<>|[-+*\/(),<>=&]|\s+/g)||[];
 if(!t||tk.join('')!==t)throw new Error('Unsupported or invalid syntax');
 const K=tk.filter(x=>!/^\s+$/.test(x));let p=0;
 const cell=a=>{const m=a.match(/^([A-Za-z])(\d+)$/),c=m[1].toUpperCase().charCodeAt(0)-65,r=+m[2]-1;if(!G[r]||c>=G[r].length)throw new Error('Bad reference '+a);return G[r][c]};
 const range=a=>{const[x,y]=a.split(':').map(s=>s.match(/^([A-Za-z])(\d+)$/));const c1=x[1].toUpperCase().charCodeAt(0),c2=y[1].toUpperCase().charCodeAt(0),o=[];for(let r=Math.min(+x[2],+y[2]);r<=Math.max(+x[2],+y[2]);r++)for(let c=Math.min(c1,c2);c<=Math.max(c1,c2);c++)o.push(cell(String.fromCharCode(c)+r));return o};
 const num=x=>typeof x==='number'?x:(x===''||x==null)?0:isNaN(+x)?new Err('#VALUE!'):+x;
 const ns=a=>a.flatMap(x=>Array.isArray(x)?x.filter(y=>typeof y==='number'):typeof x==='number'?[x]:[]);
 const sm=a=>a.reduce((x,y)=>x+y,0);
 const mt=(v,c)=>{if(typeof c==='number')return v===c;const q=String(c).match(/^(<=|>=|<>|<|>|=)?(.*)$/),o=q[1]||'=',w=q[2],nw=w!==''&&!isNaN(+w)&&typeof v==='number';const x=nw?v:String(v).toLowerCase(),y=nw?+w:w.toLowerCase();return o==='='?x===y:o==='<>'?x!==y:o==='>'?x>y:o==='<'?x<y:o==='>='?x>=y:x<=y};
 const F={SUM:a=>sm(ns(a)),AVERAGE:a=>{const n=ns(a);return n.length?sm(n)/n.length:new Err('#DIV/0!')},MIN:a=>Math.min(...ns(a)),MAX:a=>Math.max(...ns(a)),COUNT:a=>ns(a).length,
  COUNTA:a=>a.flat().filter(x=>x!==''&&x!=null).length,ROUND:a=>{const k=10**(a[1]||0);return Math.round(a[0]*k)/k},IF:a=>a[0]?a[1]:a.length>2?a[2]:false,
  AND:a=>a.flat().every(Boolean),OR:a=>a.flat().some(Boolean),IFERROR:a=>a[0] instanceof Err?a[1]:a[0],
  COUNTIF:a=>a[0].filter(x=>mt(x,a[1])).length,SUMIF:a=>{const s=a[2]||a[0];return a[0].reduce((t,x,i)=>mt(x,a[1])&&typeof s[i]==='number'?t+s[i]:t,0)}};
 const pk=()=>K[p],nx=()=>K[p++];
 const pr=()=>{const k=nx();if(k===undefined)throw new Error('Unexpected end of formula');
  if(k[0]==='"')return k.slice(1,-1);if(/^\d/.test(k))return +k;
  if(k==='('){const v=ex();if(nx()!==')')throw new Error('Missing )');return v}
  if(/^[A-Za-z]\d+:[A-Za-z]\d+$/.test(k))return range(k);
  if(/^[A-Za-z]\d+$/.test(k))return cell(k);
  if(pk()==='('){nx();const f=F[k.toUpperCase()];if(!f)throw new Error('Unsupported function '+k);const a=[];if(pk()!==')'){do{a.push(ex())}while(pk()===','&&nx())}if(nx()!==')')throw new Error('Missing )');return f(a)}
  throw new Error('Unexpected '+k)};
 const un=()=>pk()==='-'?(nx(),-num(un())):pr();
 const mu=()=>{let a=un();while(pk()==='*'||pk()==='/'){const o=nx(),b=un();a=a instanceof Err?a:b instanceof Err?b:o==='*'?a*b:b===0?new Err('#DIV/0!'):a/b}return a};
 const ad=()=>{let a=mu();while(['+','-','&'].includes(pk())){const o=nx(),b=mu();a=o==='&'?String(a)+String(b):a instanceof Err?a:b instanceof Err?b:o==='+'?num(a)+num(b):num(a)-num(b)}return a};
 const ex=()=>{const a=ad(),o=pk();if(['=','<>','<','>','<=','>='].includes(o)){nx();const b=ad();return o==='='?a==b:o==='<>'?a!=b:o==='<'?a<b:o==='>'?a>b:o==='<='?a<=b:a>=b}return a};
 const v=ex();if(p<K.length)throw new Error('Unexpected '+K[p]);
 return v instanceof Err?v.m:v;
}
const REF=[
 ['SUM','=SUM(number1,[number2],...)','=SUM(B2:B10)','Total revenue column.','Text-formatted numbers are ignored.'],
 ['AVERAGE','=AVERAGE(number1,...)','=AVERAGE(B2:B10)','Average order value.','Blank cells are skipped, zeros are not.'],
 ['MIN / MAX','=MAX(range)','=MAX(D2:D20)','Best and worst price from vendors.','Mixing text in the range.'],
 ['COUNT / COUNTA','=COUNTA(range)','=COUNTA(A2:A50)','Number of orders or filled records.','COUNT ignores text; COUNTA counts anything non-blank.'],
 ['COUNTIF','=COUNTIF(range,criteria)','=COUNTIF(B2:B20,"North")','Orders per region.','Forgetting quotes around operators: ">50" not >50.'],
 ['SUMIF','=SUMIF(range,criteria,[sum_range])','=SUMIF(B2:B20,"North",E2:E20)','Region-wise sales.','Ranges of different sizes.'],
 ['SUMIFS / COUNTIFS','=SUMIFS(sum_range,range1,crit1,range2,crit2)','=SUMIFS(E:E,B:B,"North",C:C,"Laptop")','Sales by region AND product.','Note: sum_range comes FIRST in SUMIFS.'],
 ['IF','=IF(test,if_true,if_false)','=IF(A2>100,"High","Low")','Flag orders above a threshold.','Missing the false branch returns FALSE.'],
 ['IFS','=IFS(test1,val1,test2,val2,...)','=IFS(A2>90,"A",A2>70,"B",TRUE,"C")','Commission slabs. (Excel 2019+)','No final TRUE catch-all gives #N/A.'],
 ['IFERROR','=IFERROR(value,value_if_error)','=IFERROR(A2/B2,0)','Hide #DIV/0! in KPI tables.','It hides all errors, including real mistakes.'],
 ['VLOOKUP','=VLOOKUP(value,table,col,0)','=VLOOKUP(A2,F:H,3,0)','Fetch price by product code.','Forgetting 0 (exact match); lookup column must be leftmost.'],
 ['XLOOKUP','=XLOOKUP(value,lookup,return,[if_missing])','=XLOOKUP(A2,F:F,H:H,"n/a")','Safer lookup. (Excel 365/2021 only)','Not available in Excel 2016/2019.'],
 ['INDEX + MATCH','=INDEX(return,MATCH(value,lookup,0))','=INDEX(H:H,MATCH(A2,F:F,0))','Works in all versions, any direction.','Wrong match type (use 0).'],
 ['TRIM / PROPER','=PROPER(TRIM(text))','=PROPER(TRIM(A2))','Clean customer names.','TRIM does not remove non-breaking spaces.'],
 ['LEFT / RIGHT / MID','=MID(text,start,length)','=LEFT(A2,3)','Extract region code from an ID.','MID starts counting at 1.'],
 ['ROUND','=ROUND(number,digits)','=ROUND(B2*0.18,2)','Invoice tax amounts.','Rounding too early in multi-step calculations.']
];
