/* ---------------- 2.12 Log rules and equivalent forms ---------------- */
(function logrules(){
  const cv=$('#lr-canvas');if(!cv)return;
  let rule='prod',m=6,n=4;
  const L2=v=>Math.log(v)/Math.log(2),f3=v=>fmt(v,3).replace(/\.?0+$/,'').replace('-','−'),f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  function parts(){const a=L2(m);
    if(rule==='prod')return {segs:[[0,a,T.cx,'log₂ m'],[a,a+L2(n),T.cv,'log₂ n']],tot:L2(m*n),totL:'log₂(mn)'};
    if(rule==='quot')return {segs:[[0,a,T.cx,'log₂ m'],[a,a-L2(n),T.cv,'− log₂ n']],tot:L2(m/n),totL:'log₂(m/n)'};
    const k=Math.floor(n),segs=[];for(let i=0;i<k;i++)segs.push([a*i,a*(i+1),i%2?T.cv:T.cx,'log₂ m']);if(n-k>1e-9)segs.push([a*k,a*n,T.ca,'']);return {segs,tot:n*a,totL:'log₂(mᵖ)'};}
  const sim=sim2d(cv,{h:w=>clamp(w*.34,230,300),draw(ctx,w,h){const Pt=parts(),xs=[0,Pt.tot,...Pt.segs.flatMap(s=>[s[0],s[1]])],lo=Math.min(...xs)-.4,hi=Math.max(...xs)+.4,X=v=>50+(v-lo)/(hi-lo)*(w-80);
    const y1=h*.3,y2=h*.62,bh=h*.14;
    ctx.strokeStyle=T.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(40,h*.84);ctx.lineTo(w-20,h*.84);ctx.stroke();
    for(let t=Math.ceil(lo);t<=hi;t++){label(ctx,String(t).replace('-','−'),X(t),h*.84+14,T.muted,'center','middle',MONO);ctx.beginPath();ctx.moveTo(X(t),h*.84-4);ctx.lineTo(X(t),h*.84+4);ctx.stroke();}
    ctx.strokeStyle=alpha(T.ce,.7);ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(X(Pt.tot),y1-bh);ctx.lineTo(X(Pt.tot),y2+bh);ctx.stroke();ctx.setLineDash([]);
    Pt.segs.forEach(([a,b,c,t])=>{const x0=Math.min(X(a),X(b)),ww=Math.abs(X(b)-X(a));ctx.fillStyle=alpha(c,.75);ctx.fillRect(x0,y1-bh/2,ww,bh);ctx.strokeStyle=T.surface;ctx.lineWidth=1.5;ctx.strokeRect(x0,y1-bh/2,ww,bh);
      if(t&&ww>46)label(ctx,t,x0+ww/2,y1,'#fff','center','middle','600 11px "IBM Plex Mono",monospace');});
    const x0=Math.min(X(0),X(Pt.tot)),ww=Math.abs(X(Pt.tot)-X(0));ctx.fillStyle=alpha(T.hot,.8);ctx.fillRect(x0,y2-bh/2,ww,bh);if(ww>50)label(ctx,Pt.totL,x0+ww/2,y2,'#fff','center','middle','600 11px "IBM Plex Mono",monospace');
    label(ctx,'the pieces laid end to end',44,y1-bh/2-12,T.muted,'left','middle',MONO);label(ctx,'the logarithm of the combination',44,y2-bh/2-12,T.hot,'left','middle',MONO);}});
  function upd(){const a=L2(m),b=L2(n);let l,r,lt,rt;
    if(rule==='prod'){l=L2(m*n);r=a+b;lt=`log₂(${f2(m)} × ${f2(n)}) = log₂ ${f2(m*n)} = ${f3(l)}`;rt=`log₂ ${f2(m)} + log₂ ${f2(n)} = ${f3(a)} + ${f3(b)} = ${f3(r)}`;}
    else if(rule==='quot'){l=L2(m/n);r=a-b;lt=`log₂(${f2(m)} ÷ ${f2(n)}) = log₂ ${f2(m/n)} = ${f3(l)}`;rt=`log₂ ${f2(m)} − log₂ ${f2(n)} = ${f3(a)} − ${f3(b)} = ${f3(r)}`;}
    else{l=L2(m**n);r=n*a;lt=`log₂(${f2(m)}^${f2(n)}) = log₂ ${f2(m**n)} = ${f3(l)}`;rt=`${f2(n)} × log₂ ${f2(m)} = ${f2(n)} × ${f3(a)} = ${f3(r)}`;}
    setText('lr-lhs',lt);setText('lr-rhs',rt);setText('lr-ok',Math.abs(l-r)<1e-9?'equal ✓':'not equal');sim.render();}
  bindRange('lr-m',f2,v=>{m=v;upd();});bindRange('lr-n',f2,v=>{n=v;upd();});segBind('lr-r','k',k=>{rule=k;upd();});

  let x=8;
  const sim2=glab('lr-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[0,20],yr:[-3,6],xn:10,yn:4}),draw(ctx,P){
    [[v=>Math.log(v)/Math.log(2),T.cx],[v=>Math.log10(v),T.cv],[Math.log,T.ca]].forEach(([f,c])=>{curveD(ctx,P,f,.01,20,c,3,600);dot(ctx,P.X(x),P.Y(f(x)),5.5,c,T.surface);});
    vline(ctx,P,x,alpha(T.hot,.8),[5,4]);label(ctx,'blue: log₂ x   green: log₁₀ x   magenta: ln x',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd2(){const a=Math.log(x)/Math.log(2),b=Math.log10(x),c=Math.log(x);setText('lr-vals',`${f3(a)},  ${f3(b)},  ${f3(c)}`);
    setText('lr-ratio',Math.abs(b)<1e-9?'x = 1: all three are 0':f3(a/b));setText('lr-why',`log₂ x = log₁₀ x / log₁₀ 2 ≈ ${f3(1/Math.log10(2))} · log₁₀ x`);sim2.render();}
  bindRange('lr-x',v=>fmt(v,1),v=>{x=v;upd2();});
  drawers.logrules=()=>{sim.render();sim2.render();};
  KEYS['lr-canvas']=['Logarithms as lengths on a number line. Top: the two logs laid end to end. Bottom: the log of the product, quotient or power. Gold dashed: where they end.',[['cx','log₂ m'],['cv','log₂ n'],['hot','the combined log'],['ce','end point']]];
  KEYS['lr-canvas2']=['Three logarithms of x. Their heights are always in the same ratio: they are vertical stretches of each other.',[['cx','log₂ x'],['cv','log₁₀ x'],['ca','ln x'],['hot','chosen x']]];
  TIPS['lr-r:prod']='Product: multiply the numbers, add the logs.';TIPS['lr-r:quot']='Quotient: divide the numbers, subtract the logs.';TIPS['lr-r:pow']='Power: raise to a power, multiply the log.';
  GLOSS['change of base']='log_b x = ln x / ln b: any logarithm can be computed from the natural log.';
  TT.logrules='Derive each rule from bᵃ·bᶜ = b^(a+c) with the class before they use it. Then drill "which rule?" before "simplify".';
  GLYPH.logrules='<rect x="2" y="5" width="9" height="5" fill="var(--cx)"/><rect x="11" y="5" width="7" height="5" fill="var(--cv)"/><rect x="2" y="14" width="16" height="5" fill="var(--hot)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),SUB=b=>String(b).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join('');
  const bv=(b,N)=>Math.log(N)/Math.log(b);
  PROBS.push({id:'lr-prod',topic:'logrules',title:'Add logs, then evaluate',gen(){const b=pick([2,3,5,10]),k=ri(2,5),big=Math.pow(b,k),divs=[];for(let d=2;d<big;d++)if(big%d===0&&d!==b**1&&true)divs.push(d);const m=pick(divs.length?divs:[b]),n=big/m;
    return {q:`Evaluate log${SUB(b)} ${m} + log${SUB(b)} ${n}.`,ans:k,unit:'',abs:0,chk:Math.round(bv(b,m)+bv(b,n)),hint:'Combine into one log with the product rule, then ask what power of the base gives that number.',sol:`log${SUB(b)}(${m} · ${n}) = log${SUB(b)} ${big} = <b>${k}</b>, since ${b}^${k} = ${big}.`};}});
  PROBS.push({id:'lr-quot',topic:'logrules',title:'Subtract logs, then evaluate',gen(){const b=pick([2,3,5,10]),k=ri(1,4),n=pick([2,3,4,5,6,8,10]),m=n*Math.pow(b,k);
    return {q:`Evaluate log${SUB(b)} ${m} − log${SUB(b)} ${n}.`,ans:k,unit:'',abs:0,chk:Math.round(bv(b,m)-bv(b,n)),hint:'The quotient rule turns the difference into one log of a ratio.',sol:`log${SUB(b)}(${m}/${n}) = log${SUB(b)} ${Math.pow(b,k)} = <b>${k}</b>.`};}});
  PROBS.push({id:'lr-pow',topic:'logrules',title:'Use the power rule',gen(){const b=pick([2,3,5]),a=pick([3,5,6,7,10,11]),p=pick([2,3,4,5]),L=+bv(b,a).toFixed(4),ans=p*L;
    return {q:`log${SUB(b)} ${a} ≈ ${L}. Use the power rule to find log${SUB(b)} ${Math.pow(a,p)}. Round to 3 decimal places.`,ans,unit:'',abs:.002,chk:bv(b,Math.pow(a,p)),show:ans.toFixed(3),hint:`${Math.pow(a,p)} = ${a}^${p}, so the log is ${p} times log${SUB(b)} ${a}.`,sol:`log${SUB(b)} ${Math.pow(a,p)} = ${p}·log${SUB(b)} ${a} ≈ ${p}(${L}) = <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'lr-cob',topic:'logrules',title:'Change of base',gen(){const b=pick([2,3,5,7]),N=pick([10,12,20,30,50,100]),ans=Math.log(N)/Math.log(b);
    return {q:`Evaluate log${SUB(b)} ${N} with a calculator. Round to 3 decimal places.`,ans,unit:'',abs:.0006,chk:Math.log10(N)/Math.log10(b),show:ans.toFixed(3),hint:'log_b N = ln N / ln b (or log N / log b).',sol:`log${SUB(b)} ${N} = ln ${N} / ln ${b} = ${Math.log(N).toFixed(4)} / ${Math.log(b).toFixed(4)} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'lr-expand',topic:'logrules',title:'Expand a logarithm',gen(){const b=pick([2,3,10]),c=Math.pow(b,ri(1,3)),p=pick([2,3,4,5]),which=pick(['a','p']),kk=Math.round(bv(b,c));
    const f=x=>Math.log(c*Math.pow(x,p))/Math.log(b),slope=(f(4)-f(2))/(Math.log(4)/Math.log(b)-Math.log(2)/Math.log(b)),icept=f(1);
    return {q:`log${SUB(b)}(${c}x${'⁰¹²³⁴⁵⁶⁷⁸⁹'[p]}) = A + B·log${SUB(b)} x for x > 0. Find ${which==='a'?'A':'B'}.`,ans:which==='a'?kk:p,unit:'',abs:0,chk:Math.round(which==='a'?icept:slope),hint:'Use the product rule to split off the constant, then the power rule on x.',sol:`log${SUB(b)}(${c}x^${p}) = log${SUB(b)} ${c} + ${p}·log${SUB(b)} x = ${kk} + ${p}·log${SUB(b)} x. So ${which==='a'?'A':'B'} = <b>${which==='a'?kk:p}</b>.`};}});
  const MC=[['log x + log y','log(xy)'],['2 log x','log(x²)'],['log x − log y','log(x/y)'],['½ log x','log(√x)'],['log x + 2 log y','log(xy²)'],['3 log x − log y','log(x³/y)']];
  PROBS.push({id:'lr-one',topic:'logrules',title:'Condense to one log',gen(){const [e,r]=pick(MC),wrong=['log(x + y)','log(x − y)','(log x)(log y)','log(x²y)','log(x/y²)','log(xy)','log(x/y)','log(x²)','log(√x)','log(x³ − y)'].filter(s=>s!==r),{choices,ans}=mcq(r,shuffle(wrong).slice(0,3),4);
    return {q:`Which single logarithm equals ${e}?`,choices,ans,hint:'Sums become products, differences become quotients, coefficients become exponents.',sol:`${e} = <b>${r}</b>.`};}});
})();
