/* ---------------- 3.9 Inverse trig functions ---------------- */
(function invtrig(){
  const cv=$('#it-canvas');if(!cv)return;
  const FN={asin:{f:Math.sin,g:Math.asin,lo:-Math.PI/2,hi:Math.PI/2,nm:'arcsin',p:'sin',rng:'[−π/2, π/2]',yr:[-2.2,2.2],xc:0,vin:[-1,1]},
    acos:{f:Math.cos,g:Math.acos,lo:0,hi:Math.PI,nm:'arccos',p:'cos',rng:'[0, π]',yr:[-1.4,3.6],xc:1.1,vin:[-1,1]},
    atan:{f:Math.tan,g:Math.atan,lo:-Math.PI/2+1e-3,hi:Math.PI/2-1e-3,nm:'arctan',p:'tan',rng:'(−π/2, π/2)',yr:[-2.2,2.2],xc:0,vin:[-4,4]}};
  let k='asin',v=Math.sqrt(3)/2,full=false;
  const vEl=$('#it-v');
  const sim=glab('it-canvas',{h:w=>clamp(w*.55,280,420),view:(w,h)=>{const F=FN[k],pw=w-60,ph=h-36,half=(F.yr[1]-F.yr[0])/2*pw/ph;return {xr:[F.xc-half,F.xc+half],yr:F.yr,xn:8,yn:6};},draw(ctx,P){const F=FN[k],o=F.g(v);
    line(ctx,P,P.xr[0],P.xr[0],P.xr[1],P.xr[1],alpha(T.muted,.9),1.3,[6,5]);label(ctx,'y = x',P.X(Math.min(P.xr[1],P.yr[1])-.15)-4,P.Y(Math.min(P.xr[1],P.yr[1])-.15),T.muted,'right','middle',MONO);
    if(full){curveD(ctx,P,F.f,P.xr[0],P.xr[1],alpha(T.cx,.3),2,900);
      /* the full graph reflected: x = f(y), drawn as a path in y */
      ctx.save();clip(ctx,P);ctx.strokeStyle=alpha(T.cv,.3);ctx.lineWidth=2;ctx.beginPath();let pen=false;for(let i=0;i<=900;i++){const y=P.yr[0]+(P.yr[1]-P.yr[0])*i/900,x=F.f(y);if(!isFinite(x)||Math.abs(x)>50){pen=false;continue;}pen?ctx.lineTo(P.X(x),P.Y(y)):ctx.moveTo(P.X(x),P.Y(y));pen=true;}ctx.stroke();ctx.restore();}
    if(k==='atan'){vline(ctx,P,-Math.PI/2,T.ce,[6,4]);vline(ctx,P,Math.PI/2,T.ce,[6,4]);hline(ctx,P,-Math.PI/2,alpha(T.ce,.7),[2,4]);hline(ctx,P,Math.PI/2,alpha(T.ce,.7),[2,4]);}
    curveD(ctx,P,F.f,F.lo,F.hi,T.cx,3,500);
    const ilo=k==='atan'?P.xr[0]:-1,ihi=k==='atan'?P.xr[1]:1;curveD(ctx,P,F.g,ilo,ihi,T.cv,3,500);
    line(ctx,P,v,0,v,o,alpha(T.hot,.7),1.4,[4,3]);line(ctx,P,0,o,v,o,alpha(T.hot,.7),1.4,[4,3]);
    line(ctx,P,v,o,o,v,T.hot,1.6,[2,3]);dot(ctx,P.X(o),P.Y(v),6,T.cx,T.surface);dot(ctx,P.X(v),P.Y(o),7.5,T.cv,T.surface);
    label(ctx,`${F.p}`,P.X(F.hi*.55)+8,P.Y(F.f(F.hi*.55))+(k==='acos'?-12:14),T.cx,'left','middle',LABEL);
    label(ctx,F.nm,P.box.x+8,P.box.y+12,T.cv,'left','middle',LABEL);}});
  const pt=t=>{const s=piText(t);return s.includes('π')?s:fmt(t,3);};
  function upd(){const F=FN[k],o=F.g(v);setText('it-out',`${F.nm}(${fmt(v,2)}) = ${fmt(o,3)}${piText(o).includes('π')?' = '+piText(o):''} (${fmt(o*180/Math.PI,1)}°)`);
    setText('it-chk',`${F.p}(${pt(o)}) = ${fmt(F.f(o),3)}, and ${pt(o)} is in ${F.rng}`);setText('it-rng',F.rng);sim.render();}
  /* snap the input to the exact values so the outputs come out as multiples of π */
  const SNAP=[0,.5,Math.SQRT2/2,Math.sqrt(3)/2,1,Math.sqrt(3)/3,Math.sqrt(3)];
  const snapV=x=>{for(const s of SNAP)for(const y of [s,-s])if(Math.abs(x-y)<.012)return y;return x;};
  bindRange('it-v',x=>fmt(snapV(x),2),x=>{v=snapV(x);upd();});
  segBind('it-fn','k',kk=>{k=kk;const F=FN[k];vEl.min=F.vin[0];vEl.max=F.vin[1];vEl.step=k==='atan'?.02:.01;v=clamp(v,F.vin[0],F.vin[1]);vEl.value=v;const o=$('#it-v-out');if(o)o.textContent=fmt(v,2);upd();});
  $('#it-full').addEventListener('change',e=>{full=e.target.checked;sim.render();});

  /* every angle with the value k, and the one the inverse picks */
  const F2={sin:{f:Math.sin,lo:-Math.PI/2,hi:Math.PI/2,inv:Math.asin,nm:'arcsin',all:(c)=>{if(Math.abs(c)>1)return [];const a=Math.asin(c);return [a,Math.PI-a];},per:TAU,yr:[-1.6,1.6],kin:[-1.2,1.2]},
    cos:{f:Math.cos,lo:0,hi:Math.PI,inv:Math.acos,nm:'arccos',all:(c)=>{if(Math.abs(c)>1)return [];const a=Math.acos(c);return [a,-a];},per:TAU,yr:[-1.6,1.6],kin:[-1.2,1.2]},
    tan:{f:Math.tan,lo:-Math.PI/2+1e-3,hi:Math.PI/2-1e-3,inv:Math.atan,nm:'arctan',all:(c)=>[Math.atan(c)],per:Math.PI,yr:[-5,5],kin:[-4,4]}};
  let k2='sin',kv=.5;const kEl=$('#it-k');
  const sols=()=>{const F=F2[k2],out=[];F.all(kv).forEach(a=>{for(let n=-4;n<=4;n++){const t=a+n*F.per;if(t>=-TAU-1e-9&&t<=TAU+1e-9&&!out.some(s=>Math.abs(s-t)<1e-7))out.push(t);}});return out.sort((x,y)=>x-y);};
  const sim2=glab('it-canvas2',{h:w=>clamp(w*.45,240,340),view:()=>({xr:[-TAU-.2,TAU+.2],yr:F2[k2].yr,xn:8,yn:6,xt:false}),draw(ctx,P){const F=F2[k2];
    piTicks(ctx,P,-TAU,TAU,Math.PI);if(k2==='tan')for(let n=-4;n<=3;n++){const x=(n+.5)*Math.PI;if(Math.abs(x)<TAU)vline(ctx,P,x,alpha(T.ce,.5),[3,4]);}
    curveD(ctx,P,F.f,F.lo,F.hi,alpha(T.ce,.55),9,300);curveD(ctx,P,F.f,-TAU-.2,TAU+.2,T.cx,2.6,1400);
    hline(ctx,P,kv,T.hot,[6,4]);const S=sols(),p=Math.abs(kv)<=1||k2==='tan'?F.inv(kv):null;
    S.forEach(t=>{const pr=p!==null&&Math.abs(t-p)<1e-7;line(ctx,P,t,0,t,kv,alpha(T.hot,.6),1,[3,3]);dot(ctx,P.X(t),P.Y(kv),pr?8:5,pr?T.hot:T.cx,T.surface);});
    label(ctx,'gold: the restricted piece',P.box.x+8,P.box.y+12,T.ce,'left','middle',MONO);}});
  function upd2(){const F=F2[k2],S=sols();setText('it-all',S.length?`${S.length}: ${S.map(t=>piText(t).includes('π')||Math.abs(t)<1e-9?piText(t):fmt(t,2)).join(', ')}`:'none: no angle has this value');
    setText('it-pick',Math.abs(kv)>1&&k2!=='tan'?`nothing: ${F.nm}(${fmt(kv,2)}) is undefined`:`${F.nm}(${fmt(kv,2)}) = ${piText(F.inv(kv)).includes('π')?piText(F.inv(kv)):fmt(F.inv(kv),3)}`);sim2.render();}
  bindRange('it-k',x=>fmt(snapV(x),2),x=>{kv=snapV(x);upd2();});
  segBind('it-fn2','k',kk=>{k2=kk;const F=F2[k2];kEl.min=F.kin[0];kEl.max=F.kin[1];kEl.step=k2==='tan'?.02:.01;kv=clamp(kv,F.kin[0],F.kin[1]);kEl.value=kv;const o=$('#it-k-out');if(o)o.textContent=fmt(kv,2);upd2();});
  drawers.invtrig=()=>{sim.render();sim2.render();};
  KEYS['it-canvas']=['Move the input x. The green point (x, output) on the inverse mirrors the blue point (output, x) across y = x.',[['cx','restricted sin, cos or tan'],['cv','its inverse'],['hot','the matching pair'],['muted','y = x']]];
  KEYS['it-canvas2']=['Move k. Every crossing has the value k; the inverse returns only the orange one, on the gold piece.',[['cx','the full function'],['ce','restricted piece'],['hot','the angle the inverse returns']]];
  TIPS['it-v']=el=>{const F=FN[k];return `${F.nm}(${fmt(+el.value,2)}) = ${fmt(F.g(+el.value),3)} rad, always in ${F.rng}.`;};
  TIPS['it-fn:asin']='arcsin: input a height in [−1, 1], output an angle in [−π/2, π/2].';TIPS['it-fn:acos']='arccos: input a width in [−1, 1], output an angle in [0, π].';TIPS['it-fn:atan']='arctan: input any slope, output an angle in (−π/2, π/2).';
  TIPS['it-full']=el=>el.checked?'Faded: the whole function and its full reflection. The reflection fails the vertical line test, which is why we restrict first.':'Only the restricted piece and its inverse.';
  TIPS['it-k']=el=>Math.abs(+el.value)>1&&k2!=='tan'?'No angle has a sine or cosine bigger than 1 in size: the line misses the wave.':'Count the crossings: infinitely many angles share this value.';
  GLOSS['restricted domain']='A smaller interval of inputs chosen so that a function is one-to-one there and has an inverse.';
  GLOSS['one-to-one']='Each output comes from exactly one input: the graph passes the horizontal line test.';
  TT.invtrig='Ask "which angle?" out loud before every inverse: students who say the range first make far fewer quadrant errors.';
  GLYPH.invtrig='<path d="M3 21 L21 3" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M5 19 C9 18, 9 6, 13 5" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M5 19 C6 15, 18 15, 19 11" fill="none" stroke="var(--cv)" stroke-width="2"/>';
})();

(function(){
  const V=[[0,'0'],[.5,'1/2'],[Math.SQRT2/2,'√2/2'],[Math.sqrt(3)/2,'√3/2'],[1,'1'],[-.5,'−1/2'],[-Math.SQRT2/2,'−√2/2'],[-Math.sqrt(3)/2,'−√3/2'],[-1,'−1']];
  const TV=[[0,'0'],[1,'1'],[Math.sqrt(3),'√3'],[Math.sqrt(3)/3,'√3/3'],[-1,'−1'],[-Math.sqrt(3),'−√3'],[-Math.sqrt(3)/3,'−√3/3']];
  PROBS.push({id:'it-exact',topic:'invtrig',title:'Exact inverse values',gen(){const fn=pick(['arcsin','arccos','arctan']),[v,vt]=pick(fn==='arctan'?TV:V);
    const ans={arcsin:Math.asin,arccos:Math.acos,arctan:Math.atan}[fn](v),s=Math.sqrt(Math.max(0,1-v*v));
    const chk=fn==='arcsin'?Math.atan2(v,s):fn==='arccos'?Math.atan2(s,v):Math.atan2(v,1);
    return {q:`Find the exact value of ${fn}(${vt}), in radians.`,ans,unit:'',abs:.002,chk,show:piText(ans),hint:fn==='arccos'?'arccos returns an angle in [0, π].':'This one returns an angle in [−π/2, π/2].',
      sol:`The angle in ${fn==='arccos'?'[0, π]':fn==='arcsin'?'[−π/2, π/2]':'(−π/2, π/2)'} whose ${fn.slice(3)} is ${vt} is <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'it-comp',topic:'invtrig',title:'Inverse of a trig value',gen(){const fn=pick(['sin','cos']),pool=SPECIAL.filter(([t])=>fn==='sin'?t>Math.PI/2+1e-9&&t<3*Math.PI/2-1e-9:t>Math.PI+1e-9),[t,nm]=pick(pool);
    const f=fn==='sin'?Math.sin:Math.cos,ans=fn==='sin'?Math.asin(f(t)):Math.acos(f(t));
    /* independent check: search the restricted range for the angle with the same value */
    const lo=fn==='sin'?-Math.PI/2:0,chk=SPECIAL.concat(SPECIAL.map(([a,n])=>[a-TAU,n])).map(([a])=>a).filter(a=>a>=lo-1e-9&&a<=lo+Math.PI+1e-9).find(a=>Math.abs(f(a)-f(t))<1e-9);
    return {q:`Find the exact value of arc${fn}(${fn}(${nm})).`,ans,unit:'',abs:.002,chk,show:piText(ans),hint:`${nm} is not in the range of arc${fn}. Find ${fn}(${nm}) first.`,
      sol:`${fn}(${nm}) = ${exactTrig(f(t))}. The angle in ${fn==='sin'?'[−π/2, π/2]':'[0, π]'} with that ${fn==='sin'?'sine':'cosine'} is <b>${piText(ans)}</b>, not ${nm}.`};}});
  PROBS.push({id:'it-angle',topic:'invtrig',title:'Find the angle',gen(){const kind=pick(['ramp','ladder','sun']);let q,ans,chk,sol;
    if(kind==='ramp'){const rise=pick([.3,.4,.5,.6,.75]),run=pick([4,5,6,8,9]);ans=Math.atan(rise/run)*180/Math.PI;chk=Math.asin(rise/Math.hypot(rise,run))*180/Math.PI;
      q=`A ramp rises ${rise} m over a horizontal run of ${run} m. Find its angle with the ground, in degrees.`;sol=`tan θ = ${rise}/${run}, so θ = arctan(${fmt(rise/run,4)}) ≈ <b>${fmt(ans,2)}°</b>.`;}
    else if(kind==='ladder'){const L=pick([4,5,6,8]),d=pick([1,1.2,1.5,2]);ans=Math.acos(d/L)*180/Math.PI;chk=Math.atan(Math.sqrt(L*L-d*d)/d)*180/Math.PI;
      q=`A ${L} m ladder leans on a wall with its foot ${d} m from the wall. Find the angle between the ladder and the ground, in degrees.`;sol=`cos θ = ${d}/${L}, so θ = arccos(${fmt(d/L,4)}) ≈ <b>${fmt(ans,2)}°</b>.`;}
    else{const h=pick([10,12,15,20]),s=pick([8,14,18,25]);ans=Math.atan(h/s)*180/Math.PI;chk=90-Math.atan(s/h)*180/Math.PI;
      q=`A ${h} m tree casts a ${s} m shadow on level ground. Find the angle of elevation of the sun, in degrees.`;sol=`tan θ = ${h}/${s}, so θ = arctan(${fmt(h/s,4)}) ≈ <b>${fmt(ans,2)}°</b>.`;}
    return {q,ans,unit:'°',abs:.05,chk,hint:'Pick the ratio you know (opposite/adjacent, adjacent/hypotenuse, ...) and use the matching inverse.',sol};}});
})();
