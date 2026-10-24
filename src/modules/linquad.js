/* ---------------- 1.3 Linear vs quadratic change ---------------- */
(function linquad(){
  const cv=$('#lq-canvas');if(!cv)return;
  let a=.5,b=-1,hs=1;const F=x=>a*x*x+b*x+1;
  const xs=()=>{const o=[];for(let x=0;x<=6+1e-9;x+=hs)o.push(+x.toFixed(6));return o;};
  const sim=sim2d(cv,{h:w=>clamp(w*.62,360,480),draw(ctx,w,h){const X=xs(),Y=X.map(F),D=Y.slice(1).map((y,i)=>y-Y[i]);
    let lo=Math.min(0,...Y),hi=Math.max(1,...Y);const pd=(hi-lo)*.1+.5;lo-=pd;hi+=pd;
    const gh=(h-40)*.62,P=gpanel(ctx,{x:46,y:12,w:w-60,h:gh},[-.3,6.3],[lo,hi],{xn:6,yn:4});
    curveD(ctx,P,F,-.3,6.3,alpha(T.cx,.9),2.4,400);
    D.forEach((d,i)=>{line(ctx,P,X[i],Y[i],X[i+1],Y[i],alpha(T.ca,.8),1.4,[3,3]);line(ctx,P,X[i+1],Y[i],X[i+1],Y[i+1],T.hot,3.2);});
    X.forEach((x,i)=>dot(ctx,P.X(x),P.Y(Y[i]),5,T.cx,T.surface));
    label(ctx,`f(x) = ${polyTxt([+a.toFixed(2),+b.toFixed(2),1])}`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);
    /* the rises as bars */
    const m=Math.max(1,...D.map(Math.abs))*1.25,B={x:46,y:12+gh+28,w:w-60,h:h-gh-58},Q=gpanel(ctx,B,[-.3,6.3],[Math.min(0,...D)<0?-m:-m*.15,Math.max(0,...D)>0?m:m*.15],{xn:6,yn:2});
    const bw=Math.max(4,(Q.X(hs)-Q.X(0))*.55);
    D.forEach((d,i)=>{const xm=(X[i]+X[i+1])/2,x0=Q.X(xm)-bw/2,y0=Q.Y(0),y1=Q.Y(d);ctx.fillStyle=alpha(T.hot,.75);ctx.fillRect(x0,Math.min(y0,y1),bw,Math.abs(y1-y0));
      if(D.length<=12)label(ctx,fmt(d,2),Q.X(xm),y1+(d>=0?-9:9),T.hot,'center','middle','600 10px "IBM Plex Mono",monospace');});
    if(D.length>1)line(ctx,Q,(X[0]+X[1])/2,D[0],(X[D.length-1]+X[D.length])/2,D[D.length-1],alpha(T.ce,.9),1.4,[5,4]);
    label(ctx,'Δy for each step',B.x+6,B.y+10,T.hot,'left','middle',MONO);}});
  function upd(){const X=xs(),Y=X.map(F),D=Y.slice(1).map((y,i)=>y-Y[i]),D2=D.slice(1).map((d,i)=>d-D[i]),show=v=>v.slice(0,7).map(d=>fmt(d,2)).join(', ')+(v.length>7?', …':'');
    setText('lq-d1',show(D));setText('lq-d2',D2.length?show(D2):'—');
    const s=2*a*hs*hs;setText('lq-kind',Math.abs(a)<1e-9?'linear: the same rise every step':`quadratic: each rise ${a>0?'grows':'shrinks'} by |2ah²| = ${fmt(Math.abs(s),2)}, concave ${a>0?'up':'down'}`);sim.render();}
  bindRange('lq-a',v=>fmt(v,1),v=>{a=Math.abs(v)<1e-9?0:v;upd();});bindRange('lq-b',v=>fmt(v,1),v=>{b=v;upd();});bindRange('lq-h',v=>fmt(v,1),v=>{hs=v;upd();});

  /* average rates on each interval, plotted against the interval's midpoint */
  const DATA={fall:{f:t=>4.9*t*t,u:'m/s',yl:'fallen (m)',xl:'t (s)',yr:[-4,84]},brake:{f:t=>20*t-2.5*t*t,u:'m/s',yl:'distance (m)',xl:'t (s)',yr:[-3,44]},taxi:{f:x=>3+2.5*x,u:'$/km',yl:'fare ($)',xl:'distance (km)',yr:[0,14]}};
  let dk='fall',k=2;
  const sim2=sim2d($('#lq-canvas2'),{h:w=>clamp(w*.62,360,480),draw(ctx,w,h){const D=DATA[dk],V=[0,1,2,3,4].map(D.f),R=V.slice(1).map((v,i)=>v-V[i]);
    const gh=(h-40)*.55,P=gpanel(ctx,{x:46,y:12,w:w-60,h:gh},[-.2,4.3],D.yr,{xn:4,yn:4});
    curveD(ctx,P,D.f,0,4,alpha(T.cx,.85),2.4,300);
    line(ctx,P,k-1,V[k-1],k,V[k],T.hot,3.2);V.forEach((v,i)=>dot(ctx,P.X(i),P.Y(v),5.5,T.cx,T.surface));
    label(ctx,D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl,P.box.x+14,P.box.y+11,T.muted,'left','middle',MONO);
    const lo=Math.min(0,...R),hi=Math.max(...R),pd=(hi-lo)*.2+2,Q=gpanel(ctx,{x:46,y:12+gh+28,w:w-60,h:h-gh-58},[-.2,4.3],[lo-pd,hi+pd],{xn:4,yn:3});
    line(ctx,Q,.5,R[0],3.5,R[3],alpha(T.ce,.95),1.6,[6,4]);
    R.forEach((r,i)=>{dot(ctx,Q.X(i+.5),Q.Y(r),i===k-1?7:5,T.hot,T.surface);label(ctx,fmt(r,1),Q.X(i+.5),Q.Y(r)-13,T.hot,'center','middle','600 10px "IBM Plex Mono",monospace');});
    label(ctx,`average rate (${D.u}) on each interval`,Q.box.x+6,Q.box.y+10,T.hot,'left','middle',MONO);}});
  function upd2(){const D=DATA[dk],V=[0,1,2,3,4].map(D.f),R=V.slice(1).map((v,i)=>v-V[i]),RR=R.slice(1).map((r,i)=>r-R[i]);
    setText('lq-r',R.map(r=>fmt(r,1)).join(', ')+' '+D.u);setText('lq-rr',RR.map(r=>fmt(r,1)).join(', '));
    const c=RR[0];setText('lq-cc',Math.abs(c)<1e-9?'constant rate: linear':`rates change by ${fmt(c,1)} each step: quadratic, concave ${c>0?'up':'down'}`);sim2.render();}
  bindRange('lq-k',v=>`[${v-1}, ${v}]`,v=>{k=v;upd2();});segBind('lq-data','k',kk=>{dk=kk;upd2();});
  drawers.linquad=()=>{sim.render();sim2.render();};
  KEYS['lq-canvas']=['Change a, b and the step h. Orange: the rise over each step, repeated as bars below. Equal bars mean linear; bars that grow by equal amounts mean quadratic.',[['cx','f(x)'],['hot','rise Δy on each step'],['ca','the step h'],['ce','trend of the rises']]];
  KEYS['lq-canvas2']=['Pick a data set. Bottom: the average rate on each interval, at its midpoint. A straight line of rates means quadratic data; a flat line means linear.',[['cx','the data'],['hot','average rates'],['ce','line through the rates']]];
  TIPS['lq-a']=el=>+el.value===0?'a = 0: a linear function.':`a = ${el.value}: the rises change by 2ah² each step.`;TIPS['lq-b']=el=>`b shifts every rise by the same amount (b·h); it never changes the second differences.`;
  TIPS['lq-h']=el=>`Step ${el.value}: second difference 2ah² = ${fmt(2*a*(+el.value)**2,2)}.`;
  TIPS['lq-data:brake']='The car slows down: each second it covers 5 m less than the second before.';TIPS['lq-data:taxi']='Every km costs the same: linear.';
  GLOSS['second difference']='The change between consecutive first differences; constant for a quadratic when the x-steps are equal.';
  TT.linquad='Have students build difference tables by hand for one linear and one quadratic table before the slider: the pattern is the point.';
  GLYPH.linquad='<path d="M4 20 V16 M9 20 V13 M14 20 V9 M19 20 V4" stroke="var(--hot)" stroke-width="3"/>';
})();

(function(){
  const sg=v=>String(+v.toFixed(3)).replace('-','−');
  PROBS.push({id:'lq-type',topic:'linquad',title:'Linear, quadratic or neither?',gen(){const kind=pick(['lin','quad','cub','exp']),m=ri(-4,4)||2,c=ri(-5,5),a=pick([-3,-2,-1,1,2,3]);
    const f=kind==='lin'?x=>m*x+c:kind==='quad'?x=>a*x*x+m*x+c:kind==='cub'?x=>x**3+c:x=>3*2**x;const xs=[0,1,2,3,4],ys=xs.map(f);
    const d1=ys.slice(1).map((y,i)=>y-ys[i]),d2=d1.slice(1).map((d,i)=>d-d1[i]),right=d1.every(d=>d===d1[0])?'linear':d2.every(d=>d===d2[0])?'quadratic':'neither';
    const {choices,ans}=mcq(right,['linear','quadratic','neither'].filter(s=>s!==right),3);
    return {q:`x: 0, 1, 2, 3, 4. y: ${ys.map(y=>String(y).replace('-','−')).join(', ')}. Are these data linear, quadratic or neither?`,choices,ans,hint:'Take first differences, then second differences.',
      sol:`First differences ${d1.join(', ')}; second differences ${d2.join(', ')}. So <b>${right}</b>.`.replace(/-(\d)/g,'−$1')};}});
  PROBS.push({id:'lq-next',topic:'linquad',title:'Continue a quadratic table',gen(){const a=pick([-2,-1,1,2,3]),b=ri(-4,4),c=ri(-5,5),f=x=>a*x*x+b*x+c,ys=[0,1,2,3].map(f);
    const d1=[ys[1]-ys[0],ys[2]-ys[1],ys[3]-ys[2]],d2=d1[1]-d1[0],ans=ys[3]+d1[2]+d2;
    return {q:`A quadratic function has f(0) = ${ys[0]}, f(1) = ${ys[1]}, f(2) = ${ys[2]}, f(3) = ${ys[3]}. Find f(4) without finding the formula.`.replace(/-(\d)/g,'−$1'),ans,unit:'',abs:0,chk:f(4),hint:'The second differences are constant: extend them one step.',
      sol:`First differences ${d1.join(', ')}; second difference ${d2}. The next first difference is ${d1[2]} + ${d2} = ${d1[2]+d2}, so f(4) = ${ys[3]} + ${d1[2]+d2} = <b>${ans}</b>.`.replace(/-(\d)/g,'−$1').replace(/\+ −/g,'− ')};}});
  PROBS.push({id:'lq-a',topic:'linquad',title:'Find a from second differences',gen(){const h=pick([.5,1,2]),a=pick([-3,-2,-1,-.5,.5,1,2,3]),b=ri(-3,3),c=ri(-4,4),xs=[0,1,2,3].map(i=>i*h),ys=xs.map(x=>a*x*x+b*x+c);
    const d1=ys.slice(1).map((y,i)=>y-ys[i]),d2=d1[1]-d1[0],ans=d2/(2*h*h);
    return {q:`f is quadratic. x: ${xs.map(x=>fmt(x,1)).join(', ')}. f(x): ${ys.map(y=>sg(y)).join(', ')}. Find the coefficient a of x².`,ans,unit:'',abs:.001,chk:a,show:fmt(ans,2),hint:`With equal steps h, the second difference is 2ah². Here h = ${h}.`,
      sol:`First differences ${d1.map(sg).join(', ')}; second difference ${sg(d2)}. 2a(${h})² = ${sg(d2)}, so a = ${sg(d2)}/${fmt(2*h*h,2)} = <b>${fmt(ans,2)}</b>.`};}});
})();
