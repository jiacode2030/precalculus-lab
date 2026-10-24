/* ---------------- 1.13, 1.14 Building function models ---------------- */
(function models(){
  const cv=$('#md-canvas');if(!cv)return;
  const DATA={stop:{x:[20,30,40,50,60],y:[44,82.5,132,192.5,264],xl:'speed (mph)',yl:'distance (ft)'},
    fuel:{x:[40,60,80,100,120,140],y:[8.5,6.9,6.1,6.4,7.6,9.9],xl:'speed (km/h)',yl:'fuel (L/100 km)'},
    cost:{x:[10,20,30,40,60,80,100],y:[45.2,24.9,18.3,15.1,11.6,10.1,9],xl:'units made',yl:'cost per unit ($)'}};
  const BASIS={lin:x=>[1,x],quad:x=>[1,x,x*x],cub:x=>[1,x,x*x,x**3],rat:x=>[1,1/x]};
  /* least squares through the normal equations (x is scaled to keep the numbers tame) */
  function fit(type,X,Y){const s=Math.max(...X),B=x=>BASIS[type](x/s),m=B(X[0]).length,A=Array.from({length:m},()=>Array(m+1).fill(0));
    X.forEach((x,i)=>{const b=B(x);for(let r=0;r<m;r++){for(let c=0;c<m;c++)A[r][c]+=b[r]*b[c];A[r][m]+=b[r]*Y[i];}});
    for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];
      for(let r=0;r<m;r++)if(r!==c){const f=A[r][c]/A[c][c];for(let k=c;k<=m;k++)A[r][k]-=f*A[c][k];}}
    const co=A.map((row,i)=>row[m]/row[i]);return {co,s,f:x=>BASIS[type](x/s).reduce((t,b,i)=>t+b*co[i],0)};}
  let dk='stop',ty='lin';
  const tidy=v=>+(+v).toPrecision(3);
  function eqTxt(M,type){const s=M.s,c=M.co;
    if(type==='rat')return `y = ${tidy(c[1]*s)}/x ${c[0]<0?'−':'+'} ${Math.abs(tidy(c[0]))}`.replace('+ -','− ').replace('= -','= −');
    const k=c.map((v,i)=>v/Math.pow(s,i)).reverse().map(tidy);return 'y = '+polyTxt(k.map(v=>v)).replace(/^−?\s*0\b/,'0');}
  const sim=sim2d(cv,{h:w=>clamp(w*.62,340,460),draw(ctx,w,h){const D=DATA[dk],M=fit(ty,D.x,D.y),res=D.y.map((y,i)=>y-M.f(D.x[i])),x0=0,x1=Math.max(...D.x)*1.35;
    const xs=Math.min(...D.x);const gh=(h-40)*.64,lo0=Math.min(...D.y,...D.x.map(M.f)),hi0=Math.max(...D.y,...D.x.map(M.f)),pd=(hi0-lo0)*.15;
    const P=gpanel(ctx,{x:50,y:12,w:w-66,h:gh},[x0,x1],[Math.min(0,lo0-pd),hi0+pd*1.5],{xn:5,yn:4});
    ctx.save();ctx.beginPath();ctx.rect(P.box.x,P.box.y,P.box.w,P.box.h);ctx.clip();
    const xa=ty==='rat'?xs*.6:x0;curveD(ctx,P,M.f,xa,Math.max(...D.x),T.cv,3,600);curveD(ctx,P,M.f,Math.max(...D.x),x1,alpha(T.cv,.7),2.2,300,[6,5]);
    D.x.forEach((x,i)=>{line(ctx,P,x,D.y[i],x,M.f(x),T.hot,2.4);dot(ctx,P.X(x),P.Y(D.y[i]),5.5,T.cx,T.surface);});ctx.restore();
    label(ctx,D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl,P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);
    const m=Math.max(...res.map(Math.abs),1e-9)*1.4,Q=gpanel(ctx,{x:50,y:12+gh+28,w:w-66,h:h-gh-58},[x0,x1],[-m,m],{xn:5,yn:2});
    const bw=Math.max(5,(Q.X(D.x[1])-Q.X(D.x[0]))*.4);res.forEach((r,i)=>{ctx.fillStyle=alpha(T.hot,.8);const y0=Q.Y(0),y1=Q.Y(r);ctx.fillRect(Q.X(D.x[i])-bw/2,Math.min(y0,y1),bw,Math.abs(y1-y0));});
    label(ctx,'residuals (data − model)',Q.box.x+6,Q.box.y+10,T.hot,'left','middle',MONO);}});
  function upd(){const D=DATA[dk],M=fit(ty,D.x,D.y),res=D.y.map((y,i)=>y-M.f(D.x[i])),rms=Math.sqrt(res.reduce((s,r)=>s+r*r,0)/res.length),mean=D.y.reduce((s,v)=>s+v,0)/D.y.length,sd=Math.sqrt(D.y.reduce((s,v)=>s+(v-mean)**2,0)/D.y.length);
    const flips=res.slice(1).filter((r,i)=>Math.sign(r)!==Math.sign(res[i])).length;
    setText('md-eq',eqTxt(M,ty));setText('md-rms',fmt(rms,2)+' '+(D.yl.match(/\((.*)\)/)||['',''])[1]);
    setText('md-verdict',rms/sd<.04?'a good fit: small residuals with no pattern':flips<=2?'the residuals have a pattern: try another type of function':'a rough fit; check it against the context');sim.render();}
  segBind('md-data','k',k=>{dk=k;upd();});segBind('md-type','k',k=>{ty=k;upd();});

  /* tiered bill */
  let c=500,r1=.12,r2=.18,xu=800;const FEE=10,C=x=>x<=c?FEE+r1*x:FEE+r1*c+r2*(x-c);
  const sim2=glab('md-canvas2',{h:w=>clamp(w*.42,250,330),view:()=>({xr:[0,1000],yr:[0,330],xn:5,yn:4}),draw(ctx,P){vline(ctx,P,c,T.ce,[6,4]);
    curveD(ctx,P,C,0,c,T.cx,3.2,400);curveD(ctx,P,C,c,1000,T.cv,3.2,400);dot(ctx,P.X(c),P.Y(C(c)),5.5,T.ce,T.surface);
    dot(ctx,P.X(xu),P.Y(C(xu)),6.5,T.hot,T.surface);line(ctx,P,xu,0,xu,C(xu),alpha(T.hot,.6),1.4,[4,3]);
    label(ctx,'x (kWh)',P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,'bill ($)',P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);}});
  const m2=v=>fmt(v,2).replace(/\.00$/,'');
  function upd2(){setText('md-form',`${FEE} + ${m2(r1)}x  (x ≤ ${c});   ${m2(FEE+r1*c)} + ${m2(r2)}(x − ${c})  (x > ${c})`);
    setText('md-val',`$${fmt(C(xu),2)} at ${xu} kWh`);setText('md-cont',Math.abs(r1-r2)<1e-9?'no kink: one straight line':`the pieces meet at (${c}, $${fmt(C(c),2)}); the slope changes from ${m2(r1)} to ${m2(r2)}`);sim2.render();}
  bindRange('md-c',String,v=>{c=v;upd2();});bindRange('md-r1',m2,v=>{r1=v;upd2();});bindRange('md-r2',m2,v=>{r2=v;upd2();});bindRange('md-x',String,v=>{xu=v;upd2();});
  drawers.models=()=>{sim.render();sim2.render();};
  KEYS['md-canvas']=['Pick a data set and a type of function. Blue dots: data. Green: the best-fit model. Orange: the residuals, also plotted below. Dashed: the model beyond the data.',[['cx','data'],['cv','model'],['hot','residuals']]];
  KEYS['md-canvas2']=['Two pieces, one rate each. Blue: before the breakpoint. Green: after. Gold dashed: the breakpoint. Orange: the usage x.',[['cx','first piece'],['cv','second piece'],['ce','breakpoint'],['hot','usage x']]];
  TIPS['md-type:lin']='A straight line: constant first differences.';TIPS['md-type:rat']='y = a/x + b: levels off toward b for large x.';TIPS['md-r1']=el=>`$${el.value} per kWh up to the breakpoint.`;TIPS['md-r2']=el=>`$${el.value} per kWh above the breakpoint.`;
  GLOSS['residual']='Data value minus model value. Patterns in the residuals show that the model type is wrong.';GLOSS['extrapolation']='Using a model outside the range of the data. It is risky.';GLOSS['piecewise function']='A function defined by different formulas on different intervals.';
  TT.models='Ask "what would the residuals look like?" before switching types. The story (units, domain, what is fixed and what varies) should choose the model, not just the fit.';
  GLYPH.models='<circle cx="5" cy="17" r="2" fill="var(--cx)"/><circle cx="10" cy="11" r="2" fill="var(--cx)"/><circle cx="15" cy="9" r="2" fill="var(--cx)"/><path d="M3 19 C9 6, 15 6, 21 8" stroke="var(--cv)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(3)).replace('-','−');
  PROBS.push({id:'md-pw',topic:'models',title:'Tiered bill',gen(){const F=pick([5,8,10,12,15]),r1=pick([.1,.12,.15,.2]),r2=pick([.18,.22,.25,.3]),cb=pick([200,300,400,500]),x=cb+pick([100,150,200,300]),ans=F+r1*cb+r2*(x-cb);
    let t=F;for(let u=0;u<x-1e-9;u+=.5){const rate=u<cb?r1:r2;t+=rate*.5;}
    return {q:`A company charges a $${F} fee plus $${r1} per kWh for the first ${cb} kWh and $${r2} per kWh for each kWh above ${cb}. What is the bill for ${x} kWh, in dollars?`,ans,unit:'$',abs:.01,chk:t,show:ans.toFixed(2),hint:'Charge the first tier fully, then charge the rest at the second rate. Do not charge everything at one rate.',
      sol:`First ${cb} kWh: ${F} + ${r1}(${cb}) = ${sg(F+r1*cb)}. The other ${x-cb} kWh: ${r2}(${x-cb}) = ${sg(r2*(x-cb))}. Total <b>$${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'md-ha',topic:'models',title:'Long-run average cost',gen(){const F=pick([200,300,500,800,1000]),v=pick([2,3,4,5,8,12]),f=n=>(F+v*n)/n;
    return {q:`A company's total cost for n items is ${F} + ${v}n dollars, so the average cost per item is A(n) = (${F} + ${v}n)/n. What value does A(n) approach as n gets very large?`,ans:v,unit:'$',abs:.001,chk:f(1e9),hint:'A(n) = F/n + v. What happens to F/n as n grows?',
      sol:`A(n) = ${F}/n + ${v}. As n grows, ${F}/n → 0, so A(n) → <b>${v}</b>: the horizontal asymptote.`};}});
  PROBS.push({id:'md-avg',topic:'models',title:'How many items for a target cost?',gen(){const v=pick([2,3,4,5,8]),n=pick([20,25,40,50,80,100]),d=pick([1,2,4,5]),F=n*d,t=v+d;
    let best=0,bd=1e9;for(let m=1;m<=2000;m++){const e=Math.abs((F+v*m)/m-t);if(e<bd){bd=e;best=m;}}
    return {q:`Total cost is ${F} + ${v}n dollars for n items. For what n does the average cost per item equal $${t}?`,ans:n,unit:'',abs:0,chk:best,hint:`Set (${F} + ${v}n)/n = ${t} and solve for n.`,
      sol:`${F} + ${v}n = ${t}n gives ${F} = ${d===1?'':d}n, so n = <b>${n}</b>.`};}});
  PROBS.push({id:'md-quad',topic:'models',title:'Predict from a quadratic model',gen(){const a=pick([-2,-1,1,2,3]),b=ri(-5,5),c=ri(-6,6),f=x=>a*x*x+b*x+c,y=[f(0),f(1),f(2)],x=ri(4,7);
    /* a from second difference, b and c from the first two values */
    const A=(y[2]-2*y[1]+y[0])/2,B=y[1]-y[0]-A,ans=A*x*x+B*x+y[0];
    const L=t=>y[0]*(t-1)*(t-2)/2-y[1]*t*(t-2)+y[2]*t*(t-1)/2;
    return {q:`A quadratic model has y = ${sg(y[0])} at x = 0, y = ${sg(y[1])} at x = 1 and y = ${sg(y[2])} at x = 2. What does it predict at x = ${x}?`,ans,unit:'',abs:.001,chk:L(x),hint:'The second difference is 2a. Then use the first difference and the value at 0 to find b and c.',
      sol:`Second difference ${sg(y[2]-2*y[1]+y[0])} = 2a, so a = ${sg(A)}. y(1) − y(0) = a + b gives b = ${sg(B)}; c = ${sg(y[0])}. At x = ${x}: <b>${sg(ans)}</b>. (This is extrapolation, so it assumes the pattern continues.)`};}});
  const SC=[['A taxi charges $3 plus $2.50 per km.','linear'],['The height of a ball thrown straight up, over time.','quadratic'],['The average cost per ticket when a show has a fixed setup cost plus a cost per ticket.','rational'],['A phone plan: $30 up to 5 GB, then $8 for each additional GB.','piecewise'],['A tank drains by 4 liters every minute.','linear'],['The area of a square as its side length grows.','quadratic'],['The average cost per item, with a fixed rent and a per-item cost.','rational']];
  PROBS.push({id:'md-type',topic:'models',title:'Choose the model',gen(){const [s,right]=pick(SC),{choices,ans}=mcq(right,['linear','quadratic','rational','piecewise'].filter(v=>v!==right),4);
    return {q:`${s} Which type of function is the best model?`,choices,ans,hint:'Think about what changes at a constant rate, what is squared, what is divided by the count, and where the rule switches.',sol:`The best model is <b>${right}</b>.`};}});
})();
