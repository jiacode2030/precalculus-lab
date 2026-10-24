/* ---------------- 2.13 Exponential and logarithmic equations and inequalities ---------------- */
(function expeq(){
  const cv=$('#xe-canvas');if(!cv)return;
  let rel='eq',a=3,b=2,c=24;
  const f3=v=>String(+v.toFixed(3)).replace('-','−'),f1=v=>fmt(v,1).replace(/\.0$/,'');
  const x0=()=>Math.log(c/a)/Math.log(b);
  const sim=glab('xe-canvas',{h:w=>clamp(w*.5,290,400),view:()=>{const M=clamp(c*2.2,10,220);return {xr:[-3,7],yr:[-M*.08,M],xn:10,yn:4};},draw(ctx,P){
    const flat=Math.abs(b-1)<1e-9,r=x0();curveD(ctx,P,x=>a*b**x,-3,7,T.cx,3.2,600);hline(ctx,P,c,alpha(T.ce,.95),[6,4]);
    if(!flat&&isFinite(r)){const up=(b>1)===(rel==='gt');
      if(rel!=='eq'){const xa=up?r:-3,xb=up?7:r;ctx.fillStyle=alpha(T.hot,.35);ctx.fillRect(P.X(Math.max(-3,xa)),P.Y(0)-6,Math.max(0,P.X(Math.min(7,xb))-P.X(Math.max(-3,xa))),12);}
      if(r>=-3&&r<=7){dot(ctx,P.X(r),P.Y(c),6.5,T.hot,T.surface);line(ctx,P,r,c,r,0,alpha(T.hot,.7),1.5,[4,3]);dot(ctx,P.X(r),P.Y(0),5,T.hot,T.surface);}
      else label(ctx,`solution x ≈ ${f3(r)} is off the graph`,P.box.x+P.box.w-8,P.box.y+28,T.hot,'right','middle',MONO);}
    label(ctx,`y = ${f1(a)}·${f1(b)}ˣ    gold: y = ${f1(c)}`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd(){const r=x0(),flat=Math.abs(b-1)<1e-9;
    if(flat){setText('xe-steps','b = 1 makes the function constant');setText('xe-sol','no unique solution');setText('xe-chk','—');sim.render();return;}
    setText('xe-steps',`${f1(a)}·${f1(b)}ˣ ${rel==='eq'?'=':rel==='gt'?'>':'<'} ${f1(c)}  →  ${f1(b)}ˣ ${rel==='eq'?'=':rel==='gt'?'>':'<'} ${f3(c/a)}  →  x ${rel==='eq'?'=':(b>1)===(rel==='gt')?'>':'<'} ln(${f3(c/a)}) / ln ${f1(b)}${b<1&&rel!=='eq'?'  (ln b < 0 flips it)':''}`);
    setText('xe-sol',rel==='eq'?`x = ${f3(r)}`:`x ${(b>1)===(rel==='gt')?'>':'<'} ${f3(r)}`);
    if(rel==='eq')setText('xe-chk',`${f1(a)}·${f1(b)}^${f3(r)} = ${f3(a*b**r)}`);else{const t=(b>1)===(rel==='gt')?r+1:r-1;setText('xe-chk',`test x = ${f3(t)}: ${f3(a*b**t)} ${rel==='gt'?'>':'<'} ${f1(c)} ✓`);}
    sim.render();}
  bindRange('xe-a',f1,v=>{a=v;upd();});bindRange('xe-b',f1,v=>{b=v;upd();});bindRange('xe-c',f1,v=>{c=v;upd();});segBind('xe-rel','k',k=>{rel=k;upd();});

  let d=2,k=3;
  const roots=()=>{const q=Math.sqrt(d*d+4*2**k);return [(d+q)/2,(d-q)/2];};
  const sim2=glab('xe-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[-6,14],yr:[-3,8],xn:10,yn:5}),draw(ctx,P){const F=x=>Math.log2(x)+Math.log2(x-d),[r1,r2]=roots();
    vline(ctx,P,d,T.ce,[6,4]);hline(ctx,P,k,alpha(T.muted,.9),[5,4]);curveD(ctx,P,F,d+1e-3,14,T.cx,3.2,900);
    if(r1<14)dot(ctx,P.X(r1),P.Y(k),6.5,T.hot,T.surface);
    if(r2>-6){ctx.beginPath();ctx.arc(P.X(r2),P.Y(k),6,0,TAU);ctx.fillStyle=T.surface;ctx.fill();ctx.strokeStyle=T.ca;ctx.lineWidth=2.4;ctx.stroke();label(ctx,'extraneous',P.X(r2),P.Y(k)-16,T.ca,'center','middle',MONO);}
    label(ctx,`y = log₂ x + log₂(x − ${d})   (domain x > ${d})   line y = ${k}`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd2(){const [r1,r2]=roots(),f=v=>String(+v.toFixed(3)).replace('-','−');
    setText('xe-quad',`x(x − ${d}) = 2^${k} = ${2**k}   →   x² − ${d}x − ${2**k} = 0`);setText('xe-roots',`x = ${f(r1)}  and  x = ${f(r2)}`);
    setText('xe-valid',`x = ${f(r1)} works; x = ${f(r2)} is extraneous (it makes the log input ≤ 0)`);sim2.render();}
  bindRange('xe-d',String,v=>{d=v;upd2();});bindRange('xe-k',String,v=>{k=v;upd2();});
  drawers.expeq=()=>{sim.render();sim2.render();};
  KEYS['xe-canvas']=['Blue: a·bˣ. Gold: y = c. The orange point is where they meet; the orange bar on the x-axis is the solution set of an inequality.',[['cx','a·bˣ'],['ce','y = c'],['hot','solution']]];
  KEYS['xe-canvas2']=['Blue: the logs combined. Dotted line: y = k. The orange point is the valid solution. The open magenta circle is the root of the quadratic that falls outside the domain.',[['cx','log₂ x + log₂(x − d)'],['ce','domain edge'],['hot','valid solution'],['ca','extraneous']]];
  TIPS['xe-rel:gt']='For b > 1 the solution is to the right of the crossing; for b < 1 it flips.';TIPS['xe-b']=el=>+el.value<1?'b < 1: the exponential decays, so ln b is negative.':'b > 1: the exponential grows.';
  GLOSS['extraneous solution']='A solution that appears when solving an equation but fails in the original, for example because it makes a log input negative.';
  TT.expeq='Make students write the domain of every log before solving, and check each answer in the original equation.';
  GLYPH.expeq='<path d="M2 20 C10 20, 15 16, 21 4" stroke="var(--cx)" stroke-width="2.4" fill="none"/><path d="M2 12 H22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="14" cy="12" r="2.4" fill="var(--hot)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),SUB=b=>String(b).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join('');
  const bis=(f,lo,hi,t)=>{const inc=f(hi)>f(lo);for(let i=0;i<300;i++){const m=(lo+hi)/2;if((f(m)<t)===inc)lo=m;else hi=m;}return (lo+hi)/2;};
  PROBS.push({id:'xe-exp',topic:'expeq',title:'Solve a·bˣ = c',gen(){const a=pick([2,3,5,10,50,100]),b=pick([1.5,2,3,5,.5,.8,1.05,1.1]),c=a*pick([2,3,5,7,10,.5,.2]),ans=Math.log(c/a)/Math.log(b);
    return {q:`Solve ${a}(${b})ˣ = ${c}. Round to 3 decimal places.`.replace('= 0','= 0'),ans,unit:'',abs:.0006,chk:bis(x=>a*Math.pow(b,x),-200,200,c),show:ans.toFixed(3),hint:'Divide by a, then take ln of both sides and divide by ln b.',sol:`${b}ˣ = ${sg(c/a)}, so x = ln ${sg(c/a)} / ln ${b} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'xe-same',topic:'expeq',title:'Equal bases',gen(){const b=pick([2,3,5]),k=ri(2,5),m=pick([2,3,4]),s=ri(-4,4),n=ri(-3,5),rhs=Math.pow(b,k),x=(k-s)/m;
    const ex=`${m}x${s?` ${s<0?'−':'+'} ${Math.abs(s)}`:''}`;
    return {q:`Solve ${b}^(${ex}) = ${rhs}.`,ans:x,unit:'',abs:.001,chk:bis(t=>Math.pow(b,m*t+s),-50,50,rhs),show:frac(x),hint:`Write ${rhs} as a power of ${b} and equate the exponents.`,sol:`${rhs} = ${b}^${k}, so ${ex} = ${k} and x = <b>${frac(x)}</b>.`};}});
  PROBS.push({id:'xe-log',topic:'expeq',title:'Solve log_b(x + h) = c',gen(){const b=pick([2,3,4,5,10]),c=pick([1,2,3]),h=ri(-6,6),ans=Math.pow(b,c)-h;
    return {q:`Solve log${SUB(b)}(x ${h<0?'−':'+'} ${Math.abs(h)||0}) = ${c}.`.replace('(x + 0)','(x)').replace('(x − 0)','(x)'),ans,unit:'',abs:.001,chk:bis(x=>Math.log(x+h)/Math.log(b),-h+1e-9,-h+1e5,c),hint:'Rewrite as an exponential: the inside equals b to the power c.',sol:`x ${h<0?'−':'+'} ${Math.abs(h)} = ${b}^${c} = ${Math.pow(b,c)}, so x = <b>${sg(ans)}</b>.`};}});
  const EXT=[[2,3,2,4],[2,3,7,8],[2,4,6,8],[2,4,15,16],[3,2,8,9],[3,3,6,9],[3,3,26,27],[10,2,15,20],[10,2,21,25],[10,2,48,50]];
  PROBS.push({id:'xe-ext',topic:'expeq',title:'Solve and reject the extra root',gen(){const [b,k,d,r]=pick(EXT);
    const F=x=>Math.log(x)/Math.log(b)+Math.log(x-d)/Math.log(b);let lo=d+1e-9,hi=1e4;for(let i=0;i<300;i++){const m=(lo+hi)/2;if(F(m)<k)lo=m;else hi=m;}
    return {q:`Solve log${SUB(b)} x + log${SUB(b)}(x − ${d}) = ${k}. Give the valid solution.`,ans:r,unit:'',abs:.001,chk:(lo+hi)/2,hint:'Combine into one log, rewrite as an exponential, solve the quadratic, then reject the root outside the domain x > d.',sol:`x(x − ${d}) = ${b}^${k} = ${Math.pow(b,k)}, so x² − ${d}x − ${Math.pow(b,k)} = 0 and x = ${r} or x = ${d-r}. Since x must exceed ${d}, only <b>x = ${r}</b> works.`};}});
  PROBS.push({id:'xe-ineq',topic:'expeq',title:'Which way does it go?',gen(){const a=pick([2,5,10,20]),b=pick([2,3,.5,.8,1.5,.25]),gt=Math.random()<.5,c=a*pick([4,8,10,3,.25]),r=Math.log(c/a)/Math.log(b),dir=(b>1)===gt?'>':'<';
    const right=`x ${dir} ${sg(+r.toFixed(2))}`,wrong=[`x ${dir==='>'?'<':'>'} ${sg(+r.toFixed(2))}`,`x ${dir} ${sg(-(+r.toFixed(2)))}`,`x ${dir==='>'?'<':'>'} ${sg(-(+r.toFixed(2)))}`].filter(s=>s!==right),{choices,ans}=mcq(right,wrong,4);
    const t=dir==='>'?r+1:r-1;const ok=gt?a*Math.pow(b,t)>c:a*Math.pow(b,t)<c;if(!ok)throw new Error('direction');
    return {q:`Solve ${a}(${b})ˣ ${gt?'>':'<'} ${c}. The boundary is rounded to 2 decimal places.`,choices,ans,hint:'Solve the equation first, then decide the direction: for b < 1 the exponential falls, which reverses it.',sol:`The boundary is x = ln(${sg(c/a)})/ln ${b} ≈ ${sg(+r.toFixed(2))}. Since b ${b>1?'>':'<'} 1, the solution is <b>${right}</b>.`};}});
})();
