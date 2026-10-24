/* ---------------- sim2d: one animation loop per canvas ----------------
   o.h(w) height, o.step(dt,t) physics, o.draw(ctx,w,h,t) drawing. Runs only while the canvas is on screen and its module is open;
   with reduced motion it draws once and again whenever the module calls .render() after a control changes. */
function sim2d(cv,o){let seen=true,last=0,t=0,raf=0,inF=false;
  const live=()=>seen&&!document.hidden&&cv.offsetParent!==null;
  function render(){const w=cv.clientWidth;if(!w)return;const h=o.h?o.h(w):clamp(w*.5,240,380);const c=prep(cv,h);if(!c)return;o.draw(c.ctx,w,h,t);}
  function frame(ts){raf=0;if(!live()){last=0;return;}inF=true;const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;t+=dt;try{if(o.step&&!(o.paused&&o.paused()))o.step(dt,t);render();}finally{inF=false;}raf=requestAnimationFrame(frame);}
  function kick(){if(REDUCE){render();return;}if(!raf&&!inF&&live())raf=requestAnimationFrame(frame);}
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{seen=es[es.length-1].isIntersecting;if(seen)kick();}).observe(cv);
  document.addEventListener('visibilitychange',kick);window.addEventListener('hashchange',()=>setTimeout(kick,50));
  if(o.drag){cv.classList.add('drag');cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);o.drag('down',e,cv);kick();});cv.addEventListener('pointermove',e=>{o.drag('move',e,cv);if(REDUCE)render();});
    const up=e=>o.drag('up',e,cv);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);}
  setTimeout(kick,30);
  return {render:()=>{render();kick();},get t(){return t;}};}
/* pointer position inside a canvas, in css pixels */
const ptr=(e,cv)=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top];};
/* quadratic roots of a x² + b x + c = 0 (real roots, ascending) */
function quad(a,b,c){const d=b*b-4*a*c;if(d<0)return [];const s=Math.sqrt(d),q=-.5*(b+Math.sign(b||1)*s);const r=[q/a,c/q].filter(isFinite).sort((x,y)=>x-y);return r;}
/* bisection solve of f(x)=0 on [a,b] (f changes sign) */
function solve(f,a,b,n=200){let fa=f(a);for(let i=0;i<n;i++){const m=(a+b)/2,fm=f(m);if((fm<0)===(fa<0)){a=m;fa=fm;}else b=m;}return (a+b)/2;}

/* ---------------- Calculus helpers ---------------- */
/* pixel -> data coordinates for a panel() result */
const inv=(P,px,py)=>[P.xr[0]+(px-P.box.x)/P.box.w*(P.xr[1]-P.xr[0]),P.yr[0]+(P.box.y+P.box.h-py)/P.box.h*(P.yr[1]-P.yr[0])];
/* like curve(), but lifts the pen across jumps and asymptotes so they are not drawn as vertical lines */
function curveD(ctx,P,f,a,b,color,w=2.25,n=500,dash){ctx.save();clip(ctx,P);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();
  const H=P.box.h*1.5;let pen=false,py0=0;
  for(let i=0;i<=n;i++){const t=a+(b-a)*i/n,v=f(t);if(!isFinite(v)||v==null){pen=false;continue;}const px=P.X(t),py=P.Y(v);
    if(pen&&Math.abs(py-py0)>H)pen=false;pen?ctx.lineTo(px,py):ctx.moveTo(px,py);pen=true;py0=py;}
  ctx.stroke();ctx.restore();}
/* open or closed circle on a graph (limits and continuity): filled = the point is on the graph */
function hole(ctx,x,y,r,color,filled){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=filled?color:T.surface;ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();}
/* dashed vertical / horizontal guide */
function vline(ctx,P,x,color,dash=[4,4]){line(ctx,P,x,P.yr[0],x,P.yr[1],color,1.25,dash);}
function hline(ctx,P,y,color,dash=[4,4]){line(ctx,P,P.xr[0],y,P.xr[1],y,color,1.25,dash);}
/* panel() that also remembers its ranges, so inv() works */
const gpanel=(ctx,box,xr,yr,o)=>{const P=panel(ctx,box,xr,yr,o);P.xr=xr;P.yr=yr;return P;};

/* ----- numerics ----- */
/* derivative: Richardson-extrapolated central difference */
function D(f,x,h=1e-3){const d=h2=>(f(x+h2)-f(x-h2))/(2*h2);return (4*d(h/2)-d(h))/3;}
function D2(f,x,h=2e-3){return (f(x+h)-2*f(x)+f(x-h))/(h*h);}
/* Simpson's rule (n even) */
function integ(f,a,b,n=400){if(a===b)return 0;if(n%2)n++;const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3;}
/* one-sided limit estimate: side = -1 (left), +1 (right) */
function limit(f,a,side){const hs=[1e-3,1e-4,1e-5];const v=hs.map(h=>f(a+side*h));return Math.abs(v[2]-v[1])<=Math.abs(v[1]-v[0])+1e-12?v[2]:v[1];}
/* Riemann sums: kind L, R, M, T on [a,b] with n pieces */
function riemann(f,a,b,n,kind){const h=(b-a)/n;let s=0;for(let i=0;i<n;i++){const x0=a+i*h,x1=x0+h;s+=kind==='L'?f(x0):kind==='R'?f(x1):kind==='M'?f(x0+h/2):(f(x0)+f(x1))/2;}return s*h;}
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);

/* ----- expressions: a small safe parser. "3x^2 + sin(2x)" -> function of x (and optionally t, y, n) -----
   Supports + - * / ^, implicit multiplication (2x, 3(x+1), x(x+1), 2 sin x), sin cos tan sec csc cot
   asin acos atan (arcsin...), sinh cosh tanh, ln, exp, sqrt, abs, pi, e, and the symbols × · − √ π. No eval. */
const FN1={sin:Math.sin,cos:Math.cos,tan:Math.tan,sec:x=>1/Math.cos(x),csc:x=>1/Math.sin(x),cot:x=>1/Math.tan(x),asin:Math.asin,acos:Math.acos,atan:Math.atan,
  arcsin:Math.asin,arccos:Math.acos,arctan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,ln:Math.log,exp:Math.exp,sqrt:Math.sqrt,abs:Math.abs};
function parseExpr(src){
  const s=String(src).replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\s+/g,' ').trim();
  const tk=[];const re=/\s*(\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+|[A-Za-z]+|[-+*\/^(),|])/y;let m,i=0;
  while(i<s.length){re.lastIndex=i;m=re.exec(s);if(!m){if(/^\s*$/.test(s.slice(i)))break;throw new Error('bad character');}tk.push(m[1]);i=re.lastIndex;}
  /* split letter runs like "xy" or "2xsinx": names that are functions/constants stay whole, other runs split into single variables */
  const T2=[];tk.forEach(t=>{if(/^[A-Za-z]+$/.test(t)&&!FN1[t]&&t!=='pi'&&t!=='e'){let r=t;while(r){const f=Object.keys(FN1).sort((a,b)=>b.length-a.length).find(k=>r.startsWith(k));if(f&&r.length>1&&r!==f){T2.push(f);r=r.slice(f.length);}else if(r.startsWith('pi')){T2.push('pi');r=r.slice(2);}else{T2.push(r[0]);r=r.slice(1);}}}else T2.push(t);});
  let p=0;const peek=()=>T2[p],next=()=>T2[p++];
  const isNum=t=>t!=null&&/^[\d.]/.test(t),isName=t=>t!=null&&/^[A-Za-z]/.test(t);
  /* grammar: sum -> term (+|- term)* ; term -> unary ((*|/|implicit) unary)* ; unary -> -unary | power ; power -> atom (^ unary)? */
  function sum(){let a=term();while(peek()==='+'||peek()==='-'){const o=next(),b=term();a=[o,a,b];}return a;}
  function term(){let a=unary();for(;;){const t=peek();if(t==='*'||t==='/'){next();a=[t,a,unary()];}else if(t==='('||isNum(t)||(isName(t)&&!(a&&a[0]==='num'&&false))){a=['*',a,power()];}else break;}return a;}
  function unary(){if(peek()==='-'){next();return ['neg',unary()];}if(peek()==='+'){next();return unary();}return power();}
  function power(){const a=atom();if(peek()==='^'){next();return ['^',a,unary()];}return a;}
  function atom(){const t=next();if(t==null)throw new Error('unexpected end');
    if(isNum(t))return ['num',parseFloat(t)];
    if(t==='('){const a=sum();if(next()!==')')throw new Error('missing )');return a;}
    if(t==='|'){const a=sum();if(next()!=='|')throw new Error('missing |');return ['f',Math.abs,a];}
    if(isName(t)){if(FN1[t]){let arg;if(peek()==='('){next();arg=sum();if(next()!==')')throw new Error('missing )');}else arg=power();
        /* sin^2 x style: sin^2(x) is not supported; write sin(x)^2 */return ['f',FN1[t],arg];}
      if(t==='pi')return ['num',Math.PI];if(t==='e')return ['num',Math.E];return ['var',t];}
    throw new Error('unexpected '+t);}
  const ast=sum();if(p<T2.length)throw new Error('unexpected '+T2[p]);
  const ev=(n,v)=>{switch(n[0]){case 'num':return n[1];case 'var':{const x=v[n[1]];if(x===undefined)throw new Error('unknown '+n[1]);return x;}case 'neg':return -ev(n[1],v);
    case '+':return ev(n[1],v)+ev(n[2],v);case '-':return ev(n[1],v)-ev(n[2],v);case '*':return ev(n[1],v)*ev(n[2],v);case '/':return ev(n[1],v)/ev(n[2],v);
    case '^':return Math.pow(ev(n[1],v),ev(n[2],v));case 'f':return n[1](ev(n[2],v));}};
  const f=(x,y)=>ev(ast,typeof x==='object'?x:{x,t:x,n:x,y});f.ast=ast;f.src=String(src);return f;}
/* a constant expression (no variables): "3/4", "2pi", "ln(2)", "e^2", "sqrt(3)/2" -> number or NaN */
function exprConst(raw){try{const v=parseExpr(raw)({});return typeof v==='number'?v:NaN;}catch(e){return NaN;}}
/* is typed expression b the same function as a? compares at sample points; c:true ignores an added constant (antiderivatives) */
function sameFn(a,b,o={}){let fa,fb;try{fa=parseExpr(a);fb=parseExpr(b);}catch(e){return false;}
  const xs=o.xs||[.37,.83,1.21,1.74,2.3,2.77,.51,1.09,-0.4,-1.3];let off=null,good=0;
  for(const x of xs){let va,vb;try{va=fa(x);vb=fb(x);}catch(e){return false;}if(!isFinite(va)||!isFinite(vb)){if(isFinite(va)!==isFinite(vb))return false;continue;}
    good++;if(o.c){const d=vb-va;if(off===null)off=d;else if(Math.abs(d-off)>1e-6*(1+Math.abs(va)))return false;}else if(Math.abs(va-vb)>1e-6*(1+Math.abs(va)))return false;}
  return good>=3;}
/* "x^2" -> "x²", "sqrt(" -> "√(", "pi" -> "π", "*" dropped between a number and a letter: for showing expressions in text */
function pretty(s){const S='⁰¹²³⁴⁵⁶⁷⁸⁹',sp=d=>d.split('').map(c=>c==='-'?'⁻':S[+c]).join('');
  return String(s).replace(/\^\((-?\d+)\)/g,(m,d)=>sp(d)).replace(/\^(-?\d+)/g,(m,d)=>sp(d)).replace(/sqrt\(/g,'√(').replace(/\bpi\b/g,'π').replace(/(\d)\s*\*\s*(?=[a-zA-Zπ(])/g,'$1').replace(/\*/g,'·').replace(/-/g,'−');}
/* polynomial text from coefficients, highest power first: polyTxt([3,0,-2,5]) -> "3x³ − 2x + 5" */
function polyTxt(c,v='x'){const n=c.length-1,S='⁰¹²³⁴⁵⁶⁷⁸⁹';let out='';c.forEach((a,i)=>{const p=n-i;if(!a)return;const m=Math.abs(a);
  const t=p===0?String(m):(m===1?'':m)+v+(p===1?'':p<10?S[p]:'^'+p);out+=out?(a<0?' − ':' + ')+t:(a<0?'−':'')+t;});return out||'0';}
/* a number as an exact-looking fraction when it is one: 0.75 -> "3/4" */
function frac(x,maxd=64){if(Number.isInteger(x))return String(x).replace('-','−');for(let d=2;d<=maxd;d++){const n=Math.round(x*d);if(Math.abs(n/d-x)<1e-9){const g=gcd(n,d);return (n<0?'−':'')+Math.abs(n/g)+'/'+(d/g);}}return fmt(x,3);}

/* ----- which units to show: 'AB' = AP exam units only (Units 1–3), 'BC' = all units. Unit 4 parts carry class "bc" (not on the exam); extras inside shared modules are .bcx boxes ----- */
const COURSE=()=>{const c=store('prec-course');return c==='AB'?'AB':'BC';};
function setCourse(c){store('prec-course',c);applyCourse();document.dispatchEvent(new CustomEvent('coursechange'));}
function applyCourse(){const ab=COURSE()==='AB';document.body.classList.toggle('is-ab',ab);$$('#course-seg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===COURSE()));}
/* is this problem (or its module) BC-only? */
const isBC=p=>!!(p&&(p.bc||(MODS[p.topic]&&MODS[p.topic].bc)));

/* ----- svgG: a small static graph as an SVG string, for problems that show a picture -----
   o: {xr,yr, pieces:[{f,x0,x1,color?,dash?}], pts:[{x,y,open?,color?}], vlines:[x], hlines:[y], labels:[{x,y,t}], w,h} (axes drawn with integer ticks) */
function svgG(o){const W=o.w||400,H=o.h||280,xr=o.xr||[-5,5],yr=o.yr||[-4,4],m={l:24,r:10,t:10,b:20};
  const X=x=>m.l+(x-xr[0])/(xr[1]-xr[0])*(W-m.l-m.r),Y=y=>m.t+(yr[1]-y)/(yr[1]-yr[0])*(H-m.t-m.b);let s=`<svg class="svgg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.alt||'A graph. Read the values from the picture.'}" style="width:100%;max-width:${W}px;height:auto;display:block;font:10px 'IBM Plex Mono',monospace">`;
  for(let x=Math.ceil(xr[0]);x<=xr[1];x++){s+=`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H-m.b}" stroke="var(--grid)"/>`;if(x&&x%1===0&&(xr[1]-xr[0]<=12||x%2===0))s+=`<text x="${X(x)}" y="${H-6}" text-anchor="middle" fill="var(--muted)">${String(x).replace('-','−')}</text>`;}
  for(let y=Math.ceil(yr[0]);y<=yr[1];y++){s+=`<line x1="${m.l}" y1="${Y(y)}" x2="${W-m.r}" y2="${Y(y)}" stroke="var(--grid)"/>`;if(y&&(yr[1]-yr[0]<=12||y%2===0))s+=`<text x="${m.l-4}" y="${Y(y)+3}" text-anchor="end" fill="var(--muted)">${String(y).replace('-','−')}</text>`;}
  if(xr[0]<=0&&xr[1]>=0)s+=`<line x1="${X(0)}" y1="${m.t}" x2="${X(0)}" y2="${H-m.b}" stroke="var(--muted)" stroke-width="1.2"/>`;
  if(yr[0]<=0&&yr[1]>=0)s+=`<line x1="${m.l}" y1="${Y(0)}" x2="${W-m.r}" y2="${Y(0)}" stroke="var(--muted)" stroke-width="1.2"/>`;
  (o.vlines||[]).forEach(x=>s+=`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H-m.b}" stroke="var(--hot)" stroke-dasharray="5 4"/>`);
  (o.hlines||[]).forEach(y=>s+=`<line x1="${m.l}" y1="${Y(y)}" x2="${W-m.r}" y2="${Y(y)}" stroke="var(--hot)" stroke-dasharray="5 4"/>`);
  (o.pieces||[]).forEach(p=>{let d='',pen=false,prev=0;const n=160;for(let i=0;i<=n;i++){const x=p.x0+(p.x1-p.x0)*i/n,y=p.f(x);if(!isFinite(y)){pen=false;continue;}const py=Y(y);if(pen&&Math.abs(py-prev)>H){pen=false;}d+=(pen?'L':'M')+X(x).toFixed(1)+' '+py.toFixed(1);pen=true;prev=py;}
    s+=`<path d="${d}" fill="none" stroke="${p.color||'var(--cx)'}" stroke-width="2.4" stroke-linecap="round"${p.dash?' stroke-dasharray="6 4"':''}/>`;});
  (o.pts||[]).forEach(q=>s+=`<circle cx="${X(q.x)}" cy="${Y(q.y)}" r="4.2" fill="${q.open?'var(--surface)':(q.color||'var(--cx)')}" stroke="${q.color||'var(--cx)'}" stroke-width="2"/>`);
  (o.labels||[]).forEach(l=>s+=`<text x="${X(l.x)}" y="${Y(l.y)}" fill="${l.color||'var(--ink)'}" font-size="11" font-weight="600">${l.t}</text>`);
  return s+'</svg>';}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/* four multiple-choice strings: the correct one plus distractors (deduplicated, shuffled); returns {choices, ans} */
function mcq(correct,distract,n=4){const s=[correct];shuffle(distract).forEach(d=>{if(d!=null&&!s.includes(d)&&s.length<n)s.push(d);});const ch=shuffle(s);return {choices:ch,ans:ch.indexOf(correct)};}

/* ----- glab: a graph lab in a few lines -----
   o.view(w,h) -> {xr,yr,xn?,yn?};  o.draw(ctx,P,w,h,t) draws on the panel P (P.X, P.Y, inv(P,px,py));
   o.drag(kind,x,y) gets pointer positions in data coordinates (kind: down|move|up). Returns the sim2d handle. */
function glab(id,o){const cv=$('#'+id);if(!cv)return null;let last=null;const mx=o.mx||46;
  const sim=sim2d(cv,{h:o.h||(w=>clamp(w*.52,250,370)),draw(ctx,w,h,t){const v=o.view(w,h);const P=gpanel(ctx,{x:mx,y:12,w:w-mx-14,h:h-36},v.xr,v.yr,{xn:v.xn||6,yn:v.yn||4,ylabel:v.ylabel,xlabel:v.xlabel,xt:v.xt});last=P;o.draw(ctx,P,w,h,t);},
    step:o.step,paused:o.paused,
    drag:o.drag&&((k,e)=>{if(k==='up'){o.drag('up');return;}if(!last)return;const [px,py]=ptr(e,cv),[x,y]=inv(last,px,py);o.drag(k,x,y,e);})});
  return sim;}
/* signed number text for building expressions: sgn(3) -> " + 3", sgn(-3) -> " − 3" */
const sgn=v=>(v<0?' − ':' + ')+Math.abs(+(+v).toFixed(4));
/* number text with a true minus sign */
const nz=v=>String(+(+v).toFixed(4)).replace('-','−');
/* a draggable handle on a panel: returns true when the pointer is within r px of (x,y) */
const near=(P,px,py,x,y,r=14)=>Math.hypot(P.X(x)-px,P.Y(y)-py)<r;
/* text of the factor (x − r): lin(3) -> "x − 3", lin(-2) -> "x + 2", lin(0) -> "x" */
const lin=(r,v='x')=>r===0?v:(r<0?v+' + '+(-r):v+' − '+r);
/* expression text (parser syntax) from terms [[c,p],...]: c·x^p. terms([[4,3],[-6,.5],[5,-2],[7,0]]) -> "4x^3-6sqrt(x)+5x^(-2)+7". Integer coefficients. */
function terms(ts){let s='';ts.forEach(([c,p])=>{if(!c)return;const m=Math.abs(c);const body=p===0?String(m):(m===1?'':String(m))+(p===1?'x':p===.5?'sqrt(x)':Number.isInteger(p)&&p>0?'x^'+p:'x^('+(Number.isInteger(p)?p:frac(p).replace('−','-'))+')');
  s+=(s?(c<0?'-':'+'):(c<0?'-':''))+body;});return s||'0';}
/* evaluate terms at x */
const tval=(ts,x)=>ts.reduce((a,[c,p])=>a+c*Math.pow(x,p),0);
/* derivative of terms */
const tder=ts=>ts.filter(([c,p])=>p!==0).map(([c,p])=>[c*p,p-1]);
/* x in [a,b] that maximizes f (grid search, then refinement) */
function argmax(f,a,b,n=4000){let bx=a,bv=-Infinity;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,v=f(x);if(isFinite(v)&&v>bv){bv=v;bx=x;}}const h=(b-a)/n;let lo=Math.max(a,bx-h),hi=Math.min(b,bx+h);for(let i=0;i<60;i++){const m1=lo+(hi-lo)/3,m2=hi-(hi-lo)/3;if(f(m1)<f(m2))lo=m1;else hi=m2;}return (lo+hi)/2;}
const argmin=(f,a,b,n=4000)=>argmax(x=>-f(x),a,b,n);
/* zeros of g in (a,b): sign changes found on a grid and refined by bisection; jumps (no real root) are discarded */
function roots(g,a,b,n=2000){const out=[];let x0=a,v0=g(x0);for(let i=1;i<=n;i++){const x1=a+(b-a)*i/n,v1=g(x1);if(isFinite(v0)&&isFinite(v1)&&(v0===0||v0*v1<0)){const r=solve(g,x0,x1,60);if(Math.abs(g(r))<1e-4*(1+Math.abs(v0)+Math.abs(v1))*10&&(!out.length||Math.abs(r-out[out.length-1])>(b-a)/n*2))out.push(r);}x0=x1;v0=v1;}return out;}
/* shade the panel background by the sign of s(x): posCol where s > 0, negCol where s < 0 (runs are merged so there are no seams) */
function signBands(ctx,P,xr,s,posCol,negCol,n=400){let run=null;const flush=x=>{if(run){const a=P.X(run.x0),b=P.X(x);ctx.fillStyle=run.c;ctx.fillRect(a,P.box.y,b-a,P.box.h);run=null;}};
  for(let i=0;i<n;i++){const x0=xr[0]+(xr[1]-xr[0])*i/n,v=s(x0+(xr[1]-xr[0])/n/2),c=!isFinite(v)?null:v>0?posCol:negCol;if(!run||run.c!==c){flush(x0);if(c)run={x0,c};}}flush(xr[1]);}
/* area between f and the x-axis from a to b: gold above the axis, pink below (signed area) */
function areaSigned(ctx,P,f,a,b,posCol,negCol,n=300,al=.35){if(b<=a)return;const y0=P.Y(0);const poly=()=>{ctx.beginPath();ctx.moveTo(P.X(a),y0);for(let i=0;i<=n;i++){const t=a+(b-a)*i/n;ctx.lineTo(P.X(t),P.Y(f(t)));}ctx.lineTo(P.X(b),y0);ctx.closePath();};
  ctx.save();clip(ctx,P);[[posCol,P.box.y,y0],[negCol,y0,P.box.y+P.box.h]].forEach(([c,t,bt])=>{ctx.save();ctx.beginPath();ctx.rect(P.box.x,t,P.box.w,bt-t);ctx.clip();poly();ctx.fillStyle=alpha(c,al);ctx.fill();ctx.restore();});ctx.restore();}
/* integrate terms [[c,p],...] (p ≠ −1) */
const tint=ts=>ts.map(([c,p])=>[c/(p+1),p+1]);

/* ---------------- Precalculus: trig values and polar pictures (shared by the Unit 3 modules) ---------------- */
/* exact-value text for the special angles, used by every trig module */
const TAU=2*Math.PI;
const SPECIAL=[[0,'0'],[Math.PI/6,'π/6'],[Math.PI/4,'π/4'],[Math.PI/3,'π/3'],[Math.PI/2,'π/2'],[2*Math.PI/3,'2π/3'],[3*Math.PI/4,'3π/4'],[5*Math.PI/6,'5π/6'],[Math.PI,'π'],
  [7*Math.PI/6,'7π/6'],[5*Math.PI/4,'5π/4'],[4*Math.PI/3,'4π/3'],[3*Math.PI/2,'3π/2'],[5*Math.PI/3,'5π/3'],[7*Math.PI/4,'7π/4'],[11*Math.PI/6,'11π/6']];
function exactTrig(v){if(!isFinite(v))return 'undefined';const r=Math.abs(v);const m=[[0,'0'],[.5,'1/2'],[1,'1'],[Math.SQRT2/2,'√2/2'],[Math.sqrt(3)/2,'√3/2'],[Math.sqrt(3),'√3'],[Math.sqrt(3)/3,'√3/3']].find(([t])=>Math.abs(r-t)<1e-9);
  return m?(v<0&&m[0]?'−':'')+m[1]:fmt(v,3);}
/* θ (radians) as a multiple of π when it is a multiple of π/12, else a decimal */
function piText(t){if(Math.abs(t)<1e-9)return '0';for(const d of [1,2,3,4,6,8,12,16,18,24,36,48]){const k=Math.round(t/Math.PI*d);if(k&&Math.abs(t-k*Math.PI/d)<1e-7){const g=gcd(Math.abs(k),d),n=k/g,dd=d/g;
  return (n<0?'−':'')+(Math.abs(n)===1?'':Math.abs(n))+'π'+(dd===1?'':'/'+dd);}}return fmt(t,3);}
const wrap2pi=t=>((t%TAU)+TAU)%TAU;
const isSpecial=t=>SPECIAL.some(([a])=>Math.abs(wrap2pi(t)-a)<1e-6||Math.abs(wrap2pi(t)-TAU)<1e-6);

/* a polar grid on a panel P (equal scales): rings every `step`, rays every π/6, angle labels outside */
function polarGrid(ctx,P,rmax,step){const o=[P.X(0),P.Y(0)],u=P.X(1)-P.X(0);step=step||niceStep(rmax,4);ctx.save();ctx.strokeStyle=T.grid;ctx.lineWidth=1;
  for(let k=step;k<=rmax*1.05+1e-9;k+=step){ctx.beginPath();ctx.arc(o[0],o[1],k*u,0,TAU);ctx.stroke();}
  for(let k=0;k<12;k++){const a=k*Math.PI/6;ctx.beginPath();ctx.moveTo(o[0],o[1]);ctx.lineTo(o[0]+rmax*1.08*u*Math.cos(a),o[1]-rmax*1.08*u*Math.sin(a));ctx.stroke();}
  ctx.strokeStyle=alpha(T.muted,.6);ctx.beginPath();ctx.moveTo(P.box.x,o[1]+.5);ctx.lineTo(P.box.x+P.box.w,o[1]+.5);ctx.moveTo(o[0]+.5,P.box.y);ctx.lineTo(o[0]+.5,P.box.y+P.box.h);ctx.stroke();ctx.restore();
  label(ctx,fmt(Math.floor(rmax*1.05/step)*step,2),o[0]+Math.floor(rmax*1.05/step)*step*u+3,o[1]+10,T.muted,'left','middle','10px "IBM Plex Mono",monospace');}
/* two linked pictures of r = f(θ): the (θ, r) graph and the polar curve. Wide screens side by side, phones stacked. */
function polarPanels(ctx,w,h,rmax,yr){const wide=w>=620;let L,Pb;
  if(wide){const pw=Math.min(h-30,w*.48);L={x:40,y:16,w:w-pw-90,h:h-46};Pb={x:w-pw-10,y:(h-pw)/2,w:pw,h:pw};}
  else{const ph=Math.min(w-30,h*.6);L={x:40,y:14,w:w-54,h:h-ph-60};Pb={x:(w-ph)/2,y:h-ph-8,w:ph,h:ph};}
  const G=gpanel(ctx,L,[0,TAU],yr||[-rmax*1.1,rmax*1.1],{xn:4,yn:4,xlabel:'θ',ylabel:'r',xt:false});
  ['π/2','π','3π/2','2π'].forEach((t,i)=>label(ctx,t,G.X((i+1)*Math.PI/2),L.y+L.h+16,T.muted,'center','middle',MONO));
  const s=rmax*1.15,Pp={box:Pb,X:x=>Pb.x+(x+s)/(2*s)*Pb.w,Y:y=>Pb.y+Pb.h-(y+s)/(2*s)*Pb.h,xr:[-s,s],yr:[-s,s]};
  polarGrid(ctx,Pp,rmax);return {G,Pp,wide};}
/* draw the polar curve (and optionally the (θ, r) graph) colored by the sign of r: blue r ≥ 0, magenta r < 0 */
function polarStroke(ctx,P,f,a,b,w=2.6,al=1,rect){const n=Math.max(60,Math.ceil((b-a)/TAU*900));ctx.save();clip(ctx,P);ctx.lineWidth=w;ctx.lineJoin='round';ctx.lineCap='round';
  let prev=null;for(let i=0;i<=n;i++){const t=a+(b-a)*i/n,r=f(t);const pt=rect?[P.X(t),P.Y(r)]:[P.X(r*Math.cos(t)),P.Y(r*Math.sin(t))];
    if(prev){ctx.strokeStyle=alpha(prev[2]<0||r<0&&prev[2]<=0?T.ca:T.cx,al);ctx.beginPath();ctx.moveTo(prev[0],prev[1]);ctx.lineTo(pt[0],pt[1]);ctx.stroke();}prev=[pt[0],pt[1],r];}ctx.restore();}

/* a unit circle beside a graph: wide screens side by side, phones stacked (circle on top). Returns circle center/radius and the graph box. */
function circLayout(w,h){const wide=w>=560;if(wide){const R=Math.min(h/2-34,w*.17);return {wide,cx:R+44,cy:h/2,R,gx:2*R+104,gy:16,gw:w-(2*R+104)-14,gh:h-48};}
  const R=Math.min(w/2-46,120);return {wide,cx:w/2,cy:R+30,R,gx:40,gy:2*R+70,gw:w-54,gh:h-(2*R+70)-30};}
/* the circle, its axes and the special-angle ticks */
function circBase(ctx,L,labels=true){const {cx,cy,R}=L;ctx.save();ctx.strokeStyle=T.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-R-18,cy+.5);ctx.lineTo(cx+R+18,cy+.5);ctx.moveTo(cx+.5,cy-R-18);ctx.lineTo(cx+.5,cy+R+18);ctx.stroke();
  ctx.fillStyle=alpha(T.surface,.6);ctx.strokeStyle=T.muted;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();ctx.stroke();ctx.restore();
  SPECIAL.forEach(([a,t])=>{dot(ctx,cx+R*Math.cos(a),cy-R*Math.sin(a),2,T.muted);if(labels)label(ctx,t,cx+(R+15)*Math.cos(a),cy-(R+13)*Math.sin(a),T.muted,'center','middle','10px "IBM Plex Mono",monospace');});}
/* an angle arc from 0 to θ at radius r (gold) */
function angArc(ctx,cx,cy,r,th,col){ctx.save();ctx.strokeStyle=col||T.ce;ctx.lineWidth=2.6;ctx.beginPath();const n=Math.max(8,Math.ceil(Math.abs(th)*20));for(let i=0;i<=n;i++){const a=th*i/n;i?ctx.lineTo(cx+r*Math.cos(a),cy-r*Math.sin(a)):ctx.moveTo(cx+r*Math.cos(a),cy-r*Math.sin(a));}ctx.stroke();ctx.restore();}
/* π labels under a θ-axis that runs over [a, b] */
function piTicks(ctx,P,a,b,step=Math.PI/2){for(let k=Math.ceil(a/step-1e-9);k*step<=b+1e-9;k++){if(!k)continue;label(ctx,piText(k*step),P.X(k*step),P.box.y+P.box.h+14,T.muted,'center','middle',MONO);}}
/* which way a moving point goes, from the signs of its horizontal and vertical change */
function dirText(dx,dy,eps=1e-6){const h=dx>eps?'right':dx<-eps?'left':'',v=dy>eps?'up':dy<-eps?'down':'';return h&&v?`${h} and ${v}`:h||v||'momentarily stopped';}
/* Catmull–Rom curve through values V at t = 0, 1, ..., V.length − 1 (ends held) */
function crSpline(V,t){const n=V.length-1,u=clamp(t,0,n),i=Math.min(n-1,Math.floor(u)),s=u-i,p0=V[Math.max(0,i-1)],p1=V[i],p2=V[i+1],p3=V[Math.min(n,i+2)];
  return .5*((2*p1)+(-p0+p2)*s+(2*p0-5*p1+4*p2-p3)*s*s+(-p0+3*p1-3*p2+p3)*s*s*s);}
