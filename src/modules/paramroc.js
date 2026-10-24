/* ---------------- 4.3 Parametric rates of change ---------------- */
(function paramroc(){
  const cv=$('#qr-canvas');if(!cv)return;
  const TP=(12+Math.sqrt(163.6))/9.8;
  const PRE={proj:{x:t=>18*t,y:t=>1+12*t-4.9*t*t,T:TP,ab:[0,1],u:'m/s',eq:'x = 18t,  y = 1 + 12t − 4.9t²  (meters, seconds)',bx:[-2,48],by:[-1,10]},
    run:{x:t=>50*Math.cos(Math.PI*t/40),y:t=>50*Math.sin(Math.PI*t/40),T:80,ab:[0,20],u:'m/s',eq:'x = 50 cos(πt/40),  y = 50 sin(πt/40)  (meters, seconds)',bx:[-55,55],by:[-55,55]},
    liss:{x:t=>3*Math.sin(t),y:t=>2*Math.sin(2*t),T:TAU,ab:[0,1],u:'',eq:'x = 3 sin t,  y = 2 sin(2t),  0 ≤ t ≤ 2π',bx:[-3.6,3.6],by:[-2.6,2.6]}};
  let k='proj',a=0,b=1,lay=null,dr=-1;const aEl=$('#qr-a'),bEl=$('#qr-b');
  const pad=(lo,hi)=>[lo-(hi-lo)*.08,hi+(hi-lo)*.08];
  const sim=sim2d(cv,{h:w=>w>=640?clamp(w*.5,320,440):clamp(w*1.55,540,700),draw(ctx,w,h){const L=lay=paLayout(w,h),p=PRE[k];
    const PX=gpanel(ctx,L.X,[0,p.T],pad(...p.bx),{xn:4,yn:3}),PY=gpanel(ctx,L.Y,[0,p.T],pad(...p.by),{xn:4,yn:3});
    label(ctx,'x(t)',L.X.x+6,L.X.y+11,T.ca,'left','middle',LABEL);label(ctx,'y(t)',L.Y.x+6,L.Y.y+11,T.cv,'left','middle',LABEL);
    label(ctx,'t',L.X.x+L.X.w-4,L.X.y+L.X.h-8,T.muted,'right','middle',MONO);label(ctx,'t',L.Y.x+L.Y.w-4,L.Y.y+L.Y.h-8,T.muted,'right','middle',MONO);
    [[PX,p.x,T.ca],[PY,p.y,T.cv]].forEach(([P,f,col])=>{ctx.fillStyle=alpha(T.ce,.1);ctx.fillRect(P.X(Math.min(a,b)),P.box.y,Math.abs(P.X(b)-P.X(a)),P.box.h);
      curveD(ctx,P,f,0,p.T,col,2.6,500);line(ctx,P,a,f(a),b,f(b),T.hot,2.4);dot(ctx,P.X(a),P.Y(f(a)),5.5,T.hot,T.surface);dot(ctx,P.X(b),P.Y(f(b)),5.5,T.hot,T.surface);});
    const P=eqPanel(ctx,L.B,p.bx,p.by);
    pathD(ctx,P,p.x,p.y,0,p.T,alpha(T.cx,.3),2.2);pathD(ctx,P,p.x,p.y,Math.min(a,b),Math.max(a,b),T.cx,3.2);
    [.15,.4,.65,.9].forEach(f=>{const u=f*p.T,e=p.T*1e-3,an=Math.atan2(-(P.Y(p.y(u+e))-P.Y(p.y(u-e))),P.X(p.x(u+e))-P.X(p.x(u-e)));arrowHead(ctx,P.X(p.x(u)),P.Y(p.y(u)),-an,alpha(T.cx,.7));});
    const x1=p.x(a),y1=p.y(a),x2=p.x(b),y2=p.y(b);
    line(ctx,P,x1,y1,x2,y1,T.ca,2,[5,4]);line(ctx,P,x2,y1,x2,y2,T.cv,2,[5,4]);line(ctx,P,x1,y1,x2,y2,T.hot,2.6);
    if(Math.abs(P.X(x2)-P.X(x1))>30)label(ctx,`Δx = ${fmt(x2-x1,2)}`,(P.X(x1)+P.X(x2))/2,P.Y(y1)+(y2>=y1?14:-14),T.ca,'center','middle',MONO);
    if(Math.abs(P.Y(y2)-P.Y(y1))>24)label(ctx,`Δy = ${fmt(y2-y1,2)}`,P.X(x2)+(x2>=x1?6:-6),(P.Y(y1)+P.Y(y2))/2,T.cv,x2>=x1?'left':'right','middle',MONO);
    dot(ctx,P.X(x1),P.Y(y1),7,T.hot,T.surface);dot(ctx,P.X(x2),P.Y(y2),7,T.hot,T.surface);
    label(ctx,'t₁',P.X(x1)-8,P.Y(y1)-10,T.hot,'right','middle',LABEL);label(ctx,'t₂',P.X(x2)+8,P.Y(y2)-10,T.hot,'left','middle',LABEL);},
    drag(kind,e){if(!lay)return;if(kind==='up'){dr=-1;return;}const [px,py]=ptr(e,cv),L=lay,p=PRE[k],inB=(B,m=10)=>px>=B.x-m&&px<=B.x+B.w+m&&py>=B.y-m&&py<=B.y+B.h+m;
      if(inB(L.X)||inB(L.Y)){const B=inB(L.X)?L.X:L.Y,t=clamp((px-B.x)/B.w*p.T,0,p.T);if(kind==='down')dr=Math.abs(t-a)<Math.abs(t-b)?0:1;if(dr===0)a=t;else if(dr===1)b=t;sync();}}});
  const tl=v=>{const s=k==='liss'?piText(v):'';return s.includes('π')?`${fmt(v,2)} (${s})`:fmt(v,2);};
  function sync(){aEl.value=a;bEl.value=b;const oa=$('#qr-a-out'),ob=$('#qr-b-out');if(oa)oa.textContent=tl(a);if(ob)ob.textContent=tl(b);upd();}
  function upd(){const p=PRE[k],dt=b-a,u=p.u?' '+p.u:'';setHTML('qr-eq',p.eq);
    if(Math.abs(dt)<1e-9){setText('qr-dx','— (t₁ = t₂)');setText('qr-dy','—');setText('qr-m','—');sim.render();return;}
    const rx=(p.x(b)-p.x(a))/dt,ry=(p.y(b)-p.y(a))/dt;setText('qr-dx',`${fmt(rx,3)}${u}`);setText('qr-dy',`${fmt(ry,3)}${u}`);
    setText('qr-m',Math.abs(rx)<1e-9?(Math.abs(ry)<1e-9?'undefined (same point at both times)':'undefined (a vertical chord)'):`${fmt(ry,3)} / ${fmt(rx,3)} = ${fmt(ry/rx,3)}`);sim.render();}
  bindRange('qr-a',tl,v=>{a=v;upd();});bindRange('qr-b',tl,v=>{b=v;upd();});
  function setPre(kk){k=kk;const p=PRE[k];[aEl,bEl].forEach(el=>{el.max=p.T;el.step=p.T/1000;});[a,b]=p.ab;sync();}
  segBind('qr-pre','k',setPre);setPre('proj');
  $('#qr-lab').addEventListener('labreset',()=>setPre('proj'));

  /* shrink the interval: the chord from t to t + h turns into the tangent */
  const cv2=$('#qr-canvas2');
  const PRE2={liss:{x:t=>3*Math.sin(t),y:t=>2*Math.sin(2*t),T:TAU,bx:[-3.6,3.6],by:[-2.6,2.6]},circ:{x:t=>2*Math.cos(t),y:t=>2*Math.sin(t),T:TAU,bx:[-2.6,2.6],by:[-2.6,2.6]},
    cyc:{x:t=>t-Math.sin(t),y:t=>1-Math.cos(t),T:4*Math.PI,bx:[-.4,13],by:[-.4,2.6]}};
  let k2='liss',t=.5,hh=1,lay2=null;const tEl=$('#qr-t');
  const der=(f,u)=>{const e=1e-5;return (f(u+e)-f(u-e))/(2*e);};
  /* times where x(t) or y(t) turns: vertical or horizontal tangents */
  const turns=(f,p)=>roots(u=>der(f,u),1e-4,p.T-1e-4,4000);
  const sim2=sim2d(cv2,{h:w=>w>=560?clamp(w*.5,300,420):clamp(w*.95,300,420),draw(ctx,w,h){const p=PRE2[k2],B={x:40,y:12,w:w-54,h:h-40},P=lay2=eqPanel(ctx,B,p.bx,p.by);
    pathD(ctx,P,p.x,p.y,0,p.T,T.cx,2.6,900);
    turns(p.x,p).forEach(u=>{if(Math.abs(der(p.y,u))<.05)return;const X=P.X(p.x(u)),Y=P.Y(p.y(u));ctx.strokeStyle=T.ca;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X,Y-11);ctx.lineTo(X,Y+11);ctx.stroke();});
    turns(p.y,p).forEach(u=>{if(Math.abs(der(p.x,u))<.05)return;const X=P.X(p.x(u)),Y=P.Y(p.y(u));ctx.strokeStyle=T.cv;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X-11,Y);ctx.lineTo(X+11,Y);ctx.stroke();});
    const t2=Math.min(p.T,t+hh),x1=p.x(t),y1=p.y(t),x2=p.x(t2),y2=p.y(t2),vx=der(p.x,t),vy=der(p.y,t),sp=Math.hypot(vx,vy);
    if(sp>1e-3){const s=(p.bx[1]-p.bx[0])*.6/sp;line(ctx,P,x1-vx*s,y1-vy*s,x1+vx*s,y1+vy*s,alpha(T.ce,.95),1.6,[6,4]);}
    line(ctx,P,x1,y1,x2,y1,T.ca,2.2);line(ctx,P,x2,y1,x2,y2,T.cv,2.2);
    const cx=x2-x1,cy=y2-y1,cl=Math.hypot(cx,cy);if(cl>1e-9){const s=(p.bx[1]-p.bx[0])*.35/cl;line(ctx,P,x1-cx*s,y1-cy*s,x2+cx*s,y2+cy*s,alpha(T.hot,.45),1.4);}
    line(ctx,P,x1,y1,x2,y2,T.hot,3);dot(ctx,P.X(x2),P.Y(y2),5,T.hot,T.surface);dot(ctx,P.X(x1),P.Y(y1),7.5,T.hot,T.surface);
    label(ctx,'t',P.X(x1)-9,P.Y(y1)-11,T.hot,'right','middle',LABEL);label(ctx,'t + h',P.X(x2)+9,P.Y(y2)-11,T.hot,'left','middle',LABEL);
    label(ctx,'| vertical tangent',B.x+6,B.y+B.h-30,T.ca,'left','middle',MONO);label(ctx,'— horizontal tangent',B.x+6,B.y+B.h-14,T.cv,'left','middle',MONO);},
    drag(kind,e){if(kind==='up'||!lay2)return;const [px,py]=ptr(e,cv2),p=PRE2[k2],P=lay2;let best=t,bd=1e9;
      for(let i=0;i<=900;i++){const u=p.T*i/900,d=Math.hypot(P.X(p.x(u))-px,P.Y(p.y(u))-py);if(d<bd){bd=d;best=u;}}t=best;tEl.value=t;const o=$('#qr-t-out');if(o)o.textContent=tl2(t);upd2();}});
  const tl2=v=>{const s=piText(v);return s.includes('π')?`${fmt(v,2)} (${s})`:fmt(v,2);};
  function upd2(){const p=PRE2[k2],t2=Math.min(p.T,t+hh),h=t2-t;
    if(h<1e-9){setText('qr-rate','— (at the end)');setText('qr-dir','—');}
    else{const rx=(p.x(t2)-p.x(t))/h,ry=(p.y(t2)-p.y(t))/h;setText('qr-rate',`(${fmt(rx,3)}, ${fmt(ry,3)})`);setText('qr-dir',dirText(rx,ry,1e-6));}
    const vx=der(p.x,t),vy=der(p.y,t),e=.02;
    setText('qr-tan',Math.abs(vx)<e&&Math.abs(vy)<e?'both rates are 0: the point stops (a cusp)':Math.abs(vx)<e?'vertical: x(t) is turning':Math.abs(vy)<e?'horizontal: y(t) is turning':`slope ${fmt(vy/vx,3)} (the chord's slope → this as h → 0)`);sim2.render();}
  bindRange('qr-t',tl2,v=>{t=v;upd2();});bindRange('qr-h',v=>fmt(v,2),v=>{hh=v;upd2();});
  segBind('qr-pre2','k',kk=>{k2=kk;const p=PRE2[k2];tEl.max=p.T;tEl.step=p.T/1000;t=clamp(t,0,p.T);tEl.value=t;const o=$('#qr-t-out');if(o)o.textContent=tl2(t);upd2();});
  $('#qr-lab2').addEventListener('labreset',()=>{k2='liss';tEl.max=TAU;upd2();});
  drawers.paramroc=()=>{sim.render();sim2.render();};
  KEYS['qr-canvas']=['Move t₁ and t₂ with the sliders or by dragging on the x(t) and y(t) graphs. Orange lines are the secants on each graph and the chord on the path.',[['ca','x(t) and Δx'],['cv','y(t) and Δy'],['cx','the path'],['hot','secants and the chord'],['ce','the interval']]];
  KEYS['qr-canvas2']=['Drag the point along the path and shrink h. The orange chord turns into the gold tangent line.',[['cx','the path'],['hot','chord from t to t + h'],['ca','Δx, and vertical tangents'],['cv','Δy, and horizontal tangents'],['ce','tangent line at t']]];
  TIPS['qr-a']=el=>`t₁ = ${fmt(+el.value,2)}.`;TIPS['qr-b']=el=>`t₂ = ${fmt(+el.value,2)}. Swap them and every rate keeps its value: both Δ's change sign.`;
  TIPS['qr-pre:proj']='x(t) is linear, so Δx/Δt is the same on every interval.';TIPS['qr-pre:run']='Constant speed around the track, but x and y change at varying rates.';TIPS['qr-pre:liss']='The path crosses itself at the origin at t = 0 and t = π.';
  TIPS['qr-h']=el=>+el.value<.05?'Tiny h: the chord is practically the tangent.':`h = ${fmt(+el.value,2)}: the chord cuts across the path.`;
  TIPS['qr-pre2:cyc']='At t = 0, 2π and 4π both rates are 0: the pebble stops for an instant and the path has a sharp point.';
  GLOSS['average rate of change of x']='Δx/Δt = (x(t₂) − x(t₁))/(t₂ − t₁): the horizontal distance per unit of time.';
  GLOSS['vertical tangent']='Where the path is momentarily straight up or down: x(t) is turning while y(t) keeps changing.';
  TT.paramroc='Walk a path across the room while two students call out "left/right" and "up/down": the signs of the two rates before any numbers.';
  GLYPH.paramroc='<path d="M3 19 C7 5, 15 3, 21 11" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M6 13 L17 6" stroke="var(--hot)" stroke-width="2"/><path d="M6 13 H17" stroke="var(--ca)" stroke-width="1.5"/><path d="M17 13 V6" stroke="var(--cv)" stroke-width="1.5"/>';
})();

(function(){
  /* quadratics in t: the average rate on [t1, t2] is a(t1 + t2) + b (an independent formula for the checks) */
  const Qd=()=>{let a,b;do{a=ri(-3,3);b=ri(-6,6);}while(!a&&!b);return [a,b,ri(-5,5)];};
  const ev=([a,b,c],t)=>a*t*t+b*t+c,avg=([a,b],t1,t2)=>a*(t1+t2)+b;
  const iv=()=>{const t1=ri(0,3),t2=t1+ri(1,3);return [t1,t2];};
  PROBS.push({id:'qr-avg',topic:'paramroc',title:'Average rate of x(t) or y(t)',gen(){const X=Qd(),Y=Qd(),[t1,t2]=iv(),w=pick(['x','y']),F=w==='x'?X:Y,ans=(ev(F,t2)-ev(F,t1))/(t2-t1);
    return {q:`A particle moves with x(t) = ${polyTxt(X,'t')} and y(t) = ${polyTxt(Y,'t')}. Find the average rate of change of ${w}(t) on [${t1}, ${t2}].`,ans,unit:'',abs:.001,chk:avg(F,t1,t2),show:frac(ans),hint:`(${w}(${t2}) − ${w}(${t1})) / (${t2} − ${t1}).`,
      sol:`${w}(${t1}) = ${ev(F,t1)} and ${w}(${t2}) = ${ev(F,t2)}, so Δ${w}/Δt = (${ev(F,t2)} − ${ev(F,t1)<0?'('+ev(F,t1)+')':ev(F,t1)})/${t2-t1} = <b>${frac(ans)}</b>.`.replace(/-(\d)/g,'−$1')};}});
  PROBS.push({id:'qr-slope',topic:'paramroc',title:'Slope of the path, Δy/Δx',gen(){let X,Y,t1,t2;do{X=Qd();Y=Qd();[t1,t2]=iv();}while(ev(X,t2)===ev(X,t1));
    const dx=ev(X,t2)-ev(X,t1),dy=ev(Y,t2)-ev(Y,t1),ans=dy/dx;
    return {q:`x(t) = ${polyTxt(X,'t')}, y(t) = ${polyTxt(Y,'t')}. Find the average rate of change of y with respect to x for ${t1} ≤ t ≤ ${t2}.`,ans,unit:'',abs:.001,chk:avg(Y,t1,t2)/avg(X,t1,t2),show:frac(ans),hint:'Δy/Δx = (Δy/Δt) ÷ (Δx/Δt), or just Δy ÷ Δx between the two points.',
      sol:`Points: (${ev(X,t1)}, ${ev(Y,t1)}) and (${ev(X,t2)}, ${ev(Y,t2)}). Δy/Δx = ${dy}/${dx<0?'('+dx+')':dx} = <b>${frac(ans)}</b>.`.replace(/-(\d)/g,'−$1')};}});
  PROBS.push({id:'qr-dir',topic:'paramroc',title:'Which way is it moving?',gen(){let X,Y,t1,t2;do{X=Qd();Y=Qd();[t1,t2]=iv();}while(ev(X,t2)===ev(X,t1)||ev(Y,t2)===ev(Y,t1));
    const dx=ev(X,t2)-ev(X,t1),dy=ev(Y,t2)-ev(Y,t1),right=`${dy>0?'up':'down'} and ${dx>0?'right':'left'}`;
    const {choices,ans}=mcq(right,['up and right','up and left','down and right','down and left'].filter(s=>s!==right),4);
    return {q:`x(t) = ${polyTxt(X,'t')}, y(t) = ${polyTxt(Y,'t')}. Overall, from t = ${t1} to t = ${t2}, the particle's position changes in which direction?`,choices,ans,hint:'Find the sign of Δx and of Δy over the interval.',
      sol:`Δx = ${dx} (${dx>0?'right':'left'}) and Δy = ${dy} (${dy>0?'up':'down'}): <b>${right}</b>.`.replace(/-(\d)/g,'−$1')};}});
})();
