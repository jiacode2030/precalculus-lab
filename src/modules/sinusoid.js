/* ---------------- 3.5–3.6 Sinusoidal transformations ---------------- */
(function sinusoid(){
  const cv=$('#sn-canvas');if(!cv)return;
  let a=2,b=1,c=0,d=0,fn='sin',drag=null;
  const F=t=>a*(fn==='sin'?Math.sin:Math.cos)(b*(t+c))+d;
  /* the first maximum to the right of θ = −c: b(θ + c) = π/2 for sin, 0 for cos (if a > 0; otherwise a min is there) */
  const peak=()=>{const u=(fn==='sin'?Math.PI/2:0)+(a<0?Math.PI:0);let t=u/b-c;const p=TAU/b;while(t<0)t+=p;while(t>p)t-=p;return t;};
  const sim=glab('sn-canvas',{h:w=>clamp(w*.5,260,380),view:()=>({xr:[-.3,TAU+.3],yr:[-5.4,5.4],xn:8,yn:6,xt:false}),draw(ctx,P){
    curveD(ctx,P,fn==='sin'?Math.sin:Math.cos,-.3,TAU+.3,T.muted,1.6,300,[5,5]);
    hline(ctx,P,d,T.ce);line(ctx,P,-.3,d+Math.abs(a),TAU+.3,d+Math.abs(a),alpha(T.ce,.5),1,[2,4]);line(ctx,P,-.3,d-Math.abs(a),TAU+.3,d-Math.abs(a),alpha(T.ce,.5),1,[2,4]);
    const p=TAU/b,t0=-c+(Math.ceil((-.3+c)/p))*p;
    /* one cycle highlighted, starting where the parent's cycle starts */
    let s0=-c;while(s0<-.3)s0+=p;while(s0-p>=-.3)s0-=p;
    if(s0+p<=TAU+.3)line(ctx,P,s0,d-Math.abs(a)-.45,s0+p,d-Math.abs(a)-.45,T.hot,2.4);
    curveD(ctx,P,F,-.3,TAU+.3,T.cx,2.8,600);
    const tp=peak();line(ctx,P,tp,d,tp,F(tp),T.ca,2.6);dot(ctx,P.X(tp),P.Y(F(tp)),7,T.hot,T.surface);dot(ctx,P.X(s0),P.Y(d),6,T.ce,T.surface);
    ['π/2','π','3π/2','2π'].forEach((s,i)=>label(ctx,s,P.X((i+1)*Math.PI/2),P.Y(-5.4)-8,T.muted,'center','middle',MONO));
    label(ctx,'drag the orange max or the gold midline dot',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);},
    drag(k,x,y){if(k==='up'){drag=null;return;}const tp=peak();
      if(k==='down'){drag=Math.hypot(x-tp,(y-F(tp))/1.8)<.45?'max':Math.abs(y-d)<.5?'mid':null;return;}
      if(drag==='max'){const na=clamp(Math.round((y-d)*10)/10,-3,3);a=Math.abs(na)<.1?.1:na;const u=(fn==='sin'?Math.PI/2:0)+(a<0?Math.PI:0);c=clamp(Math.round((u/b-x)*100)/100,-3.14,3.14);set('sn-a',a);set('sn-c',c);}
      else if(drag==='mid'){d=clamp(Math.round(y*10)/10,-2,2);set('sn-d',d);}upd();}});
  function set(id,v){$('#'+id).value=v;}
  const num=v=>{const m=[[Math.PI,'π'],[Math.PI/2,'π/2'],[Math.PI/4,'π/4'],[Math.PI/3,'π/3'],[Math.PI/6,'π/6'],[3*Math.PI/4,'3π/4'],[2*Math.PI/3,'2π/3']].find(([q])=>Math.abs(Math.abs(v)-q)<.006);return m?(v<0?'−':'')+m[1]:nz(+v.toFixed(2));};
  function upd(){const per=TAU/b,inner=Math.abs(c)<.005?`${b===1?'':nz(b)}θ`:`${b===1?'':nz(b)}(θ ${c<0?'−':'+'} ${num(Math.abs(c))})`;
    setHTML('sn-eq',`f(θ) = ${a===1?'':a===-1?'−':nz(a)} ${fn}(${inner})${Math.abs(d)<.05?'':` ${d<0?'−':'+'} ${nz(Math.abs(d))}`}`);
    setText('sn-amp',`|a| = ${nz(Math.abs(a))}${a<0?' (flipped)':''}`);setText('sn-per',`2π/${nz(b)} = ${num(per)===nz(+per.toFixed(2))?fmt(per,3):num(per)+' ≈ '+fmt(per,3)}`);
    setText('sn-ph',Math.abs(c)<.005?'none':`${num(Math.abs(c))} to the ${c>0?'left':'right'}`);setText('sn-mid',`y = ${nz(d)} · [${nz(+(d-Math.abs(a)).toFixed(2))}, ${nz(+(d+Math.abs(a)).toFixed(2))}]`);
    ['sn-a','sn-b','sn-c','sn-d'].forEach(id=>{const o=$('#'+id+'-out');if(o)o.textContent=nz(+$('#'+id).value);});sim.render();}
  bindRange('sn-a',nz,v=>{a=Math.abs(v)<.05?.1*Math.sign(v||1):v;upd();});bindRange('sn-b',nz,v=>{b=v;upd();});bindRange('sn-c',nz,v=>{c=v;upd();});bindRange('sn-d',nz,v=>{d=v;upd();});
  segBind('sn-fn','k',k=>{fn=k;upd();});

  /* build a sinusoid through a maximum and the next minimum */
  let M=[1,3],m=[3,-1],dr=null;
  const sim2=glab('sn-canvas2',{h:w=>clamp(w*.5,250,360),view:()=>({xr:[-.5,8.5],yr:[-4.5,4.5],xn:8,yn:6}),draw(ctx,P){
    const A=(M[1]-m[1])/2,D=(M[1]+m[1])/2,half=m[0]-M[0],B=Math.PI/half,f=t=>A*Math.cos(B*(t-M[0]))+D;
    hline(ctx,P,D,T.ce);line(ctx,P,M[0],D,M[0],M[1],T.ca,2.4);line(ctx,P,M[0],m[1]-.35,m[0],m[1]-.35,T.hot,2.4);label(ctx,'half a period',P.X((M[0]+m[0])/2),P.Y(m[1]-.35)+14,T.hot,'center','middle',MONO);
    curveD(ctx,P,f,-.5,8.5,T.cx,2.8,500);dot(ctx,P.X(M[0]),P.Y(M[1]),8,T.cx,T.surface);dot(ctx,P.X(m[0]),P.Y(m[1]),8,T.ca,T.surface);
    label(ctx,'max',P.X(M[0]),P.Y(M[1])-16,T.cx,'center','middle',LABEL);label(ctx,'min',P.X(m[0]),P.Y(m[1])+16,T.ca,'center','middle',LABEL);},
    drag(k,x,y){if(k==='up'){dr=null;return;}const P=null;if(k==='down'){dr=Math.hypot(x-M[0],y-M[1])<Math.hypot(x-m[0],y-m[1])?'M':'m';}
      const sx=Math.round(x*4)/4,sy=Math.round(y*4)/4;
      if(dr==='M'){M=[clamp(sx,0,m[0]-.5),clamp(sy,m[1]+.5,4)];}else if(dr==='m'){m=[clamp(sx,M[0]+.5,8),clamp(sy,-4,M[1]-.5)];}upd2();}});
  function upd2(){const A=(M[1]-m[1])/2,D=(M[1]+m[1])/2,per=2*(m[0]-M[0]),B=TAU/per;
    setText('sn-feat',`${nz(A)} · y = ${nz(D)}`);setText('sn-p2',`2 × ${nz(m[0]-M[0])} = ${nz(per)}`);
    setText('sn-eq2',`f(θ) = ${nz(A)} cos(${fmt(B,3)}(θ ${M[0]<0?'+':'−'} ${nz(Math.abs(M[0]))}))${Math.abs(D)<1e-9?'':` ${D<0?'−':'+'} ${nz(Math.abs(D))}`}`);sim2.render();}
  upd2();
  drawers.sinusoid=()=>{sim.render();sim2.render();};
  KEYS['sn-canvas']=['Move the sliders or drag the handles. Dashed gray is the parent sin θ or cos θ; blue is f.',[['cx','f(θ)'],['ce','midline and range'],['ca','amplitude'],['hot','one period']]];
  KEYS['sn-canvas2']=['Drag the maximum and the minimum. The wave through them is drawn as a cosine starting at the max.',[['cx','maximum'],['ca','minimum'],['ce','midline'],['hot','half a period']]];
  TIPS['sn-a']=el=>+el.value<0?`a = ${nz(+el.value)}: amplitude ${nz(Math.abs(+el.value))}, and the wave is flipped over the midline.`:`a = ${nz(+el.value)}: the wave reaches ${nz(+el.value)} above and below the midline.`;
  TIPS['sn-b']=el=>`b = ${nz(+el.value)}: one cycle takes 2π/${nz(+el.value)} ≈ ${fmt(TAU/+el.value,3)}. Bigger b means a shorter period.`;
  TIPS['sn-c']=el=>{const v=+el.value;return Math.abs(v)<.005?'No shift.':`θ ${v>0?'+':'−'} ${nz(Math.abs(v))} inside: the whole wave slides ${nz(Math.abs(v))} to the ${v>0?'left':'right'} (the opposite of the sign).`;};
  TIPS['sn-d']=el=>`d = ${nz(+el.value)}: the midline moves to y = ${nz(+el.value)}, and the whole wave with it.`;
  TIPS['sn-fn:sin']='Sine starts its cycle on the midline, going up.';TIPS['sn-fn:cos']='Cosine starts its cycle at a maximum: it is sine shifted left by π/2.';
  GLOSS['amplitude']='Half the distance from the maximum to the minimum: |a| in a sin(b(θ + c)) + d.';
  GLOSS['midline']='The horizontal line halfway between the maximum and the minimum: y = d.';
  GLOSS['period']='The length of one full cycle: 2π/|b| for a sinusoid.';
  GLOSS['phase shift']='How far a sinusoid is slid sideways: −c in a sin(b(θ + c)) + d.';
  TT.sinusoid='Give students a printed max and min and have them build the equation by hand before checking it in the second lab.';
  GLYPH.sinusoid='<path d="M2 12 C5 2, 8 2, 11 12 S17 22, 20 12" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M2 12 H22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
})();

(function(){
  PROBS.push({id:'sn-period',topic:'sinusoid',title:'Period from the equation',gen(){const [b,bt]=pick([[2,'2'],[3,'3'],[4,'4'],[.5,'1/2'],[Math.PI,'π'],[Math.PI/2,'π/2'],[Math.PI/6,'π/6']]),a=ri(2,6),d=ri(-3,3),fn=pick(['sin','cos']),ans=TAU/b;
    return {q:`Find the period of f(θ) = ${a} ${fn}(${bt}θ)${d?` ${d<0?'−':'+'} ${Math.abs(d)}`:''}.`,ans,unit:'',tol:.005,chk:Math.PI*2/b,show:piText(ans)===fmt(ans,3)?fmt(ans,3):piText(ans),hint:'Period = 2π/|b|.',
      sol:`b = ${bt}, so the period is 2π ÷ ${bt} = <b>${Math.abs(ans-Math.round(ans))<1e-9?Math.round(ans):piText(ans)}</b>.`};}});
  PROBS.push({id:'sn-maxmin',topic:'sinusoid',title:'Midline and amplitude from max and min',gen(){const mn=ri(-6,4),mx=mn+2*ri(1,6),which=pick(['amp','mid']),ans=which==='amp'?(mx-mn)/2:(mx+mn)/2;
    return {q:`A sinusoidal function has maximum value ${mx} and minimum value ${mn}. Find its ${which==='amp'?'amplitude':'midline value d'}.`,ans,unit:'',abs:.01,chk:which==='amp'?Math.abs(mn-mx)/2:mn+(mx-mn)/2,
      hint:'Amplitude = (max − min)/2. Midline = (max + min)/2.',sol:which==='amp'?`(${mx} − ${mn})/2 = <b>${ans}</b>.`:`(${mx} + ${mn})/2 = <b>${ans}</b>: the midline is y = ${ans}.`};}});
  PROBS.push({id:'sn-shift',topic:'sinusoid',title:'Phase shift',gen(){const b=pick([2,3,4]),k=pick([1,2,3]),den=pick([2,3,4,6]),sg=pick([1,-1]),inside=k*Math.PI/den,ans=-sg*inside/b;
    const it=piText(inside);
    return {q:`f(θ) = sin(${b}θ ${sg>0?'+':'−'} ${it}). By how much is the graph shifted horizontally? Give a signed answer (positive = right, negative = left).`,ans,unit:'',abs:.005,chk:-(sg*k*Math.PI/den)/b,show:piText(ans),
      hint:'Factor out b first: sin(b(θ + c)). The shift is −c.',sol:`sin(${b}θ ${sg>0?'+':'−'} ${it}) = sin(${b}(θ ${sg>0?'+':'−'} ${piText(inside/b)})). The shift is <b>${piText(ans)}</b>, ${ans>0?'to the right':'to the left'}.`};}});
  PROBS.push({id:'sn-value',topic:'sinusoid',title:'Evaluate a sinusoid',gen(){const a=ri(2,5),d=ri(-2,4),b=pick([1,2]),[t,nm]=pick(SPECIAL.slice(1,9)),ans=a*Math.sin(b*t)+d;
    return {q:`Let f(θ) = ${a} sin(${b===1?'':b}θ)${d?` ${d<0?'−':'+'} ${Math.abs(d)}`:''}. Find the exact value of f(${nm}).`,ans,unit:'',abs:.005,chk:d+a*Math.sin(b*t),
      hint:'Evaluate the inside first, then use the unit circle.',sol:`f(${nm}) = ${a} sin(${piText(b*t)})${d?` ${d<0?'−':'+'} ${Math.abs(d)}`:''} = ${a}(${exactTrig(Math.sin(b*t))})${d?` ${d<0?'−':'+'} ${Math.abs(d)}`:''} ≈ <b>${fmt(ans,3)}</b>.`};}});
})();
