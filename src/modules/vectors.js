/* ---------------- 4.8, 4.9 Vectors and vector-valued functions ---------------- */
(function vectors(){
  const cv=$('#vc-canvas');if(!cv)return;
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1').replace('-','−');
  const vt=(x,y)=>`⟨${f2(x)}, ${f2(y)}⟩`;
  const R=Math.PI/180;
  const view=R0=>(w,h)=>{const r=(w-60)/(h-36),q=typeof R0==='function'?R0():R0;return {xr:[-q*r,q*r],yr:[-q,q],xn:8,yn:6};};
  const vec=(ctx,P,x1,y1,x2,y2,c,wd=3,dash)=>arrow(ctx,P.X(x1),P.Y(y1),P.X(x2),P.Y(y2),c,wd,dash);
  const tag=(ctx,P,x,y,s,c,dx=8,dy=-10)=>label(ctx,s,P.X(x)+dx,P.Y(y)+dy,c,'left','middle',MONO);

  let u1=3,u2=4,v1=-2,v2=1,s=1;
  const sim=glab('vc-canvas',{h:w=>clamp(w*.62,320,450),view:view(()=>Math.max(6,Math.ceil(1.2*Math.max(...[u1,u2,v1,v2,u1+v1,u2+v2,s*u1,s*u2].map(Math.abs))))),draw(ctx,P){
    vec(ctx,P,0,0,v1,v2,alpha(T.cv,.45),2,[5,4]);vec(ctx,P,v1,v2,u1+v1,u2+v2,alpha(T.cx,.45),2,[5,4]);
    if(s!==1)vec(ctx,P,0,0,s*u1,s*u2,T.hot,2.4);
    vec(ctx,P,0,0,u1,u2,T.cx,3.4);vec(ctx,P,u1,u2,u1+v1,u2+v2,T.cv,3.4);vec(ctx,P,0,0,u1+v1,u2+v2,T.ca,3.8);
    tag(ctx,P,u1/2,u2/2,'u',T.cx,10,8);tag(ctx,P,u1+v1/2,u2+v2/2,'v',T.cv,8,-8);label(ctx,'u + v',P.X((u1+v1)/2)-8,P.Y((u2+v2)/2),T.ca,'right','middle',MONO);
    if(s!==1)tag(ctx,P,s*u1,s*u2,`${f2(s)}u`,T.hot,8,-8);dot(ctx,P.X(0),P.Y(0),4,T.ink,T.surface);}});
  function upd(){const mg=(a,b)=>Math.hypot(a,b);
    setText('vc-sum',`${vt(u1,u2)} + ${vt(v1,v2)} = ${vt(u1+v1,u2+v2)}`);
    setText('vc-mag',`|u| = ${fmt(mg(u1,u2),2)}, |v| = ${fmt(mg(v1,v2),2)}, |u + v| = ${fmt(mg(u1+v1,u2+v2),2)}`);
    setText('vc-ku',`${f2(s)}u = ${vt(s*u1,s*u2)};  u − v = ${vt(u1-v1,u2-v2)}`);sim.render();}
  bindRange('vc-u1',f2,x=>{u1=x;upd();});bindRange('vc-u2',f2,x=>{u2=x;upd();});bindRange('vc-v1',f2,x=>{v1=x;upd();});bindRange('vc-v2',f2,x=>{v2=x;upd();});bindRange('vc-s',f2,x=>{s=x;upd();});

  /* magnitude and direction */
  let rr=6,th=40;
  const sim2=glab('vc-canvas2',{h:w=>clamp(w*.58,310,430),view:view(()=>Math.max(4,Math.ceil(rr*1.25))),draw(ctx,P){const x=rr*Math.cos(th*R),y=rr*Math.sin(th*R);
    vec(ctx,P,0,0,x,0,T.ca,3);vec(ctx,P,x,0,x,y,T.cx,3);
    if(rr>0){ctx.save();ctx.strokeStyle=T.ce;ctx.lineWidth=2;ctx.beginPath();const ar=Math.min(1.8,rr*.4);for(let i=0;i<=40;i++){const a=th*R*i/40;i?ctx.lineTo(P.X(ar*Math.cos(a)),P.Y(ar*Math.sin(a))):ctx.moveTo(P.X(ar),P.Y(0));}ctx.stroke();ctx.restore();}
    vec(ctx,P,0,0,x,y,T.hot,4);dot(ctx,P.X(0),P.Y(0),4,T.ink,T.surface);
    if(rr>.2){tag(ctx,P,x/2,0,`r cos θ = ${f2(x)}`,T.ca,-30,y>=0?14:-14);tag(ctx,P,x,y/2,`r sin θ = ${f2(y)}`,T.cx,x>=0?10:-130,0);}}});
  function upd2(){const x=rr*Math.cos(th*R),y=rr*Math.sin(th*R);
    setText('vc-comp',vt(+x.toFixed(6),+y.toFixed(6)));
    setText('vc-unit',rr>0?vt(+Math.cos(th*R).toFixed(3),+Math.sin(th*R).toFixed(3)):'no unit vector (the zero vector has no direction)');
    let ang=Math.atan2(y,x)/R;if(ang<0)ang+=360;setText('vc-back',rr>0?`|v| = √(${f2(x)}² + ${f2(y)}²) = ${f2(Math.hypot(x,y))}, θ = ${f2(ang)}°`:'|v| = 0');sim2.render();}
  bindRange('vc-r',f2,x=>{rr=x;upd2();});bindRange('vc-th',x=>x+'°',x=>{th=x;upd2();});

  /* vector-valued function */
  const FN={lin:t=>[2*t,1+t],par:t=>[t,4-t*t/2],cir:t=>[3*Math.cos(t),3*Math.sin(t)]};
  let fk='lin',t1=.5,t2=2;
  const sim3=glab('vc-canvas3',{h:w=>clamp(w*.58,310,430),view:view(5),draw(ctx,P){const F=FN[fk];
    pathD(ctx,P,t=>F(t)[0],t=>F(t)[1],0,3,T.cx,3.2);
    const a=F(t1),b=F(t2);vec(ctx,P,0,0,a[0],a[1],alpha(T.cv,.8),2.4);vec(ctx,P,0,0,b[0],b[1],alpha(T.cv,.8),2.4);
    vec(ctx,P,a[0],a[1],b[0],b[1],T.hot,3.6);dot(ctx,P.X(a[0]),P.Y(a[1]),6,T.cx,T.surface);dot(ctx,P.X(b[0]),P.Y(b[1]),6,T.cx,T.surface);dot(ctx,P.X(0),P.Y(0),4,T.ink,T.surface);
    tag(ctx,P,a[0],a[1],'r(t₁)',T.cv,8,-12);tag(ctx,P,b[0],b[1],'r(t₂)',T.cv,8,-12);}});
  function upd3(){const F=FN[fk],a=F(t1),b=F(t2),d=[b[0]-a[0],b[1]-a[1]];
    setText('vc-disp',vt(+d[0].toFixed(4),+d[1].toFixed(4)));setText('vc-dl',fmt(Math.hypot(d[0],d[1]),3));
    setText('vc-av',Math.abs(t2-t1)<1e-9?'no value: t₁ = t₂ (divide by zero)':vt(+(d[0]/(t2-t1)).toFixed(4),+(d[1]/(t2-t1)).toFixed(4)));sim3.render();}
  bindRange('vc-t1',f2,x=>{t1=x;upd3();});bindRange('vc-t2',f2,x=>{t2=x;upd3();});segBind('vc-fn','k',k=>{fk=k;upd3();});
  drawers.vectors=()=>{sim.render();sim2.render();sim3.render();};
  KEYS['vc-canvas']=['Blue: u. Green: v (placed at the tip of u). Magenta: u + v. Orange: the scalar multiple k·u. Dashed: the parallelogram.',[['cx','u'],['cv','v'],['ca','u + v'],['hot','k·u']]];
  KEYS['vc-canvas2']=['Orange: the vector. Magenta: its horizontal part r cos θ. Blue: its vertical part r sin θ. Gold: the angle θ.',[['hot','vector'],['ca','x-component'],['cx','y-component'],['ce','angle']]];
  KEYS['vc-canvas3']=['Blue: the path r(t) for 0 ≤ t ≤ 3. Green: the position vectors at t₁ and t₂. Orange: the displacement between them.',[['cx','path'],['cv','position vectors'],['hot','displacement']]];
  TIPS['vc-th']=el=>`θ = ${el.value}°: components are r cos θ and r sin θ.`;
  GLOSS['vector']='A quantity with magnitude and direction, written in components as ⟨a, b⟩.';
  TT.vectors='Have students predict u + v by adding components before looking at the arrows. Then ask why the lengths do not add.';
  GLYPH.vectors='<path d="M4 19 L18 6" stroke="var(--cx)" stroke-width="2.4" fill="none"/><path d="M18 6 l-1 5 M18 6 l-5 1" stroke="var(--cx)" stroke-width="2.4" fill="none"/><path d="M4 19 H19" stroke="var(--ca)" stroke-width="1.8" stroke-dasharray="3 2" fill="none"/>';
  upd();upd2();upd3();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  const vt=(a,b)=>`⟨${sg(a)}, ${sg(b)}⟩`;
  PROBS.push({id:'vc-mag',topic:'vectors',title:'Magnitude of a vector',gen(){const a=ri(-9,9),b=ri(-9,9);if(!a&&!b)return this.gen();const ans=Math.hypot(a,b);
    return {q:`Find the magnitude of ${vt(a,b)}. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:Math.exp(.5*Math.log(a*a+b*b)),show:ans.toFixed(2),hint:'|⟨a, b⟩| = √(a² + b²).',sol:`√((${sg(a)})² + (${sg(b)})²) = √${a*a+b*b} ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'vc-add',topic:'vectors',title:'Magnitude of a sum',gen(){const a=ri(-8,8),b=ri(-8,8),c=ri(-8,8),d=ri(-8,8),sx=a+c,sy=b+d;if(!sx&&!sy)return this.gen();const ans=Math.hypot(sx,sy),chk=Math.sqrt(a*a+b*b+c*c+d*d+2*(a*c+b*d));
    return {q:`Let u = ${vt(a,b)} and v = ${vt(c,d)}. Find |u + v|. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk,show:ans.toFixed(2),hint:'Add components first, then find the length of the sum.',sol:`u + v = ${vt(sx,sy)}, so |u + v| = √(${sx*sx} + ${sy*sy}) ≈ <b>${ans.toFixed(2)}</b>. (Not |u| + |v|.)`};}});
  PROBS.push({id:'vc-scale',topic:'vectors',title:'Magnitude of a scalar multiple',gen(){const a=ri(-7,7),b=ri(-7,7),k=pick([2,3,-2,-3,.5,4]);if(!a&&!b)return this.gen();const ans=Math.hypot(k*a,k*b);
    return {q:`Let u = ${vt(a,b)}. Find |${sg(k)}u|. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:Math.abs(k)*Math.sqrt(a*a+b*b),show:ans.toFixed(2),hint:'Scaling by k multiplies the length by |k|, whichever the sign.',sol:`${sg(k)}u = ${vt(k*a,k*b)}, with length √${sg(k*k*(a*a+b*b))} ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'vc-comp',topic:'vectors',title:'Components from magnitude and angle',gen(){const r=ri(2,20),th=pick([20,30,35,40,50,60,70,110,125,150,200,225,300]),ans=r*Math.cos(th*Math.PI/180);
    return {q:`A vector has magnitude ${r} and direction ${th}° (measured from the positive x-axis). Find its horizontal component. Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:r*Math.sin((90-th)*Math.PI/180),show:ans.toFixed(2),hint:'Horizontal component: r cos θ. Use degree mode.',sol:`${r} cos ${th}° ≈ <b>${ans.toFixed(2)}</b>. (The vertical component is ${r} sin ${th}° ≈ ${(r*Math.sin(th*Math.PI/180)).toFixed(2)}.)`};}});
  PROBS.push({id:'vc-dir',topic:'vectors',title:'Direction angle of a vector',gen(){const a=pick([-8,-5,-3,2,4,6,9]),b=pick([-7,-4,-2,3,5,8]),L=Math.hypot(a,b);let ans=Math.atan2(b,a)*180/Math.PI;if(ans<0)ans+=360;let chk=Math.acos(a/L)*180/Math.PI;if(b<0)chk=360-chk;
    return {q:`Find the direction angle θ (from 0° to 360°) of ${vt(a,b)}. Round to 1 decimal place.`,ans,unit:'°',abs:.06,chk,show:ans.toFixed(1),hint:'Use tan⁻¹(b/a), then fix the quadrant from the signs: add 180° if a is negative, 360° if only b is negative.',sol:`tan⁻¹(${sg(b)}/${sg(a)}) gives a reference angle; the vector is in quadrant ${a>0&&b>0?'I':a<0&&b>0?'II':a<0?'III':'IV'}, so θ ≈ <b>${ans.toFixed(1)}°</b>.`};}});
  PROBS.push({id:'vc-unit',topic:'vectors',title:'Unit vector component',gen(){const a=ri(-9,9),b=ri(-9,9);if(!a&&!b)return this.gen();const L=Math.hypot(a,b),ans=a/L;
    return {q:`The unit vector in the direction of ${vt(a,b)} has horizontal component …? Round to 3 decimal places.`,ans,unit:'',abs:.0015,chk:Math.cos(Math.atan2(b,a)),show:ans.toFixed(3),hint:'Divide each component by the magnitude.',sol:`|v| = √${a*a+b*b} ≈ ${L.toFixed(3)}, so the horizontal component is ${sg(a)}/${L.toFixed(3)} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'vc-dot',topic:'vectors',title:'Dot product',gen(){const a=ri(-6,6),b=ri(-6,6),c=ri(-6,6),d=ri(-6,6);if(!(a||b)||!(c||d))return this.gen();const ans=a*c+b*d,chk=Math.hypot(a,b)*Math.hypot(c,d)*Math.cos(Math.atan2(d,c)-Math.atan2(b,a));
    return {q:`Find the dot product ${vt(a,b)} · ${vt(c,d)}.`,ans,unit:'',abs:.01,chk,show:String(ans),hint:'Multiply matching components and add: ac + bd.',sol:`(${sg(a)})(${sg(c)}) + (${sg(b)})(${sg(d)}) = ${sg(a*c)} + ${sg(b*d)} = <b>${sg(ans)}</b>.${ans===0?' (Zero: the vectors are perpendicular.)':''}`};}});
  PROBS.push({id:'vc-res',topic:'vectors',title:'Speed with a crosswind',gen(){const a=pick([6,8,12,5,9,15,20,30]),b=pick([5,8,10,12,15,16,21,40]),ans=Math.hypot(a,b);
    return {q:`A boat heads east at ${a} mph relative to the water, and the current flows north at ${b} mph. How fast does it move relative to the ground? Round to 2 decimal places.`,ans,unit:'mph',abs:.006,chk:Math.exp(.5*Math.log(a*a+b*b)),show:ans.toFixed(2),hint:'The velocity vectors are perpendicular: add components, then take the length.',sol:`Velocity = ⟨${a}, ${b}⟩, speed = √(${a*a} + ${b*b}) = √${a*a+b*b} ≈ <b>${ans.toFixed(2)} mph</b>.`};}});
})();
