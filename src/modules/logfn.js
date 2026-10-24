/* ---------------- 2.9, 2.10, 2.11 Logarithms and log functions ---------------- */
(function logfn(){
  const cv=$('#lg-canvas');if(!cv)return;
  const BASE={b2:2,b3:3,b10:10,be:Math.E},NM={b2:'log₂',b3:'log₃',b10:'log₁₀',be:'ln'},BT={b2:'2',b3:'3',b10:'10',be:'e'};
  let bk='b2',x=8;
  const f4=v=>String(+v.toFixed(4)).replace('-','−');
  const sim=glab('lg-canvas',{h:w=>clamp(w*.5,290,400),view:()=>({xr:[-2.5,5.5],yr:[-2,32],xn:8,yn:4}),draw(ctx,P){const b=BASE[bk],t=Math.log(x)/Math.log(b);
    curveD(ctx,P,u=>b**u,-2.5,5.5,T.cx,3.4,700);
    line(ctx,P,-2.5,x,t,x,alpha(T.hot,.75),1.6,[5,4]);line(ctx,P,t,x,t,0,alpha(T.hot,.75),1.6,[5,4]);
    dot(ctx,P.X(t),P.Y(x),5.5,T.cx,T.surface);dot(ctx,P.X(t),P.Y(0),7,T.hot,T.surface);dot(ctx,P.X(-2.5)+8,P.Y(x),5,T.hot,T.surface);
    label(ctx,`t = ${NM[bk]}(${f4(x)}) ≈ ${f4(t)}`,P.X(t)+(t>2.5?-10:10),P.Y(0)-16,T.hot,t>2.5?'right':'left','middle','700 13px "IBM Plex Mono",monospace');
    label(ctx,`y = ${BT[bk]}ᵗ`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);label(ctx,'x',P.box.x+14,P.Y(x)-12,T.hot,'left','middle',MONO);}});
  function upd(){const b=BASE[bk],t=Math.log(x)/Math.log(b),r=Math.round(t);
    setText('lg-eq',`${NM[bk]} ${f4(x)} = ${f4(t)}`);setText('lg-why',`${BT[bk]}^${f4(t)} = ${f4(x)}`);
    setText('lg-int',Math.abs(t-r)<1e-9?`exactly ${f4(r)}`:`between ${Math.floor(t)} and ${Math.ceil(t)}`.replace(/-/g,'−'));sim.render();}
  bindRange('lg-x',v=>fmt(v,1),v=>{x=v;upd();});segBind('lg-b','k',k=>{bk=k;upd();});

  const B2={b2:2,b10:10,bh:.5},N2={b2:'log₂',b10:'log₁₀',bh:'log_(1/2)'};
  let k2='b2',h=0,kk=0;
  const sim2=glab('lg-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[-4,9],yr:[-5,5],xn:13,yn:5}),draw(ctx,P){const b=B2[k2],g=u=>Math.log(u-h)/Math.log(b)+kk;
    vline(ctx,P,h,T.ce,[6,4]);curveD(ctx,P,g,h+1e-4,9,T.cx,3.4,1200);
    const xi=h+b**(-kk);dot(ctx,P.X(h+1),P.Y(kk),5,T.cv,T.surface);if(xi<9&&xi>-4)dot(ctx,P.X(xi),P.Y(0),6.5,T.hot,T.surface);
    label(ctx,`x = ${f4(h)}`,P.X(h)+6,P.box.y+12,T.ce,'left','middle',MONO);label(ctx,`green dot: (h + 1, k)`,P.box.x+P.box.w-6,P.box.y+12,T.muted,'right','middle',MONO);}});
  function upd2(){const b=B2[k2],xi=h+b**(-kk),sh=h===0?'x':`x ${h<0?'+':'−'} ${f4(Math.abs(h))}`;
    setText('lg-form',`${N2[k2]}(${sh})${kk===0?'':(kk<0?' − ':' + ')+f4(Math.abs(kk))}`);setText('lg-dom',`domain x > ${f4(h)};  asymptote x = ${f4(h)}`);
    setText('lg-int2',`x = ${f4(h)} + ${k2==='bh'?'(1/2)':B2[k2]}^(${f4(-kk)}) = ${f4(xi)}`);sim2.render();}
  bindRange('lg-h',v=>fmt(v,1),v=>{h=v;upd2();});bindRange('lg-k',v=>fmt(v,1),v=>{kk=v;upd2();});segBind('lg-b2','k',k=>{k2=k;upd2();});
  drawers.logfn=()=>{sim.render();sim2.render();};
  KEYS['lg-canvas']=['Blue: y = bᵗ. The orange dashed path starts at the value x on the y-axis, goes across to the curve, then down: the orange point on the t-axis is log_b(x).',[['cx','y = bᵗ'],['hot','reading the logarithm']]];
  KEYS['lg-canvas2']=['Blue: g(x) = log_b(x − h) + k. Gold dashed: the vertical asymptote x = h. Orange: the x-intercept. Green: the anchor point (h + 1, k).',[['cx','g(x)'],['ce','vertical asymptote'],['hot','x-intercept'],['cv','anchor']]];
  TIPS['lg-h']=el=>`h = ${el.value}: the asymptote moves to x = ${el.value}.`;TIPS['lg-b2:bh']='A base below 1 makes the log graph decrease.';
  GLOSS['logarithm']='log_b(x) is the exponent y for which bʸ = x.';GLOSS['natural logarithm']='ln x = log_e x, the logarithm with base e ≈ 2.718.';GLOSS['vertical asymptote']='A vertical line x = c that the graph approaches (up or down) as x approaches c.';
  TT.logfn='Train the translation "log_b x = y means b^y = x" until it is automatic. The two-way reading solves most problems.';
  GLYPH.logfn='<path d="M5 22 C5 10, 10 6, 22 5" stroke="var(--cx)" stroke-width="2.4" fill="none"/><path d="M4 2 V22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),SUB={2:'₂',3:'₃',5:'₅',10:'₁₀'};
  PROBS.push({id:'lg-eval',topic:'logfn',title:'Evaluate a logarithm',gen(){const r=pick([2,3,5,10]),q=pick([1,1,2,3]),p=pick([-3,-2,-1,1,2,3,4,5]),b=Math.pow(r,q),N=Math.pow(r,p),ans=p/q;
    const Ntxt=p<0?`1/${Math.pow(r,-p)}`:String(N),btxt=String(b);
    return {q:`Evaluate log${String(b).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join('')} ${Ntxt}. Enter a fraction or number.`,ans,unit:'',abs:1e-6,chk:Math.log(N)/Math.log(b),show:frac(ans),hint:`Ask: ${btxt} to what power gives ${Ntxt}? Write both as powers of ${r}.`,sol:`${btxt} = ${r}${q>1?'^'+q:''} and ${Ntxt} = ${r}^${p<0?`(${sg(p)})`:p}, so ${btxt}^y = ${Ntxt} needs ${q===1?'':q}y = ${sg(p)}, y = <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'lg-solve',topic:'logfn',title:'From a log equation to a number',gen(){const b=pick([2,3,4,5,10]),c=pick([-3,-2,-1,1,2,3,4]),ans=Math.pow(b,c);
    return {q:`Solve log${String(b).split('').map(ch=>'₀₁₂₃₄₅₆₇₈₉'[ch]).join('')} x = ${sg(c)}. Enter a fraction or number.`,ans,unit:'',abs:1e-6,chk:Math.exp(c*Math.log(b)),show:frac(ans),hint:'Rewrite the logarithm as an exponential: log_b x = c means x = bᶜ.',sol:`x = ${b}^${c<0?`(${sg(c)})`:c} = <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'lg-asym',topic:'logfn',title:'Asymptote of a shifted log',gen(){const b=pick([2,3,10]),h=ri(-6,6),k=ri(-4,4);
    let edge=null;for(let x=-20;x<=20;x+=.001){const v=Math.log(x-h)/Math.log(b);if(isFinite(v)){edge=x;break;}}
    return {q:`g(x) = log${String(b).split('').map(ch=>'₀₁₂₃₄₅₆₇₈₉'[ch]).join('')}(x ${h<0?'+':'−'} ${Math.abs(h)||0})${k?(k<0?' − ':' + ')+Math.abs(k):''}. The graph has a vertical asymptote x = c. Find c.`.replace('(x − 0)','(x)'),ans:h,unit:'',abs:0,chk:Math.round(edge),hint:'The expression inside the log must be positive. The asymptote is where it equals 0.',sol:`x ${h<0?'+':'−'} ${Math.abs(h)} = 0 at x = <b>${sg(h)}</b>; the domain is x > ${sg(h)}.`.replace(/x [−+] 0(?![.\d])/g,'x')};}});
  PROBS.push({id:'lg-x',topic:'logfn',title:'x-intercept of a shifted log',gen(){const b=pick([2,3,10]),h=ri(-4,4),k=pick([-2,-1,1,2]),ans=h+Math.pow(b,-k);
    const g=x=>Math.log(x-h)/Math.log(b)+k;let lo=h+1e-9,hi=h+1e4;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(g(m)<0)lo=m;else hi=m;}
    return {q:`Find the x-intercept of g(x) = log${String(b).split('').map(ch=>'₀₁₂₃₄₅₆₇₈₉'[ch]).join('')}(x ${h<0?'+':'−'} ${Math.abs(h)||0}) ${k<0?'−':'+'} ${Math.abs(k)}. Round to 3 decimal places if needed.`.replace('(x − 0)','(x)'),ans,unit:'',abs:.0006,chk:(lo+hi)/2,show:sg(+ans.toFixed(4)),hint:'Set g(x) = 0, isolate the logarithm, and rewrite it as an exponential.',sol:`log(x ${h<0?'+':'−'} ${Math.abs(h)}) = ${sg(-k)}, so x ${h<0?'+':'−'} ${Math.abs(h)} = ${b}^${k>0?`(${sg(-k)})`:-k} = ${sg(+Math.pow(b,-k).toFixed(4))}, giving x = <b>${sg(+ans.toFixed(4))}</b>.`.replace(/x [−+] 0(?![.\d])/g,'x')};}});
  PROBS.push({id:'lg-ph',topic:'logfn',title:'pH from a concentration',gen(){const m=pick([1.5,2,2.5,3.2,4,5,6.3,7.9]),e=pick([3,4,5,6,7,8,9]),ans=-Math.log10(m*Math.pow(10,-e));
    let chk=-(Math.log(m)/Math.LN10-e);
    return {q:`The pH of a solution is −log₁₀[H⁺]. Find the pH when [H⁺] = ${m} × 10⁻${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]} mol/L. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk,show:ans.toFixed(2),hint:'log₁₀(m × 10⁻ⁿ) = log₁₀ m − n.',sol:`pH = −(log₁₀ ${m} − ${e}) = ${e} − ${(Math.log10(m)).toFixed(3)} ≈ <b>${ans.toFixed(2)}</b>.`};}});
})();
