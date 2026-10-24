/* ---------------- 4.6 Conic sections ---------------- */
(function conics(){
  const cv=$('#cn-canvas');if(!cv)return;
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1').replace('-','−');
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  const sq=(v,s)=>v===0?`${s}²`:`(${s} ${v<0?'+':'−'} ${f2(Math.abs(v))})²`;
  const lin=(v,s)=>v===0?s:`(${s} ${v<0?'+':'−'} ${f2(Math.abs(v))})`;
  const pt=(x,y)=>`(${f2(x)}, ${f2(y)})`;
  let ty='circ',or='h',h=0,k=0,a=3,b=2;
  const view=(w,hh)=>{const r=(w-60)/(hh-36);return {xr:[-10*r,10*r],yr:[-10,10],xn:8,yn:8};};
  const path=(ctx,P,pts,color,wd,dash)=>{ctx.save();clip(ctx,P);ctx.strokeStyle=color;ctx.lineWidth=wd;ctx.lineJoin='round';if(dash)ctx.setLineDash(dash);ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y)));ctx.stroke();ctx.restore();};
  const tr=(n,a0,a1)=>Array.from({length:n+1},(_,i)=>a0+(a1-a0)*i/n);
  function geom(){const g={curves:[],foci:[],verts:[],guides:[]};
    if(ty==='circ'){g.curves.push(tr(200,0,2*Math.PI).map(t=>[h+a*Math.cos(t),k+a*Math.sin(t)]));g.verts=[[h+a,k],[h-a,k],[h,k+a],[h,k-a]];}
    else if(ty==='ell'){g.curves.push(tr(200,0,2*Math.PI).map(t=>[h+a*Math.cos(t),k+b*Math.sin(t)]));g.verts=[[h+a,k],[h-a,k],[h,k+b],[h,k-b]];const c=Math.sqrt(Math.abs(a*a-b*b));g.c=c;if(c>1e-9)g.foci=a>b?[[h-c,k],[h+c,k]]:[[h,k-c],[h,k+c]];}
    else if(ty==='hyp'){const c=Math.sqrt(a*a+b*b);g.c=c;
      if(or==='h'){[1,-1].forEach(s=>g.curves.push(tr(200,-3,3).map(t=>[h+s*a*Math.cosh(t),k+b*Math.sinh(t)])));g.verts=[[h+a,k],[h-a,k]];g.foci=[[h-c,k],[h+c,k]];g.m=b/a;}
      else{[1,-1].forEach(s=>g.curves.push(tr(200,-3,3).map(t=>[h+b*Math.sinh(t),k+s*a*Math.cosh(t)])));g.verts=[[h,k+a],[h,k-a]];g.foci=[[h,k-c],[h,k+c]];g.m=a/b;}
      g.guides.push([-30,k+g.m*(-30-h),30,k+g.m*(30-h)],[-30,k-g.m*(-30-h),30,k-g.m*(30-h)]);}
    else{const p=a;
      if(or==='h'){g.curves.push(tr(200,-14,14).map(t=>[h+t*t/(4*p),k+t]));g.foci=[[h+p,k]];g.guides.push([h-p,-30,h-p,30]);g.verts=[[h,k]];}
      else{g.curves.push(tr(200,-14,14).map(t=>[h+t,k+t*t/(4*p)]));g.foci=[[h,k+p]];g.guides.push([-30,k-p,30,k-p]);g.verts=[[h,k]];}}
    return g;}
  const sim=glab('cn-canvas',{h:w=>clamp(w*.62,330,470),view,draw(ctx,P){const g=geom();
    g.guides.forEach(([x1,y1,x2,y2])=>line(ctx,P,x1,y1,x2,y2,T.ce,1.6,[6,5]));
    g.curves.forEach(c=>path(ctx,P,c,T.cx,3.2));
    g.verts.forEach(([x,y])=>dot(ctx,P.X(x),P.Y(y),5,T.ink,T.surface));
    if(ty!=='par')dot(ctx,P.X(h),P.Y(k),4,T.muted,T.surface);
    g.foci.forEach(([x,y],i)=>{dot(ctx,P.X(x),P.Y(y),6.5,T.ca,T.surface);label(ctx,ty==='par'?'F':'F'+(i?'₂':'₁'),P.X(x)+10,P.Y(y)-12,T.ca,'left','middle',MONO);});
    label(ctx,{circ:'circle',ell:'ellipse',hyp:'hyperbola',par:'parabola'}[ty],P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd(){const g=geom();let eq,pc,fo;const X=sq(h,'x'),Y=sq(k,'y');
    $('#cn-b').disabled=ty==='circ'||ty==='par';$('#cn-or').style.display=(ty==='circ'||ty==='ell')?'none':'';
    if(ty==='circ'){eq=`${X} + ${Y} = ${f2(a*a)}`;pc=`center ${pt(h,k)}, radius ${f2(a)}`;fo='both "foci" sit at the center (c = 0)';}
    else if(ty==='ell'){eq=`${X}/${f2(a*a)} + ${Y}/${f2(b*b)} = 1`;pc=`center ${pt(h,k)}; vertices ${pt(h+a,k)}, ${pt(h-a,k)}, ${pt(h,k+b)}, ${pt(h,k-b)}`;
      fo=g.c>1e-9?`c = √|${f2(a*a)} − ${f2(b*b)}| = ${f2(g.c)}; foci ${g.foci.map(p=>pt(p[0],p[1])).join(' and ')}`:'a = b: the foci merge at the center, so this is a circle';}
    else if(ty==='hyp'){eq=or==='h'?`${X}/${f2(a*a)} − ${Y}/${f2(b*b)} = 1`:`${Y}/${f2(a*a)} − ${X}/${f2(b*b)} = 1`;pc=`center ${pt(h,k)}; vertices ${g.verts.map(p=>pt(p[0],p[1])).join(' and ')}`;
      fo=`c = √(${f2(a*a)} + ${f2(b*b)}) = ${f2(g.c)}; foci ${g.foci.map(p=>pt(p[0],p[1])).join(' and ')}; asymptotes y ${k<0?'+':'−'} ${f2(Math.abs(k))} = ±${f2(g.m)}(x ${h<0?'+':'−'} ${f2(Math.abs(h))})`;}
    else{eq=or==='h'?`${Y} = ${f2(4*a)}${lin(h,'x')}`:`${X} = ${f2(4*a)}${lin(k,'y')}`;pc=`vertex ${pt(h,k)}; p = ${f2(a)} (opens ${or==='h'?'right':'up'})`;
      fo=`focus ${pt(g.foci[0][0],g.foci[0][1])}; directrix ${or==='h'?'x = '+f2(h-a):'y = '+f2(k-a)}`;}
    setText('cn-eq',eq);setText('cn-pt',pc);setText('cn-fo',fo);sim.render();}
  bindRange('cn-h',f2,v=>{h=v;upd();});bindRange('cn-k',f2,v=>{k=v;upd();});bindRange('cn-a',f2,v=>{a=v;upd();});bindRange('cn-b',f2,v=>{b=v;upd();});
  segBind('cn-set','k',v=>{ty=v;upd();});segBind('cn-or','k',v=>{or=v;upd();});
  $('#cn-lab').addEventListener('labreset',()=>{ty='circ';or='h';set('cn-h',0);set('cn-k',0);set('cn-a',3);set('cn-b',2);});

  /* the distance rule */
  let t2='ell',tt=1;
  const dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
  const S2={ell:{pt:t=>[5*Math.cos(t),3*Math.sin(t)],F:[[-4,0],[4,0]]},hyp:{pt:t=>{const s=(t-Math.PI)*1.55/Math.PI;return [3*Math.cosh(s),4*Math.sinh(s)];},F:[[-5,0],[5,0]]},par:{pt:t=>{const x=(t-Math.PI)*6/Math.PI;return [x,x*x/8];},F:[[0,2]]}};
  const sim2=glab('cn-canvas2',{h:w=>clamp(w*.6,320,450),view:(w,hh)=>{const r=(w-60)/(hh-36);return {xr:[-8*r,8*r],yr:[-8,8],xn:8,yn:8};},
    draw(ctx,P){const S=S2[t2],p=S.pt(tt),c=t2==='ell'?tr(200,0,2*Math.PI).map(t=>[5*Math.cos(t),3*Math.sin(t)]):null;
      if(t2==='ell')path(ctx,P,c,T.cx,3.2);else if(t2==='hyp'){[1,-1].forEach(s=>path(ctx,P,tr(200,-3,3).map(t=>[s*3*Math.cosh(t),4*Math.sinh(t)]),T.cx,3.2));}else path(ctx,P,tr(200,-9,9).map(x=>[x,x*x/8]),T.cx,3.2);
      if(t2==='par'){line(ctx,P,-30,-2,30,-2,T.ce,1.6,[6,5]);line(ctx,P,p[0],p[1],p[0],-2,alpha(T.hot,.75),2);}
      S.F.forEach(f=>line(ctx,P,p[0],p[1],f[0],f[1],alpha(T.hot,.75),2));
      S.F.forEach((f,i)=>{dot(ctx,P.X(f[0]),P.Y(f[1]),6.5,T.ca,T.surface);label(ctx,t2==='par'?'F':'F'+(i?'₂':'₁'),P.X(f[0])+10,P.Y(f[1])+14,T.ca,'left','middle',MONO);});
      dot(ctx,P.X(p[0]),P.Y(p[1]),7,T.hot,T.surface);}});
  function upd2(){const S=S2[t2],p=S.pt(tt);let d1,d2,r;
    if(t2==='par'){d1=dist(p,S.F[0]);d2=p[1]+2;r=`distance to the focus = distance to the directrix = ${fmt(d1,2)}`;setText('cn-d1',`to the focus F: ${fmt(d1,2)}`);setText('cn-d2',`to the directrix y = −2: ${fmt(d2,2)}`);}
    else{d1=dist(p,S.F[0]);d2=dist(p,S.F[1]);setText('cn-d1',`to F₁: ${fmt(d1,2)}`);setText('cn-d2',`to F₂: ${fmt(d2,2)}`);
      r=t2==='ell'?`d₁ + d₂ = ${fmt(d1+d2,2)} = 2a (a = 5)`:`|d₁ − d₂| = ${fmt(Math.abs(d1-d2),2)} = 2a (a = 3)`;}
    setText('cn-rule',r);sim2.render();}
  bindRange('cn-t',v=>fmt(v,2),v=>{tt=v;upd2();});
  segBind('cn-set2','k',v=>{t2=v;upd2();});
  drawers.conics=()=>{sim.render();sim2.render();};
  KEYS['cn-canvas']=['Blue: the conic. Magenta: foci. Black dots: vertices. Gold dashed: asymptotes or the directrix.',[['cx','conic'],['ca','focus'],['ce','asymptote / directrix']]];
  KEYS['cn-canvas2']=['Blue: the conic with its foci in magenta. Orange: the moving point and its distances. Gold dashed: the parabola\'s directrix.',[['cx','conic'],['ca','focus'],['hot','point and distances'],['ce','directrix']]];
  TIPS['cn-b']='b is not used by the circle or the parabola.';
  GLOSS['focus']='A special point used to define a conic by distances: an ellipse has two foci, a hyperbola two, a parabola one.';
  TT.conics='Let students predict the shape from the equation before they build it. Then connect c² = a² − b² (ellipse) and c² = a² + b² (hyperbola) to the pictures.';
  GLYPH.conics='<ellipse cx="12" cy="12" rx="9" ry="5" fill="none" stroke="var(--cx)" stroke-width="2"/><circle cx="8" cy="12" r="1.8" fill="var(--ca)"/><circle cx="16" cy="12" r="1.8" fill="var(--ca)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  PROBS.push({id:'cn-type',topic:'conics',title:'Name the conic',gen(){const A=pick([4,9,16,25]),B=pick([1,4,9]);const t=pick(['ell','hyp','circ','par']);let eq,right;
    if(t==='ell'){eq=`x²/${A} + y²/${A+pick([5,11])} = 1`;right='ellipse';}else if(t==='hyp'){eq=pick([`x²/${A} − y²/${B} = 1`,`y²/${A} − x²/${B} = 1`,`${B}x² − ${A}y² = ${A*B}`]);right='hyperbola';}
    else if(t==='circ'){eq=pick([`x² + y² = ${A}`,`(x − ${B})² + (y + 2)² = ${A}`]);right='circle';}else{eq=pick([`y = ${B===1?'':B}x²`,`x² = ${4*B}y`,`(x − 1)² = 8(y + 3)`]);right='parabola';}
    const {choices,ans}=mcq(right,['circle','ellipse','hyperbola','parabola'].filter(v=>v!==right),4);
    return {q:`What kind of conic is ${eq}?`,choices,ans,hint:'Count the squared terms and look at their signs and coefficients.',sol:`${right==='parabola'?'Only one of x, y is squared':right==='hyperbola'?'The squared terms have opposite signs':right==='circle'?'Both squared, added, with equal coefficients':'Both squared and added, with different denominators'}: a <b>${right}</b>.`};}});
  PROBS.push({id:'cn-ell',topic:'conics',title:'Distance to an ellipse focus',gen(){const A=ri(5,12),B=ri(2,A-1),a2=A*A,b2=B*B,ans=Math.sqrt(a2-b2);
    return {q:`For the ellipse x²/${a2} + y²/${b2} = 1, how far is each focus from the center? Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:Math.exp(.5*Math.log(a2-b2)),show:ans.toFixed(2),hint:'For an ellipse c² = a² − b² (the larger denominator minus the smaller).',sol:`c² = ${a2} − ${b2} = ${a2-b2}, so c = √${a2-b2} ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'cn-hyp',topic:'conics',title:'Distance to a hyperbola focus',gen(){const A=ri(2,9),B=ri(2,9),ans=Math.sqrt(A*A+B*B);
    return {q:`For the hyperbola x²/${A*A} − y²/${B*B} = 1, how far is each focus from the center? Round to 2 decimal places.`,ans,unit:'',abs:.006,chk:Math.hypot(A,B),show:ans.toFixed(2),hint:'For a hyperbola c² = a² + b².',sol:`c² = ${A*A} + ${B*B} = ${A*A+B*B}, so c = √${A*A+B*B} ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'cn-asym',topic:'conics',title:'Asymptote slope',gen(){const A=ri(2,8),B=ri(2,8),ans=B/A;
    return {q:`The hyperbola x²/${A*A} − y²/${B*B} = 1 has asymptotes y = ±mx. Find m (the positive slope). Round to 3 decimal places.`,ans,unit:'',abs:.002,chk:Math.exp(Math.log(B)-Math.log(A)),show:ans.toFixed(3),hint:'The asymptotes are the diagonals of the a-by-b box: slope b/a.',sol:`a = ${A} and b = ${B}, so m = b/a = ${B}/${A} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'cn-par',topic:'conics',title:'Focus of a parabola',gen(){const kk=pick([2,4,6,8,10,12,16,20]),ans=kk/4;
    return {q:`The parabola x² = ${kk}y has its vertex at the origin. How far above the vertex is its focus?`,ans,unit:'',abs:.006,chk:Math.exp(Math.log(kk)-Math.log(4)),show:String(ans),hint:'Match x² = 4py. Then p = the coefficient of y divided by 4.',sol:`4p = ${kk}, so p = ${kk}/4 = <b>${sg(ans)}</b>. The focus is (0, ${sg(ans)}) and the directrix is y = −${sg(ans)}.`};}});
  PROBS.push({id:'cn-center',topic:'conics',title:'Center from the equation',gen(){const h=ri(-6,6),kk=ri(-6,6),A=pick([4,9,16]),B=pick([1,4,9].filter(v=>v!==A));if(h===0||kk===0)return this.gen();
    return {q:`The ellipse (x ${h<0?'+':'−'} ${Math.abs(h)})²/${A} + (y ${kk<0?'+':'−'} ${Math.abs(kk)})²${B===1?'':'/'+B} = 1 is centered at (h, k). Find h.`,ans:h,unit:'',abs:.006,chk:-(-2*h)/2,show:String(h),hint:'The center is where each bracket is zero: x − h = 0.',sol:`x ${h<0?'+':'−'} ${Math.abs(h)} = x − ${pn(h)}, so h = <b>${sg(h)}</b> (and k = ${sg(kk)}).`};}});
})();
