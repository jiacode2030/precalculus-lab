/* ---------------- 3.2–3.3 Sine, cosine & the unit circle ---------------- */
(function unitcircle(){
  const cv=$('#uc-canvas');if(!cv)return;
  let th=125*Math.PI/180,snap=true,showTan=true,spin=false,lay=null;
  const angEl=$('#uc-ang');
  function layout(w,h){const wide=w>=560;if(wide){const R=Math.min(h/2-34,w*.19);return {wide,cx:R+48,cy:h/2,R,gx:2*R+110,gy:20,gw:w-(2*R+110)-16,gh:h-52};}
    const R=Math.min(w/2-50,150);return {wide,cx:w/2,cy:R+36,R,gx:40,gy:2*R+84,gw:w-56,gh:h-(2*R+84)-30};}
  function snapTo(t){if(!snap)return t;const base=Math.floor(t/TAU)*TAU,u=t-base;let best=null,bd=7*Math.PI/180;
    SPECIAL.concat([[TAU,'2π']]).forEach(([a])=>{const d=Math.abs(u-a);if(d<bd){bd=d;best=a;}});return best===null?t:base+best;}
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.46,300,400):clamp(w*1.5,520,640),draw(ctx,w,h){
    const L=lay=layout(w,h),{cx,cy,R}=L,c=Math.cos(th),s=Math.sin(th),px=cx+R*c,py=cy-R*s;
    /* axes and circle */
    ctx.save();ctx.strokeStyle=T.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-R-18,cy+.5);ctx.lineTo(cx+R+18,cy+.5);ctx.moveTo(cx+.5,cy-R-18);ctx.lineTo(cx+.5,cy+R+18);ctx.stroke();
    ctx.fillStyle=alpha(T.surface,.6);ctx.strokeStyle=T.muted;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.fill();ctx.stroke();ctx.restore();
    SPECIAL.forEach(([a,t])=>{const ex=cx+(R+15)*Math.cos(a),ey=cy-(R+13)*Math.sin(a);dot(ctx,cx+R*Math.cos(a),cy-R*Math.sin(a),2,T.muted);label(ctx,t,ex,ey,T.muted,'center','middle','10px "IBM Plex Mono",monospace');});
    /* tangent: the radius extended to the line x = 1 */
    if(showTan&&Math.abs(c)>.02){const tn=s/c,ty=cy-R*tn;ctx.save();ctx.beginPath();ctx.rect(0,0,L.wide?L.gx-20:w,L.wide?h:L.gy-30);ctx.clip();
      ctx.setLineDash([4,4]);ctx.strokeStyle=alpha(T.hot,.85);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle=T.hot;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(cx+R,cy);ctx.lineTo(cx+R,ty);ctx.stroke();ctx.restore();
      if(Math.abs(tn)<3.2)label(ctx,'tan θ',cx+R+6,(cy+ty)/2,T.hot,'left','middle',LABEL);}
    /* angle arc (gold), cos (magenta), sin (blue), radius, point */
    const turns=Math.abs(th)/TAU;ctx.strokeStyle=T.ce;ctx.lineWidth=2.6;ctx.beginPath();const ar=R*.24;
    if(th>=0){for(let i=0;i<=120;i++){const a=th*i/120,rr=ar+(turns>1?6*a/TAU:0);i?ctx.lineTo(cx+rr*Math.cos(a),cy-rr*Math.sin(a)):ctx.moveTo(cx+rr*Math.cos(a),cy-rr*Math.sin(a));}}
    else{for(let i=0;i<=120;i++){const a=th*i/120,rr=ar+(turns>1?6*-a/TAU:0);i?ctx.lineTo(cx+rr*Math.cos(a),cy-rr*Math.sin(a)):ctx.moveTo(cx+rr*Math.cos(a),cy-rr*Math.sin(a));}}ctx.stroke();
    label(ctx,'θ',cx+(ar+14)*Math.cos(th/2||.3),cy-(ar+14)*Math.sin(th/2||.3),T.ce,'center','middle','600 14px "IBM Plex Sans",sans-serif');
    ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
    ctx.strokeStyle=T.ca;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,cy);ctx.stroke();
    ctx.strokeStyle=T.cx;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();
    label(ctx,'cos θ',(cx+px)/2,cy+(s>=0?15:-15),T.ca,'center','middle',LABEL);label(ctx,'sin θ',px+(c>=0?7:-7),(py+cy)/2,T.cx,c>=0?'left':'right','middle',LABEL);
    dot(ctx,px,py,7,T.hot,T.surface);
    {const txt=`(${exactTrig(c)}, ${exactTrig(s)})`,fnt='600 12px "IBM Plex Mono",monospace';ctx.font=fnt;const tw=ctx.measureText(txt).width;
    const lx=c>=0?Math.min(px+10,w-tw-4):Math.max(px-10,tw+4);label(ctx,txt,lx,py+(s>=0?-14:14),T.ink,c>=0?'left':'right','middle',fnt);}
    /* the same numbers unrolled against θ */
    const P=gpanel(ctx,{x:L.gx,y:L.gy,w:L.gw,h:L.gh},[0,TAU],[-1.4,1.4],{xn:4,yn:4,xt:false});const u=wrap2pi(th);
    if(showTan){ctx.save();ctx.globalAlpha=.45;curveD(ctx,P,Math.tan,0,TAU,T.hot,1.6,600,[4,4]);ctx.restore();}
    [[Math.sin,T.cx],[Math.cos,T.ca]].forEach(([f,col])=>{curveD(ctx,P,f,0,TAU,alpha(col,.28),2.2,300);curveD(ctx,P,f,0,u,col,2.8,300);dot(ctx,P.X(u),P.Y(f(u)),5.5,col,T.surface);});
    vline(ctx,P,u,T.hot);['π/2','π','3π/2','2π'].forEach((t,i)=>label(ctx,t,P.X((i+1)*Math.PI/2),P.box.y+P.box.h+16,T.muted,'center','middle',MONO));
    label(ctx,'sin θ',P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);label(ctx,'cos θ',P.box.x+56,P.box.y+12,T.ca,'left','middle',LABEL);if(showTan)label(ctx,'tan θ',P.box.x+104,P.box.y+12,T.hot,'left','middle',LABEL);},
    drag(kind,e){if(kind==='up'||!lay)return;const [x,y]=ptr(e,cv),L=lay;spinOff();
      const inGraph=L.wide?x>L.gx-10:y>L.gy-20;
      if(inGraph){th=snapTo(clamp((x-L.gx)/L.gw*TAU,0,TAU));}
      else{let a=Math.atan2(L.cy-y,x-L.cx);if(a<0)a+=TAU;th=snapTo(a);}
      sync();}});
  function readouts(){const c=Math.cos(th),s=Math.sin(th),sp=isSpecial(th),deg=th*180/Math.PI;
    setText('uc-rad',`${piText(th)}${sp||Math.abs(th-Math.round(th/(Math.PI/12))*Math.PI/12)<1e-6?'':''} rad`);
    setText('uc-sin',sp?exactTrig(s):fmt(s,3));setText('uc-cos',sp?exactTrig(c):fmt(c,3));
    setText('uc-tanv',Math.abs(c)<1e-9?'undefined (cos θ = 0)':sp?exactTrig(s/c):fmt(s/c,3));
    const u=wrap2pi(th),onAx=Math.abs(Math.sin(2*u))<1e-9;let q=onAx?'on an axis':['I','II','III','IV'][Math.floor(u/(Math.PI/2))%4];
    const ref=Math.atan2(Math.abs(s),Math.abs(c));setText('uc-q',onAx?'on an axis':`${q} · ${fmt(ref*180/Math.PI,0)}°`);}
  function sync(){const d=Math.round(th*180/Math.PI);if(+angEl.value!==d){angEl.value=d;const o=$('#uc-ang-out');if(o)o.textContent=d+'°';}readouts();sim.render();}
  bindRange('uc-ang',v=>v+'°',v=>{th=v*Math.PI/180;readouts();sim.render();});
  segBind('uc-snap','k',k=>{snap=k==='on';});
  const sb=$('#uc-spin');function spinOff(){spin=false;sb.textContent='Spin';}
  sb.addEventListener('click',()=>{spin=!spin;sb.textContent=spin?'Pause':'Spin';});
  $('#uc-tan').addEventListener('click',e=>{showTan=!showTan;e.target.textContent=showTan?'Hide tangent':'Show tangent';sim.render();});
  ticker('unitcircle',dt=>{if(!spin)return;th+=dt*.7;if(th>4*Math.PI)th-=TAU;const d=Math.round(th*180/Math.PI);angEl.value=d;const o=$('#uc-ang-out');if(o)o.textContent=d+'°';readouts();sim.render();});
  $('#uc-lab').addEventListener('labreset',()=>{spinOff();showTan=true;$('#uc-tan').textContent='Hide tangent';sim.render();});

  /* any radius: the point (r cos θ, r sin θ) and the arc s = rθ */
  let r=2,t2=1;
  const sim2=glab('uc-canvas2',{h:w=>clamp(w*.62,260,380),view:(w,h)=>{const sy=3.4,sx=sy*(w-60)/(h-36);return {xr:[-sx,sx],yr:[-sy,sy],xn:6,yn:6};},draw(ctx,P){
    ctx.save();clip(ctx,P);ctx.strokeStyle=alpha(T.muted,.35);ctx.lineWidth=1;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),P.X(1)-P.X(0),0,TAU);ctx.stroke();
    ctx.strokeStyle=T.muted;ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),(P.X(1)-P.X(0))*r,0,TAU);ctx.stroke();
    ctx.strokeStyle=T.hot;ctx.lineWidth=4;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),(P.X(1)-P.X(0))*r,0,-t2,true);ctx.stroke();ctx.restore();
    const x=r*Math.cos(t2),y=r*Math.sin(t2);line(ctx,P,0,0,x,y,T.ink,2);line(ctx,P,x,0,x,y,T.cx,3);line(ctx,P,0,0,x,0,T.ca,3);
    ctx.strokeStyle=T.ce;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),20,0,-t2,true);ctx.stroke();
    dot(ctx,P.X(x),P.Y(y),6.5,T.hot,T.surface);label(ctx,`s = rθ = ${fmt(r*t2,3)}`,P.X(r*Math.cos(t2/2))+(Math.cos(t2/2)>=0?8:-8),P.Y(r*Math.sin(t2/2))-8,T.hot,Math.cos(t2/2)>=0?'left':'right','middle',LABEL);
    label(ctx,'unit circle',P.X(.72),P.Y(-.86),T.muted,'center','middle',MONO);},
    drag(k,x,y){if(k==='up')return;let a=Math.atan2(y,x);if(a<0)a+=TAU;t2=a;r=clamp(Math.round(Math.hypot(x,y)*10)/10,.5,3);$('#uc-th2').value=t2;$('#uc-r').value=r;upd2();}});
  function upd2(){const x=r*Math.cos(t2),y=r*Math.sin(t2);setText('uc-pt',`(${fmt(x,3)}, ${fmt(y,3)})`);setText('uc-arc',fmt(r*t2,3));setText('uc-ratio',`${fmt(y/r,4)} = sin θ`);
    const o1=$('#uc-r-out'),o2=$('#uc-th2-out');if(o1)o1.textContent=fmt(r,1);if(o2)o2.textContent=`${fmt(t2,2)} rad = ${fmt(t2*180/Math.PI,1)}°`;sim2.render();}
  bindRange('uc-r',v=>fmt(v,1),v=>{r=v;upd2();});bindRange('uc-th2',v=>`${fmt(v,2)} rad = ${fmt(v*180/Math.PI,1)}°`,v=>{t2=v;upd2();});

  drawers.unitcircle=()=>{sim.render();sim2.render();};
  KEYS['uc-canvas']=['Drag the point around the circle (or along the graph). Blue is the height (sine), magenta is the width (cosine), gold is the angle.',[['cx','sine'],['ca','cosine'],['ce','angle'],['hot','the point and tan θ']]];
  KEYS['uc-canvas2']=['Drag the point anywhere: its distance sets r and its direction sets θ. Orange is the arc s = rθ.',[['hot','arc length'],['cx','y = r sin θ'],['ca','x = r cos θ']]];
  TIPS['uc-ang']=el=>{const d=+el.value,u=((d%360)+360)%360;return d<0?`A negative angle turns clockwise. ${d}° lands on the same ray as ${u}°.`:d>=360?`${d}° is more than a full turn: the same point as ${u}°. Sine and cosine repeat every 360° (2π).`:`θ = ${d}°. The point is (cos θ, sin θ).`;};
  TIPS['uc-snap:on']='Snapping on: the point jumps to the nearest special angle (multiples of π/6 and π/4) so you get exact values.';
  TIPS['uc-snap:off']='Snapping off: drag to any angle. The readouts switch to decimals.';
  TIPS['uc-r']=el=>`Radius ${fmt(+el.value,1)}: the point moves out along the same ray, the arc gets longer, but y/r stays sin θ.`;
  TIPS['uc-th2']=el=>`θ = ${fmt(+el.value,2)} radians: the arc is θ times the radius long.`;
  GLOSS['reference angle']='The acute angle between the terminal ray and the x-axis. It gives the size of sin and cos; the quadrant gives the sign.';
  GLOSS['radians']='An angle measured by arc length on the unit circle. A full turn is 2π radians, so 180° = π.';
  GLOSS['unit circle']='The circle of radius 1 centered at the origin. The point at angle θ is (cos θ, sin θ).';
  GLOSS['coterminal']='Angles that end on the same ray, differing by a whole number of full turns (2π).';
  TT.unitcircle='Have students predict the signs of sin, cos and tan in each quadrant before turning snapping on, then check four angles that share a reference angle.';
  GLYPH.unitcircle='<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 12 L18 6" stroke="currentColor" stroke-width="1.6"/><path d="M18 6 V12" stroke="var(--cx)" stroke-width="2"/><path d="M12 12 H18" stroke="var(--ca)" stroke-width="2"/>';
})();

(function(){
  const ANG=SPECIAL.slice(1);
  PROBS.push({id:'uc-exact',topic:'unitcircle',title:'Exact values on the unit circle',gen(){const [t,nm]=pick(ANG),fn=pick(['sin','cos','tan']);if(fn==='tan'&&Math.abs(Math.cos(t))<1e-9)return this.gen();
    const v=fn==='sin'?Math.sin(t):fn==='cos'?Math.cos(t):Math.tan(t),ans=Math.abs(v)<1e-12?0:v,ref=Math.atan2(Math.abs(Math.sin(t)),Math.abs(Math.cos(t)));
    return {q:`Find the exact value of ${fn}(${nm}). (Type √3/2, −1/2, sqrt(3) and so on.)`,ans,unit:'',abs:.005,chk:fn==='sin'?Math.sin(t):fn==='cos'?Math.cos(t):Math.sin(t)/Math.cos(t),show:exactTrig(ans),
      hint:'Find the quadrant and the reference angle. The reference angle gives the size; the quadrant gives the sign.',
      sol:`${nm} has reference angle ${piText(ref)}${Math.abs(Math.sin(2*t))<1e-9?' (it is on an axis)':''}. The point is (${exactTrig(Math.cos(t))}, ${exactTrig(Math.sin(t))}), so ${fn}(${nm}) = <b>${exactTrig(ans)}</b>${fn==='tan'?' (sin ÷ cos)':''}.`};}});
  PROBS.push({id:'uc-rad',topic:'unitcircle',title:'Degrees to radians',gen(){const d=pick([15,40,75,120,135,200,225,240,300,330,390,-45,-150]),ans=d*Math.PI/180;
    return {q:`Convert ${nz(d)}° to radians. (An exact answer like 5pi/4 or a decimal both work.)`,ans,unit:'rad',abs:.005,chk:d/180*Math.PI,show:`${piText(ans)} ≈ ${fmt(ans,4)}`,hint:'Multiply by π/180.',
      sol:`${nz(d)} × π/180 = <b>${piText(ans)}</b> ≈ ${fmt(ans,4)} radians.`};}});
  PROBS.push({id:'uc-point',topic:'unitcircle',title:'A point on a circle',gen(){const r=pick([2,3,4,5,8,10]),d=pick([20,50,110,160,200,250,290,340]),t=d*Math.PI/180,which=pick(['x','y']),ans=which==='x'?r*Math.cos(t):r*Math.sin(t);
    return {q:`A point starts at (${r}, 0) on a circle of radius ${r} centered at the origin and rotates ${d}° counterclockwise. Find its ${which}-coordinate to three decimal places.`,ans,unit:'',abs:.002,chk:which==='x'?Math.hypot(r,0)*Math.cos(d/57.29577951308232):Math.hypot(r,0)*Math.sin(d/57.29577951308232),
      hint:`On a circle of radius r the point is (r cos θ, r sin θ). Check your calculator is in degree mode (or convert).`,
      sol:`${which} = ${r} ${which==='x'?'cos':'sin'} ${d}° = ${r} × (${fmt(which==='x'?Math.cos(t):Math.sin(t),4)}) ≈ <b>${fmt(ans,3)}</b>.`};}});
  PROBS.push({id:'uc-arc',topic:'unitcircle',title:'Arc length',gen(){const r=pick([3,4,6,9,12,15]),d=pick([30,45,60,72,120,150,210,270]),ans=r*d*Math.PI/180;
    return {q:`A circle has radius ${r} cm. Find the length of the arc cut by a central angle of ${d}°, to two decimal places.`,ans,unit:'cm',tol:.002,chk:2*Math.PI*r*(d/360),hint:'s = rθ needs θ in radians.',
      sol:`θ = ${d}° = ${piText(d*Math.PI/180)} rad, so s = ${r} × ${piText(d*Math.PI/180)} ≈ <b>${fmt(ans,2)} cm</b>.`};}});
  PROBS.push({id:'uc-pyth',topic:'unitcircle',title:'One value from another',gen(){const [a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),q=pick([2,3,4]);
    const s=q===3||q===4?-1:1,co=q===2||q===3?-1:1,ans=co*b/c;
    return {q:`sin θ = ${s<0?'−':''}${a}/${c} and θ is in quadrant ${['','I','II','III','IV'][q]}. Find cos θ.`,ans,unit:'',abs:.002,chk:co*Math.sqrt(1-(a/c)**2),show:`${co<0?'−':''}${b}/${c}`,
      hint:'Use sin²θ + cos²θ = 1, then choose the sign from the quadrant.',
      sol:`cos²θ = 1 − (${a}/${c})² = ${c*c-a*a}/${c*c}, so |cos θ| = ${b}/${c}. In quadrant ${['','I','II','III','IV'][q]} cosine is ${co<0?'negative':'positive'}: cos θ = <b>${co<0?'−':''}${b}/${c}</b>.`};}});
})();
