/* ---------------- 3.15 Rates of change in polar functions ---------------- */
(function polarroc(){
  const cv=$('#pr-canvas');if(!cv)return;
  const FN={lim:[t=>1+2*Math.sin(t),'r = 1 + 2 sin θ',3],rose:[t=>3*Math.cos(2*t),'r = 3 cos(2θ)',3],card:[t=>2+2*Math.cos(t),'r = 2 + 2 cos θ',4],spr:[t=>10+4*Math.cos(t),'r = 10 + 4 cos θ (ft)',14]};
  let k='lim',t1=Math.PI/2,dt=2*Math.PI/3;
  /* color a stretch of the polar curve by whether |r| grows (green, farther) or shrinks (orange, closer) */
  function stretch(ctx,P,f,a,b,rect){const n=240;ctx.save();clip(ctx,P);ctx.lineWidth=4;ctx.lineCap='round';let prev=null;
    for(let i=0;i<=n;i++){const t=a+(b-a)*i/n,r=f(t),pt=rect?[P.X(t),P.Y(r)]:[P.X(r*Math.cos(t)),P.Y(r*Math.sin(t))];
      if(prev){const away=Math.abs(r)>Math.abs(prev[2]);ctx.strokeStyle=away?T.cv:T.hot;ctx.beginPath();ctx.moveTo(prev[0],prev[1]);ctx.lineTo(pt[0],pt[1]);ctx.stroke();}prev=[pt[0],pt[1],r];}ctx.restore();}
  const sim=sim2d(cv,{h:w=>w>=620?clamp(w*.45,320,420):clamp(w*1.45,520,680),draw(ctx,w,h){const [f,,rm]=FN[k],t2=Math.min(t1+dt,TAU*1.5),L=polarPanels(ctx,w,h,rm),G=L.G,Pp=L.Pp;
    hline(ctx,G,0,T.muted,[1,0]);polarStroke(ctx,G,f,0,TAU,2,.35,true);stretch(ctx,G,f,t1,t2,true);
    line(ctx,G,t1,f(t1),t2,f(t2),T.ce,2.2,[6,4]);dot(ctx,G.X(t1),G.Y(f(t1)),6,T.ink,T.surface);dot(ctx,G.X(t2),G.Y(f(t2)),6,T.ink,T.surface);
    polarStroke(ctx,Pp,f,0,TAU,2,.3);stretch(ctx,Pp,f,t1,t2);
    [[t1,'θ₁'],[t2,'θ₂']].forEach(([t,s])=>{const r=f(t);line(ctx,Pp,0,0,r*Math.cos(t),r*Math.sin(t),alpha(T.ink,.7),1.4,[4,3]);dot(ctx,Pp.X(r*Math.cos(t)),Pp.Y(r*Math.sin(t)),6,T.ink,T.surface);
      label(ctx,s,Pp.X(r*Math.cos(t))+8,Pp.Y(r*Math.sin(t))-10,T.ink,'left','middle',LABEL);});
    label(ctx,FN[k][1],Pp.box.x+6,Pp.box.y+12,T.cx,'left','middle','600 13px "IBM Plex Mono",monospace');
    label(ctx,'secant slope = average rate',G.box.x+8,G.box.y+G.box.h-10,T.ce,'left','middle',MONO);}});
  function upd(){const [f]=FN[k],t2=t1+dt,r1=f(t1),r2=f(t2),ar=(r2-r1)/dt;
    setText('pr-r',`${fmt(r1,3)} → ${fmt(r2,3)}`);setText('pr-aroc',`(${fmt(r2,3)} − ${fmt(r1,3)}) / ${fmt(dt,3)} = ${fmt(ar,3)}${k==='spr'?' ft per radian':' per radian'}`);
    /* look at the whole interval: does |r| only grow, only shrink, or both? */
    let up=0,dn=0,sgn=new Set();for(let i=1;i<=200;i++){const a=t1+dt*(i-1)/200,b=t1+dt*i/200,ra=f(a),rb=f(b);if(Math.abs(rb)>Math.abs(ra)+1e-12)up++;else if(Math.abs(rb)<Math.abs(ra)-1e-12)dn++;if(Math.abs(rb)>1e-9)sgn.add(Math.sign(rb));}
    const sg=sgn.size>1?'r changes sign':[...sgn][0]>0?'r > 0':'r < 0';
    setText('pr-dir',!dn?`${sg}, |r| growing: farther from the origin`:!up?`${sg}, |r| shrinking: closer to the origin`:`${sg}: moves ${up>dn?'mostly away':'mostly closer'}, but not the whole way (green = farther, orange = closer)`);sim.render();}
  bindRange('pr-th',v=>`${fmt(v,2)} rad (${Math.round(v*180/Math.PI)}°)`,v=>{t1=v;upd();});bindRange('pr-dt',v=>`${fmt(v,2)} rad`,v=>{dt=v;upd();});
  segBind('pr-fn','k',kk=>{k=kk;upd();});
  drawers.polarroc=()=>sim.render();
  KEYS['pr-canvas']=['Move θ₁ and the interval width. Green stretches move away from the origin, orange stretches move closer. The dashed gold line is the secant.',[['cv','farther (|r| grows)'],['hot','closer (|r| shrinks)'],['ce','secant']]];
  TIPS['pr-th']=el=>`θ₁ = ${fmt(+el.value,2)}. The interval runs to θ₁ + Δθ.`;
  TIPS['pr-dt']=el=>+el.value<.1?'A tiny interval: the average rate is close to the instantaneous rate of change of r at θ₁.':`Δθ = ${fmt(+el.value,2)} radians. The average rate is the secant slope over this interval.`;
  TT.polarroc='Pair each interval with a sentence: "r is ___ and ___, so the point is getting ___ the origin." Insist on both the sign and the direction.';
  GLYPH.polarroc='<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 12 C18 6, 22 14, 16 18" fill="none" stroke="var(--cv)" stroke-width="2"/><path d="M16 18 C12 21, 6 18, 7 13" fill="none" stroke="var(--hot)" stroke-width="2"/>';
})();

(function(){
  const F=[[(t)=>1+2*Math.sin(t),'1 + 2 sin θ'],[(t)=>3+2*Math.cos(t),'3 + 2 cos θ'],[(t)=>4*Math.sin(2*t),'4 sin(2θ)'],[(t)=>2-3*Math.cos(t),'2 − 3 cos θ']];
  const IV=[[0,Math.PI/2,'0','π/2'],[Math.PI/6,Math.PI/2,'π/6','π/2'],[Math.PI/2,Math.PI,'π/2','π'],[Math.PI/3,2*Math.PI/3,'π/3','2π/3'],[Math.PI,3*Math.PI/2,'π','3π/2']];
  PROBS.push({id:'pr-aroc',topic:'polarroc',title:'Average rate of change of r',gen(){const [f,ft]=pick(F),[a,b,an,bn]=pick(IV),ans=(f(b)-f(a))/(b-a);
    return {q:`For r = ${ft}, find the average rate of change of r with respect to θ on [${an}, ${bn}], to three decimals.`,ans,unit:'per radian',abs:.005,chk:(f(b)-f(a))*(180/Math.PI)/((b-a)*180/Math.PI),
      hint:'(r(θ₂) − r(θ₁)) / (θ₂ − θ₁), with θ in radians.',sol:`r(${an}) = ${fmt(f(a),4)} and r(${bn}) = ${fmt(f(b),4)}. (${fmt(f(b),4)} − ${fmt(f(a),4)}) / (${bn} − ${an}) ≈ <b>${fmt(ans,3)}</b>.`};}});
  PROBS.push({id:'pr-dir',topic:'polarroc',title:'Closer or farther?',gen(){const cases=[[1,1,'farther from'],[1,-1,'closer to'],[-1,-1,'farther from'],[-1,1,'closer to']],[sg,dir,ok]=pick(cases);
    const {choices,ans}=mcq(`getting ${ok} the origin`,['getting farther from the origin','getting closer to the origin','at a constant distance from the origin'].filter(x=>x!==`getting ${ok} the origin`));
    return {q:`On an interval, r = f(θ) is ${sg>0?'positive':'negative'} and ${dir>0?'increasing':'decreasing'}. The point on the polar curve is`,choices,ans,hint:'The distance is |r|. Ask whether |r| grows or shrinks.',
      sol:`${sg>0?'Positive':'Negative'} and ${dir>0?'increasing':'decreasing'} means |r| ${sg*dir>0?'grows':'shrinks'}, so the point is <b>getting ${ok} the origin</b>.`};}});
})();
