/* ---------------- 1.12 Transformations of functions ---------------- */
(function transform(){
  const cv=$('#tr-canvas');if(!cv)return;
  const KEY=[[-2,1],[0,3],[2,-1],[4,0]];
  const BASE={bump:{pts:KEY,f:null,t:'f'},cubic:{pts:[[-2,-2],[-1,2],[1,-2],[2,2]],f:x=>x**3-3*x,t:'f'},inv:{pts:[[-2,-.5],[-1,-1],[1,1],[2,.5]],f:x=>1/x,t:'f'},abs:{pts:[[-2,2],[0,0],[1,1],[2,2]],f:Math.abs,t:'f'}};
  let bk='bump',a=1,b=1,h=0,k=0;
  const sg=v=>fmt(v,1).replace(/\.0$/,'').replace('-','−');
  const co=(v)=>v===1?'':v===-1?'−':sg(v);
  const inner=(b,h)=>h===0?`${co(b)}x`:b===1?`x ${h<0?'+':'−'} ${sg(Math.abs(h))}`:`${co(b)}(x ${h<0?'+':'−'} ${sg(Math.abs(h))})`;
  const gtxt=()=>`g(x) = ${a===1?'':a===0?'0·':co(a)}f(${inner(b,h)})${k===0?'':(k<0?' − ':' + ')+sg(Math.abs(k))}`;
  const img=([x,y])=>[x/b+h,a*y+k];
  const sim=glab('tr-canvas',{h:w=>clamp(w*.5,290,400),view:()=>({xr:[-8,8],yr:[-8,8],xn:8,yn:4}),draw(ctx,P){const B=BASE[bk];
    /* original */
    if(bk==='bump'){ctx.beginPath();KEY.forEach(([x,y],i)=>{i?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y));});ctx.strokeStyle=T.cx;ctx.lineWidth=3;ctx.stroke();}
    else curveD(ctx,P,B.f,-8,8,T.cx,3,1800);
    if(bk==='inv'){vline(ctx,P,h,alpha(T.ce,.9),[6,4]);hline(ctx,P,k,alpha(T.ce,.9),[6,4]);}
    if(b!==0){
      if(bk==='bump'){const Q=KEY.map(img).sort((p,q)=>p[0]-q[0]);ctx.beginPath();Q.forEach(([x,y],i)=>{i?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y));});ctx.strokeStyle=T.cv;ctx.lineWidth=3.2;ctx.stroke();}
      else curveD(ctx,P,x=>a*B.f(b*(x-h))+k,-8,8,T.cv,3.2,1800);
      B.pts.forEach(p=>{const q=img(p);line(ctx,P,p[0],p[1],q[0],q[1],alpha(T.hot,.45),1.3,[3,3]);dot(ctx,P.X(p[0]),P.Y(p[1]),4.5,T.cx,T.surface);dot(ctx,P.X(q[0]),P.Y(q[1]),5,T.cv,T.surface);});
      const p0=B.pts[0],q0=img(p0);dot(ctx,P.X(q0[0]),P.Y(q0[1]),6,T.hot,T.surface);}
    label(ctx,'blue: f   green: g',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  const rng=()=>{if(a===0)return `{${sg(k)}}`;
    if(bk==='cubic')return 'all real numbers';
    if(bk==='inv')return `all real numbers except ${sg(k)}`;
    if(bk==='abs')return a>0?`[${sg(k)}, ∞)`:`(−∞, ${sg(k)}]`;
    const lo=a>0?-a+k:3*a+k,hi=a>0?3*a+k:-a+k;return `[${sg(lo)}, ${sg(hi)}]`;};
  const sym=()=>bk==='bump'?'none':bk==='abs'?`mirror line x = ${sg(h)}`:`odd about the point (${sg(h)}, ${sg(k)})`;
  function upd(){if(b===0){setText('tr-eq','b = 0 is not allowed (g would not depend on x)');setText('tr-pt','—');setText('tr-dom','—');setText('tr-sym','—');sim.render();return;}
    setText('tr-eq',gtxt());const p=BASE[bk].pts[0],q=img(p);setText('tr-pt',`(${sg(p[0])}, ${sg(p[1])}) → (${sg(q[0])}, ${sg(q[1])})`);setText('tr-dom',rng());setText('tr-sym',sym());sim.render();}
  bindRange('tr-a',sg,v=>{a=v;upd();});bindRange('tr-b',sg,v=>{b=v;upd();});bindRange('tr-h',sg,v=>{h=v;upd();});bindRange('tr-k',sg,v=>{k=v;upd();});
  segBind('tr-base','k',kk=>{bk=kk;upd();});

  /* stage by stage */
  const EX={e1:{a:-2,b:2,h:1,k:1},e2:{a:.5,b:1,h:-2,k:-3},e3:{a:1,b:-1,h:0,k:2}};
  let ek='e1',st=0;
  const stage=(p,E,s)=>{let [x,y]=p;if(s>=1)x=x/E.b;if(s>=2)x+=E.h;if(s>=3)y*=E.a;if(s>=4)y+=E.k;return [x,y];};
  const sim2=glab('tr-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[-8,8],yr:[-8,8],xn:8,yn:4}),draw(ctx,P){const E=EX[ek];
    ctx.beginPath();KEY.forEach(([x,y],i)=>{i?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y));});ctx.strokeStyle=alpha(T.cx,.55);ctx.lineWidth=2.4;ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);
    const Q=KEY.map(p=>stage(p,E,st)).sort((p,q)=>p[0]-q[0]);ctx.beginPath();Q.forEach(([x,y],i)=>{i?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y));});ctx.strokeStyle=T.cv;ctx.lineWidth=3.2;ctx.stroke();
    KEY.forEach(p=>{const q=stage(p,E,st);dot(ctx,P.X(q[0]),P.Y(q[1]),5,T.cv,T.surface);});
    const q0=stage(KEY[0],E,st);dot(ctx,P.X(q0[0]),P.Y(q0[1]),6.5,T.hot,T.surface);
    label(ctx,`stage ${st} of 4`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  const WHAT=[()=>'the original graph f',E=>`horizontal: x → x/${sg(E.b)}`+(E.b<0?' (flips over the y-axis)':Math.abs(E.b)===1?' (no change)':'' ),E=>`shift: x → x ${E.h<0?'−':'+'} ${sg(Math.abs(E.h))}`+(E.h===0?' (no change)':''),E=>`vertical: y → ${sg(E.a)}·y`+(E.a<0?' (flips over the x-axis)':E.a===1?' (no change)':''),E=>`shift: y → y ${E.k<0?'−':'+'} ${sg(Math.abs(E.k))}`];
  function upd2(){const E=EX[ek],q=stage(KEY[0],E,st);setText('tr-stage',WHAT[st](E));setText('tr-order',`(${sg(q[0])}, ${sg(q[1])})`);sim2.render();}
  bindRange('tr-st',String,v=>{st=v;upd2();});segBind('tr-ex','k',kk=>{ek=kk;upd2();});
  drawers.transform=()=>{sim.render();sim2.render();};
  KEYS['tr-canvas']=['Blue is f, green is g. The thin orange lines connect each key point of f to its image; the big orange dot follows the first key point.',[['cx','f'],['cv','g'],['hot','key point images'],['ce','asymptotes (for 1/x)']]];
  KEYS['tr-canvas2']=['Dashed blue: f. Green: the graph after the stage you pick. Do horizontal first, then the shift h, then vertical, then the shift k.',[['cx','f'],['cv','g so far'],['hot','first key point']]];
  TIPS['tr-b']=el=>`b = ${el.value}: the graph is ${Math.abs(el.value)>1?'squeezed':Math.abs(el.value)<1?'stretched':'unchanged'} horizontally${+el.value<0?' and flipped over the y-axis':''}.`;
  TIPS['tr-h']=el=>`h = ${el.value}: moves the graph ${+el.value>=0?'right':'left'} ${Math.abs(el.value)}.`;TIPS['tr-a']=el=>`a = ${el.value}: stretches by ${Math.abs(el.value)}${+el.value<0?' and flips over the x-axis':''}.`;
  GLOSS['reflection']='A flip of the graph over an axis: a < 0 flips over the x-axis, b < 0 flips over the y-axis.';GLOSS['transformation']='A change of a graph by shifting, stretching, compressing or reflecting it.';
  TT.transform='Ask for the image of one key point before showing the graph. Insist on the order: horizontal changes, shift h, vertical changes, shift k.';
  GLYPH.transform='<path d="M3 18 L8 8 L13 14 L18 6" stroke="var(--cx)" stroke-width="2" fill="none" stroke-dasharray="3 2"/><path d="M6 20 L11 10 L16 16 L21 8" stroke="var(--cv)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+v.toFixed(3)).replace('-','−'),co=v=>v===1?'':v===-1?'−':sg(v);
  const inner=(b,h)=>h===0?`${co(b)}x`:b===1?`x ${h<0?'+':'−'} ${Math.abs(h)}`:`${co(b)}(x ${h<0?'+':'−'} ${Math.abs(h)})`;
  const gform=(a,b,h,k)=>`g(x) = ${co(a)}f(${inner(b,h)})${k?(k<0?' − ':' + ')+Math.abs(k):''}`;
  const scan=e=>{let best=1e9,bx=0;for(let x=-60;x<=60;x+=.01){const v=e(x);if(v<best){best=v;bx=x;}}return bx;};
  PROBS.push({id:'tr-point',topic:'transform',title:'Where does the point go?',gen(){const a=pick([-3,-2,-1,2,3,.5]),b=pick([2,-2,3,-1,4]),h=ri(-4,4),k=ri(-4,4),p=b*ri(-3,3),q=ri(-5,5)*(Math.abs(a)===.5?2:1),wantX=Math.random()<.5;
    const ans=wantX?h+p/b:a*q+k;
    return {q:`The graph of f passes through (${sg(p)}, ${sg(q)}). The graph of ${gform(a,b,h,k)} passes through a point whose ${wantX?'x':'y'}-coordinate is?`,ans,unit:'',abs:.001,chk:wantX?scan(x=>Math.abs(b*(x-h)-p)):a*q+k,
      hint:'The point (x, y) goes to (x/b + h, a·y + k).',sol:`x: ${sg(p)}/${sg(b)} ${h<0?'−':'+'} ${Math.abs(h)} = ${sg(h+p/b)}. y: ${sg(a)}·${sg(q)} ${k<0?'−':'+'} ${Math.abs(k)} = ${sg(a*q+k)}. The ${wantX?'x':'y'}-coordinate is <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'tr-zero',topic:'transform',title:'Where is the zero of g?',gen(){const b=pick([2,-2,3,-1,4,.5]),h=ri(-4,4),z=b*ri(-3,3)||b*2,a=pick([-2,2,3]),k=0,ans=z/b+h;
    return {q:`f has a zero at x = ${sg(z)}. Find a zero of ${gform(a,b,h,k)}.`,ans,unit:'',abs:.001,chk:scan(x=>Math.abs(b*(x-h)-z)),hint:'g(x) = 0 when the input of f equals the zero of f: solve b(x − h) = z.',
      sol:`Solve ${co(b)}${h===0?'x':`(x ${h<0?'+':'−'} ${Math.abs(h)})`} = ${sg(z)}: x = ${sg(z)}/${sg(b)} ${h<0?'−':'+'} ${Math.abs(h)} = <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'tr-range',topic:'transform',title:'Largest value of g',gen(){const m=ri(-6,0),M=ri(1,7),a=pick([-3,-2,-1,2,3]),b=pick([2,3,-1,-2]),h=ri(-3,3),k=ri(-5,5),ans=a>0?a*M+k:a*m+k;
    const f=x=>(M+m)/2+(M-m)/2*Math.sin(x);let best=-1e9;for(let x=h;x<=h+2*Math.PI/Math.abs(b);x+=.002)best=Math.max(best,a*f(b*(x-h))+k);
    return {q:`f has range [${sg(m)}, ${sg(M)}]. What is the largest value of ${gform(a,b,h,k)}?`,ans,unit:'',abs:.001,chk:best,hint:'Only a and k change the outputs. If a is negative, the old minimum becomes the new maximum.',
      sol:`${a>0?`a > 0, so the maximum of g is a·${sg(M)} + k`:`a < 0, so the maximum of g comes from the minimum of f: a·${sg(m)} + k`} = ${sg(a)}·${sg(a>0?M:m)} ${k<0?'−':'+'} ${Math.abs(k)} = <b>${sg(ans)}</b>.`};}});
})();
