/* ---------------- 2.5, 2.6 Exponential models & competing models ---------------- */
(function expmodel(){
  const cv=$('#xm-canvas');if(!cv)return;
  const DATA={pop:{x:[0,2,4,6,8,10],y:[12,12.7,13.2,14.1,14.6,15.5],xl:'years since 2010',yl:'population (thousands)',a:12,b:1.026},
    dep:{x:[0,1,2,3,4,5],y:[40,34.5,28.7,24.9,21.3,17.6],xl:'years',yl:'value ($ thousands)',a:40,b:.85},
    fol:{x:[0,1,2,3,4,5],y:[100,130,169,220,286,371],xl:'weeks',yl:'followers',a:100,b:1.3}};
  let dk='pop',a=12,b=1.03;
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  /* least squares of ln y on x gives the exponential regression */
  function best(D){const n=D.x.length,L=D.y.map(Math.log),mx=D.x.reduce((s,v)=>s+v,0)/n,my=L.reduce((s,v)=>s+v,0)/n;let sxy=0,sxx=0;D.x.forEach((x,i)=>{sxy+=(x-mx)*(L[i]-my);sxx+=(x-mx)**2;});const k=sxy/sxx;return {a:Math.exp(my-k*mx),b:Math.exp(k)};}
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const sim=sim2d(cv,{h:w=>clamp(w*.62,340,450),draw(ctx,w,h){const D=DATA[dk],f=x=>a*b**x,res=D.y.map((y,i)=>y-f(D.x[i])),x0=D.x[0]-.4,x1=D.x[D.x.length-1]+.4,top=Math.max(...D.y)*1.18;
    const gh=(h-40)*.66,P=gpanel(ctx,{x:50,y:12,w:w-66,h:gh},[x0,x1],[0,top],{xn:5,yn:4});
    ctx.save();ctx.beginPath();ctx.rect(P.box.x,P.box.y,P.box.w,P.box.h);ctx.clip();
    curveD(ctx,P,f,x0,x1,T.cv,3,300);D.x.forEach((x,i)=>{line(ctx,P,x,f(x),x,D.y[i],T.hot,2.6);dot(ctx,P.X(x),P.Y(D.y[i]),5.5,T.cx,T.surface);});ctx.restore();
    label(ctx,D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl,P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);
    const m=Math.max(...res.map(Math.abs),1e-9)*1.4,Q=gpanel(ctx,{x:50,y:12+gh+28,w:w-66,h:h-gh-58},[x0,x1],[-m,m],{xn:5,yn:2});
    const bw=Math.max(5,(Q.X(D.x[1])-Q.X(D.x[0]))*.35);res.forEach((r,i)=>{ctx.fillStyle=alpha(T.hot,.8);const y0=Q.Y(0),y1=Q.Y(r);ctx.fillRect(Q.X(D.x[i])-bw/2,Math.min(y0,y1),bw,Math.abs(y1-y0));});
    label(ctx,'residuals (data − model)',Q.box.x+6,Q.box.y+10,T.hot,'left','middle',MONO);}});
  function upd(){const D=DATA[dk],res=D.y.map((y,i)=>y-a*b**D.x[i]),rms=Math.sqrt(res.reduce((s,r)=>s+r*r,0)/res.length),mean=D.y.reduce((s,v)=>s+v,0)/D.y.length,rel=rms/mean,flips=res.slice(1).filter((r,i)=>Math.sign(r)!==Math.sign(res[i])).length;
    setText('xm-eq',`f(x) = ${f2(a)}(${fmt(b,3)})ˣ`);setText('xm-rms',fmt(rms,2));
    setText('xm-verdict',rel<.03?(flips<=1?'small misses, but they lean one way: nudge b':'a good fit: small misses, no pattern'):rel<.1?'close: look for a pattern in the residuals':'a poor fit: change a and b');sim.render();}
  bindRange('xm-a',f2,v=>{a=v;upd();});bindRange('xm-b',v=>fmt(v,3),v=>{b=v;upd();});
  const pick0=()=>{const D=DATA[dk];set('xm-a',D.a);set('xm-b',D.b);};
  segBind('xm-data','k',k=>{dk=k;pick0();});
  $('#xm-two').addEventListener('click',()=>{const D=DATA[dk],n=D.x.length-1,bb=(D.y[n]/D.y[0])**(1/(D.x[n]-D.x[0]));set('xm-a',D.y[0]);set('xm-b',+bb.toFixed(3));});
  $('#xm-best').addEventListener('click',()=>{const r=best(DATA[dk]);set('xm-a',+r.a.toFixed(1));set('xm-b',+r.b.toFixed(3));});
  $('#xm-lab').addEventListener('labreset',()=>{dk='pop';pick0();});

  /* three competing models */
  const SET={grow:{x:[0,1,2,3,4,5],y:[100,130,169,220,286,371],xl:'week',yl:'followers'},arc:{x:[0,1,2,3,4,5,6],y:[4,9.3,11.8,13.2,11.9,9.1,3.8],xl:'time (s)',yl:'height (m)'}};
  const BAS={lin:x=>[1,x],quad:x=>[1,x,x*x]};
  function ls(type,X,Y){const m=BAS[type](0).length,A=Array.from({length:m},()=>Array(m+1).fill(0));X.forEach((x,i)=>{const bv=BAS[type](x);for(let r=0;r<m;r++){for(let c=0;c<m;c++)A[r][c]+=bv[r]*bv[c];A[r][m]+=bv[r]*Y[i];}});
    for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];for(let r=0;r<m;r++)if(r!==c){const q=A[r][c]/A[c][c];for(let k=c;k<=m;k++)A[r][k]-=q*A[c][k];}}
    const co=A.map((row,i)=>row[m]/row[i]);return x=>BAS[type](x).reduce((t,bv,i)=>t+bv*co[i],0);}
  let sk='grow',xp=9;
  const models=()=>{const D=SET[sk],e=best(D);return {lin:ls('lin',D.x,D.y),quad:ls('quad',D.x,D.y),exp:x=>e.a*e.b**x};};
  const rmsOf=(f,D)=>Math.sqrt(D.y.reduce((s,y,i)=>s+(y-f(D.x[i]))**2,0)/D.y.length);
  const sim2=sim2d($('#xm-canvas2'),{h:w=>clamp(w*.55,320,420),draw(ctx,w,h){const D=SET[sk],M=models(),X1=12.4,top=Math.max(...D.y)*(sk==='grow'?3.2:1.7),bot=sk==='arc'?-6:0;
    const P=gpanel(ctx,{x:50,y:12,w:w-66,h:h-40},[-.4,X1],[bot,top],{xn:6,yn:4});ctx.save();ctx.beginPath();ctx.rect(P.box.x,P.box.y,P.box.w,P.box.h);ctx.clip();
    const lastX=D.x[D.x.length-1];[['lin',T.cv],['quad',T.ca],['exp',T.cx]].forEach(([k,c])=>{curveD(ctx,P,M[k],-.4,lastX,c,3,300);curveD(ctx,P,M[k],lastX,X1,alpha(c,.75),2.4,300,[6,5]);});
    vline(ctx,P,xp,alpha(T.hot,.7),[4,4]);[['lin',T.cv],['quad',T.ca],['exp',T.cx]].forEach(([k,c])=>dot(ctx,P.X(xp),P.Y(M[k](xp)),5,c,T.surface));
    D.x.forEach((x,i)=>dot(ctx,P.X(x),P.Y(D.y[i]),5.5,T.ink,T.surface));ctx.restore();
    label(ctx,D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl+'   (dashed: beyond the data)',P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);}});
  function upd2(){const D=SET[sk],M=models(),r=k=>fmt(rmsOf(M[k],D),2),vals=Object.fromEntries(Object.keys(M).map(k=>[k,rmsOf(M[k],D)])),bestK=Object.keys(vals).sort((p,q)=>vals[p]-vals[q])[0];
    setText('xm-rmss',`${r('lin')} / ${r('quad')} / ${r('exp')}`);setText('xm-pred',`line ${fmt(M.lin(xp),1)}  quadratic ${fmt(M.quad(xp),1)}  exponential ${fmt(M.exp(xp),1)}`);
    setText('xm-pick',`smallest miss: ${{lin:'the line',quad:'the quadratic',exp:'the exponential'}[bestK]}; now check the context`);sim2.render();}
  bindRange('xm-x',v=>fmt(v,1),v=>{xp=v;upd2();});segBind('xm-set','k',k=>{sk=k;upd2();});
  drawers.expmodel=()=>{sim.render();sim2.render();};
  KEYS['xm-canvas']=['Blue dots are the data, the green curve is your model, orange segments are the residuals (also shown as bars).',[['cx','data'],['cv','model'],['hot','residuals']]];
  KEYS['xm-canvas2']=['Black dots: data. Green: line. Magenta: quadratic. Blue: exponential. Dashed: beyond the data. The orange line is the x where you predict.',[['ink','data'],['cv','line'],['ca','quadratic'],['cx','exponential'],['hot','predict at x']]];
  TIPS['xm-b']=el=>+el.value>1?`b = ${el.value}: ${f2((el.value-1)*100)}% growth per step.`:`b = ${el.value}: ${f2((1-el.value)*100)}% decay per step.`;
  GLOSS['residual']='Data value minus model value. Small, patternless residuals mean a good model.';GLOSS['extrapolation']='Using a model outside the range of the data. It is risky.';
  TT.expmodel='Ask which model students would trust at x = 9 before showing the predictions, then ask what in the story supports it.';
  GLYPH.expmodel='<circle cx="4" cy="19" r="1.8" fill="var(--cx)"/><circle cx="10" cy="17" r="1.8" fill="var(--cx)"/><circle cx="15" cy="12" r="1.8" fill="var(--cx)"/><circle cx="19" cy="5" r="1.8" fill="var(--cx)"/><path d="M2 20 C10 19, 16 16, 20 4" stroke="var(--cv)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  PROBS.push({id:'xm-two',topic:'expmodel',title:'Growth factor from two points',gen(){const a=pick([5,10,20,50,100,200]),b=pick([1.5,2,3,.5,.8,1.2,.9]),n=ri(2,5),y2=a*Math.pow(b,n);
    let best=0,bd=1e9;for(let t=.05;t<=5;t+=.001){const e=Math.abs(a*Math.pow(t,n)-y2);if(e<bd){bd=e;best=t;}}
    return {q:`An exponential function has f(0) = ${a} and f(${n}) = ${+y2.toFixed(4)}. Find b in f(x) = a·bˣ, to 3 decimal places.`,ans:b,unit:'',abs:.0006,chk:best,show:sg(b),hint:`f(${n}) = a·b^${n}, so b^${n} = f(${n})/f(0).`,sol:`b^${n} = ${+y2.toFixed(4)}/${a} = ${sg(y2/a)}, so b = ${sg(y2/a)}^(1/${n}) = <b>${sg(b)}</b>.`};}});
  PROBS.push({id:'xm-pred',topic:'expmodel',title:'Predict with a two-point model',gen(){const a=pick([1000,2000,5000,12000,800]),pct=pick([2,3,4,5,6,8]),b=1+pct/100,n=pick([5,10]),m=n+pick([5,10,15]),y1=a*Math.pow(b,n),ans=a*Math.pow(b,m);
    const bb=Math.pow(y1/a,1/n);return {q:`A population is ${a} at time 0 and ${y1.toFixed(1)} at time ${n}. Assuming exponential growth, predict the population at time ${m}. Round to the nearest whole number.`,ans,unit:'',abs:1.5,chk:a*Math.pow(bb,m),show:String(Math.round(ans)),hint:`Find b = (${y1.toFixed(1)}/${a})^(1/${n}) first, then evaluate ${a}·b^${m}.`,sol:`b = (${y1.toFixed(1)}/${a})^(1/${n}) = ${sg(b)}. Then ${a}(${sg(b)})^${m} ≈ <b>${Math.round(ans)}</b>.`};}});
  PROBS.push({id:'xm-ratio',topic:'expmodel',title:'Exponential from a table',gen(){const a=pick([3,5,10,40,64]),b=pick([2,3,1.5,.5,.25,4]),ys=[0,1,2,3,4].map(i=>a*Math.pow(b,i)),right=ys[4];
    return {q:`x: 0, 1, 2, 3, 4. y: ${ys.slice(0,4).map(sg).join(', ')}, ?. If the data are exponential, what is the missing value?`,ans:right,unit:'',abs:1e-6,chk:ys[3]*(ys[3]/ys[2]),hint:'The ratio between consecutive outputs is constant.',sol:`The ratio is ${sg(ys[1]/ys[0])}, so the next value is ${sg(ys[3])} × ${sg(b)} = <b>${sg(right)}</b>.`};}});
  PROBS.push({id:'xm-resid',topic:'expmodel',title:'A residual',gen(){const a=pick([20,50,100]),b=pick([1.1,1.2,1.5,.9]),x=ri(2,6),act=Math.round(a*Math.pow(b,x)+ri(-12,12)),pred=a*Math.pow(b,x),ans=act-pred;
    return {q:`A model is f(x) = ${a}(${b})ˣ. At x = ${x} the data value is ${act}. Find the residual (data − model), to 2 decimal places.`,ans,unit:'',abs:.006,chk:act-a*Math.pow(b,x),show:ans.toFixed(2).replace('-','−'),hint:'Residual = actual − predicted.',sol:`f(${x}) = ${pred.toFixed(2)}. Residual = ${act} − ${pred.toFixed(2)} = <b>${ans.toFixed(2).replace('-','−')}</b>.`};}});
})();
