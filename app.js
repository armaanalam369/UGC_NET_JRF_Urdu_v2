/* Urdu NET Arena — app.js  (needs manifest.js; papers in data/ load on demand) */
(()=>{'use strict';
if(!window.RULES||!window.RULES.papers||!window.PAPER_LIST){document.getElementById('app').innerHTML='<div class="card" style="margin-top:20px"><h3>⚠️ data/manifest.js not found or outdated</h3><p class="mu">Upload the new <b>manifest.js</b> into the <b>data</b> folder of your GitHub repository (next to the paper files like data/2021-1.js), then refresh this page.</p></div>';return}
const $=s=>document.querySelector(s);
window.PAPERS=window.PAPERS||{};
const R=window.RULES,PL=window.PAPER_LIST,PP=R.papers,PK=Object.keys(PP),IC={},CD={},UR={},SUB={},TALL=[];
PL.forEach(p=>p.paper=p.paper||'II');
PK.forEach(k=>PP[k].topics.forEach(t=>{IC[t.n]=t.i;CD[t.n]=t.k||t.n.slice(0,4);UR[t.n]=t.ur||'';SUB[t.n]=t.sub||[];TALL.push(t.n)}));
let TP=PP.II.topics,TN=TP.map(t=>t.n);
const setTP=p=>{TP=PP[p].topics;TN=TP.map(t=>t.n)},tnOf=p=>PP[p||'II'].topics.map(t=>t.n);
const QUOTES=(window.QUOTES&&window.QUOTES.length)?window.QUOTES:['Small steps every day.'];
const ti=s=>{const i=TALL.indexOf(s);return i<0?999:i},DAY=864e5,INT=[1,3,7,14];
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const del=k=>{try{localStorage.removeItem(k)}catch(e){}};
const SET=Object.assign({font:1,motion:true,showTimer:true,autoNext:false,shuffleQ:false,shuffleO:false,confirmSubmit:true,autoWrong:true,haptic:true,wake:false,defMins:30,defNeg:false,tools:true,fullscreen:true},get('un_set',{}));
let ATT=get('un_att',[]),SAV=get('un_sav',{}),DAYM=get('un_days',{}),SEEN=get('un_seen',{}),LOADED=false;
const root=document.documentElement,app=$('#app');
root.dataset.theme=get('un_t','light');root.dataset.pal=get('un_p','oxblood');
const p2=n=>String(n).padStart(2,'0'),dkey=d=>{d=d||new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
const today0=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const fmt=s=>{s=Math.max(0,s);return p2(Math.floor(s/60))+':'+p2(s%60)},pct=(a,b)=>b?Math.round(a/b*100):0;
const tone=p=>p>=75?'#10b981':p>=50?'#f59e0b':'#ef4444',lab=p=>p>=75?'Strong':p>=50?'Average':'Weak';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const URX=/[\u0600-\u06FF]/,bi=s=>URX.test(s)?`<span class="ur" dir="rtl">${s}</span>`:s;
const pk=p=>(p.paper==='I'?'P1-':'')+p.year+'-'+p.shift,pl=p=>p.year+' · '+(R.shifts[p.shift]||'Shift '+p.shift);
const byNew=(a,b)=>(b.year-a.year)||(b.shift-a.shift);
const latestOf=p=>PL.filter(x=>x.paper===p).sort(byNew)[0];
const YS=pp=>[...new Set(PL.filter(p=>p.paper===(pp||S.paper)).map(p=>p.year))].sort((a,b)=>b-a);
const S={kind:'test',run:'test',el:0,view:'home',paper:'II',tpaper:'II',ap:'II',subs:{},year:String((latestOf('II')||{year:'all'}).year),shift:String((latestOf('II')||{shift:1}).shift),sh:'all',mode:'full',pool:'all',secs:{},neg:SET.defNeg,tneg:true,mins:SET.defMins,cnt:20,qs:[],ans:[],qt:[],mk:{},fl:[],cur:0,left:0,total:0,t:null,grid:false,tab:'last',sf:'all',wl:null,src:'',paused:false,fs:false,fsx:0,tabx:0,tabNote:false};
TALL.forEach(t=>S.secs[t]=false);
const prefs=()=>{root.style.setProperty('--fs',['14.5px','16px','18px'][SET.font]);root.dataset.motion=SET.motion?'on':'off'};
const saveSet=()=>{put('un_set',SET);prefs()};prefs();

/* ---------- helpers ---------- */
const bar=p=>`<div class="bar"><i style="width:${p}%;background:${tone(p)}"></i></div>`;
function render(h,keep){const y=scrollY;app.innerHTML=h;if(keep){scrollTo(0,y);return}app.classList.remove('in');void app.offsetWidth;app.classList.add('in');scrollTo(0,0)}
const sw=(on,act,v)=>`<button class="sw ${on?'on':''}" role="switch" aria-checked="${!!on}" data-act="${act}" data-v="${esc(v||'')}"><i></i></button>`;
const buzz=()=>{if(SET.haptic&&navigator.vibrate)try{navigator.vibrate(10)}catch(e){}};
const ask=m=>SET.confirmSubmit?confirm(m):true;
const getWake=()=>{if(SET.wake&&navigator.wakeLock)navigator.wakeLock.request('screen').then(l=>S.wl=l).catch(()=>{})};
const relWake=()=>{try{if(S.wl)S.wl.release()}catch(e){}S.wl=null};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const label=q=>(IC[q.s]||'')+' '+esc(q.s)+(q.c?' · '+esc(q.c):'');
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2600)}
function download(name,txt,mime){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:mime||'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
const FL={s:'🟢 Sure',g:'🟡 Guess',c:'🔴 Confused',u:'⚪ Not flagged'};
const stat=(l,v)=>`<div class="stat"><span class="mu">${l}</span><b>${v}</b></div>`;
const empty=(i,t,d)=>`<div class="empty"><b>${i}</b><div><strong>${t}</strong></div><div>${d}</div></div>`;

/* ---------- notebook (saved + spaced repetition) ---------- */
function keep(q,f){const e=SAV[q._k]||(SAV[q._k]={k:q._k,p:q._p||S.tpaper,s:q.s,c:q.c||'',q:q.q,o:q.o,a:q.a,e:q.e||'',src:q._src||''});e[f]=true}
function persist(){Object.keys(SAV).forEach(k=>{if(!SAV[k].b&&!SAV[k].w)delete SAV[k]});put('un_sav',SAV)}
const dueList=()=>Object.values(SAV).filter(e=>e.w&&(e.due||0)<=today0());
const dueText=e=>{const d=Math.round(((e.due||0)-today0())/DAY);return d<=0?'Due today':'Review in '+d+'d'};
function streak(){let n=0,x=new Date();if(!DAYM[dkey(x)])x.setDate(x.getDate()-1);while(DAYM[dkey(x)]){n++;x.setDate(x.getDate()-1)}return n}
function bestStreak(){let b=0,c=0,prev=null;Object.keys(DAYM).sort().forEach(k=>{const d=new Date(k+'T00:00');c=(prev&&Math.round((d-prev)/DAY)===1)?c+1:1;if(c>b)b=c;prev=d});return b}

/* ---------- autosave / resume ---------- */
function saveRun(){if(S.view!=='test')return;put('un_run',{tp:S.tpaper,run:S.run,mode:S.mode,tneg:S.tneg,src:S.src,ans:S.ans,qt:S.qt,mk:S.mk,fl:S.fl,cur:S.cur,left:S.left,total:S.total,el:S.el,fsx:S.fsx,tabx:S.tabx})}
function clearRun(){del('un_run');del('un_run_q')}
function resume(){const r=get('un_run',null),q=get('un_run_q',null);if(!r||!q)return;
Object.assign(S,{tpaper:r.tp||'II',run:r.run,mode:r.mode,tneg:r.tneg,src:r.src,qs:q,ans:r.ans,qt:r.qt,mk:r.mk,fl:r.fl||q.map(()=>null),cur:r.cur,left:r.left,total:r.total,el:r.el,fsx:r.fsx||0,tabx:r.tabx||0,paused:false});
clearInterval(S.t);S.t=setInterval(tick,1000);getWake();reqFS(S.run,S.mode);test()}

/* ---------- full-screen guard, tab tracking, pause ---------- */
function reqFS(kind,mode){const el=root;if(kind==='test'&&mode==='full'&&SET.fullscreen&&el.requestFullscreen){S.fs=true;el.requestFullscreen().catch(()=>S.fs=false)}else S.fs=false}
function exitFS(){S.fs=false;if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{})}
document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement){$('#warn').classList.remove('show');return}if(S.fs&&S.view==='test'&&!S.paused){S.fsx++;saveRun();$('#warn').classList.add('show')}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(S.view==='test'&&S.run==='test'&&S.mode==='full'&&!S.paused){S.tabx++;S.tabNote=true;saveRun()}}else if(S.tabNote){S.tabNote=false;toast('⚠️ Tab switch recorded ('+S.tabx+')')}});
function pause(){if(S.view!=='test'||S.run!=='test'||S.paused)return;S.paused=true;closeGrid();closeTools();saveRun();$('#pLeft').textContent=fmt(S.left);$('#pause').classList.add('show')}
function unpause(){S.paused=false;$('#pause').classList.remove('show');if(S.fs&&!document.fullscreenElement)reqFS(S.run,S.mode)}

/* ---------- floating speed-dial + floating bars ---------- */
function fabs(){const t=S.view==='test';document.body.dataset.v=S.view;
const it=t?[...(S.run==='test'?[['pause','⏸','Pause']]:[]),['grid','▦','Questions'],...(SET.tools?[['tools','✏️','Rough pad','pad'],['tools','🧮','Calculator','calc']]:[]),['sheet','⚙️','Settings','set'],['exit','✕','Exit']]
:[['sheet','📊','Analytics','last'],['sheet','🔁','Revision','sav'],['sheet','⚙️','Settings','set'],['theme','🌗','Theme'],['tour','💡','App tour']];
const n=it.length;$('#dItems').innerHTML=it.map((x,i)=>`<button class="di" data-act="${x[0]}" data-v="${x[3]||''}" data-l="${x[2]}" aria-label="${x[2]}" style="--y:${-(i+1)*58}px;--x:${-Math.round(Math.sin((i+1)/(n+1)*Math.PI)*24)}px;--d:${i*40}ms">${x[1]}</button>`).join('');
$('#dial').classList.remove('open')}
const dialClose=()=>$('#dial').classList.remove('open');

/* ---------- questions pool ---------- */
function poolQs(){const o=[];PL.forEach(p=>{const pp=PAPERS[pk(p)];if(pp)pp.questions.forEach((q,i)=>o.push({s:q.s,k:pk(p)+'#'+i,y:String(p.year),h:String(p.shift),c:q.c||'',p:p.paper}))});return o}
const subSel=u=>(SUB[u]||[]).filter(x=>S.subs[u+'|'+x]);
const subOK=q=>{const s=subSel(q.s);return !s.length||s.includes(q.c)};
function counts(year,sh,unseen,useSub,paper){paper=paper||S.paper;const c={};tnOf(paper).forEach(t=>c[t]=0);poolQs().forEach(x=>{if(x.p!==paper)return;if(year!=='all'&&x.y!==String(year))return;if(sh!=='all'&&x.h!==String(sh))return;if(unseen&&SEEN[x.k])return;if(useSub&&!subOK(x))return;if(c[x.s]!==undefined)c[x.s]++});return c}
function subCounts(u,year,sh,unseen){const m={};poolQs().forEach(x=>{if(x.p!==S.paper||x.s!==u)return;if(year!=='all'&&x.y!==String(year))return;if(sh!=='all'&&x.h!==String(sh))return;if(unseen&&SEEN[x.k])return;m[x.c]=(m[x.c]||0)+1});return m}
const sumC=(c,only)=>Object.keys(c).reduce((n,k)=>n+(!only||only[k]?c[k]:0),0);
const loadP=p=>new Promise((res,rej)=>{const k=pk(p);if(PAPERS[k])return res(PAPERS[k]);const s=document.createElement('script');s.src=p.file;s.onload=()=>PAPERS[k]?res(PAPERS[k]):rej();s.onerror=rej;document.body.appendChild(s)});
function preload(){return Promise.all(PL.map(p=>loadP(p).then(()=>p,()=>null))).then(r=>{const ok=r.filter(Boolean);if(ok.length&&ok.length<PL.length){PL.splice(0,PL.length,...ok)}LOADED=true;if(S.view==='home')home(true)})}
const selMap=()=>{const m={};TN.forEach(t=>{if(S.secs[t])m[t]=1});return m};

/* ---------- home ---------- */
function quoteCard(){return `<div class="card quote"><span class="mu">💬 Today's motivation</span><p>${bi(esc(QUOTES[Math.floor(today0()/DAY)%QUOTES.length]))}</p></div>`}
function coachInfo(){const g=agg();let ks=weakFirst(g).filter(k=>g[k].t>=3);return ks.length?{k:ks[0],p:pct(g[ks[0]].c,g[ks[0]].t)}:null}
function homeCards(){let h=quoteCard();const run=get('un_run',null),s=streak();
h+=`<div class="row"><span class="pill">🔥 ${s}-day streak</span><span class="pill">📝 ${ATT.length} tests</span></div>`;
if(run&&get('un_run_q',null)){const d=run.ans.filter(x=>x!==null).length;h+=`<div class="card glow"><b>⏯ Unfinished ${run.run==='quiz'?'quiz':'test'}</b><p class="mu">${esc(run.src)} · Q${run.cur+1} · ${d} answered${run.run==='test'?' · '+fmt(run.left)+' left':''}</p><div class="row"><button class="btn s" data-act="resume">▶ Resume</button><button class="btn g s" data-act="discard">Discard</button></div></div>`}
const due=dueList().length;if(due)h+=`<div class="card hint"><span><b>🔁 Revision due: ${due}</b><br><span class="mu">Wrong answers ready for review</span></span><button class="btn s" data-act="revdue">Revise</button></div>`;
const c=coachInfo();h+=c?`<div class="card hint"><span><b>🎯 Weak-area coach</b><br><span class="mu">Weakest unit: <b style="color:${tone(c.p)}">${esc(c.k)} (${c.p}%)</b>. Try 10 questions?</span></span><button class="btn s" data-act="coach" data-v="${esc(c.k)}">Practise</button></div>`:`<div class="card"><b>🎯 Weak-area coach</b><p class="mu">Take a few tests and I'll pick the unit that needs you most.</p></div>`;
return h}
const step=(n,t)=>`<h2 class="step"><i>${n}</i>${t}</h2>`;
const tile=(on,act,v,ic,t,d)=>`<button class="tile ${on?'on':''}" data-act="${act}" data-v="${v}"><em>${ic}</em><b>${t}</b><span>${d}</span></button>`;
function home(keepScroll){
setTP(S.paper);const rp=PP[S.paper],ys=YS();
if(S.mode==='saved')S.mode='full';
if(S.mode==='full'&&ys.length&&(S.year==='all'||!ys.includes(+S.year)))S.year=String(ys[0]);
S.view='home';clearInterval(S.t);relWake();closeGrid();closeTools();fabs();
const q=S.kind==='quiz',full=S.mode==='full',un=!full&&S.pool==='unseen',pls=PL.filter(p=>p.paper===S.paper);
const shF=full?S.shift:S.sh,cAll=counts('all','all',false),cY=counts(S.year,shF,un),nTot=sumC(cAll),nCov=TN.filter(t=>cAll[t]>0).length;
const yq=y=>sumC(counts(y,'all',false));
const stats=`<div class="stats">${stat('Papers',pls.length)}${stat('Questions',LOADED?nTot:'…')}${stat('Units',LOADED?nCov+'/'+TN.length:'…')}</div>`;
const yearChips=`<div class="chips">${(full?ys:['all',...ys]).map(y=>`<button class="chip ${String(S.year)===String(y)?'on':''}" data-act="year" data-v="${y}">${y==='all'?'📚 All years':y}${LOADED&&y!=='all'?` <span class="cn">${yq(y)}</span>`:''}</button>`).join('')}</div>`;
const shifts=(full?[1,2]:['all',1,2]).map(s=>`<button class="${String(shF)===String(s)?'on':''}" data-act="shift" data-v="${s}">${s==='all'?'Both shifts':R.shifts[s]}</button>`).join('');
let card='';
if(full){const by=counts(S.year,S.shift,false),yt=sumC(by),has=pls.some(p=>String(p.year)===S.year&&String(p.shift)===S.shift);
card=`<b>${rp.short} exam pattern</b><p class="mu">${rp.fullMinutes} minutes · ${rp.count} questions · ${rp.marks} marks per correct answer${rp.negative?` · −${rp.negative} per wrong answer`:' · no negative marking'}.</p>`+(has?(LOADED?`<div class="sec">${esc(S.year)} · ${R.shifts[S.shift]} · ${yt} questions</div><div class="tgrid">${TN.map(t=>`<span class="tag" style="${by[t]?'':'opacity:.4'}">${IC[t]} ${esc(CD[t])} <b>${by[t]}</b></span>`).join('')}</div>`:'<p class="mu">Loading paper details…</p>'):'<p class="mu" style="color:var(--rose)">This year/shift is not in the paper list yet.</p>')}
else{const avail=sumC(counts(S.year,shF,un,true),selMap()),g=agg(),selN=Object.keys(selMap()).length;
if(q)card+=`<b>Instant-feedback quiz</b><p class="mu">See the right answer and explanation right after each question. No timer.</p>`;
card+=`<div class="line"><b>Choose units</b><span class="row"><button class="btn g s" data-act="topall">All</button><button class="btn g s" data-act="topweak">🎯 Weakest 3</button><button class="btn g s" data-act="topnone">None</button></span></div><p class="mu"><b>${selN}</b> of ${TN.length} units · <b>${LOADED?avail:'…'}</b> questions available${S.year==='all'?'':' in '+esc(S.year)}</p><div class="ugrid">`+TP.map((t,i)=>{const n=cY[t.n],gp=g[t.n]&&g[t.n].t?pct(g[t.n].c,g[t.n].t):null;
return `<button class="ut ${S.secs[t.n]?'on':''}" ${LOADED&&!n&&!S.secs[t.n]?'disabled':''} data-act="sec" data-v="${esc(t.n)}"><i>${t.i}</i><span><b>${i+1}. ${esc(t.n)}</b><small class="ur" dir="rtl">${t.ur||''}</small></span><em>${LOADED?n:'…'}</em>${gp===null?'':`<u style="background:${tone(gp)}" title="Your accuracy ${gp}%"></u>`}</button>`}).join('')+`</div><p class="mu"><i class="mdot" style="background:#10b981"></i> strong <i class="mdot" style="background:#f59e0b"></i> average <i class="mdot" style="background:#ef4444"></i> weak — from your past tests</p>`;
const sh=TP.filter(t=>S.secs[t.n]&&(SUB[t.n]||[]).length);
if(sh.length)card+=`<div class="sec">Sub-topics (optional)</div><p class="mu">Tap sub-topics to narrow down. Leave a unit's sub-topics unselected to practise the whole unit.</p>`+sh.map(t=>{const m=subCounts(t.n,S.year,shF,un);return `<div class="sub"><p class="lbl"><b>${t.i} ${esc(t.n)}</b></p><div class="chips sm">${SUB[t.n].map(x=>`<button class="chip ${S.subs[t.n+'|'+x]?'on':''}" data-act="sub" data-v="${esc(t.n+'|'+x)}">${esc(x)}${LOADED?` <span class="cn">${m[x]||0}</span>`:''}</button>`).join('')}</div></div>`}).join('')+`<button class="btn g s" data-act="subclear">Clear sub-topics</button>`;
card+=`<div class="line"><span>Question pool</span><span class="row"><button class="chip ${!un?'on':''}" data-act="pool" data-v="all">All</button><button class="chip ${un?'on':''}" data-act="pool" data-v="unseen">🆕 Unseen only</button></span></div>`+
`<div class="line"><span>Number of questions</span><span class="row">${[10,20,30,0].map(c=>`<button class="chip ${S.cnt===c?'on':''}" data-act="cnt" data-v="${c}">${c||'All'+(LOADED?' ('+avail+')':'')}</button>`).join('')}</span></div>`}
if(!full&&rp.negative)card+=`<div class="line"><span>Negative marking</span>${sw(S.neg,'neg')}</div>`;
if(!full&&!q)card+=`<div class="line"><span>Time (minutes)</span><input type="number" id="mins" min="1" max="180" value="${S.mins}"></div>`;
card+=`<div class="line"><span>Rough pad &amp; calculator<small>Show ✏️ and 🧮 in the test menu</small></span>${sw(SET.tools,'tg','tools')}</div>`;
if(!q&&full)card+=`<div class="line"><span>Full-screen exam mode<small>Warns if you leave full-screen or switch tabs</small></span>${sw(SET.fullscreen,'tg','fullscreen')}</div>`;
const nStart=full?sumC(counts(S.year,S.shift,false)):Math.min(S.cnt||1e9,sumC(counts(S.year,shF,un,true),selMap()));
const ptile=k=>{const r=PP[k];return tile(S.paper===k,'paper',k,r.icon,r.short,`${r.tag}<br>${r.count} Qs · ${r.count*r.marks} marks · ${r.fullMinutes} min`)};
render(`<section class="hero"><div class="big">اردو</div><h1>Complete UGC NET JRF Urdu Prep</h1><p class="mu">Paper I &amp; Paper II · previous-year papers by year &amp; shift · unit and sub-topic practice.</p></section>${stats}${homeCards()}`+
step(1,'Choose a paper')+`<div class="tiles">${PK.slice().reverse().map(ptile).join('')}</div>`+
step(2,'Choose a mode')+`<div class="tiles">${tile(!q,'kind','test','📝','Exam Test','Timed, like the real paper')}${tile(q,'kind','quiz','💡','Quiz','Instant answers &amp; notes')}</div>`+
step(3,'Choose the scope')+`<div class="tiles">${tile(full,'mode','full','📜','Full paper','Pick a year &amp; shift')}${tile(!full,'mode','sec','📚','Unit-wise','Units &amp; sub-topics of '+rp.short)}</div>`+
step(4,full?'Pick year &amp; shift':'Filter by year &amp; shift')+yearChips+`<div class="seg">${shifts}</div>`+
`<div class="card">${card}</div><div style="height:90px"></div>`,keepScroll);
const ok=full?pls.some(p=>String(p.year)===S.year&&String(p.shift)===S.shift):true;
$('#sb').innerHTML=`<button class="go" data-act="start" ${ok?'':'disabled'}>${q?'Start Quiz':'Start Test'}${LOADED&&nStart?' · '+nStart+' questions':''} →</button>`}
document.addEventListener('input',e=>{if(e.target.id==='mins')S.mins=+e.target.value||1;if(e.target.id==='dm'){SET.defMins=Math.max(1,Math.min(180,+e.target.value||30));S.mins=SET.defMins;saveSet()}});

/* ---------- start ---------- */
async function start(opt){
if(S.view==='test')return;const sec=S.mode==='sec',secs=TN.filter(t=>S.secs[t]),rp=PP[S.paper];
if(sec&&!secs.length)return alert('Select at least one unit.');
const list=PL.filter(p=>p.paper===S.paper&&(sec?((S.year==='all'||String(p.year)===S.year)&&(S.sh==='all'||String(p.shift)===S.sh)):(String(p.year)===S.year&&String(p.shift)===S.shift)));
if(!list.length)return alert('Please choose an available year and shift.');
if(get('un_run',null)&&!confirm('You have an unfinished test. Discard it and start a new one?'))return;
reqFS(S.kind,S.mode);let papers;
try{papers=await Promise.all(list.map(loadP))}catch(e){exitFS();return alert('Could not load a paper file. Check the paths in data/manifest.js.')}
let qs=[];const cnt=(opt&&opt.cnt!=null)?opt.cnt:S.cnt;
papers.forEach((p,pi)=>p.questions.forEach((q,i)=>{if(!sec||(secs.includes(q.s)&&subOK(q)))qs.push({...q,_k:pk(list[pi])+'#'+i,_p:S.paper,_src:R.examName+' '+rp.short+' '+pl(list[pi])})}));
if(sec&&S.pool==='unseen')qs=qs.filter(q=>!SEEN[q._k]);
if(!qs.length){exitFS();return alert(sec&&S.pool==='unseen'?'You have already seen every question here. Switch the pool to "All".':'No questions found for this selection.')}
if(sec){if(cnt>0&&qs.length>cnt)qs=shuf(qs).slice(0,cnt);qs.sort((a,b)=>ti(a.s)-ti(b.s));S.src=R.examName+' '+rp.short+' · Unit practice'+(S.year==='all'?'':' · '+S.year)}
else S.src=R.examName+' '+rp.short+' '+pl(list[0]);
begin(qs,S.kind==='quiz'?0:(S.mode==='full'?rp.fullMinutes:Math.max(1,S.mins))*60)}
function begin(qs,total,kind){
S.tpaper=S.paper;S.run=kind||S.kind;S.tneg=S.neg;S.paused=false;S.fsx=0;S.tabx=0;S.tabNote=false;
if(SET.shuffleQ){const g={},o=[];qs.forEach(q=>{if(!g[q.s]){g[q.s]=[];o.push(q.s)}g[q.s].push(q)});qs=[];o.forEach(s=>qs=qs.concat(shuf(g[s])))}
if(SET.shuffleO)qs=qs.map(q=>{const ord=shuf(q.o.map((_,i)=>i));return {...q,o:ord.map(i=>q.o[i]),a:ord.indexOf(q.a)}});
S.qs=qs;S.ans=qs.map(()=>null);S.qt=qs.map(()=>0);S.fl=qs.map(()=>null);S.mk={};S.cur=0;S.total=total;S.left=total;S.el=0;
PAD.strokes=[];CALC=calcNew();calcUI();put('un_run_q',qs);
clearInterval(S.t);S.t=setInterval(tick,1000);getWake();test()}
function tick(){if(S.paused)return;S.el++;if(S.view==='test')S.qt[S.cur]++;if(S.el%5===0)saveRun();if(S.run==='quiz')return;S.left--;
const el=$('#tm');if(el){el.textContent=SET.showTimer?fmt(S.left):'⏱ ••';el.classList.toggle('low',S.left<300)}
if(S.left<=0){toast('⏰ Time is up!');submit()}}

/* ---------- question screens ---------- */
function tchips(q){const secs=[];S.qs.forEach(x=>{if(!secs.includes(x.s))secs.push(x.s)});return `<div class="chips sm tscroll">${secs.map(s=>`<button class="chip ${s===q.s?'on':''}" data-act="secjump" data-v="${esc(s)}">${IC[s]||''} ${esc(CD[s]||s)}</button>`).join('')}</div>`}
function centerChip(){const c=$('.tscroll .on');if(c){const p=c.parentNode;p.scrollLeft=c.offsetLeft-p.clientWidth/2+c.clientWidth/2}}
function flagsRow(locked){const f=S.fl[S.cur];return `<div class="flags"><span class="mu">Confidence</span>${[['s','🟢 Sure'],['g','🟡 Guess'],['c','🔴 Confused']].map(x=>`<button class="chip ${f===x[0]?'on':''}" ${locked?'disabled':''} data-act="flag" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`}
const qhead=q=>`<span class="tag">${label(q)}</span><b class="qt">${bi(q.q)}</b>`;
function dock(q,quiz){const sv=SAV[q._k]&&SAV[q._k].b,last=S.cur===S.qs.length-1;
$('#tb').innerHTML=`<div class="dk"><button data-act="prev" aria-label="Previous" ${S.cur?'':'disabled'}>←</button>${quiz?'':`<button class="${S.mk[S.cur]?'on':''}" data-act="mark" aria-label="Mark for review">${S.mk[S.cur]?'★':'☆'}</button>`}<button class="${sv?'on':''}" data-act="save" aria-label="Save question">🔖</button>${quiz?'':'<button data-act="clear" aria-label="Clear answer">⌫</button>'}<button class="nx" data-act="next">${last?(quiz?'Finish ✓':'Submit ✓'):'Next →'}</button></div>`}
function quizView(keepS){const q=S.qs[S.cur],a=S.ans[S.cur],done=a!==null;let c=0,w=0;S.ans.forEach((x,i)=>{if(x!==null){x===S.qs[i].a?c++:w++}});
render(`<div class="top"><span class="qc">Q ${S.cur+1}<small> / ${S.qs.length}</small></span><span class="timer">✅ ${c} · ❌ ${w}</span></div><div class="bar thin"><i style="width:${(S.cur+1)/S.qs.length*100}%"></i></div>${tchips(q)}
<div class="card qcard">${qhead(q)}${q.o.map((o,i)=>`<button class="opt ${done?(i===q.a?'ok':i===a?'bad':''):''}" data-act="opt" data-v="${i}"><s>${'ABCD'[i]}</s><span>${bi(o)}</span></button>`).join('')}${flagsRow(done)}${done?`<div class="expl"><b>${a===q.a?'✅ Correct!':'❌ Incorrect'}</b> · Answer: ${'ABCD'[q.a]}<br>💡 ${bi(q.e||'No explanation added for this question yet.')}</div>`:''}</div><div style="height:96px"></div>`,keepS);
dock(q,true);centerChip();if(S.grid)fillGrid();saveRun()}
const qcls=i=>S.run==='quiz'?(S.ans[i]===null?'':(S.ans[i]===S.qs[i].a?'ok':'bad')):(S.ans[i]!==null?'ans':'')+' '+(S.mk[i]?'mk':'');
function test(keepS){S.view='test';fabs();$('#sb').innerHTML='';if(S.run==='quiz')return quizView(keepS);
const q=S.qs[S.cur],d=S.ans.filter(a=>a!==null).length;
render(`<div class="top"><span class="qc">Q ${S.cur+1}<small> / ${S.qs.length} · ${d} done</small></span><span class="timer ${S.left<300?'low':''}" id="tm">${SET.showTimer?fmt(S.left):'⏱ ••'}</span></div><div class="bar thin"><i style="width:${(S.cur+1)/S.qs.length*100}%"></i></div>${tchips(q)}
<div class="card qcard">${qhead(q)}${q.o.map((o,i)=>`<button class="opt ${S.ans[S.cur]===i?'sel':''}" data-act="opt" data-v="${i}"><s>${'ABCD'[i]}</s><span>${bi(o)}</span></button>`).join('')}${flagsRow(false)}</div><div style="height:96px"></div>`,keepS);
dock(q,false);centerChip();if(S.grid)fillGrid();saveRun()}
function fillGrid(){const a=S.ans.filter(x=>x!==null).length,m=Object.keys(S.mk).length;
$('#drawer').innerHTML=`<div class="grab"></div><b>Question palette</b><p class="mu">🟩 ${a} answered · 🟧 ${m} marked · ${S.qs.length-a} left</p><div class="grid">${S.qs.map((_,i)=>`<button class="qn ${qcls(i)} ${i===S.cur?'cur':''}" data-act="jump" data-v="${i}">${i+1}</button>`).join('')}</div><button class="go inl" data-act="submit">${S.run==='quiz'?'Finish Quiz':'Submit Test'}</button>`}
function openGrid(){S.grid=true;fillGrid();$('#drawer').classList.add('show');$('#shade').classList.add('show')}
function closeGrid(){S.grid=false;$('#drawer').classList.remove('show');$('#shade').classList.remove('show')}

/* ---------- submit + result ---------- */
function submit(){
clearInterval(S.t);relWake();closeGrid();closeTools();exitFS();clearRun();S.paused=false;$('#pause').classList.remove('show');$('#warn').classList.remove('show');
S.view='result';fabs();$('#tb').innerHTML='';$('#sb').innerHTML='';
const RT=PP[S.tpaper]||PP.II,neg=(S.run==='test'&&S.mode==='full')?RT.negative:(S.tneg?RT.negative:0),mk=RT.marks||1;
const st={},det=[],full=[],conf={};let sc=0,att=0,mastered=0;const tomorrow=today0()+DAY;
S.qs.forEach((q,i)=>{const r=S.ans[i]===null?'n':S.ans[i]===q.a?'c':'w',f=S.fl[i]||'u';
const x=st[q.s]=st[q.s]||{c:0,w:0,n:0,t:0},cf=conf[f]=conf[f]||{c:0,w:0,n:0};
x.t++;x[r]++;cf[r]++;if(r==='c')sc+=mk;if(r==='w')sc-=neg;if(r!=='n')att++;if(r!=='n'&&q._k)SEEN[q._k]=1;
det.push({s:q.s,r,t:S.qt[i]||0,f});full.push({s:q.s,c:q.c||'',q:q.q,o:q.o,a:q.a,y:S.ans[i],t:S.qt[i]||0,f,e:q.e||''});
let e=SAV[q._k];
if(r==='w'&&(SET.autoWrong||S.mode==='saved')){keep(q,'w');e=SAV[q._k];e.box=1;e.due=tomorrow}
else if(r==='c'&&S.mode==='saved'&&e&&e.w){e.box=(e.box||1)+1;if(e.box>4){e.w=false;e.box=0;delete e.due;mastered++}else e.due=today0()+INT[e.box-1]*DAY}});
persist();put('un_seen',SEEN);
const dk=dkey(),dd=DAYM[dk]||(DAYM[dk]={q:0,t:0});dd.q+=att;dd.t++;put('un_days',DAYM);
const max=S.qs.length*mk;
ATT.push({paper:S.tpaper,ts:Date.now(),src:S.mode==='saved'?'Revision practice':S.src+(S.run==='quiz'?' · Quiz':''),mode:S.mode,run:S.run,sc,max,neg,mk,used:S.el,total:S.total,secs:st,det,conf,fsx:S.fsx,tabx:S.tabx,full});
if(ATT.length>40)ATT.shift();ATT.forEach((a,i)=>{if(i<ATT.length-5)delete a.full});put('un_att',ATT);
render(`<div class="card res">${ring(sc,max)}<p class="mu">Time taken: ${fmt(ATT[ATT.length-1].used)}${S.fsx+S.tabx?' · ⚠️ '+(S.fsx+S.tabx)+' focus lapse(s)':''}</p></div>`+
Object.keys(st).sort((a,b)=>ti(a)-ti(b)).map(k=>{const v=st[k];return `<div class="card"><b>${IC[k]||''} ${esc(k)}</b> <span class="mu">✅ ${v.c} · ❌ ${v.w} · ⏭ ${v.n}</span>${bar(pct(v.c,v.t))}</div>`}).join('')+
`<div class="row"><button class="btn" data-act="sheet" data-v="last">📊 Full analysis</button><button class="btn g" data-act="exportq">⬇ Export attempted (CSV)</button><button class="btn g" data-act="home">← Home</button></div>`+
(mastered?`<p class="mu">🎉 ${mastered} question(s) mastered and removed from your wrong notebook.</p>`:'')+
(S.mode!=='saved'&&SET.autoWrong?'<p class="mu">Wrong answers were added to your 🔖 notebook and scheduled for spaced revision.</p>':'')+
'<h2>Review</h2>'+S.qs.map((q,i)=>`<div class="card"><div class="line"><span class="mu">${label(q)} · Q${i+1} · ⏱ ${S.qt[i]||0}s${S.fl[i]?' · '+FL[S.fl[i]]:''}</span><button class="btn g s" data-act="rsave" data-v="${i}">${SAV[q._k]&&SAV[q._k].b?'🔖 Saved':'🔖 Save'}</button></div><b class="qt">${bi(q.q)}</b>${q.o.map((o,j)=>`<div class="opt ${j===q.a?'ok':S.ans[i]===j?'bad':''}"><s>${'ABCD'[j]}</s><span>${bi(o)}</span></div>`).join('')}${q.e?`<div class="expl">💡 ${bi(q.e)}</div>`:''}</div>`).join(''));
celebrate(sc/max,sc)}
function ring(sc,max){let c=0,w=0,n=0;const p=Math.max(0,Math.min(1,sc/max));S.ans.forEach((a,i)=>{if(a===null)n++;else if(a===S.qs[i].a)c++;else w++});
const msg=p>=.75?'Outstanding result!':p>=.5?'Good going — keep climbing':p>=.25?'Solid start — review and retry':'Every mistake here is a mark saved later';
return `<div class="ringw"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--a)"/><stop offset="1" style="stop-color:var(--b)"/></linearGradient></defs><circle class="t" cx="60" cy="60" r="52"/><circle class="f" cx="60" cy="60" r="52" style="--o:${(326.7*(1-p)).toFixed(1)}"/></svg><div class="ringc"><b id="rnum">${sc.toFixed(2)}</b><small>out of ${max} · ${Math.round(p*100)}%</small></div></div><h3>${msg}</h3><div class="rp"><span style="color:#10b981">✅ ${c}</span><span style="color:#ef4444">❌ ${w}</span><span>⏭ ${n}</span></div>`}
function celebrate(p,sc){const el=$('#rnum'),t0=performance.now();
if(el&&SET.motion)(function f(t){const k=Math.min(1,(t-t0)/1500);el.textContent=(sc*(1-Math.pow(1-k,3))).toFixed(2);if(k<1)requestAnimationFrame(f)})(t0);
if(p<.25||!SET.motion||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
const cv=$('#cf'),c=cv.getContext('2d'),W=cv.width=innerWidth,H=cv.height=innerHeight,ps=[],cols=['#8b1e2d','#b8862d','#2f6b5b','#e7c36a','#2b3a67','#c9573a'],N=Math.round(70+p*150),st=performance.now();
for(let i=0;i<N;i++)ps.push({x:W/2+(Math.random()-.5)*120,y:H*.3,vx:(Math.random()-.5)*15,vy:-Math.random()*15-4,w:6+Math.random()*6,h:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[i%cols.length]});
(function loop(t){c.clearRect(0,0,W,H);ps.forEach(q=>{q.vy+=.3;q.vx*=.992;q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;c.save();c.translate(q.x,q.y);c.rotate(q.r);c.fillStyle=q.c;c.fillRect(-q.w/2,-q.h/2,q.w,q.h);c.restore()});if(t-st<4200)requestAnimationFrame(loop);else c.clearRect(0,0,W,H)})(st)}
function exportQ(){const a=ATT[ATT.length-1];if(!a||!a.full)return alert('Nothing to export yet. Finish a test first.');
const rows=[['#','Unit','Sub-topic','Question','Option A','Option B','Option C','Option D','Your answer','Correct answer','Result','Time (s)','Confidence','Explanation']];
a.full.forEach((x,i)=>{if(x.y===null||x.y===undefined)return;rows.push([i+1,x.s,x.c,x.q,x.o[0]||'',x.o[1]||'',x.o[2]||'',x.o[3]||'','ABCD'[x.y]+'. '+x.o[x.y],'ABCD'[x.a]+'. '+x.o[x.a],x.y===x.a?'Correct':'Wrong',x.t,FL[x.f]?FL[x.f].replace(/^\S+\s/,''):'',x.e])});
if(rows.length===1)return alert('You did not attempt any question in the last test.');
download('urdu-net-attempted-'+dkey(new Date(a.ts))+'.csv','\ufeff'+rows.map(r=>r.map(c=>'"'+String(c).replace(/<[^>]*>/g,' ').replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv;charset=utf-8')}

/* ---------- charts ---------- */
function radar(map,tn){tn=tn||TN;const N=tn.length,cx=170,cy=160,r=96,f=n=>n.toFixed(1);
const pt=(i,v)=>{const a=-Math.PI/2+2*Math.PI*i/N;return [cx+Math.cos(a)*r*v,cy+Math.sin(a)*r*v]};
let s='<svg viewBox="0 0 340 320" style="width:100%;height:auto" role="img" aria-label="Radar chart of unit strengths">';
[.25,.5,.75,1].forEach(l=>s+=`<polygon points="${tn.map((_,i)=>pt(i,l).map(f).join(',')).join(' ')}" fill="none" stroke="var(--bd)"/>`);
tn.forEach((t,i)=>{const e=pt(i,1),l=pt(i,1.17),c=Math.cos(-Math.PI/2+2*Math.PI*i/N),has=!!(map[t]&&map[t].t);
s+=`<line x1="${cx}" y1="${cy}" x2="${f(e[0])}" y2="${f(e[1])}" stroke="var(--bd)"/><text x="${f(l[0])}" y="${f(l[1]+3)}" text-anchor="${c>.3?'start':c<-.3?'end':'middle'}" font-size="9" font-weight="700" style="fill:var(--mu)" opacity="${has?1:.4}">${esc(CD[t])}</text>`});
const vals=tn.map((t,i)=>{const m=map[t];return pt(i,m&&m.t?pct(m.c,m.t)/100:0)});
s+=`<polygon points="${vals.map(p=>p.map(f).join(',')).join(' ')}" style="fill:var(--a);stroke:var(--a)" fill-opacity=".28" stroke-width="2" stroke-linejoin="round"/>`;
vals.forEach((p,i)=>{const m=map[tn[i]];if(m&&m.t)s+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3" fill="${tone(pct(m.c,m.t))}"/>`});
return s+'</svg>'}
function bars(map,tn){tn=tn||TN;const rh=19;let s=`<svg viewBox="0 0 340 ${tn.length*rh+6}" style="width:100%;height:auto" role="img" aria-label="Accuracy by unit">`;
tn.forEach((t,i)=>{const y=i*rh+3,has=map[t]&&map[t].t,p=has?pct(map[t].c,map[t].t):0;
s+=`<text x="0" y="${y+11}" font-size="9.5" style="fill:var(--tx)" opacity="${has?1:.45}">${esc(t.length>26?t.slice(0,25)+'…':t)}</text><rect x="150" y="${y+2}" width="152" height="10" rx="5" style="fill:var(--bd)"/>${has?`<rect x="150" y="${y+2}" width="${Math.max(4,p*1.52)}" height="10" rx="5" fill="${tone(p)}"/>`:''}<text x="340" y="${y+11}" text-anchor="end" font-size="9.5" font-weight="700" style="fill:var(--mu)">${has?p+'%':'–'}</text>`});
return s+'</svg>'}
function heat(){const W=17,cell=14,gap=3,today=new Date();today.setHours(0,0,0,0);const start=new Date(today);start.setDate(today.getDate()-((W-1)*7+today.getDay()));
const op=[0,.3,.55,.8,1],mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];let lastM=-1,act=0;
let s=`<svg viewBox="0 0 ${W*(cell+gap)} ${7*(cell+gap)+14}" style="width:100%;height:auto" role="img" aria-label="Daily practice heatmap">`;
for(let w=0;w<W;w++)for(let d=0;d<7;d++){const dt=new Date(start);dt.setDate(start.getDate()+w*7+d);if(dt>today)continue;
const rec=DAYM[dkey(dt)],q=rec?rec.q:0,lv=!q?0:q<10?1:q<25?2:q<50?3:4;if(q)act++;
if(d===0&&dt.getMonth()!==lastM){lastM=dt.getMonth();s+=`<text x="${w*(cell+gap)}" y="9" font-size="8.5" style="fill:var(--mu)">${mn[lastM]}</text>`}
s+=`<rect x="${w*(cell+gap)}" y="${14+d*(cell+gap)}" width="${cell}" height="${cell}" rx="4" style="fill:${lv?'var(--a)':'var(--bd)'}" fill-opacity="${lv?op[lv]:1}"><title>${dkey(dt)}: ${q} question(s)</title></rect>`}
return s+`</svg><div class="legend"><span style="margin-right:auto">${act} active day${act===1?'':'s'} in the last ${W} weeks</span>Less ${op.map((o,i)=>`<i style="${i?'opacity:'+o:'background:var(--bd)'}"></i>`).join('')} More</div>`}

/* ---------- analytics ---------- */
function trow(k,v,btn){const p=pct(v.c,v.t);return `<div class="card"><div class="line"><b>${IC[k]||''} ${esc(k)}</b><b style="color:${tone(p)}">${p}% · ${lab(p)}</b></div><div class="line"><span class="mu">${v.c}/${v.t} correct · ${v.w} wrong · ${v.n} skipped</span>${btn?`<button class="btn g s" data-act="ptopic" data-v="${esc(k)}">Practise</button>`:''}</div>${bar(p)}</div>`}
function agg(paper){paper=paper||S.paper;const s={};ATT.filter(a=>(a.paper||'II')===paper).forEach(a=>Object.keys(a.secs).forEach(k=>{const v=a.secs[k],x=s[k]||(s[k]={c:0,w:0,n:0,t:0});x.c+=v.c;x.w+=v.w;x.n+=v.n;x.t+=v.t}));return s}
function aggConf(paper){paper=paper||S.paper;const s={};ATT.filter(a=>(a.paper||'II')===paper).forEach(a=>Object.keys(a.conf||{}).forEach(k=>{const v=a.conf[k],x=s[k]||(s[k]={c:0,w:0,n:0});x.c+=v.c;x.w+=v.w;x.n+=v.n}));return s}
function weakFirst(g){return Object.keys(g).sort((a,b)=>pct(g[a].c,g[a].t)-pct(g[b].c,g[b].t)||ti(a)-ti(b))}
function nums(list,col,max){max=max||15;if(!list.length)return '<span class="mu">None 🎉</span>';return `<div class="cnum">${list.slice(0,max).map(n=>`<span style="background:${col}">${n}</span>`).join('')}${list.length>max?`<span class="mu" style="background:none;color:var(--mu)">+${list.length-max} more</span>`:''}</div>`}
function timeBlock(a){const n=a.det.length,avg=a.det.reduce((s,d)=>s+d.t,0)/n||1;
const ids=fn=>a.det.map((d,i)=>fn(d)?i+1:0).filter(Boolean);
const sw_=ids(d=>d.r==='w'&&d.t>=1.5*avg),fw=ids(d=>d.r==='w'&&d.t<=.5*avg),sr=ids(d=>d.r==='c'&&d.t>=1.5*avg);
const tm={};a.det.forEach(d=>{const x=tm[d.s]||(tm[d.s]={t:0,n:0});x.t+=d.t;x.n++});
const ks=Object.keys(tm).sort((x,y)=>ti(x)-ti(y)),mx=Math.max(...ks.map(k=>tm[k].t/tm[k].n))||1;
return `<div class="sec">Time per question</div><div class="card"><p class="mu">Average: <b style="color:var(--tx)">${avg.toFixed(0)}s</b> per question${a.total?' · exam pace target '+Math.round(a.total/n)+'s':''}</p><div class="line"><b>🐢 Slow &amp; wrong</b></div><span class="mu">Took 1.5× the average and still missed — likely concept gaps.</span>${nums(sw_,'#ef4444')}<div class="line"><b>⚡ Fast &amp; wrong</b></div><span class="mu">Under half the average — rushed or guessed.</span>${nums(fw,'#f59e0b')}<div class="line"><b>🐌 Slow but right</b></div><span class="mu">Correct, but costly — practise for speed.</span>${nums(sr,'#3b82f6')}</div><div class="card"><b>Average time by unit</b>${ks.map(k=>{const v=tm[k].t/tm[k].n;return `<div class="line"><span>${IC[k]||''} ${esc(CD[k])}</span><b>${v.toFixed(0)}s</b></div><div class="bar"><i style="width:${Math.round(v/mx*100)}%"></i></div>`}).join('')}</div>`}
function confBlock(cf){const keys=['s','g','c','u'].filter(k=>cf[k]);if(!keys.length)return '';
if(keys.length===1&&keys[0]==='u')return '<div class="sec">Confidence check</div><div class="card"><p class="mu">Tap 🟢 Sure / 🟡 Guess / 🔴 Confused while answering and this section will show how well your confidence matches your results.</p></div>';
let h=`<div class="sec">Confidence check</div><div class="card"><div class="mtx"><b></b><b>Right</b><b>Wrong</b><b>Skipped</b>${keys.map(k=>{const v=cf[k];return `<span class="l">${FL[k]}</span><span style="color:#10b981">${v.c}</span><span style="color:#ef4444">${v.w}</span><span>${v.n}</span>`}).join('')}</div>`;
if(cf.s&&cf.s.w)h+=`<p>⚠️ <b>${cf.s.w}</b> "Sure" answer(s) were wrong — overconfidence. Revise those concepts first.</p>`;
if(cf.g&&cf.g.c)h+=`<p>🍀 <b>${cf.g.c}</b> right guess(es) — lucky, not learned. Re-check them.</p>`;
if(cf.s&&(cf.s.c+cf.s.w+cf.s.n)&&!cf.s.w)h+='<p>✅ Your "Sure" answers were all correct — great calibration.</p>';
return h+'</div>'}
function tLast(){const a=ATT[ATT.length-1];if(!a)return empty('📊','No test yet','Finish a test and its full analysis shows up here.');
let c=0,w=0;Object.keys(a.secs).forEach(k=>{c+=a.secs[k].c;w+=a.secs[k].w});
return `<p class="mu">${esc(a.src)} · ${new Date(a.ts).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p><div class="stats">${stat('Score',a.sc.toFixed(2)+' / '+a.max)}${stat('Accuracy',pct(c,c+w)+'%')}${stat('Attempted',(c+w)+' / '+a.det.length)}${stat('Negative marks','−'+(w*(a.neg||0)).toFixed(2))}${stat('Avg time / Q',Math.round(a.used/a.det.length)+'s')}${stat('Time taken',fmt(a.used))}${(a.fsx||a.tabx)?stat('Focus lapses','⚠️ '+((a.fsx||0)+(a.tabx||0))):''}</div>${a.full?'<button class="btn wide" data-act="exportq">⬇ Export attempted questions + my answers (CSV)</button>':''}<div class="sec">Strength radar</div><div class="card">${radar(a.secs,tnOf(a.paper))}</div><div class="sec">Question map</div><div class="strip">${a.det.map((d,i)=>`<span style="background:${d.r==='c'?'#10b981':d.r==='w'?'#ef4444':'#6b7280'}">${i+1}</span>`).join('')}</div>${timeBlock(a)}${confBlock(a.conf||{})}<div class="sec">Unit-wise (this test)</div>${Object.keys(a.secs).sort((x,y)=>ti(x)-ti(y)).map(k=>trow(k,a.secs[k])).join('')}`}
function spark(arr){const p=arr.slice(-12).map(a=>Math.max(0,Math.min(100,a.sc/a.max*100)));if(p.length<2)return '<p class="mu">Take 2+ tests to see your trend.</p>';
return `<svg viewBox="0 0 200 50" preserveAspectRatio="none" style="width:100%;height:70px"><polyline points="${p.map((v,i)=>(i*200/(p.length-1)).toFixed(1)+','+(48-v*.46).toFixed(1)).join(' ')}" fill="none" style="stroke:var(--a)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`}
function tAll(){const at=ATT.filter(a=>(a.paper||'II')===S.ap),g=agg(S.ap),s=streak();let c=0,w=0,t=0,best=0,sum=0;Object.keys(g).forEach(k=>{c+=g[k].c;w+=g[k].w});at.forEach(a=>{const p=a.sc/a.max*100;sum+=p;if(p>best)best=p;t+=a.used});
const h=`<div class="stats">${stat('Tests taken',at.length)}${stat('Avg score',at.length?Math.round(sum/at.length)+'%':'–')}${stat('Best score',at.length?Math.round(best)+'%':'–')}${stat('Accuracy',at.length?pct(c,c+w)+'%':'–')}${stat('Study streak','🔥 '+s+' day'+(s===1?'':'s'))}${stat('Best streak','🏆 '+bestStreak()+' day'+(bestStreak()===1?'':'s'))}</div><div class="sec">Daily practice calendar</div><div class="card">${heat()}</div>`;
if(!at.length)return h+empty('📈','No '+PP[S.ap].short+' tests yet','Radar, bar charts and trends appear after your first '+PP[S.ap].short+' test.');
const weak=weakFirst(g).slice(0,3),tn=tnOf(S.ap);
return h+`<div class="card"><span class="mu">Score trend (last 12 tests)</span>${spark(at)}</div><div class="sec">Strength radar</div><div class="card">${radar(g,tn)}</div><div class="sec">Accuracy by unit</div><div class="card">${bars(g,tn)}</div>${confBlock(aggConf(S.ap))}<div class="sec">Focus on these units</div>${weak.map(k=>trow(k,g[k],true)).join('')}<div class="sec">Recent tests</div>${at.slice(-5).reverse().map(a=>`<div class="line"><span>${esc(a.src)}<small>${new Date(a.ts).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</small></span><b>${a.sc.toFixed(1)}/${a.max}</b></div>`).join('')}<p class="mu">Total practice time: ${Math.round(t/60)} min</p>`}
function tTopics(){const tn=tnOf(S.ap),g=agg(S.ap);if(!ATT.some(a=>(a.paper||'II')===S.ap))return empty('📚','No '+PP[S.ap].short+' unit data','Take a '+PP[S.ap].short+' test and all its units will be ranked here, weakest first.');
const done=weakFirst(g),un=tn.filter(k=>!g[k]);
return `<div class="card">${bars(g,tn)}</div><p class="mu">Weakest units first — tap Practise to drill one.</p>${done.map(k=>trow(k,g[k],true)).join('')}${un.length?`<div class="sec">Not attempted yet (${un.length})</div><div class="tgrid">${un.map(k=>`<button class="chip" data-act="ptopic" data-v="${esc(k)}">${IC[k]} ${esc(k)}</button>`).join('')}</div>`:''}`}
const apChips=()=>`<div class="chips sm">${PK.slice().reverse().map(k=>`<button class="chip ${S.ap===k?'on':''}" data-act="ap" data-v="${k}">${PP[k].icon} ${PP[k].short}</button>`).join('')}</div>`;
function savedList(){return Object.values(SAV).filter(e=>S.sf==='all'||(S.sf==='b'&&e.b)||(S.sf==='w'&&e.w)||(S.sf==='d'&&e.w&&(e.due||0)<=today0())).sort((a,b)=>(a.due||0)-(b.due||0))}
function tSav(){const all=Object.keys(SAV).length,l=savedList(),due=dueList().length;
const h=`<div class="chips sm">${[['all','All ('+all+')'],['d','🔁 Due today ('+due+')'],['w','❌ Wrong notebook'],['b','🔖 Bookmarked']].map(x=>`<button class="chip ${S.sf===x[0]?'on':''}" data-act="sfil" data-v="${x[0]}">${x[1]}</button>`).join('')}</div><p class="mu">Spaced repetition: wrong answers return after 1 → 3 → 7 → 14 days. Get one right at the end and it's mastered.</p>`;
if(!l.length)return h+empty('🔖','Nothing here',S.sf==='d'?'No revision due today. Nice work! 🎉':'Tap 🔖 Save during a test. Wrong answers are saved automatically.');
return h+`<button class="btn wide" data-act="practice">▶ Practise these (${l.length})</button>`+l.map(e=>`<div class="card"><div class="line"><span><span class="tag">${esc(e.s)}${e.c?' · '+esc(e.c):''}</span> ${e.w?`<span class="tag" style="color:#ef4444">wrong · box ${e.box||1} · ${dueText(e)}</span>`:''}</span><button class="btn g s" data-act="delsav" data-v="${esc(e.k)}">🗑</button></div><b class="qt">${bi(e.q)}</b><div class="opt ok"><s>${'ABCD'[e.a]}</s><span>${bi(e.o[e.a])}</span></div>${e.e?`<div class="expl">💡 ${bi(e.e)}</div>`:''}<span class="mu">${esc(e.src)}</span></div>`).join('')}
const setRow=(l,d,c)=>`<div class="line"><span>${l}${d?'<small>'+d+'</small>':''}</span>${c}</div>`;
function tSet(){const kb=Math.round((JSON.stringify(ATT).length+JSON.stringify(SAV).length)/1024*10)/10;
const cols={oxblood:'#8b1e2d',indigo:'#2b3a67',verdigris:'#2f6b5b',saffron:'#b5651d',walnut:'#5a3a22'};
return `<div class="sec">Appearance</div><div class="card">${setRow('Dark mode','',sw(root.dataset.theme==='dark','theme'))}<div class="line"><span>Colour palette</span><span class="row">${Object.keys(cols).map(k=>`<button class="dot ${root.dataset.pal===k?'on':''}" data-act="pick" data-v="${k}" style="background:${cols[k]}" aria-label="${k}"></button>`).join('')}</span></div><div class="line"><span>Text size</span><span class="row">${['A−','A','A+'].map((l,i)=>`<button class="chip ${SET.font===i?'on':''}" data-act="font" data-v="${i}">${l}</button>`).join('')}</span></div>${setRow('Motion graphics','Turn off to save battery',sw(SET.motion,'tg','motion'))}</div>
<div class="sec">Test experience</div><div class="card">${setRow('Rough pad &amp; calculator','In the test menu',sw(SET.tools,'tg','tools'))}${setRow('Full-screen exam mode','Full-paper exam tests only',sw(SET.fullscreen,'tg','fullscreen'))}${setRow('Show timer','Hide it to reduce pressure',sw(SET.showTimer,'tg','showTimer'))}${setRow('Auto-next on answer','Jump ahead after choosing',sw(SET.autoNext,'tg','autoNext'))}${setRow('Shuffle questions','Within each unit',sw(SET.shuffleQ,'tg','shuffleQ'))}${setRow('Shuffle options','Stops memorising positions',sw(SET.shuffleO,'tg','shuffleO'))}${setRow('Confirm before submit','',sw(SET.confirmSubmit,'tg','confirmSubmit'))}${setRow('Auto-save wrong answers','Builds your revision notebook',sw(SET.autoWrong,'tg','autoWrong'))}${setRow('Haptic feedback','Light vibration on taps',sw(SET.haptic,'tg','haptic'))}${setRow('Keep screen awake','During tests',sw(SET.wake,'tg','wake'))}${setRow('Default unit-test time','Minutes',`<input type="number" id="dm" min="1" max="180" value="${SET.defMins}">`)}${(PP.II.negative||PP.I.negative)?setRow('Negative marking by default','For unit-wise tests',sw(SET.defNeg,'tg','defNeg')):''}</div>
<div class="sec">Help</div><div class="card"><button class="btn g s" data-act="tour">▶ Replay the app tour</button></div>
<div class="sec">Data</div><div class="card"><p class="mu">Stored on this device: ${ATT.length} tests · ${Object.keys(SAV).length} saved questions · ${kb} KB</p><div class="row"><button class="btn g s" data-act="export">⬇ Backup</button><button class="btn g s" data-act="import">⬆ Restore</button><button class="btn g s" data-act="wipe" style="color:#ef4444">🗑 Clear data</button></div></div><p class="mu c">Urdu NET Arena · UGC NET JRF Paper II</p>`}
function sheet(){const tabs=[['last','📊 Last test'],['all','📈 Overall'],['chap','📚 Units'],['sav','🔖 Revision'],['set','⚙️ Settings']];
$('#stabs').innerHTML=tabs.map(t=>`<button class="chip ${S.tab===t[0]?'on':''}" data-act="tab" data-v="${t[0]}">${t[1]}</button>`).join('');
const b=$('#sbody'),y=b.scrollTop;b.innerHTML=(S.tab==='all'||S.tab==='chap'?apChips():'')+({last:tLast,all:tAll,chap:tTopics,sav:tSav,set:tSet})[S.tab]();b.scrollTop=y}
function openSheet(tab){if(!sheetOpen())S.ap=S.view==='test'?S.tpaper:S.paper;if(tab)S.tab=tab;sheet();$('#sheet').classList.add('show');$('#shade2').classList.add('show')}
function closeSheet(){$('#sheet').classList.remove('show');$('#shade2').classList.remove('show')}
const sheetOpen=()=>$('#sheet').classList.contains('show');

/* ---------- rough pad ---------- */
const PAD={strokes:[],col:'auto',erase:false,cur:null,cv:null,cx:null};
const inkColor=c=>c==='auto'?(getComputedStyle(root).getPropertyValue('--tx').trim()||'#000'):c;
function strokeSeg(s,pts){const c=PAD.cx;c.save();c.globalCompositeOperation=s.e?'destination-out':'source-over';c.strokeStyle=inkColor(s.c);c.lineWidth=s.e?18:2.6;c.lineCap=c.lineJoin='round';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(pts.length===1)c.lineTo(pts[0][0]+.1,pts[0][1]);c.stroke();c.restore()}
const padDraw=()=>{PAD.cx.clearRect(0,0,PAD.cv.width,PAD.cv.height);PAD.strokes.forEach(s=>strokeSeg(s,s.p))};
function padResize(){const r=PAD.cv.getBoundingClientRect(),d=devicePixelRatio||1;if(!r.width)return;PAD.cv.width=Math.round(r.width*d);PAD.cv.height=Math.round(r.height*d);PAD.cx.setTransform(d,0,0,d,0,0);padDraw()}
function padUI(){document.querySelectorAll('[data-pc]').forEach(b=>b.classList.toggle('on',!PAD.erase&&b.dataset.pc===PAD.col));$('#bErase').classList.toggle('on',PAD.erase)}
function padInit(){PAD.cv=$('#pad');PAD.cx=PAD.cv.getContext('2d');const pt=e=>{const r=PAD.cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
PAD.cv.addEventListener('pointerdown',e=>{e.preventDefault();try{PAD.cv.setPointerCapture(e.pointerId)}catch(x){}PAD.cur={c:PAD.col,e:PAD.erase,p:[pt(e)]};PAD.strokes.push(PAD.cur);strokeSeg(PAD.cur,PAD.cur.p)});
PAD.cv.addEventListener('pointermove',e=>{if(!PAD.cur)return;const p=pt(e),l=PAD.cur.p[PAD.cur.p.length-1];PAD.cur.p.push(p);strokeSeg(PAD.cur,[l,p])});
const up=()=>PAD.cur=null;PAD.cv.addEventListener('pointerup',up);PAD.cv.addEventListener('pointercancel',up);addEventListener('resize',()=>{if(toolsOpen())padResize()})}

/* ---------- calculator ---------- */
const calcNew=()=>({cur:'0',acc:null,op:null,fresh:true});let CALC=calcNew();const SYM={'+':'+','-':'−','*':'×','/':'÷'};
const fmtn=n=>{if(!isFinite(n))return 'Error';const s=String(parseFloat(n.toPrecision(12)));return s.length>14?n.toExponential(6):s};
function calcEval(){const a=CALC.acc,b=parseFloat(CALC.cur);let r=0;if(CALC.op==='+')r=a+b;else if(CALC.op==='-')r=a-b;else if(CALC.op==='*')r=a*b;else r=b===0?NaN:a/b;CALC.cur=fmtn(r);CALC.acc=isFinite(r)?r:null}
const calcUI=()=>{$('#cval').textContent=CALC.cur;$('#cexp').textContent=(CALC.op&&CALC.acc!==null)?fmtn(CALC.acc)+' '+SYM[CALC.op]:''};
function calcPress(k){const C=CALC;if(C.cur==='Error'&&k!=='C')return;
if(/^[0-9]$/.test(k)){if(C.fresh){C.cur=k;C.fresh=false}else if(C.cur.replace(/[-.]/g,'').length<14)C.cur=C.cur==='0'?k:C.cur+k}
else if(k==='.'){if(C.fresh){C.cur='0.';C.fresh=false}else if(!C.cur.includes('.'))C.cur+='.'}
else if('+-*/'.includes(k)){if(C.op&&!C.fresh)calcEval();else C.acc=parseFloat(C.cur);if(CALC.cur!=='Error'){CALC.op=k;CALC.fresh=true}}
else if(k==='='){if(C.op){calcEval();C.op=null;C.fresh=true}}
else if(k==='C')CALC=calcNew();
else if(k==='B'){if(!C.fresh&&C.cur.length>1)C.cur=C.cur.slice(0,-1);else{C.cur='0';C.fresh=true}}
else if(k==='%'){C.cur=fmtn(parseFloat(C.cur)/100);C.fresh=true}
else if(k==='R'){const n=parseFloat(C.cur);C.cur=n<0?'Error':fmtn(Math.sqrt(n));C.fresh=true}
calcUI()}
function calcInit(){const keys=[['C','C','op'],['B','⌫','op'],['%','%','op'],['/','÷','op'],['7'],['8'],['9'],['*','×','op'],['4'],['5'],['6'],['-','−','op'],['1'],['2'],['3'],['+','+','op'],['0'],['.'],['R','√','op'],['=','=','eq']];
$('#ckeys').innerHTML=keys.map(k=>`<button class="${k[2]||''}" data-act="ck" data-v="${k[0]}">${k[1]||k[0]}</button>`).join('');calcUI()}
const toolsOpen=()=>$('#tools').classList.contains('show');
function openTools(tab){if(!SET.tools)return;$('#tools').classList.add('show');$('#shade2').classList.add('show');toolTab(tab||'pad')}
function closeTools(){$('#tools').classList.remove('show');if(!sheetOpen())$('#shade2').classList.remove('show')}
function toolTab(t){S.ttab=t;$('#padWrap').style.display=t==='pad'?'flex':'none';$('#calcWrap').style.display=t==='calc'?'flex':'none';$('#tabPad').classList.toggle('on',t==='pad');$('#tabCalc').classList.toggle('on',t==='calc');if(t==='pad'){padResize();padUI()}}

/* ---------- tour ---------- */
const TOUR=[
{i:'👋',t:'Welcome to Wise Choice · UGC NET Urdu',d:'Prepare for <b>both papers</b>: Paper I (Teaching &amp; Research Aptitude) and Paper II (Urdu). Practise previous-year papers by year &amp; shift, or drill any unit and sub-topic.'},
{i:'📝',t:'Two papers, two ways to practise',d:'Pick <b>Paper I</b> or <b>Paper II</b> first. Then choose <b>Exam Test</b> (timed) or <b>Quiz</b> (instant answers), and a <b>Full paper</b> or <b>Unit-wise</b> practice. In unit-wise mode you can narrow down to <b>sub-topics</b> too.'},
{i:'🎛️',t:'The floating menu',d:'Tap the round button at the bottom-right. On the home screen it opens Analytics, Revision and Settings. During a test it holds ⏸ Pause, ▦ the question palette, ✏️ rough pad, 🧮 calculator and ✕ exit.'},
{i:'📊',t:'Know your strengths',d:'Open Analytics for a <b>radar chart</b>, accuracy bars by unit, time-per-question insights, your <b>daily practice calendar</b>, and export your attempted questions with your answers.'},
{i:'🔁',t:'Revise smartly',d:'Wrong answers go to a <b>spaced-repetition notebook</b> (back after 1, 3, 7, 14 days). The <b>weak-area coach</b> on the home screen picks the unit that needs you most.'}];
function tourShow(n){const s=TOUR[n],last=n===TOUR.length-1;S.tourN=n;
$('#tour').innerHTML=`<div class="ovc"><div class="big">${s.i}</div><h2>${s.t}</h2><p>${s.d}</p><div class="tdots">${TOUR.map((_,i)=>`<i class="${i===n?'on':''}"></i>`).join('')}</div><div class="row c">${n?'<button class="btn g" data-act="tourback">←</button>':'<button class="btn g" data-act="tourend">Skip</button>'}<button class="btn" data-act="${last?'tourend':'tournext'}">${last?"Let's go 🚀":'Next →'}</button></div></div>`;$('#tour').classList.add('show')}
const tourEnd=()=>{$('#tour').classList.remove('show');put('un_tour',1)};

/* ---------- actions ---------- */
$('#imp').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
r.onload=()=>{try{const d=JSON.parse(r.result);if(d.att)ATT=d.att;if(d.sav)SAV=d.sav;if(d.days)DAYM=d.days;if(d.set)Object.assign(SET,d.set);if(d.seen)SEEN=d.seen;put('un_att',ATT);put('un_sav',SAV);put('un_days',DAYM);put('un_seen',SEEN);saveSet();sheet();alert('Backup restored.')}catch(x){alert('That file is not a valid backup.')}};
r.readAsText(f);e.target.value=''});
function setTopicOnly(v){const up=PK.find(k=>PP[k].topics.some(t=>t.n===v))||'II';S.paper=up;setTP(up);TALL.forEach(t=>S.secs[t]=(t===v));S.subs={};S.mode='sec';S.kind='quiz';S.year='all';S.sh='all';S.pool='all'}
const A={
dial:()=>$('#dial').classList.toggle('open'),
theme:()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';put('un_t',root.dataset.theme);if(sheetOpen())sheet();if(toolsOpen()&&S.ttab==='pad')padDraw()},
pick:v=>{root.dataset.pal=v;put('un_p',v);if(sheetOpen())sheet()},
paper:v=>{S.paper=v;setTP(v);S.sh='all';const l=latestOf(v);if(S.mode==='full'){S.year=l?String(l.year):'all';S.shift=l?String(l.shift):'1'}home()},
mode:v=>{S.mode=v;home(true)},
sub:v=>{S.subs[v]=!S.subs[v];home(true)},subclear:()=>{S.subs={};home(true)},ap:v=>{S.ap=v;sheet()},
kind:v=>{S.kind=v;home(true)},
year:v=>{S.year=String(v);if(S.mode==='full'&&!PL.some(p=>p.paper===S.paper&&String(p.year)===S.year&&String(p.shift)===S.shift)){const l=PL.find(p=>p.paper===S.paper&&String(p.year)===S.year);if(l)S.shift=String(l.shift)}home(true)},
shift:v=>{if(S.mode==='full')S.shift=String(v);else S.sh=String(v);home(true)},
sec:v=>{S.secs[v]=!S.secs[v];home(true)},cnt:v=>{S.cnt=+v;home(true)},
topall:()=>{const c=counts(S.year,S.sh,S.pool==='unseen');TN.forEach(t=>S.secs[t]=!LOADED||c[t]>0);home(true)},
topweak:()=>{const g=agg(),c=counts(S.year,S.sh,S.pool==='unseen'),ks=weakFirst(g).filter(k=>c[k]>0).slice(0,3);if(!ks.length)return toast('Take a test first — then I can find your weakest units.');TN.forEach(t=>S.secs[t]=ks.includes(t));home(true)},
pool:v=>{S.pool=v;home(true)},topnone:()=>{TN.forEach(t=>S.secs[t]=false);home(true)},neg:()=>{S.neg=!S.neg;home(true)},
start:()=>start(),home:()=>home(),resume,
discard:()=>{if(confirm('Discard your unfinished test?')){clearRun();home(true)}},
revdue:()=>{S.sf='d';A.practice()},
coach:v=>{if(S.view==='test')return;closeSheet();setTopicOnly(v);start({cnt:10})},
opt:v=>{if(S.run==='quiz'){if(S.ans[S.cur]!==null)return;buzz();S.ans[S.cur]=+v;test(true);return}
buzz();S.ans[S.cur]=+v;const c=S.cur;test(true);if(SET.autoNext&&c<S.qs.length-1)setTimeout(()=>{if(S.view==='test'&&S.cur===c&&!S.paused){S.cur++;test()}},280)},
flag:v=>{if(S.run==='quiz'&&S.ans[S.cur]!==null)return;S.fl[S.cur]=S.fl[S.cur]===v?null:v;test(true)},
prev:()=>{if(S.cur>0){S.cur--;test()}},
next:()=>{if(S.cur<S.qs.length-1){S.cur++;test();return}
if(S.run==='quiz'){const u=S.ans.filter(x=>x===null).length;if(u&&!confirm(u+' question(s) unanswered. Finish the quiz?'))return;submit()}else if(ask('Submit the test?'))submit()},
mark:()=>{if(S.mk[S.cur])delete S.mk[S.cur];else S.mk[S.cur]=1;test(true)},
clear:()=>{S.ans[S.cur]=null;test(true)},
save:()=>{const q=S.qs[S.cur],e=SAV[q._k];if(e&&e.b)e.b=false;else keep(q,'b');persist();test(true)},
rsave:(v,el)=>{const q=S.qs[+v],e=SAV[q._k];if(e&&e.b)e.b=false;else keep(q,'b');persist();el.textContent=SAV[q._k]&&SAV[q._k].b?'🔖 Saved':'🔖 Save'},
jump:v=>{S.cur=+v;closeGrid();test()},
secjump:v=>{for(let i=0;i<S.qs.length;i++)if(S.qs[i].s===v){S.cur=i;break}test()},
grid:()=>S.grid?closeGrid():openGrid(),closegrid:closeGrid,
submit:()=>{if(ask('Submit the test?'))submit()},
exit:()=>{if(confirm('Exit this test? Your progress will be lost.')){clearRun();exitFS();S.paused=false;$('#warn').classList.remove('show');home()}},
pause,unpause,
pauseexit:()=>{$('#pause').classList.remove('show');exitFS();S.paused=false;home()},
fsback:()=>{$('#warn').classList.remove('show');reqFS(S.run,S.mode)},fsskip:()=>{$('#warn').classList.remove('show');S.fs=false},
tools:v=>{if(S.view==='test'&&!S.paused)openTools(v)},toolsclose:closeTools,ttab:v=>toolTab(v),
padcol:v=>{PAD.col=v;PAD.erase=false;padUI()},paderase:()=>{PAD.erase=!PAD.erase;padUI()},padundo:()=>{PAD.strokes.pop();padDraw()},padclear:()=>{PAD.strokes=[];padDraw()},
ck:v=>calcPress(v),
sheet:v=>openSheet(v),closesheet:()=>{closeSheet();closeTools()},
tab:v=>{S.tab=v;sheet();$('#sbody').scrollTop=0},sfil:v=>{S.sf=v;sheet()},
delsav:v=>{delete SAV[v];persist();sheet()},
practice:()=>{if(S.view==='test')return alert('Finish or exit the current test first.');const l=savedList();if(!l.length){openSheet('sav');return}
if(get('un_run',null)&&!confirm('You have an unfinished test. Discard it and start this revision?'))return;
closeSheet();S.mode='saved';begin(l.map(e=>({s:e.s,c:e.c,q:e.q,o:e.o.slice(),a:e.a,e:e.e,_k:e.k,_src:e.src})),0,'quiz')},
ptopic:v=>{if(S.view==='test')return alert('Finish or exit the current test first.');closeSheet();setTopicOnly(v);home()},
exportq:exportQ,
tour:()=>{closeSheet();tourShow(0)},tournext:()=>tourShow(S.tourN+1),tourback:()=>tourShow(S.tourN-1),tourend:tourEnd,
tg:v=>{SET[v]=!SET[v];if(v==='defNeg')S.neg=SET.defNeg;saveSet();if(sheetOpen())sheet();if(S.view==='home')home(true);else fabs()},
font:v=>{SET.font=+v;saveSet();sheet()},
'export':()=>download('urdu-net-backup.json',JSON.stringify({att:ATT,sav:SAV,set:SET,days:DAYM,seen:SEEN})),
'import':()=>$('#imp').click(),
wipe:()=>{if(confirm('Delete all analytics, streaks and saved questions from this device?')){ATT=[];SAV={};DAYM={};SEEN={};put('un_seen',SEEN);put('un_att',ATT);put('un_sav',SAV);put('un_days',DAYM);sheet()}}};
document.addEventListener('click',e=>{
if(!e.target.closest('.dial'))dialClose();
const t=e.target.closest('[data-act]');if(!t||t.disabled)return;
const f=A[t.dataset.act];if(f){if(t.dataset.act!=='opt')buzz();if(t.classList.contains('di'))dialClose();f(t.dataset.v,t)}});
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;
if(toolsOpen()){if(S.ttab==='calc'){const k=e.key,m={Enter:'=','=':'=',Backspace:'B',Delete:'C',c:'C',C:'C','%':'%'};if(/^[0-9.]$/.test(k)||'+-*/'.includes(k)){e.preventDefault();calcPress(k)}else if(m[k]){e.preventDefault();calcPress(m[k])}}if(e.key==='Escape')closeTools();return}
if(S.view!=='test'||S.paused||sheetOpen()||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
const k=e.key.toLowerCase();
if(k>='1'&&k<='4'){if(S.qs[S.cur].o[+k-1]!==undefined)A.opt(+k-1)}
else if(k==='n'||k==='arrowright'){if(S.cur<S.qs.length-1)A.next()}
else if(k==='p'||k==='arrowleft')A.prev();
else if(k==='m'&&S.run!=='quiz')A.mark()});

padInit();calcInit();home();preload();
if(!get('un_tour',0))tourShow(0);
})();
