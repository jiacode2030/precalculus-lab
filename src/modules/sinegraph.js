/* ---------------- 3.4 Sine and cosine graphs ---------------- */
(function sinegraph(){
  const cv=$('#sg-canvas');if(!cv)return;
  let th=1,fn='both',play=false,lay=null;
  const val=v=>isSpecial(th)?exactTrig(v):fmt(v,3);
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.42,280,380):clamp(w*1.35,480,600),draw(ctx,w,h){
    const L=lay=circLayout(w,h),{cx,cy,R}=L,c=Math.cos(th),s=Math.sin(th),px=cx+R*c,py=cy-R*s,sOn=fn!=='cos',cOn=fn!=='sin';
    circBase(ctx,L);angArc(ctx,cx,cy,R*.22,th);
    ctx.strokeStyle=T.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
    if(cOn){ctx.strokeStyle=T.ca;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,cy);ctx.stroke();label(ctx,'width',(cx+px)/2,cy+(s>=0?15:-15),T.ca,'center','middle',LABEL);}
    if(sOn){ctx.strokeStyle=T.cx;ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();label(ctx,'height',px+(c>=0?7:-7),(py+cy)/2,T.cx,c>=0?'left':'right','middle',LABEL);}
    dot(ctx,px,py,7,T.hot,T.surface);
    const P=gpanel(ctx,{x:L.gx,y:L.gy,w:L.gw,h:L.gh},[0,TAU],[-1.3,1.3],{xn:4,yn:4,xt:false});piTicks(ctx,P,0,TAU);
    /* carry the height across to the graph (side by side only: then the two are level) */
    if(sOn&&L.wide){ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=alpha(T.cx,.7);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(P.X(th),P.Y(s));ctx.stroke();ctx.restore();}
    [[sOn,Math.sin,T.cx,'sin θ'],[cOn,Math.cos,T.ca,'cos θ']].forEach(([on,f,col,nm],i)=>{if(!on)return;curveD(ctx,P,f,0,TAU,alpha(col,.25),2.2,300);curveD(ctx,P,f,0,th,col,3,300);
      dot(ctx,P.X(th),P.Y(f(th)),6,col,T.surface);label(ctx,nm,P.box.x+8+i*60,P.box.y+12,col,'left','middle',LABEL);});
    vline(ctx,P,th,T.hot);},
    drag(kind,e){if(kind==='up'||!lay)return;const [x,y]=ptr(e,cv),L=lay;stop();
      const inGraph=L.wide?x>L.gx-10:y>L.gy-20;
      if(inGraph)th=clamp((x-L.gx)/L.gw*TAU,0,TAU);else{let t=Math.atan2(-(y-L.cy),x-L.cx);if(t<0)t+=TAU;th=t;}sync();}});
  const thEl=$('#sg-th'),pb=$('#sg-play');
  function stop(){play=false;pb.textContent='Play';}
  /* behavior of sin and cos at θ: increasing where the other one is positive; concave down above the midline */
  function beh(rate,v){const r=Math.abs(rate)<1e-3?'turning (a max or min)':rate>0?'increasing':'decreasing',k=Math.abs(v)<1e-3?'at an inflection point':v>0?'concave down':'concave up';return `${r}, ${k}`;}
  function sync(){thEl.value=th;const o=$('#sg-th-out');if(o)o.textContent=`${fmt(th,2)} (${isSpecial(th)?piText(th):Math.round(th*180/Math.PI)+'°'})`;upd();}
  function upd(){const c=Math.cos(th),s=Math.sin(th);setText('sg-val',`${val(s)} · ${val(c)}`);setText('sg-sin',beh(c,s));setText('sg-cos',beh(-s,c));sim.render();}
  bindRange('sg-th',v=>`${fmt(v,2)} (${isSpecial(v)?piText(v):Math.round(v*180/Math.PI)+'°'})`,v=>{th=v;upd();});
  segBind('sg-fn','k',k=>{fn=k;sim.render();});
  pb.addEventListener('click',()=>{play=!play;if(play&&th>=TAU-.01)th=0;pb.textContent=play?'Pause':'Play';});
  ticker('sinegraph',dt=>{if(!play)return;th+=dt*.8;if(th>=TAU){th=TAU;stop();}sync();});
  $('#sg-lab').addEventListener('labreset',()=>{stop();sim.render();});

  /* symmetry and the average rate over [θ, θ + π/6] */
  let x=1,fn2='sin',mir=true;const F2=()=>fn2==='sin'?Math.sin:Math.cos,col2=()=>fn2==='sin'?T.cx:T.ca,H=Math.PI/6;
  const sim2=glab('sg-canvas2',{h:w=>clamp(w*.45,240,340),view:()=>({xr:[-TAU-.25,TAU+.25],yr:[-1.5,1.5],xn:8,yn:6,xt:false}),draw(ctx,P){const f=F2();
    piTicks(ctx,P,-TAU,TAU,Math.PI);curveD(ctx,P,f,-TAU-.25,TAU+.25,col2(),2.8,600);
    if(mir){const a=[x,f(x)],b=[-x,f(-x)];line(ctx,P,a[0],a[1],b[0],b[1],T.cv,1.6,[5,4]);vline(ctx,P,-x,alpha(T.cv,.6));dot(ctx,P.X(b[0]),P.Y(b[1]),6.5,T.cv,T.surface);
      label(ctx,'−θ',P.X(-x),P.box.y+12,T.cv,'center','middle',LABEL);}
    line(ctx,P,x,f(x),x+H,f(x+H),T.hot,2.6);dot(ctx,P.X(x+H),P.Y(f(x+H)),5,T.hot,T.surface);
    vline(ctx,P,x,T.ce);dot(ctx,P.X(x),P.Y(f(x)),7,T.hot,T.surface);label(ctx,'θ',P.X(x),P.box.y+12,T.hot,'center','middle',LABEL);},
    drag(k,xx){if(k==='up')return;x=clamp(Math.round(xx*100)/100,-6.28,6.28);$('#sg-x').value=x;const o=$('#sg-x-out');if(o)o.textContent=fmt(x,2);upd2();}});
  function upd2(){const f=F2(),a=f(x),b=f(-x),r=(f(x+H)-a)/H;
    setText('sg-pair',`${fn2}(${fmt(x,2)}) = ${fmt(a,3)} · ${fn2}(${fmt(-x,2)}) = ${fmt(b,3)}`);
    setText('sg-sym',fn2==='sin'?'opposite: sin(−θ) = −sin θ, odd':'equal: cos(−θ) = cos θ, even');
    setText('sg-roc',`${fmt(r,3)} (${Math.abs(r)<.005?'level':r>0?'rising':'falling'})`);sim2.render();}
  bindRange('sg-x',v=>fmt(v,2),v=>{x=v;upd2();});
  segBind('sg-fn2','k',k=>{fn2=k;upd2();});
  $('#sg-mir').addEventListener('change',e=>{mir=e.target.checked;sim2.render();});
  drawers.sinegraph=()=>{sim.render();sim2.render();};
  KEYS['sg-canvas']=['Press Play, or drag the point around the circle or along the graph. The height becomes the sine graph, the width the cosine graph.',[['cx','sin θ = height'],['ca','cos θ = width'],['hot','the moving point'],['ce','the angle']]];
  KEYS['sg-canvas2']=['Drag along the graph to move θ. The green point is the mirror angle −θ; orange is the secant over [θ, θ + π/6].',[['cx','sin θ'],['ca','cos θ'],['cv','the point at −θ'],['hot','secant']]];
  TIPS['sg-th']=el=>{const t=+el.value;return `θ = ${fmt(t,2)}: the point is at height ${fmt(Math.sin(t),3)} and width ${fmt(Math.cos(t),3)}.`;};
  TIPS['sg-fn:sin']='Sine is the height of the point.';TIPS['sg-fn:cos']='Cosine is the width of the point (left of the center is negative).';TIPS['sg-fn:both']='Both together: cosine is the same wave as sine, shifted left by π/2.';
  TIPS['sg-x']=el=>`θ = ${fmt(+el.value,2)}. Compare the point at θ with its mirror at −θ.`;
  TIPS['sg-mir']=el=>el.checked?'The green point is at −θ: the reflection of the angle across the x-axis.':'Mirror point hidden.';
  TIPS['sg-fn2:sin']='Sine is odd: the two points are symmetric about the origin.';TIPS['sg-fn2:cos']='Cosine is even: the two points are at the same height.';
  GLOSS['odd function']='f(−x) = −f(x): the graph is symmetric about the origin. Sine and tangent are odd.';
  GLOSS['even function']='f(−x) = f(x): the graph is symmetric about the y-axis. Cosine is even.';
  TT.sinegraph='Have students hold a pencil at the edge of a rotating plate and trace its height on paper pulled sideways: the sine wave appears.';
  GLYPH.sinegraph='<circle cx="7" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 12 C14 4, 17 4, 19 12 S22 20, 23 14" fill="none" stroke="var(--cx)" stroke-width="2"/>';
})();

(function(){
  const Q=[[0,Math.PI/2,'(0, π/2)'],[Math.PI/2,Math.PI,'(π/2, π)'],[Math.PI,3*Math.PI/2,'(π, 3π/2)'],[3*Math.PI/2,TAU,'(3π/2, 2π)']];
  PROBS.push({id:'sg-incdec',topic:'sinegraph',title:'Where it rises and falls',gen(){const fn=pick(['sin','cos']),up=pick([true,false]),f=fn==='sin'?Math.sin:Math.cos;
    /* an interval qualifies when f moves the asked way across the whole quarter (checked on a grid) */
    const ok=([a,b])=>{for(let i=0;i<40;i++){const d=f(a+(b-a)*(i+1)/40)-f(a+(b-a)*i/40);if(up?d<=0:d>=0)return false;}return true;};
    const good=Q.filter(ok),bad=Q.filter(q=>!ok(q)),{choices,ans}=mcq(pick(good)[2],bad.map(q=>q[2]),3);
    return {q:`On which interval is y = ${fn} θ ${up?'increasing':'decreasing'} throughout?`,choices,ans,hint:fn==='sin'?'Sine is the height of the point on the unit circle.':'Cosine is the width of the point on the unit circle.',
      sol:`${fn==='sin'?'The height':'The width'} ${up?'grows':'shrinks'} on ${good.map(q=>q[2]).join(' and ')}. Of the choices, <b>${choices[ans]}</b>.`};}});
  PROBS.push({id:'sg-sym',topic:'sinegraph',title:'Odd and even',gen(){const fn=pick(['sin','cos']),k=pick([.2,.35,.6,.75,-.4,-.8]),ans=fn==='sin'?-k:k,a=fn==='sin'?Math.asin(k):Math.acos(k);
    return {q:`Given ${fn} a = ${nz(k)}, find ${fn}(−a).`,ans,unit:'',abs:.001,chk:(fn==='sin'?Math.sin:Math.cos)(-a),hint:'Reflect the angle across the x-axis: the width stays, the height flips.',
      sol:fn==='sin'?`Sine is odd: sin(−a) = −sin a = <b>${nz(-k)}</b>.`:`Cosine is even: cos(−a) = cos a = <b>${nz(k)}</b>.`};}});
  PROBS.push({id:'sg-aroc',topic:'sinegraph',title:'Average rate of change of sin or cos',gen(){const fn=pick(['sin','cos']),f=fn==='sin'?Math.sin:Math.cos;
    const i=ri(0,7),j=i+ri(1,3),[a,an]=SPECIAL[i],[b,bn]=SPECIAL[j],ans=(f(b)-f(a))/(b-a);
    return {q:`Find the average rate of change of y = ${fn} θ on [${an}, ${bn}], to three decimals.`,ans,unit:'',abs:.0015,chk:(()=>{const da=Math.round(a*180/Math.PI),db=Math.round(b*180/Math.PI),r=Math.PI/180;return (f(db*r)-f(da*r))/((db-da)*r);})(),
      hint:'(f(b) − f(a)) / (b − a), with the angles in radians.',sol:`${fn}(${bn}) = ${exactTrig(f(b))} and ${fn}(${an}) = ${exactTrig(f(a))}. (${exactTrig(f(b))} − ${exactTrig(f(a))}) / (${bn} − ${an}) ≈ <b>${fmt(ans,3)}</b>.`};}});
})();
