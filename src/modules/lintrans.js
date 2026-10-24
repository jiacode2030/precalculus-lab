/* ---------------- 4.12, 4.13 Linear transformations ---------------- */
(function lintrans(){
  const cv=$('#lt-canvas');if(!cv)return;
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1').replace('-','−');
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  const view=(w,h)=>{const r=(w-60)/(h-36);return {xr:[-5*r,5*r],yr:[-5,5],xn:8,yn:5};};
  const vec=(ctx,P,x1,y1,x2,y2,c,wd=3.4,dash)=>arrow(ctx,P.X(x1),P.Y(y1),P.X(x2),P.Y(y2),c,wd,dash);
  const PRE={idn:[1,0,0,1],rot:[0,-1,1,0],sca:[2,0,0,1],shr:[1,1,0,1],ref:[1,0,0,-1],sqz:[1,1,1,1]};
  let a=1,b=0,c=0,d=1,px=2,py=1;
  const M=(x,y)=>[a*x+b*y,c*x+d*y];
  const sim=glab('lt-canvas',{h:w=>clamp(w*.62,330,470),view,draw(ctx,P){
    ctx.save();clip(ctx,P);ctx.strokeStyle=alpha(T.cx,.42);ctx.lineWidth=1.3;
    for(let k=-14;k<=14;k++){[[k,-14,k,14],[-14,k,14,k]].forEach(([x1,y1,x2,y2])=>{const p=M(x1,y1),q=M(x2,y2);ctx.beginPath();ctx.moveTo(P.X(p[0]),P.Y(p[1]));ctx.lineTo(P.X(q[0]),P.Y(q[1]));ctx.stroke();});}
    ctx.restore();
    const sq=[[0,0],[1,0],[1,1],[0,1]],im=sq.map(p=>M(p[0],p[1]));
    ctx.save();ctx.fillStyle=alpha(T.cx,.22);ctx.beginPath();im.forEach((p,i)=>i?ctx.lineTo(P.X(p[0]),P.Y(p[1])):ctx.moveTo(P.X(p[0]),P.Y(p[1])));ctx.closePath();ctx.fill();ctx.strokeStyle=T.cx;ctx.lineWidth=2;ctx.stroke();
    ctx.setLineDash([5,4]);ctx.strokeStyle=T.ce;ctx.lineWidth=1.8;ctx.beginPath();sq.forEach((p,i)=>i?ctx.lineTo(P.X(p[0]),P.Y(p[1])):ctx.moveTo(P.X(p[0]),P.Y(p[1])));ctx.closePath();ctx.stroke();ctx.restore();
    vec(ctx,P,0,0,a,c,T.cx);vec(ctx,P,0,0,b,d,T.ca);
    label(ctx,'î′',P.X(a)+8,P.Y(c)-10,T.cx,'left','middle',MONO);label(ctx,'ĵ′',P.X(b)+8,P.Y(d)-10,T.ca,'left','middle',MONO);
    const q=M(px,py);line(ctx,P,px,py,q[0],q[1],alpha(T.hot,.6),1.5,[4,3]);dot(ctx,P.X(px),P.Y(py),5.5,T.surface,T.hot);dot(ctx,P.X(q[0]),P.Y(q[1]),7,T.hot,T.surface);dot(ctx,P.X(0),P.Y(0),3.5,T.ink,T.surface);}});
  function upd(){const dt=a*d-b*c,q=M(px,py);
    setText('lt-m',`⟨${f2(a)} ${f2(b)}; ${f2(c)} ${f2(d)}⟩`);
    setText('lt-det',`det = ${f2(a)}·${f2(d)} − ${f2(b)}·${f2(c)} = ${f2(dt)}: `+(Math.abs(dt)<1e-9?'the plane collapses (no inverse)':`areas × ${f2(Math.abs(dt))}, orientation ${dt<0?'flipped':'kept'}`));
    setText('lt-img',`(${f2(px)}, ${f2(py)}) → (${f2(q[0])}, ${f2(q[1])})`);sim.render();}
  bindRange('lt-a',f2,v=>{a=v;upd();});bindRange('lt-b',f2,v=>{b=v;upd();});bindRange('lt-c',f2,v=>{c=v;upd();});bindRange('lt-d',f2,v=>{d=v;upd();});bindRange('lt-px',f2,v=>{px=v;upd();});bindRange('lt-py',f2,v=>{py=v;upd();});
  segBind('lt-pre','k',k=>{const p=PRE[k];set('lt-a',p[0]);set('lt-b',p[1]);set('lt-c',p[2]);set('lt-d',p[3]);});
  $('#lt-lab').addEventListener('labreset',()=>{set('lt-px',2);set('lt-py',1);set('lt-a',1);set('lt-b',0);set('lt-c',0);set('lt-d',1);});

  /* composition with a letter F */
  const s2=Math.SQRT1_2,TR={rot:[[0,-1],[1,0]],str:[[2,0],[0,1]],shr:[[1,1],[0,1]],ref:[[-1,0],[0,1]],hlf:[[.5,0],[0,.5]]};
  const NM={rot:'rotate 90°',str:'stretch x by 2',shr:'shear',ref:'reflect over the y-axis',hlf:'shrink by ½'};
  const F=[[0,0],[.7,0],[.7,1.1],[1.5,1.1],[1.5,1.7],[.7,1.7],[.7,2.4],[2,2.4],[2,3],[0,3]];
  const ap=(m,p)=>[m[0][0]*p[0]+m[0][1]*p[1],m[1][0]*p[0]+m[1][1]*p[1]];
  const mul=(X,Y)=>[[X[0][0]*Y[0][0]+X[0][1]*Y[1][0],X[0][0]*Y[0][1]+X[0][1]*Y[1][1]],[X[1][0]*Y[0][0]+X[1][1]*Y[1][0],X[1][0]*Y[0][1]+X[1][1]*Y[1][1]]];
  const mt=m=>`⟨${f2(m[0][0])} ${f2(m[0][1])}; ${f2(m[1][0])} ${f2(m[1][1])}⟩`;
  let kp='rot',kq='str';
  const poly=(ctx,P,pts,fill,stroke,wd,dash)=>{ctx.save();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(P.X(p[0]),P.Y(p[1])):ctx.moveTo(P.X(p[0]),P.Y(p[1])));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(dash)ctx.setLineDash(dash);ctx.strokeStyle=stroke;ctx.lineWidth=wd;ctx.lineJoin='round';ctx.stroke();ctx.restore();};
  const sim2=glab('lt-canvas2',{h:w=>clamp(w*.6,320,450),view:(w,h)=>{const r=(w-60)/(h-36);return {xr:[-6*r,6*r],yr:[-6,6],xn:8,yn:6};},
    draw(ctx,P){const Pm=TR[kp],Qm=TR[kq];
      poly(ctx,P,F,alpha(T.ink,.08),T.muted,2,[5,4]);
      poly(ctx,P,F.map(p=>ap(Pm,p)),null,alpha(T.cv,.9),1.8,[3,3]);
      poly(ctx,P,F.map(p=>ap(mul(Pm,Qm),p)),null,T.ca,2.6,[]);
      poly(ctx,P,F.map(p=>ap(mul(Qm,Pm),p)),alpha(T.cx,.3),T.cx,2.6);
      label(ctx,'F',P.X(.3),P.Y(3.35),T.muted,'center','middle','700 13px sans-serif');}});
  function upd2(){const QP=mul(TR[kq],TR[kp]),PQ=mul(TR[kp],TR[kq]),same=QP.every((r,i)=>r.every((v,j)=>Math.abs(v-PQ[i][j])<1e-9));
    setText('lt-qp',`${NM[kp]}, then ${NM[kq]}: ${mt(QP)}`);setText('lt-pq',`${NM[kq]}, then ${NM[kp]}: ${mt(PQ)}`);setText('lt-same',same?'yes: these two commute':'no: the order matters');sim2.render();}
  segBind('lt-p','k',k=>{kp=k;upd2();});segBind('lt-q','k',k=>{kq=k;upd2();});
  drawers.lintrans=()=>{sim.render();sim2.render();};
  KEYS['lt-canvas']=['Blue grid and shaded parallelogram: the image of the plane and of the unit square (gold dashed). Blue arrow: where î goes. Magenta arrow: where ĵ goes. Orange: your test point and its image.',[['cx','image of the grid'],['ca','image of ĵ'],['ce','unit square'],['hot','test point']]];
  KEYS['lt-canvas2']=['Dashed grey: the letter F. Green dashed: after the first move. Blue filled: first, then second. Magenta outline: second, then first.',[['cv','after the first move'],['cx','first then second'],['ca','second then first']]];
  TIPS['lt-pre:sqz']='A determinant of 0 flattens the plane onto a line.';
  GLOSS['linear transformation']='A function ⟨x, y⟩ → ⟨ax + by, cx + dy⟩ given by a matrix. It keeps grid lines straight and fixes the origin.';
  TT.lintrans='Ask students to predict the columns of a rotation before using the matrix, then check with the picture. Compare the two orders of composition.';
  GLYPH.lintrans='<path d="M3 20 L14 20 L19 6 L8 6 Z" fill="var(--cx)" fill-opacity=".25" stroke="var(--cx)" stroke-width="2"/><path d="M3 20 H19 M3 20 V6" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="3 2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  const MT=(a,b,c,d)=>`⟨${sg(a)} ${sg(b)}; ${sg(c)} ${sg(d)}⟩`;
  PROBS.push({id:'lt-img',topic:'lintrans',title:'Image of a point',gen(){const a=ri(-4,4),b=ri(-4,4),c=ri(-4,4),d=ri(-4,4),x=ri(-5,5),y=ri(-5,5),ans=a*x+b*y;
    return {q:`The transformation M = ${MT(a,b,c,d)} sends (x, y) to M⟨x, y⟩. Find the x-coordinate of the image of (${x}, ${y}).`,ans,unit:'',abs:.01,chk:x*a+y*b,show:String(ans),hint:'The new x is a·x + b·y (the top row of M times the point).',sol:`${sg(a)}·${sg(x)} + ${sg(b)}·${sg(y)} = <b>${sg(ans)}</b>. (The new y is ${sg(c*x+d*y)}.)`};}});
  PROBS.push({id:'lt-col',topic:'lintrans',title:'Image from the basis vectors',gen(){const p=ri(-4,4),q=ri(-4,4),r=ri(-4,4),s=ri(-4,4),m=ri(-4,4),n=ri(-4,4),ans=p*m+r*n;
    return {q:`A linear transformation sends î = ⟨1, 0⟩ to ⟨${sg(p)}, ${sg(q)}⟩ and ĵ = ⟨0, 1⟩ to ⟨${sg(r)}, ${sg(s)}⟩. Find the x-coordinate of the image of (${m}, ${n}).`,ans,unit:'',abs:.01,chk:m*p+n*r,show:String(ans),hint:'(m, n) = m·î + n·ĵ, so its image is m times the image of î plus n times the image of ĵ.',sol:`${sg(m)}·${sg(p)} + ${sg(n)}·${sg(r)} = <b>${sg(ans)}</b>. (The y-coordinate is ${sg(m*q+n*s)}.)`};}});
  PROBS.push({id:'lt-area',topic:'lintrans',title:'Area after a transformation',gen(){let a,b,c,d,dt;do{a=ri(-4,4);b=ri(-4,4);c=ri(-4,4);d=ri(-4,4);dt=a*d-b*c;}while(dt===0);const A0=pick([2,3,4,5,6,10]),ans=Math.abs(dt)*A0;
    const u=[a,c],v=[b,d];const chk=A0*Math.abs(u[0]*v[1]-u[1]*v[0]);
    return {q:`A region of area ${A0} is transformed by M = ${MT(a,b,c,d)}. What is the area of its image?`,ans,unit:'',abs:.01,chk,show:String(ans),hint:'Areas are multiplied by |det M| = |ad − bc|.',sol:`det M = ${sg(a)}·${sg(d)} − ${sg(b)}·${sg(c)} = ${sg(dt)}, so the area is |${sg(dt)}| · ${A0} = <b>${ans}</b>.`};}});
  PROBS.push({id:'lt-rot',topic:'lintrans',title:'Rotate a point',gen(){const th=pick([30,45,60,90,120,150]),x=ri(1,8),y=ri(-6,6),ans=x*Math.cos(th*Math.PI/180)-y*Math.sin(th*Math.PI/180);
    const r=Math.hypot(x,y),phi=Math.atan2(y,x),chk=r*Math.cos(phi+th*Math.PI/180);
    return {q:`Rotate the point (${x}, ${y}) counterclockwise by ${th}° about the origin. Find the x-coordinate of the image. Round to 3 decimal places.`,ans,unit:'',abs:.0015,chk,show:ans.toFixed(3),hint:'x′ = x cos θ − y sin θ (the top row of the rotation matrix).',sol:`x′ = ${x} cos ${th}° − ${sg(y)} sin ${th}° ≈ <b>${ans.toFixed(3)}</b>. (y′ = x sin θ + y cos θ ≈ ${(x*Math.sin(th*Math.PI/180)+y*Math.cos(th*Math.PI/180)).toFixed(3)}.)`};}});
  PROBS.push({id:'lt-back',topic:'lintrans',title:'Undo a transformation',gen(){let a,b,c,d,dt,x=ri(-5,5),y=ri(-5,5);do{a=ri(-4,4);b=ri(-4,4);c=ri(-4,4);d=ri(-4,4);dt=a*d-b*c;}while(dt===0||!a);const X=a*x+b*y,Y=c*x+d*y;
    const m=c/a,y2=(Y-m*X)/(d-m*b),x2=(X-b*y2)/a;
    return {q:`M = ${MT(a,b,c,d)} sends a point to (${sg(X)}, ${sg(Y)}). What was the x-coordinate of the original point?`,ans:x,unit:'',abs:.01,chk:x2,show:String(x),hint:'Apply the inverse matrix: (1/det)⟨d −b; −c a⟩ to the image, or solve the two equations.',sol:`det M = ${sg(dt)}, so x = (${sg(d)}·${sg(X)} − ${sg(b)}·${sg(Y)})/${sg(dt)} = <b>${sg(x)}</b> (and y = ${sg(y)}).`};}});
  PROBS.push({id:'lt-order',topic:'lintrans',title:'Which product composes the moves?',gen(){const nm=pick([['R','S'],['A','B'],['P','Q'],['F','G']]),right=`${nm[1]}${nm[0]}`,{choices,ans}=mcq(right,[`${nm[0]}${nm[1]}`,`${nm[0]} + ${nm[1]}`,`${nm[1]}⁻¹${nm[0]}`].filter(v=>v!==right),4);
    return {q:`Transformation ${nm[0]} is applied first, and then transformation ${nm[1]}. Which matrix does both moves in one step?`,choices,ans,hint:'The first move is written on the right, next to the point it acts on.',sol:`The point is multiplied by ${nm[0]} first, then by ${nm[1]}: ${nm[1]}(${nm[0]}x) = <b>${right}</b>x.`};}});
  PROBS.push({id:'lt-sign',topic:'lintrans',title:'What the determinant says',gen(){const dt=pick([-4,-2,-1,-3,2,3,5,.5,0]);let right,sol;
    if(dt===0){right='flattens the plane onto a line or point: no inverse';sol='det = 0: all of the plane collapses.';}else if(dt<0){right=`multiplies areas by ${Math.abs(dt)} and flips orientation`;sol='Areas scale by |det| and the negative sign flips orientation.';}else{right=`multiplies areas by ${dt} and keeps orientation`;sol='Areas scale by |det| = det and a positive sign keeps orientation.';}
    const pool=[`multiplies areas by ${Math.abs(dt)||1} and flips orientation`,`multiplies areas by ${Math.abs(dt)||1} and keeps orientation`,'flattens the plane onto a line or point: no inverse',`multiplies areas by ${dt<0?dt:-dt}`];
    const {choices,ans}=mcq(right,pool.filter(v=>v!==right),4);
    return {q:`A transformation has determinant ${sg(dt)}. It …`,choices,ans,hint:'Areas scale by |det|; the sign tells whether orientation flips; 0 means collapse.',sol};}});
})();
