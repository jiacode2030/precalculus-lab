/* ---------------- 3.13 Polar coordinates ---------------- */
(function polarcoord(){
  const cv=$('#pc-canvas');if(!cv)return;
  let r=3,th=135*Math.PI/180,neg=false,snap=true;
  const R=()=>neg?-r:r;
  /* a polar grid on a square panel: rings every 1, rays every 30° */
  function pgridC(ctx,P,rmax,step=1){ctx.save();clip(ctx,P);const o=[P.X(0),P.Y(0)],u=P.X(1)-P.X(0);ctx.strokeStyle=T.grid;ctx.lineWidth=1;
    for(let k=step;k<=rmax+1e-9;k+=step){ctx.beginPath();ctx.arc(o[0],o[1],k*u,0,TAU);ctx.stroke();}
    for(let k=0;k<12;k++){const a=k*Math.PI/6;ctx.beginPath();ctx.moveTo(o[0],o[1]);ctx.lineTo(o[0]+rmax*1.6*u*Math.cos(a),o[1]-rmax*1.6*u*Math.sin(a));ctx.stroke();}
    ctx.restore();for(let k=0;k<12;k++){const a=k*Math.PI/6;if(k%3)label(ctx,piText(a),o[0]+(rmax+.45)*u*Math.cos(a),o[1]-(rmax+.45)*u*Math.sin(a),T.muted,'center','middle','10px "IBM Plex Mono",monospace');}}
  const view=(w,h)=>{const sy=5.8,sx=sy*(w-60)/(h-36);return {xr:[-sx,sx],yr:[-sy,sy],xn:8,yn:6};};
  const sim=glab('pc-canvas',{h:w=>clamp(w*.62,280,420),view,draw(ctx,P){pgridC(ctx,P,5);
    const rr=R(),x=rr*Math.cos(th),y=rr*Math.sin(th);
    line(ctx,P,0,0,6*Math.cos(th),6*Math.sin(th),alpha(T.ce,.8),1.4,[5,4]);label(ctx,'θ ray',P.X(5.4*Math.cos(th)),P.Y(5.4*Math.sin(th)),T.ce,'center','middle',MONO);
    ctx.strokeStyle=T.ce;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),24,0,-th,true);ctx.stroke();
    line(ctx,P,x,0,x,y,T.cx,3);line(ctx,P,0,0,x,0,T.ca,3);line(ctx,P,0,0,x,y,T.hot,3);
    if(neg){line(ctx,P,0,0,-x*.001,0,T.hot,1);label(ctx,'r < 0: walk backwards',P.X(x/2)+8,P.Y(y/2)-10,T.hot,'left','middle',LABEL);}
    dot(ctx,P.X(x),P.Y(y),7.5,T.hot,T.surface);label(ctx,`(${fmt(x,2)}, ${fmt(y,2)})`,P.X(x)+(x>=0?10:-10),P.Y(y)+(y>=0?-14:14),T.ink,x>=0?'left':'right','middle','600 12px "IBM Plex Mono",monospace');},
    drag(k,x,y){if(k==='up')return;let a=Math.atan2(y,x),d=Math.hypot(x,y);if(neg){a+=Math.PI;}a=wrap2pi(a);
      if(snap){a=Math.round(a/(Math.PI/12))*(Math.PI/12);d=Math.round(d*2)/2;}th=wrap2pi(a)||(a>=TAU-1e-9?0:a);r=clamp(d,0,5);$('#pc-r').value=r;$('#pc-th').value=Math.round(th*180/Math.PI);upd();}});
  function upd(){const rr=R(),x=rr*Math.cos(th),y=rr*Math.sin(th),deg=Math.round(th*180/Math.PI);
    setText('pc-polar',`(${nz(+rr.toFixed(2))}, ${deg}° = ${piText(th)})`);setText('pc-rect',`(${fmt(x,3)}, ${fmt(y,3)})`);
    const opp=wrap2pi(th+Math.PI);setText('pc-also',r?`(${nz(+rr.toFixed(2))}, ${deg+360}°) and (${nz(+(-rr).toFixed(2))}, ${Math.round(opp*180/Math.PI)}°)`:'the origin: (0, any θ)');
    const o1=$('#pc-r-out'),o2=$('#pc-th-out');if(o1)o1.textContent=fmt(r,1);if(o2)o2.textContent=deg+'°';sim.render();}
  bindRange('pc-r',v=>fmt(v,1),v=>{r=v;upd();});bindRange('pc-th',v=>v+'°',v=>{th=v*Math.PI/180;upd();});
  $('#pc-neg').addEventListener('change',e=>{neg=e.target.checked;upd();});$('#pc-snap').addEventListener('change',e=>{snap=e.target.checked;});

  /* complex plane */
  let za=1,zb=1.7;
  const sim2=glab('pc-canvas2',{h:w=>clamp(w*.55,260,380),view:(w,h)=>{const sy=4.8,sx=sy*(w-60)/(h-36);return {xr:[-sx,sx],yr:[-sy,sy],xn:8,yn:6,xlabel:'real',ylabel:'imaginary'};},draw(ctx,P){
    const rr=Math.hypot(za,zb),t=Math.atan2(zb,za);ctx.save();clip(ctx,P);ctx.strokeStyle=alpha(T.muted,.4);ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(P.X(0),P.Y(0),(P.X(1)-P.X(0))*rr,0,TAU);ctx.stroke();ctx.restore();
    ctx.strokeStyle=T.ce;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),22,0,-wrap2pi(t),true);ctx.stroke();
    line(ctx,P,za,0,za,zb,T.cx,3);line(ctx,P,0,0,za,0,T.ca,3);line(ctx,P,0,0,za,zb,T.hot,3);dot(ctx,P.X(za),P.Y(zb),7.5,T.hot,T.surface);
    label(ctx,`z = ${nz(za)} ${zb<0?'−':'+'} ${nz(Math.abs(zb))}i`,P.X(za)+(za>=0?10:-10),P.Y(zb)+(zb>=0?-14:14),T.ink,za>=0?'left':'right','middle','600 12px "IBM Plex Mono",monospace');},
    drag(k,x,y){if(k==='up')return;za=clamp(Math.round(x*10)/10,-4,4);zb=clamp(Math.round(y*10)/10,-4,4);$('#pc-za').value=za;$('#pc-zb').value=zb;upd2();}});
  function upd2(){const rr=Math.hypot(za,zb),t=wrap2pi(Math.atan2(zb,za));setText('pc-zrect',`${nz(za)} ${zb<0?'−':'+'} ${nz(Math.abs(zb))}i`);setText('pc-zr',`√(${nz(za)}² + ${nz(zb)}²) ≈ ${fmt(rr,3)}`);
    setText('pc-zth',rr<1e-9?'any (z = 0)':`${fmt(t*180/Math.PI,1)}° ≈ ${fmt(t,3)} rad`);setText('pc-zpol',rr<1e-9?'0':`${fmt(rr,3)}(cos ${fmt(t,3)} + i sin ${fmt(t,3)})`);
    const o1=$('#pc-za-out'),o2=$('#pc-zb-out');if(o1)o1.textContent=nz(za);if(o2)o2.textContent=nz(zb);sim2.render();}
  bindRange('pc-za',nz,v=>{za=v;upd2();});bindRange('pc-zb',nz,v=>{zb=v;upd2();});
  drawers.polarcoord=()=>{sim.render();sim2.render();};
  KEYS['pc-canvas']=['Drag the point anywhere on the grid, or use the sliders. Orange is r along the ray; magenta and blue are x and y.',[['hot','r'],['ce','angle θ'],['ca','x = r cos θ'],['cx','y = r sin θ']]];
  KEYS['pc-canvas2']=['Drag z around the complex plane. Its distance from 0 is r = |z|, its angle is θ.',[['hot','r = |z|'],['ca','real part a'],['cx','imaginary part b'],['ce','θ']]];
  TIPS['pc-r']=el=>`r = ${fmt(+el.value,1)}: the point slides along the ray, ${fmt(+el.value,1)} units from the origin.`;
  TIPS['pc-th']=el=>`θ = ${el.value}°: the ray turns. x = r cos θ and y = r sin θ follow.`;
  TIPS['pc-neg']=el=>el.checked?'Negative r: the point is plotted on the opposite ray, θ + 180°.':'Positive r: the point is on the ray θ.';
  TIPS['pc-za']=el=>`Real part a = ${nz(+el.value)}: left and right.`;TIPS['pc-zb']=el=>`Imaginary part b = ${nz(+el.value)}: up and down.`;
  GLOSS['polar coordinates']='(r, θ): a distance from the origin and an angle from the positive x-axis.';
  TT.polarcoord='Ask for three different polar names of one point (one with negative r) before revealing the conversion formulas.';
  GLYPH.polarcoord='<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M12 12 L5.5 5.5" stroke="var(--hot)" stroke-width="2"/><circle cx="5.5" cy="5.5" r="2" fill="var(--hot)"/>';
})();

(function(){
  const NICE=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1],[Math.sqrt(3),1],[-Math.sqrt(3),1],[1,Math.sqrt(3)],[-1,-Math.sqrt(3)]];
  PROBS.push({id:'pc-torect',topic:'polarcoord',title:'Polar to rectangular',gen(){const r=pick([2,3,4,5,6,-2,-4]),[t,nm]=pick(SPECIAL.slice(1)),which=pick(['x','y']),ans=which==='x'?r*Math.cos(t):r*Math.sin(t);
    return {q:`The point has polar coordinates (${nz(r)}, ${nm}). Find its ${which}-coordinate exactly (or to three decimals).`,ans:Math.abs(ans)<1e-12?0:ans,unit:'',abs:.005,chk:which==='x'?r*Math.cos(t):r*Math.sin(t),
      hint:`${which} = r ${which==='x'?'cos':'sin'} θ.${r<0?' A negative r stays in the formula; it flips the point to the opposite ray.':''}`,
      sol:`${which} = ${nz(r)} ${which==='x'?'cos':'sin'}(${nm}) = ${nz(r)}(${exactTrig(which==='x'?Math.cos(t):Math.sin(t))}) = <b>${fmt(ans,3)}</b>.`};}});
  PROBS.push({id:'pc-r',topic:'polarcoord',title:'Distance r from (x, y)',gen(){const x=ri(-9,9)||3,y=ri(-9,9)||-4,ans=Math.hypot(x,y);
    return {q:`Find r ≥ 0 for the point (${nz(x)}, ${nz(y)}) in polar coordinates, to three decimals if needed.`,ans,unit:'',abs:.005,chk:Math.sqrt(x*x+y*y),hint:'r = √(x² + y²).',sol:`r = √(${x*x} + ${y*y}) = √${x*x+y*y} ≈ <b>${fmt(ans,3)}</b>.`};}});
  PROBS.push({id:'pc-theta',topic:'polarcoord',title:'Angle θ from (x, y)',gen(){const [x0,y0]=pick(NICE),k=pick([1,2,3]),x=x0*k,y=y0*k,ans=wrap2pi(Math.atan2(y,x));
    const fx=v=>Math.abs(Math.abs(v)-Math.sqrt(3)*k)<1e-9?(v<0?'−':'')+(k===1?'':k)+'√3':nz(+v.toFixed(4));
    return {q:`Find θ in [0, 2π) for the point (${fx(x)}, ${fx(y)}) with r &gt; 0. (Type an answer like 5pi/6.)`,ans,unit:'rad',abs:.005,chk:(()=>{const c=Math.acos(x/Math.hypot(x,y));return y<0?TAU-c:c;})(),show:piText(ans),
      hint:'tan θ = y/x gives the reference angle; the signs of x and y give the quadrant.',sol:Math.abs(x)<1e-9||Math.abs(y)<1e-9?`The point is on an axis, ${Math.abs(x)<1e-9?(y>0?'straight up':'straight down'):(x>0?'to the right':'to the left')} of the origin, so θ = <b>${piText(ans)}</b>.`:`The point is in quadrant ${['I','II','III','IV'][Math.floor(ans/(Math.PI/2))]}, and tan θ = y/x = ${fmt(y/x,3)} gives reference angle ${piText(Math.atan(Math.abs(y/x)))}. So θ = <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'pc-complex',topic:'polarcoord',title:'Complex number: modulus',gen(){const a=ri(-6,6)||2,b=ri(-6,6)||5,ans=Math.hypot(a,b);
    return {q:`Write z = ${nz(a)} ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}i in polar form r(cos θ + i sin θ). What is r?`,ans,unit:'',abs:.005,chk:Math.sqrt(a*a+b*b),hint:'r = |z| = √(a² + b²).',sol:`r = √(${a*a} + ${b*b}) = √${a*a+b*b} ≈ <b>${fmt(ans,3)}</b>.`};}});
})();
