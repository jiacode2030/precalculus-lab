/* ---------------- 2.8 Inverse functions ---------------- */
(function inverse(){
  const cv=$('#iv-canvas');if(!cv)return;
  const FN={lin:{f:x=>2*x+1,g:x=>(x-1)/2,inv:'(x − 1)/2',dom:'all reals',ran:'all reals'},
    cub:{f:x=>x**3+1,g:x=>Math.cbrt(x-1),inv:'∛(x − 1)',dom:'all reals',ran:'all reals'},
    sqr:{f:x=>x>=0?x*x:NaN,g:x=>x>=0?Math.sqrt(x):NaN,inv:'√x',dom:'x ≥ 0',ran:'y ≥ 0'},
    exp:{f:x=>2**x,g:x=>x>0?Math.log2(x):NaN,inv:'log₂ x',dom:'all reals',ran:'y > 0'}};
  let fk='lin',a=1;
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const xa=()=>fk==='sqr'?Math.abs(a):a;
  const sim=glab('iv-canvas',{h:w=>clamp(w*.62,320,460),view:(w,h)=>{const r=(w-60)/(h-36);return {xr:[-6*r,6*r],yr:[-6,6],xn:8,yn:6};},
    draw(ctx,P){const F=FN[fk],R=P.xr[1];
      line(ctx,P,-R,-R,R,R,T.ce,1.6,[6,5]);
      curveD(ctx,P,F.f,-R,R,T.cx,3.2,900);curveD(ctx,P,F.g,-R,R,T.cv,3.2,900);
      const x=xa(),y=F.f(x);if(isFinite(y)){line(ctx,P,x,y,y,x,alpha(T.hot,.6),1.4,[4,3]);
        dot(ctx,P.X(x),P.Y(y),6.5,T.hot,T.surface);dot(ctx,P.X(y),P.Y(x),6.5,T.hot,T.surface);}
      label(ctx,'blue: f   green: f⁻¹   gold dashed: y = x',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd(){const F=FN[fk],x=xa(),y=F.f(x);
    setText('iv-pt',`(${f2(x)}, ${f2(y)})  →  (${f2(y)}, ${f2(x)})`);setText('iv-inv',`f⁻¹(x) = ${F.inv}`);setText('iv-dr',`dom f: ${F.dom};  ran f: ${F.ran}`);sim.render();}
  bindRange('iv-a',f2,v=>{a=v;upd();});segBind('iv-fn','k',k=>{fk=k;upd();});

  const F2={lin:{f:x=>3*x-4,g:y=>(y+4)/3,t:'3x − 4',inv:'(x + 4)/3'},cub:{f:x=>x**3+2,g:y=>Math.cbrt(y-2),t:'x³ + 2',inv:'∛(x − 2)'},rec:{f:x=>12/x,g:y=>12/y,t:'12/x',inv:'12/x'}};
  let k2='lin',x2=3;
  const sim2=sim2d($('#iv-canvas2'),{h:w=>clamp(w*.3,190,240),draw(ctx,w,h){const F=F2[k2],y=F.f(x2),back=F.g(y),cy=h*.5,bw=Math.min(120,w*.2),xs=[w*.1,w*.34,w*.56,w*.8];
    const box=(cx,txt,c,on)=>{ctx.fillStyle=alpha(c,on?.2:.1);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(cx-bw/2,cy-24,bw,48,10);ctx.fill();ctx.stroke();label(ctx,txt,cx,cy,T.ink,'center','middle','700 15px "IBM Plex Mono",monospace');};
    box(xs[0],`x = ${f2(x2)}`,T.hot,true);box(xs[1],`f(x) = ${f2(y)}`,T.cx,true);box(xs[2],`f⁻¹ = ${f2(back)}`,T.cv,true);
    [[xs[0],xs[1],'f',T.cx],[xs[1],xs[2],'f⁻¹',T.cv]].forEach(([p,q,t,c])=>{arrow(ctx,p+bw/2+6,cy,q-bw/2-6,cy,c,3);label(ctx,t,(p+q)/2,cy-16,c,'center','middle','700 13px "IBM Plex Mono",monospace');});
    arrow(ctx,xs[2]+bw/2+6,cy,xs[3]-bw/2+10,cy,T.ce,2.4);label(ctx,Math.abs(back-x2)<1e-9?'back to x ✓':'not back',xs[3]+4,cy,Math.abs(back-x2)<1e-9?T.cv:T.hot,'center','middle',LABEL);}});
  function upd2(){const F=F2[k2],y=F.f(x2);setText('iv-fx',f2(y));setText('iv-back',f2(F.g(y)));setText('iv-form',F.inv);sim2.render();}
  bindRange('iv-x',String,v=>{x2=v;upd2();});segBind('iv-fn2','k',k=>{k2=k;upd2();});
  drawers.inverse=()=>{sim.render();sim2.render();};
  KEYS['iv-canvas']=['Blue is f and green is f⁻¹: mirror images over the gold dashed line y = x. The orange points are (a, b) and its mirror (b, a).',[['cx','f'],['cv','f⁻¹'],['ce','y = x'],['hot','a point and its mirror']]];
  KEYS['iv-canvas2']=['Send x through f, then through f⁻¹. You get x back.',[['hot','input'],['cx','f(x)'],['cv','f⁻¹ of that']]];
  TIPS['iv-fn:sqr']='x² is not one-to-one on all reals, so we keep x ≥ 0.';TIPS['iv-fn2:rec']='This function is its own inverse.';
  GLOSS['one-to-one']='A function in which each output comes from exactly one input; a horizontal line meets its graph at most once.';GLOSS['inverse function']='The function f⁻¹ that undoes f: f⁻¹(f(x)) = x.';GLOSS['horizontal line test']='A graph is the graph of a one-to-one function exactly when no horizontal line meets it twice.';
  TT.inverse='Ask "what does this function do to x?" and have students list the undoing steps in reverse order. The reflection picture confirms it.';
  GLYPH.inverse='<path d="M3 21 L21 3" stroke="var(--ce)" stroke-width="1.6" stroke-dasharray="3 2"/><path d="M4 18 C10 16, 14 10, 16 4" stroke="var(--cx)" stroke-width="2" fill="none"/><path d="M18 4 C16 10, 10 14, 4 16" stroke="var(--cv)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),lin=(a,b)=>`${a===1?'':a===-1?'−':sg(a)}x${b?(b<0?' − ':' + ')+Math.abs(b):''}`;
  const bis=(f,lo,hi,t)=>{for(let i=0;i<200;i++){const m=(lo+hi)/2;if((f(m)<t)===(f(hi)>f(lo)))lo=m;else hi=m;}return (lo+hi)/2;};
  PROBS.push({id:'iv-lin',topic:'inverse',title:'Inverse of a linear function',gen(){const m=pick([-4,-3,-2,2,3,4,5]),b=ri(-9,9),k=ri(-12,12),ans=(k-b)/m;
    return {q:`f(x) = ${lin(m,b)}. Find f⁻¹(${sg(k)}).`,ans,unit:'',abs:.001,chk:bis(x=>m*x+b,-100,100,k),show:frac(ans),hint:'f⁻¹(k) is the input x for which f(x) = k. Solve m·x + b = k.',sol:`Solve ${lin(m,b)} = ${sg(k)}: x = (${sg(k)} ${b<0?'+':'−'} ${Math.abs(b)})/${m<0?'('+sg(m)+')':sg(m)} = <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'iv-cube',topic:'inverse',title:'Inverse of a cube',gen(){const a=pick([1,2,-1,3,.5]),b=ri(-8,8),r=ri(-3,3),k=a*r**3+b,ans=r;
    return {q:`f(x) = ${a===1?'':a===-1?'−':sg(a)}x³ ${b<0?'−':'+'} ${Math.abs(b)}. Find f⁻¹(${sg(k)}).`.replace('x³ + 0','x³').replace('x³ − 0','x³'),ans,unit:'',abs:.001,chk:bis(x=>a*x**3+b,-50,50,k),hint:'Solve f(x) = the given value for x: undo the constant, divide by the coefficient, take the cube root.',sol:`${a===1?'':sg(a)}x³ = ${sg(k-b)}, so x³ = ${sg((k-b)/a)} and x = <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'iv-sq',topic:'inverse',title:'Inverse of a restricted quadratic',gen(){const h=ri(-4,4),kk=ri(-5,5),r=ri(1,6),m=kk+r*r,ans=h+r;
    return {q:`f(x) = (x ${h<0?'+':'−'} ${Math.abs(h)||0})² ${kk<0?'−':'+'} ${Math.abs(kk)} for x ≥ ${sg(h)}. Find f⁻¹(${sg(m)}).`.replace('(x − 0)','x'),ans,unit:'',abs:.001,chk:bis(x=>(x-h)**2+kk,h,h+100,m),hint:'Solve (x − h)² + k = the value, and keep the root that satisfies the domain x ≥ h.',sol:`(x ${h<0?'+':'−'} ${Math.abs(h)})² = ${sg(m-kk)}, so x ${h<0?'+':'−'} ${Math.abs(h)} = ±${r}. Since x ≥ ${sg(h)}, take +${r}: x = <b>${sg(ans)}</b>.`};}});
  const FNS=[['2x + 5','yes'],['x³ − 1','yes'],['x² + 1','no'],['|x − 2|','no'],['x⁵','yes'],['3 − x','yes'],['x² for x ≥ 0','yes'],['x⁴ − x²','no'],['2ˣ','yes'],['−x² for x ≤ 0','yes']];
  PROBS.push({id:'iv-ok',topic:'inverse',title:'Does it have an inverse?',gen(){const [s,r]=pick(FNS),right=r==='yes'?'yes, it is one-to-one':'no, two inputs give the same output',{choices,ans}=mcq(right,['yes, it is one-to-one','no, two inputs give the same output'].filter(v=>v!==right),2);
    return {q:`Does f(x) = ${s} have an inverse function on its stated domain (all real numbers if none is given)?`,choices,ans,hint:'Look for two different inputs with the same output: any pair x and −x for an even function.',sol:r==='yes'?'Each output comes from exactly one input, so <b>it is one-to-one</b>.':'Different inputs share an output (for example x and a different x give the same value), so <b>it has no inverse as given</b>.'};}});
})();
