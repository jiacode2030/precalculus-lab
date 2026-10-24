/* ---------------- 3.8 The tangent function ---------------- */
(function tangent(){
  const cv=$('#tn-canvas');if(!cv)return;
  let th=1,lay=null;const YM=4;
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.42,280,380):clamp(w*1.35,480,600),draw(ctx,w,h){
    const L=lay=circLayout(w,h);L.R*=.62;const {cx,cy,R}=L,c=Math.cos(th),s=Math.sin(th),px=cx+R*c,py=cy-R*s,vert=Math.abs(c)<.004;
    circBase(ctx,L);
    /* the vertical line x = 1, the extended radius, and the tangent segment, clipped to the circle's area */
    ctx.save();ctx.beginPath();if(L.wide)ctx.rect(0,0,L.gx-24,h);else ctx.rect(0,0,w,L.gy-26);ctx.clip();
    ctx.strokeStyle=alpha(T.muted,.8);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx+R+.5,0);ctx.lineTo(cx+R+.5,h);ctx.stroke();
    if(!vert){const tn=s/c,ty=cy-R*tn;ctx.setLineDash([5,4]);ctx.strokeStyle=alpha(T.hot,.9);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(cx+R,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle=T.hot;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx+R,cy);ctx.lineTo(cx+R,ty);ctx.stroke();dot(ctx,cx+R,ty,5,T.hot,T.surface);
      if(Math.abs(tn)<2.6)label(ctx,'tan θ',cx+R+8,(cy+ty)/2,T.hot,'left','middle',LABEL);}
    else{ctx.setLineDash([5,4]);ctx.strokeStyle=alpha(T.hot,.9);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,h);ctx.stroke();ctx.setLineDash([]);}
    ctx.restore();
    angArc(ctx,cx,cy,R*.22,th);ctx.strokeStyle=T.ink;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
    ctx.strokeStyle=T.ca;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,cy);ctx.stroke();ctx.strokeStyle=T.cx;ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();
    dot(ctx,px,py,7,T.hot,T.surface);
    const P=gpanel(ctx,{x:L.gx,y:L.gy,w:L.gw,h:L.gh},[0,TAU],[-YM,YM],{xn:4,yn:4,xt:false});piTicks(ctx,P,0,TAU);
    vline(ctx,P,Math.PI/2,T.ce,[6,4]);vline(ctx,P,3*Math.PI/2,T.ce,[6,4]);
    curveD(ctx,P,Math.tan,0,TAU,T.cx,2.8,900);vline(ctx,P,th,alpha(T.hot,.55),[1,0]);
    if(!vert){const v=Math.tan(th);if(Math.abs(v)<=YM)dot(ctx,P.X(th),P.Y(v),7,T.hot,T.surface);
      else label(ctx,v>0?'▲ off the top':'▼ off the bottom',P.X(th)+(th<5.6?8:-8),v>0?P.box.y+12:P.box.y+P.box.h-12,T.hot,th<5.6?'left':'right','middle',LABEL);}
    label(ctx,'tan θ',P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);},
    drag(kind,e){if(kind==='up'||!lay)return;const [x,y]=ptr(e,cv),L=lay;const inGraph=L.wide?x>L.gx-10:y>L.gy-20;
      if(inGraph)th=clamp((x-L.gx)/L.gw*TAU,0,TAU);else{let t=Math.atan2(-(y-L.cy),x-L.cx);if(t<0)t+=TAU;th=t;}
      $('#tn-th').value=th;const o=$('#tn-th-out');if(o)o.textContent=lbl(th);upd();}});
  const lbl=v=>`${fmt(v,2)} (${isSpecial(v)?piText(v):Math.round(v*180/Math.PI)+'°'})`;
  function upd(){const c=Math.cos(th),s=Math.sin(th),sp=isSpecial(th),vert=Math.abs(c)<.004;
    setText('tn-sc',`${sp?exactTrig(s):fmt(s,3)} / ${sp?exactTrig(Math.abs(c)<1e-9?0:c):fmt(c,3)}`);
    setText('tn-val',vert?'undefined (cos θ = 0)':sp?exactTrig(s/c):fmt(s/c,3));
    const q=wrap2pi(th);setText('tn-note',vert?'the radius is vertical: a vertical asymptote':Math.abs(Math.cos(th))<.2?'near an asymptote: tan θ is huge':Math.abs(s)<1e-3?'radius on the x-axis: slope 0':s/c>0?'radius slopes up to the right: tan θ > 0':'radius slopes down to the right: tan θ < 0');sim.render();}
  bindRange('tn-th',lbl,v=>{th=v;upd();});

  /* a tan(b(θ + c)) + d */
  let a=1,b=1,c=0,d=0;const G=t=>a*Math.tan(b*(t+c))+d;
  const sim2=glab('tn-canvas2',{h:w=>clamp(w*.5,260,380),view:()=>({xr:[-TAU,TAU],yr:[-6,6],xn:8,yn:6,xt:false}),draw(ctx,P){
    piTicks(ctx,P,-TAU,TAU,Math.PI);curveD(ctx,P,Math.tan,-TAU,TAU,alpha(T.muted,.8),1.5,900,[5,5]);
    const p=Math.PI/b;for(let k=Math.ceil((-TAU+c)/p-.5)-1;k<=Math.floor((TAU+c)/p+.5)+1;k++){const x=(k+.5)*p-c;if(x>-TAU&&x<TAU)vline(ctx,P,x,T.ce,[6,4]);}
    hline(ctx,P,d,alpha(T.ce,.6),[2,4]);curveD(ctx,P,G,-TAU,TAU,T.cx,2.8,1400);
    const x0=-c;dot(ctx,P.X(x0),P.Y(d),6.5,T.hot,T.surface);
    if(x0-p/2>-TAU)line(ctx,P,x0-p/2,-5.5,x0+p/2,-5.5,T.hot,2.6);label(ctx,'one period',P.X(x0),P.Y(-5.5)-10,T.hot,'center','middle',MONO);}});
  function upd2(){const p=Math.PI/b;const pt=v=>{const s=piText(v);return s.includes('π')?s:nz(+v.toFixed(3));};
    setHTML('tn-eq',`f(θ) = ${a===1?'':a===-1?'−':nz(a)} tan(${b===1?'':nz(b)}${Math.abs(c)<.005?'θ':`(θ ${c<0?'−':'+'} ${pt(Math.abs(c))})`})${Math.abs(d)<.05?'':` ${d<0?'−':'+'} ${nz(Math.abs(d))}`}`);
    setText('tn-per',`π/${nz(b)} = ${pt(p)}${pt(p).includes('π')?' ≈ '+fmt(p,3):''}`);
    setText('tn-asy',`θ = ${pt(p/2-c)} + k·${pt(p)}`);setText('tn-cen',`(${pt(-c)}, ${nz(d)})`);sim2.render();}
  bindRange('tn-a',nz,v=>{a=Math.abs(v)<.05?.1*Math.sign(v||1):v;upd2();});bindRange('tn-b',nz,v=>{b=v;upd2();});bindRange('tn-c',nz,v=>{c=v;upd2();});bindRange('tn-d',nz,v=>{d=v;upd2();});
  drawers.tangent=()=>{sim.render();sim2.render();};
  KEYS['tn-canvas']=['Drag the point around the circle or along the graph. The radius, extended, meets the line x = 1 at height tan θ (orange).',[['hot','tan θ, the slope'],['cx','tan θ graph'],['ce','asymptotes']]];
  KEYS['tn-canvas2']=['Move the sliders. Dashed gray is the parent tan θ. The orange dot is the center of a branch; gold lines are the asymptotes.',[['cx','f(θ)'],['ce','asymptotes and the line y = d'],['hot','center, one period']]];
  TIPS['tn-th']=el=>{const t=+el.value,c=Math.cos(t);return Math.abs(c)<.004?'cos θ = 0 here, so tan θ is undefined: the radius is vertical and never meets x = 1.':`tan θ = ${fmt(Math.tan(t),3)}: the slope of the radius.`;};
  TIPS['tn-a']=el=>+el.value<0?'Negative a flips each branch: now it decreases from left to right.':`a = ${nz(+el.value)} stretches each branch vertically.`;
  TIPS['tn-b']=el=>`b = ${nz(+el.value)}: period π/${nz(+el.value)} ≈ ${fmt(Math.PI/+el.value,3)}. The asymptotes squeeze together as b grows.`;
  TIPS['tn-c']=el=>{const v=+el.value;return Math.abs(v)<.005?'No shift.':`The graph slides ${nz(Math.abs(v))} to the ${v>0?'left':'right'}, asymptotes and all.`;};
  TIPS['tn-d']=el=>`d = ${nz(+el.value)}: every branch now passes through its center at height ${nz(+el.value)}.`;
  GLOSS['vertical asymptote']='A vertical line x = a that a graph approaches but never reaches, with the function values growing without bound.';
  TT.tangent='Use a ruler as the radius: students read the slope where it crosses a vertical line one unit to the right.';
  GLYPH.tangent='<path d="M4 21 C9 18, 10 14, 12 12 S15 6, 20 3" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M2 3 V21 M22 3 V21" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
})();

(function(){
  PROBS.push({id:'tn-period',topic:'tangent',title:'Period of a tangent function',gen(){const [b,bt]=pick([[2,'2'],[3,'3'],[4,'4'],[.5,'1/2'],[Math.PI,'π'],[Math.PI/2,'π/2'],[Math.PI/4,'π/4']]),a=ri(2,5),ans=Math.PI/b;
    return {q:`Find the period of f(θ) = ${a} tan(${bt}θ).`,ans,unit:'',tol:.005,chk:TAU/(2*b),show:piText(ans),hint:'The period of tangent is π, not 2π. Divide by |b|.',
      sol:`Period = π ÷ ${bt} = <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'tn-asym',topic:'tangent',title:'First asymptote',gen(){const b=pick([1,2,3,4]),sh=pick([0,Math.PI/6,Math.PI/4,Math.PI/3]),f=t=>Math.cos(b*(t-sh));
    let ans=sh+Math.PI/(2*b);while(ans-Math.PI/b>1e-9)ans-=Math.PI/b;
    const chk=roots(f,1e-6,TAU,4000)[0];
    return {q:`Find the smallest positive θ where y = tan(${b===1?'':b}${sh?`(θ − ${piText(sh)})`:'θ'}) has a vertical asymptote.`,ans,unit:'',abs:.002,chk,show:piText(ans),
      hint:'Tangent is undefined where the inside equals π/2 + kπ.',sol:`Set the inside equal to π/2 + kπ: θ = ${piText(sh+Math.PI/(2*b))} + k·${piText(Math.PI/b)}. The smallest positive value is <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'tn-value',topic:'tangent',title:'Exact tangent values',gen(){const ok=SPECIAL.filter(([t])=>Math.abs(Math.cos(t))>1e-9&&t>0),[t,nm]=pick(ok),ans=Math.tan(t);
    return {q:`Find the exact value of tan(${nm}).`,ans,unit:'',abs:.002,chk:Math.sin(t)/Math.cos(t),show:exactTrig(ans),hint:'tan θ = sin θ / cos θ. Use the reference angle, then the sign for the quadrant.',
      sol:`sin(${nm}) = ${exactTrig(Math.sin(t))} and cos(${nm}) = ${exactTrig(Math.cos(t))}, so tan(${nm}) = <b>${exactTrig(ans)}</b>.`};}});
  PROBS.push({id:'tn-slope',topic:'tangent',title:'Slope from an angle',gen(){const deg=pick([20,35,50,70,110,125,160,200,250,290,340]),t=deg*Math.PI/180,ans=Math.tan(t);
    return {q:`A line through the origin makes an angle of ${deg}° with the positive x-axis (measured counterclockwise). Find its slope, to three decimals.`,ans,unit:'',abs:.002,chk:Math.sin(t)/Math.cos(t),
      hint:'The slope of the line at angle θ is tan θ. Set your calculator to degrees.',sol:`slope = tan ${deg}° ≈ <b>${fmt(ans,3)}</b>.${ans<0?' Negative: the line falls to the right.':''}`};}});
})();
