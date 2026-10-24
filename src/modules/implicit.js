/* ---------------- 4.5, 4.7 Implicitly defined functions ---------------- */
(function implicit(){
  const cv=$('#im-canvas');if(!cv)return;
  const w=v=>v<0?`(${v})`:`${v}`;
  let RT=-3;{let lo=-3,hi=-1;for(let i=0;i<80;i++){const m=(lo+hi)/2;if(m**3-3*m+3<0)lo=m;else hi=m;}RT=(lo+hi)/2;}
  const CU={
    circ:{L:(x,y)=>x*x+y*y,R:()=>25,sL:(p,q)=>`${w(p)}² + ${w(q)}²`,sR:()=>'25',dom:[[-5,5]],br:[x=>Math.sqrt(25-x*x),x=>-Math.sqrt(25-x*x)],ok:[[3,4],[-4,3],[0,-5],[5,0],[-3,-4]]},
    ell:{L:(x,y)=>x*x/16+y*y/9,R:()=>1,sL:(p,q)=>`${w(p)}²/16 + ${w(q)}²/9`,sR:()=>'1',dom:[[-4,4]],br:[x=>3*Math.sqrt(1-x*x/16),x=>-3*Math.sqrt(1-x*x/16)],ok:[[0,3],[4,0],[-4,0],[2.4,2.4],[-2.4,-2.4]]},
    hyp:{L:(x,y)=>x*x-y*y,R:()=>4,sL:(p,q)=>`${w(p)}² − ${w(q)}²`,sR:()=>'4',dom:[[-99,-2],[2,99]],br:[x=>Math.sqrt(x*x-4),x=>-Math.sqrt(x*x-4)],ok:[[2,0],[-2,0],[2.5,1.5],[-2.5,1.5],[2.5,-1.5]]},
    rec:{L:(x,y)=>x*y,R:()=>4,sL:(p,q)=>`${w(p)} · ${w(q)}`,sR:()=>'4',dom:[[-99,99]],br:[x=>x>0?4/x:NaN,x=>x<0?4/x:NaN],ok:[[2,2],[1,4],[4,1],[-2,-2],[-4,-1]]},
    cub:{L:(x,y)=>y*y,R:x=>x**3-3*x+3,sL:(p,q)=>`${w(q)}²`,sR:p=>`${w(p)}³ − 3(${w(p)}) + 3`,dom:[[RT,99]],br:[x=>Math.sqrt(x**3-3*x+3),x=>-Math.sqrt(x**3-3*x+3)],ok:[[1,1],[1,-1],[-2,1],[-2,-1]]}};
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  const view=(wd,h)=>{const r=(wd-60)/(h-36);return {xr:[-7*r,7*r],yr:[-7,7],xn:8,yn:7};};
  const drawCurve=(ctx,P,C)=>C.dom.forEach(([a,b])=>{const lo=Math.max(a,P.xr[0]),hi=Math.min(b,P.xr[1]);curveD(ctx,P,C.br[0],lo,hi,T.cx,3.2,900);curveD(ctx,P,C.br[1],lo,hi,T.cv,3.2,900);});
  let ck='circ',xs=3;
  const sim=glab('im-canvas',{h:wd=>clamp(wd*.62,320,460),view,draw(ctx,P){const C=CU[ck];drawCurve(ctx,P,C);
    line(ctx,P,xs,-7,xs,7,alpha(T.hot,.7),1.6,[5,4]);C.br.forEach(f=>{const y=f(xs);if(isFinite(y))dot(ctx,P.X(xs),P.Y(y),6.5,T.hot,T.surface);});}});
  function upd(){const C=CU[ck],ys=[];C.br.forEach(f=>{const y=f(xs);if(isFinite(y)&&!ys.some(v=>Math.abs(v-y)<1e-9))ys.push(y);});
    setText('im-pts',ys.length?ys.map(y=>`(${f2(xs)}, ${f2(y)})`).join(' and '):'none');setText('im-n',String(ys.length));
    setText('im-fn',ys.length>1?'one x has two y-values, so y is not a function of x here':ys.length===1?'exactly one y-value here (a function would have one for every x)':'the line misses the curve: x is outside the domain of the curve');sim.render();}
  bindRange('im-x',f2,v=>{xs=v;upd();});segBind('im-set','k',k=>{ck=k;upd();});

  /* is the point on the curve? */
  let k2='circ',px=3,py=3;
  const sim2=glab('im-canvas2',{h:wd=>clamp(wd*.62,320,460),view,draw(ctx,P){const C=CU[k2];drawCurve(ctx,P,C);const L=C.L(px,py),R=C.R(px),on=Math.abs(L-R)<.06;
    line(ctx,P,px,0,px,py,alpha(T.hot,.5),1.2,[4,3]);line(ctx,P,0,py,px,py,alpha(T.hot,.5),1.2,[4,3]);dot(ctx,P.X(px),P.Y(py),7.5,on?T.ca:T.hot,T.surface);
    label(ctx,`(${f2(px)}, ${f2(py)})`,P.X(px)+10,P.Y(py)-12,on?T.ca:T.hot,'left','middle',MONO);}});
  function upd2(){const C=CU[k2],L=C.L(px,py),R=C.R(px),d=L-R,on=Math.abs(d)<.06;
    setText('im-sub',`${C.sL(f2(px),f2(py)).replace(/\((-?[\d.]+)\)/g,'($1)')} = ${f2(L)}  (right side: ${C.sR(f2(px))} = ${f2(R)})`);
    setText('im-cmp',on?`${f2(L)} = ${f2(R)}`:`${f2(L)} ${L<R?'<':'>'} ${f2(R)}`);setText('im-ver',on?'on the curve':'not on the curve');sim2.render();}
  bindRange('im-px',f2,v=>{px=v;upd2();});bindRange('im-py',f2,v=>{py=v;upd2();});
  let ti=0;$('#im-try').addEventListener('click',()=>{const o=CU[k2].ok[ti++%CU[k2].ok.length];set('im-px',o[0]);set('im-py',o[1]);});
  segBind('im-set2','k',k=>{k2=k;ti=0;upd2();});
  drawers.implicit=()=>{sim.render();sim2.render();};
  KEYS['im-canvas']=['Blue: one branch (upper or right). Green: the other branch. Orange: the vertical line and the points where it meets the curve.',[['cx','branch 1'],['cv','branch 2'],['hot','your line']]];
  KEYS['im-canvas2']=['Blue and green: the two branches of the curve. The orange point turns magenta when its coordinates satisfy the equation.',[['cx','branch 1'],['cv','branch 2'],['hot','your point'],['ca','on the curve']]];
  TIPS['im-x']=el=>`x = ${el.value}: look at how many points are on the dashed line.`;
  GLOSS['implicit']='A curve defined by an equation in x and y rather than by y = f(x).';
  TT.implicit='Ask: how many y-values for x = 3? Then connect the ± from solving for y with the two halves of the picture.';
  GLYPH.implicit='<circle cx="12" cy="12" r="8" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M17 3 V21" stroke="var(--hot)" stroke-width="1.6" stroke-dasharray="3 2"/><circle cx="17" cy="7.4" r="1.8" fill="var(--hot)"/><circle cx="17" cy="16.6" r="1.8" fill="var(--hot)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  PROBS.push({id:'im-y',topic:'implicit',title:'Solve for y',gen(){const A=pick([1,2,4,9]),B=pick([1,4,9]),C=ri(30,90),x=ri(1,4),rest=C-A*x*x;if(rest<=0)return this.gen();const ans=Math.sqrt(rest/B);
    let lo=0,hi=1e3;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(A*x*x+B*m*m<C)lo=m;else hi=m;}
    return {q:`On the curve ${A===1?'':A}x² + ${B===1?'':B}y² = ${C}, find the positive y-value when x = ${x}. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:(lo+hi)/2,show:ans.toFixed(2),hint:'Substitute x, subtract, divide by the coefficient of y², then take the positive square root.',sol:`${A*x*x} + ${B===1?'':B}y² = ${C}, so ${B===1?'':B}y² = ${rest} and y² = ${sg(+(rest/B).toFixed(4))}. Then y = √${sg(+(rest/B).toFixed(4))} ≈ <b>${ans.toFixed(2)}</b> (or its negative).`};}});
  PROBS.push({id:'im-count',topic:'implicit',title:'How many points at this x?',gen(){const r=pick([3,4,5,6,8,10]),x=pick([-r,r,0,ri(1,r-1),r+ri(1,3),-(r+2)]),n=Math.abs(x)>r?0:Math.abs(x)===r?1:2,{choices,ans}=mcq(String(n),['0','1','2','3'].filter(v=>v!==String(n)),4);
    return {q:`How many points of the circle x² + y² = ${r*r} have x = ${x}?`,choices,ans,hint:'Substitute x and solve for y². Two points if y² > 0, one if y² = 0, none if y² < 0.',sol:`y² = ${r*r} − ${x*x} = ${r*r-x*x}, so ${n===2?'y = ±√'+(r*r-x*x)+': <b>two points</b>':n===1?'y = 0: <b>one point</b>':'y² is negative: <b>no points</b>'}.`};}});
  PROBS.push({id:'im-on',topic:'implicit',title:'Is the point on the curve?',gen(){const A=pick([1,2,3]),B=pick([1,2,5]),p=ri(1,4),q=ri(1,4),C=A*p*p+B*q*q,onIt=Math.random()<.5,[u,v]=onIt?[p,q]:[p+pick([-1,1]),q+pick([0,1])],val=A*u*u+B*v*v,right=val===C?'yes':'no',{choices,ans}=mcq(right,['yes','no'].filter(t=>t!==right),2);
    return {q:`Is the point (${u}, ${v}) on the curve ${A===1?'':A}x² + ${B===1?'':B}y² = ${C}?`,choices,ans,hint:'Substitute both coordinates into the left side and compare with the right side.',sol:`${A}(${u})² + ${B}(${v})² = ${A*u*u} + ${B*v*v} = ${val}, and the right side is ${C}: <b>${right==='yes'?'equal, so yes, it is on the curve':'not equal, so no'}</b>.`};}});
  PROBS.push({id:'im-hyp',topic:'implicit',title:'y on xy = k',gen(){const k=ri(2,24),x=pick([1,2,3,4,5,6,8,-2,-3,-4,-6]),ans=k/x;
    return {q:`A curve is xy = ${k}. Find y when x = ${x}. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:Math.exp(Math.log(k)-Math.log(Math.abs(x)))*(x<0?-1:1),show:ans.toFixed(2),hint:'Divide both sides by x.',sol:`y = ${k}/${w(x)} ≈ <b>${ans.toFixed(2)}</b>.`};
    function w(v){return v<0?'('+sg(v)+')':String(v);}}});
  PROBS.push({id:'im-int',topic:'implicit',title:'Where a horizontal line meets a circle',gen(){const r=pick([5,10,13,17,25]),c=pick([3,4,5,6,7,8,12].filter(v=>v<r)),ans=Math.sqrt(r*r-c*c);let lo=0,hi=100;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(m*m+c*c<r*r)lo=m;else hi=m;}
    return {q:`The line y = ${c} meets the circle x² + y² = ${r*r}. Find the positive x-coordinate of an intersection point. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:(lo+hi)/2,show:ans.toFixed(2),hint:'Substitute y = '+c+' into the circle and solve for x².',sol:`x² + ${c*c} = ${r*r}, so x² = ${r*r-c*c} and x = √${r*r-c*c} ≈ <b>${ans.toFixed(2)}</b> (the other point has x = −${ans.toFixed(2)}).`};}});
})();
