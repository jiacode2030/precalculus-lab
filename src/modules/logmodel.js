/* ---------------- 2.14 Logarithmic function context and data modeling ---------------- */
(function logmodel(){
  const cv=$('#lm-canvas');if(!cv)return;
  const DATA={score:{x:[1,2,4,8,16,32],y:[42,50,57,66,73,81],xl:'hours of practice',yl:'score',a:42,b:11.3,ticks:[1,2,4,8,16,32]},
    alt:{x:[100,80,60,40,20],y:[.1,2,4.5,7.7,13.6],xl:'pressure (kPa)',yl:'altitude (km)',a:38.8,b:-8.4,ticks:[20,40,60,80,100]}};
  let dk='score',ax='lin',a=42,b=11.3;
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const fit=D=>{const n=D.x.length,L=D.x.map(Math.log),mx=L.reduce((s,v)=>s+v,0)/n,my=D.y.reduce((s,v)=>s+v,0)/n;let sxy=0,sxx=0;L.forEach((l,i)=>{sxy+=(l-mx)*(D.y[i]-my);sxx+=(l-mx)**2;});const bb=sxy/sxx;return {a:my-bb*mx,b:bb};};
  const sim=sim2d(cv,{h:w=>clamp(w*.62,340,450),draw(ctx,w,h){const D=DATA[dk],f=x=>a+b*Math.log(x),res=D.y.map((y,i)=>y-f(D.x[i])),log=ax==='log';
    const xmin=Math.min(...D.x),xmax=Math.max(...D.x),pad=log?.3:(xmax-xmin)*.06+.5,xr=log?[Math.log(xmin)-.3,Math.log(xmax)+.3]:[Math.max(0,xmin-pad),xmax+pad],X=x=>log?Math.log(x):x;
    const ys=[...D.y,...D.x.map(f)],lo=Math.min(...ys),hi=Math.max(...ys),pd=(hi-lo)*.15;
    const gh=(h-40)*.64,P=gpanel(ctx,{x:50,y:12,w:w-66,h:gh},xr,[lo-pd,hi+pd],{xn:5,yn:4,xt:log?false:undefined});
    if(log)D.ticks.forEach(t=>label(ctx,String(t),P.X(Math.log(t)),P.box.y+P.box.h+4,T.muted,'center','top',MONO));
    ctx.save();ctx.beginPath();ctx.rect(P.box.x,P.box.y,P.box.w,P.box.h);ctx.clip();
    const xa=Math.max(1e-3,xr[0]<=0?.05:(log?Math.exp(xr[0]):xr[0]));const N=400;ctx.strokeStyle=T.cv;ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=N;i++){const t=log?xr[0]+(xr[1]-xr[0])*i/N:xa+(xr[1]-xa)*i/N,x=log?Math.exp(t):t;const px=P.X(X(x)),py=P.Y(f(x));i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
    D.x.forEach((x,i)=>{ctx.strokeStyle=T.hot;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(P.X(X(x)),P.Y(f(x)));ctx.lineTo(P.X(X(x)),P.Y(D.y[i]));ctx.stroke();dot(ctx,P.X(X(x)),P.Y(D.y[i]),5.5,T.cx,T.surface);});ctx.restore();
    label(ctx,(log?'log scale: ':'')+D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl,P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);
    const m=Math.max(...res.map(Math.abs),1e-9)*1.4,Q=gpanel(ctx,{x:50,y:12+gh+28,w:w-66,h:h-gh-58},xr,[-m,m],{xn:5,yn:2,xt:false});
    const gap=Math.min(...D.x.slice(1).map((x,i)=>Math.abs(Q.X(X(x))-Q.X(X(D.x[i])))));const bw=Math.max(5,Math.min(30,gap*.35));
    res.forEach((r,i)=>{ctx.fillStyle=alpha(T.hot,.8);const y0=Q.Y(0),y1=Q.Y(r);ctx.fillRect(Q.X(X(D.x[i]))-bw/2,Math.min(y0,y1),bw,Math.abs(y1-y0));});
    label(ctx,'residuals (data − model)',Q.box.x+6,Q.box.y+10,T.hot,'left','middle',MONO);}});
  function upd(){const D=DATA[dk],res=D.y.map((y,i)=>y-(a+b*Math.log(D.x[i]))),rms=Math.sqrt(res.reduce((s,r)=>s+r*r,0)/res.length);
    setText('lm-eq',`y = ${f2(a)} ${b<0?'−':'+'} ${f2(Math.abs(b))} ln x`);setText('lm-rms',fmt(rms,2));setText('lm-dbl',`b·ln 2 = ${(b*Math.LN2<0?'−':'')+f2(Math.abs(b*Math.LN2))}`);sim.render();}
  bindRange('lm-a',f2,v=>{a=v;upd();});bindRange('lm-b',f2,v=>{b=v;upd();});
  const pick0=()=>{const D=DATA[dk];set('lm-a',D.a);set('lm-b',D.b);};
  segBind('lm-set','k',k=>{dk=k;pick0();});segBind('lm-ax','k',k=>{ax=k;upd();});
  $('#lm-best').addEventListener('click',()=>{const r=fit(DATA[dk]);set('lm-a',+r.a.toFixed(1));set('lm-b',+r.b.toFixed(1));});
  $('#lm-lab').addEventListener('labreset',()=>{dk='score';ax='lin';pick0();});

  /* using it, and its limits */
  let xh=20;const A=42,B=39/Math.log(32),M=x=>A+B*Math.log(x);
  const sim2=glab('lm-canvas2',{h:w=>clamp(w*.44,260,340),view:()=>({xr:[0,250],yr:[30,115],xn:5,yn:4}),draw(ctx,P){hline(ctx,P,100,T.ce,[6,4]);
    curveD(ctx,P,M,.5,250,T.cv,3.2,600);const y=M(xh);dot(ctx,P.X(xh),P.Y(y),6.5,y>100?T.ca:T.hot,T.surface);line(ctx,P,xh,30,xh,y,alpha(T.hot,.6),1.4,[4,3]);
    label(ctx,'score cannot exceed 100',P.box.x+P.box.w-8,P.Y(100)-10,T.ce,'right','middle',MONO);label(ctx,'y = 42 + 11.25 ln x',P.box.x+8,P.box.y+12,T.cv,'left','middle',LABEL);}});
  function upd2(){const y=M(xh);setText('lm-pred',fmt(y,1)+(y>100?'  (impossible: over 100)':''));setText('lm-dbl2',`${fmt(M(2*xh)-M(xh),2)} points (always b·ln 2)`);setText('lm-cap',`x = e^((100 − 42)/${fmt(B,2)}) ≈ ${fmt(Math.exp((100-A)/B),0)} hours`);sim2.render();}
  bindRange('lm-x',String,v=>{xh=v;upd2();});
  drawers.logmodel=()=>{sim.render();sim2.render();};
  KEYS['lm-canvas']=['Blue dots: data. Green: your model. Orange: residuals (also the bars below). On a log x-axis a log model is a straight line.',[['cx','data'],['cv','model'],['hot','residuals']]];
  KEYS['lm-canvas2']=['Green: the fitted score model. Gold: the maximum score 100. The orange dot is your chosen number of hours; it turns magenta when the model gives an impossible value.',[['cv','model'],['ce','maximum'],['hot','your x']]];
  TIPS['lm-b']=el=>`b = ${el.value}: each doubling of x changes y by ${f2(el.value*Math.LN2)}.`;TIPS['lm-ax:log']='On a log scale, equal ratios of x are equally spaced.';
  GLOSS['logarithmic model']='A model y = a + b·ln x: equal multiples of the input add equal amounts to the output.';
  TT.logmodel='Let students find a doubling table by hand first: equal output steps for doubled inputs is the fingerprint.';
  GLYPH.logmodel='<circle cx="4" cy="19" r="1.8" fill="var(--cx)"/><circle cx="9" cy="12" r="1.8" fill="var(--cx)"/><circle cx="15" cy="8" r="1.8" fill="var(--cx)"/><circle cx="21" cy="6" r="1.8" fill="var(--cx)"/><path d="M3 21 C6 8, 14 5, 22 5" stroke="var(--cv)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),ln=Math.log;
  PROBS.push({id:'lm-eval',topic:'logmodel',title:'Evaluate a log model',gen(){const a=ri(5,60),b=pick([2,3,4,5,8,10,-2,-3,-5]),x=pick([2,3,5,10,20,50,100]),ans=a+b*ln(x);
    return {q:`A model is y = ${a} ${b<0?'−':'+'} ${Math.abs(b)} ln x. Find y when x = ${x}. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:a+b*Math.log10(x)/Math.log10(Math.E),show:ans.toFixed(2),hint:'Use the ln key. ln x is the natural logarithm of x.',sol:`ln ${x} = ${ln(x).toFixed(4)}, so y = ${a} ${b<0?'−':'+'} ${Math.abs(b)}(${ln(x).toFixed(4)}) ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'lm-solve',topic:'logmodel',title:'Solve for x in a log model',gen(){const a=ri(5,40),b=pick([2,3,4,5,6,10]),x=pick([2,3,5,8,10,20,30]),y=a+b*ln(x),yy=+y.toFixed(3),ans=Math.exp((yy-a)/b);
    let lo=1e-6,hi=1e9;for(let i=0;i<300;i++){const m=Math.sqrt(lo*hi);if(a+b*Math.log(m)<yy)lo=m;else hi=m;}
    return {q:`A model is y = ${a} + ${b} ln x. For what x is y = ${yy}? Round to 2 decimal places.`,ans,unit:'',abs:.01,chk:Math.sqrt(lo*hi),show:ans.toFixed(2),hint:'Subtract a, divide by b, then undo the natural log with e to that power.',sol:`${b} ln x = ${sg(+(yy-a).toFixed(3))}, so ln x = ${sg(+((yy-a)/b).toFixed(4))} and x = e^${sg(+((yy-a)/b).toFixed(4))} ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'lm-two',topic:'logmodel',title:'Find b from two points',gen(){const a=ri(10,60),b=pick([2,3,4,5,6,8,10,12]),x2=pick([2,4,8,10,16,20,100]),y2=a+b*ln(x2),y2r=+y2.toFixed(3);
    return {q:`y = a + b ln x passes through (1, ${a}) and (${x2}, ${y2r}). Find b. Round to 2 decimal places.`,ans:(y2r-a)/ln(x2),unit:'',abs:.01,chk:(y2r-a)/(Math.log10(x2)/Math.log10(Math.E)),show:((y2r-a)/ln(x2)).toFixed(2),hint:'At x = 1, ln x = 0, so a is the y-value there. Then b = (y₂ − a)/ln x₂.',sol:`b = (${y2r} − ${a}) / ln ${x2} = ${sg(+(y2r-a).toFixed(3))}/${ln(x2).toFixed(4)} ≈ <b>${((y2r-a)/ln(x2)).toFixed(2)}</b>.`};}});
  PROBS.push({id:'lm-double',topic:'logmodel',title:'Effect of doubling',gen(){const a=ri(5,50),b=pick([2,3,5,7,10,-4,-6]),x=pick([2,5,10,30]),ans=b*Math.LN2,chk=(a+b*Math.log(2*x))-(a+b*Math.log(x));
    return {q:`y = ${a} ${b<0?'−':'+'} ${Math.abs(b)} ln x. By how much does y change when x doubles? Round to 2 decimal places.`,ans,unit:'',abs:.01,chk,show:ans.toFixed(2),hint:'ln(2x) = ln 2 + ln x, so the change does not depend on x.',sol:`y(2x) − y(x) = ${sg(b)}(ln 2x − ln x) = ${sg(b)} ln 2 ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'lm-pred',topic:'logmodel',title:'Predict from two points',gen(){const x1=pick([1,2,4,5]),x2=x1*pick([4,5,8,10]),x3=x2*pick([2,3,5]),a=ri(10,50),b=pick([3,4,5,6,8]),y1=+(a+b*ln(x1)).toFixed(3),y2=+(a+b*ln(x2)).toFixed(3),bb=(y2-y1)/(ln(x2)-ln(x1)),ans=y1+bb*(ln(x3)-ln(x1));
    const b10=(y2-y1)/(Math.log10(x2)-Math.log10(x1));
    return {q:`A log model passes through (${x1}, ${y1}) and (${x2}, ${y2}). Predict y at x = ${x3}. Round to 1 decimal place.`,ans,unit:'',abs:.06,chk:y1+b10*(Math.log10(x3)-Math.log10(x1)),show:ans.toFixed(1),hint:'Find b from the two points using ln of the inputs, then use y = y₁ + b(ln x − ln x₁).',sol:`b = (${y2} − ${y1})/(ln ${x2} − ln ${x1}) ≈ ${bb.toFixed(3)}. Then y(${x3}) = ${y1} + ${bb.toFixed(3)}(ln ${x3} − ln ${x1}) ≈ <b>${ans.toFixed(1)}</b>.`};}});
})();
