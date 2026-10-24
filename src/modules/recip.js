/* ---------------- 3.11 Secant, cosecant and cotangent ---------------- */
(function recip(){
  const cv=$('#rc-canvas');if(!cv)return;
  let th=.8,fn='sec',lay=null;const YM=4;
  const REC={sec:{f:t=>1/Math.cos(t),p:Math.cos,pn:'cos θ',col:()=>T.ca,zero:t=>Math.abs(Math.cos(t))<.004},csc:{f:t=>1/Math.sin(t),p:Math.sin,pn:'sin θ',col:()=>T.cx,zero:t=>Math.abs(Math.sin(t))<.004},
    cot:{f:t=>Math.cos(t)/Math.sin(t),p:Math.tan,pn:'tan θ',col:()=>T.hot,zero:t=>Math.abs(Math.sin(t))<.004}};
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.42,280,380):clamp(w*1.35,480,600),draw(ctx,w,h){
    const L=lay=circLayout(w,h);L.R*=.56;const {cx,cy,R}=L,c=Math.cos(th),s=Math.sin(th),px=cx+R*c,py=cy-R*s;circBase(ctx,L,false);
    ctx.save();ctx.beginPath();if(L.wide)ctx.rect(0,0,L.gx-24,h);else ctx.rect(0,0,w,L.gy-26);ctx.clip();
    /* the two tangent lines x = 1 and y = 1 */
    ctx.strokeStyle=alpha(T.muted,.7);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx+R+.5,0);ctx.lineTo(cx+R+.5,h);ctx.moveTo(0,cy-R+.5);ctx.lineTo(w,cy-R+.5);ctx.stroke();
    const seg=(x1,y1,x2,y2,col,wd,on)=>{ctx.strokeStyle=on?col:alpha(col,.35);ctx.lineWidth=on?wd+1.5:wd;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
    if(Math.abs(c)>.01){const ty=cy-R*s/c;seg(cx+R,cy,cx+R,ty,T.hot,2.5,false);seg(cx,cy,cx+R,ty,T.ca,2.5,fn==='sec');
      if(fn==='sec'&&Math.abs(s/c)<3)label(ctx,`sec θ = ${fmt(1/c,2)}`,cx+R+8,ty+(s/c>0?-10:10),T.ca,'left','middle',LABEL);}
    if(Math.abs(s)>.01){const tx=cx+R*c/s;seg(cx,cy-R,tx,cy-R,T.cv,2.5,fn==='cot');seg(cx,cy,tx,cy-R,T.cx,2.5,fn==='csc');
      if(fn==='csc'&&Math.abs(c/s)<3)label(ctx,`csc θ = ${fmt(1/s,2)}`,tx+(c/s>0?6:-6),cy-R-12,T.cx,c/s>0?'left':'right','middle',LABEL);
      if(fn==='cot'&&Math.abs(c/s)<3)label(ctx,`cot θ = ${fmt(c/s,2)}`,(cx+tx)/2,cy-R-12,T.cv,'center','middle',LABEL);}
    ctx.restore();
    angArc(ctx,cx,cy,R*.25,th);ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();dot(ctx,px,py,6.5,T.hot,T.surface);
    const F=REC[fn],P=gpanel(ctx,{x:L.gx,y:L.gy,w:L.gw,h:L.gh},[0,TAU],[-YM,YM],{xn:4,yn:4,xt:false});piTicks(ctx,P,0,TAU);
    for(let k=0;k<=4;k++){const x=k*Math.PI/2;if(F.zero(x)&&x>0&&x<TAU)vline(ctx,P,x,T.ce,[6,4]);}
    hline(ctx,P,1,alpha(T.muted,.5),[2,4]);hline(ctx,P,-1,alpha(T.muted,.5),[2,4]);
    curveD(ctx,P,F.p,0,TAU,alpha(T.muted,.9),1.6,900,[5,5]);curveD(ctx,P,F.f,0,TAU,F.col()===T.hot?T.cv:F.col(),2.8,1600);
    vline(ctx,P,th,alpha(T.hot,.55),[1,0]);const v=F.f(th);if(isFinite(v)&&Math.abs(v)<=YM)dot(ctx,P.X(th),P.Y(v),7,T.hot,T.surface);
    label(ctx,`${fn} θ`,P.box.x+8,P.box.y+12,F.col()===T.hot?T.cv:F.col(),'left','middle',LABEL);label(ctx,`dashed: ${F.pn}`,P.box.x+60,P.box.y+12,T.muted,'left','middle',MONO);},
    drag(kind,e){if(kind==='up'||!lay)return;const [x,y]=ptr(e,cv),L=lay;const inGraph=L.wide?x>L.gx-10:y>L.gy-20;
      if(inGraph)th=clamp((x-L.gx)/L.gw*TAU,0,TAU);else{let t=Math.atan2(-(y-L.cy),x-L.cx);if(t<0)t+=TAU;th=t;}
      $('#rc-th').value=th;const o=$('#rc-th-out');if(o)o.textContent=lbl(th);upd();}});
  const lbl=v=>`${fmt(v,2)} (${isSpecial(v)?piText(v):Math.round(v*180/Math.PI)+'°'})`;
  const ex=(v,sp)=>!isFinite(v)||Math.abs(v)>1e9?'undefined (÷ 0)':sp?exactTrig(v):fmt(v,3);
  function upd(){const c=Math.cos(th),s=Math.sin(th),sp=isSpecial(th),z=v=>Math.abs(v)<1e-9?0:v;
    setText('rc-six',`${ex(z(s),sp)} · ${ex(z(c),sp)} · ${Math.abs(c)<1e-9?'undefined (÷ 0)':ex(z(s)/c,sp)}`);
    setText('rc-rec',`${Math.abs(s)<1e-9?'undefined (÷ 0)':ex(1/s,sp)} · ${Math.abs(c)<1e-9?'undefined (÷ 0)':ex(1/c,sp)} · ${Math.abs(s)<1e-9?'undefined (÷ 0)':ex(z(c)/s,sp)}`);
    const F=REC[fn],pv=F.p(th);setText('rc-note',F.zero(th)?`${F.pn} = 0 here, so ${fn} θ is undefined: an asymptote`:Math.abs(Math.abs(fn==='cot'?1/pv:pv)-1)<.01&&fn!=='cot'?`${F.pn} = ±1, so ${fn} θ = ±1: the turning point of a U`:`${fn} θ = 1/(${fmt(pv,3)}) = ${fmt(1/pv,3)}`);sim.render();}
  bindRange('rc-th',lbl,v=>{th=v;upd();});segBind('rc-fn','k',k=>{fn=k;upd();});

  /* reciprocal of a sin(bθ) */
  let a=1,b=1;const W=t=>a*Math.sin(b*t),Rf=t=>1/W(t);
  const sim2=glab('rc-canvas2',{h:w=>clamp(w*.42,240,320),view:()=>({xr:[0,TAU],yr:[-5,5],xn:4,yn:5,xt:false}),draw(ctx,P){piTicks(ctx,P,0,TAU);
    for(let k=0;k*Math.PI/b<=TAU+1e-9;k++)vline(ctx,P,k*Math.PI/b,T.ce,[6,4]);
    curveD(ctx,P,W,0,TAU,alpha(T.cx,.8),1.8,900,[5,5]);curveD(ctx,P,Rf,0,TAU,T.cv,2.8,2000);
    hline(ctx,P,1/a,alpha(T.hot,.7),[2,3]);hline(ctx,P,-1/a,alpha(T.hot,.7),[2,3]);label(ctx,`±1/${nz(a)}`,P.box.x+P.box.w-4,P.Y(1/a)-8,T.hot,'right','middle',MONO);}});
  function upd2(){setText('rc-min',`1/${nz(a)} = ${fmt(1/a,3)}`);setText('rc-asy',`θ = k·${piText(Math.PI/b).includes('π')?piText(Math.PI/b):fmt(Math.PI/b,3)} (where ${nz(a)} sin(${nz(b)}θ) = 0)`);sim2.render();}
  bindRange('rc-a',nz,v=>{a=v;upd2();});bindRange('rc-b',nz,v=>{b=v;upd2();});
  drawers.recip=()=>{sim.render();sim2.render();};
  KEYS['rc-canvas']=['Drag the point. On the circle: tan θ on the line x = 1 (orange), sec θ from the origin to it, cot θ along y = 1 (green), csc θ from the origin to that point.',[['ca','sec θ'],['cx','csc θ'],['cv','cot θ'],['hot','tan θ'],['ce','asymptotes']]];
  KEYS['rc-canvas2']=['Change a and b. Dashed blue is a sin(bθ); green is its reciprocal. Gold lines are where the wave is 0.',[['cx','a sin(bθ)'],['cv','1 / (a sin(bθ))'],['ce','asymptotes'],['hot','±1/a']]];
  TIPS['rc-th']=el=>{const t=+el.value;return `θ = ${fmt(t,2)}: cos θ = ${fmt(Math.cos(t),3)}, so sec θ = ${Math.abs(Math.cos(t))<.004?'undefined (÷ 0)':fmt(1/Math.cos(t),3)}.`;};
  TIPS['rc-fn:sec']='sec θ = 1/cos θ: asymptotes where cos θ = 0 (π/2, 3π/2).';TIPS['rc-fn:csc']='csc θ = 1/sin θ: asymptotes where sin θ = 0 (0, π, 2π).';TIPS['rc-fn:cot']='cot θ = cos θ/sin θ: period π, asymptotes where sin θ = 0.';
  TIPS['rc-a']=el=>`The wave reaches ±${nz(+el.value)}, so the reciprocal never gets closer to 0 than ±${fmt(1/+el.value,3)}.`;
  TIPS['rc-b']=el=>`b = ${nz(+el.value)}: zeros, and so asymptotes, every π/${nz(+el.value)}.`;
  GLOSS['secant']='sec θ = 1/cos θ.';GLOSS['cosecant']='csc θ = 1/sin θ.';GLOSS['cotangent']='cot θ = cos θ/sin θ = 1/tan θ.';
  TT.recip='Before any graphing, practice flipping numbers: 1/0.9, 1/0.1, 1/(−0.5). Students who see "small becomes big" sketch secant correctly.';
  GLYPH.recip='<path d="M3 4 C5 14, 9 14, 11 4" fill="none" stroke="var(--cv)" stroke-width="2"/><path d="M13 20 C15 10, 19 10, 21 20" fill="none" stroke="var(--cv)" stroke-width="2"/><path d="M12 2 V22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
})();

(function(){
  PROBS.push({id:'rc-exact',topic:'recip',title:'Exact reciprocal values',gen(){const fn=pick(['sec','csc','cot']),ok=SPECIAL.filter(([t])=>t>0&&(fn==='sec'?Math.abs(Math.cos(t))>1e-9:Math.abs(Math.sin(t))>1e-9)),[t,nm]=pick(ok);
    const ans=fn==='sec'?1/Math.cos(t):fn==='csc'?1/Math.sin(t):Math.cos(t)/Math.sin(t);
    const chk=fn==='sec'?Math.hypot(1,Math.tan(t))*Math.sign(Math.cos(t)):fn==='csc'?Math.sqrt(1+(Math.cos(t)/Math.sin(t))**2)*Math.sign(Math.sin(t)):1/Math.tan(t);
    const ex=v=>{const r=Math.abs(v),m=[[2,'2'],[2/Math.sqrt(3),'2√3/3'],[Math.SQRT2,'√2'],[1,'1'],[Math.sqrt(3),'√3'],[Math.sqrt(3)/3,'√3/3'],[0,'0']].find(([q])=>Math.abs(r-q)<1e-9);return m?(v<-1e-12&&m[0]?'−':'')+m[1]:fmt(v,3);};
    return {q:`Find the exact value of ${fn}(${nm}).`,ans,unit:'',abs:.002,chk,show:ex(ans),hint:fn==='sec'?'sec = 1/cos.':fn==='csc'?'csc = 1/sin.':'cot = cos/sin.',
      sol:`${fn==='sec'?`cos(${nm}) = ${exactTrig(Math.cos(t))}`:fn==='csc'?`sin(${nm}) = ${exactTrig(Math.sin(t))}`:`cos(${nm}) = ${exactTrig(Math.cos(t))} and sin(${nm}) = ${exactTrig(Math.sin(t))}`}, so ${fn}(${nm}) = <b>${ex(ans)}</b>.`};}});
  PROBS.push({id:'rc-from',topic:'recip',title:'From one value to another',gen(){const [p,r,h]=pick([[3,4,5],[5,12,13],[8,15,17]]),sw=pick([0,1]),n=sw?r:p,m=sw?p:r,q=pick([2,3,4]),known=pick(['sin','cos']);
    /* signs in quadrants II, III, IV; ask for the reciprocal of the OTHER function */
    const SG={2:{sin:1,cos:-1},3:{sin:-1,cos:-1},4:{sin:-1,cos:1}}[q],other=known==='sin'?'cos':'sin',want=known==='sin'?'sec':'csc',QN={2:'II',3:'III',4:'IV'}[q];
    const ov=SG[other]*m,ans=h/ov,al=known==='sin'?Math.asin(n/h):Math.acos(n/h),th=q===2?Math.PI-al:q===3?Math.PI+al:TAU-al,chk=want==='sec'?1/Math.cos(th):1/Math.sin(th);
    const neg=v=>v<0?'−':'';
    return {q:`${known} θ = ${neg(SG[known])}${n}/${h} and θ is in quadrant ${QN}. Find ${want} θ exactly.`,ans,unit:'',abs:.001,chk,show:`${neg(ov)}${h}/${m}`,
      hint:'Use sin²θ + cos²θ = 1 for the missing value, pick its sign from the quadrant, then flip it.',
      sol:`${other}²θ = 1 − (${n}/${h})² = ${m*m}/${h*h}, so ${other} θ = ±${m}/${h}. In quadrant ${QN} it is ${neg(ov)}${m}/${h}, so ${want} θ = <b>${neg(ov)}${h}/${m}</b>.`};}});
  PROBS.push({id:'rc-asym',topic:'recip',title:'First asymptote',gen(){const fn=pick(['sec','csc']),b=pick([1,2,3,4]),ans=fn==='sec'?Math.PI/(2*b):Math.PI/b;
    const chk=roots(t=>fn==='sec'?Math.cos(b*t):Math.sin(b*t),1e-6,TAU,6000)[0];
    return {q:`Find the smallest positive θ where y = ${fn}(${b===1?'':b}θ) has a vertical asymptote.`,ans,unit:'',abs:.002,chk,show:piText(ans),hint:`${fn} is undefined where ${fn==='sec'?'cos':'sin'} of the inside is 0.`,
      sol:`${fn==='sec'?'cos':'sin'}(${b===1?'':b}θ) = 0 first when ${b===1?'':b}θ = ${fn==='sec'?'π/2':'π'}, so θ = <b>${piText(ans)}</b>.`};}});
})();
