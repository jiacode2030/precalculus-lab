/* ---------------- 3.10 Trig equations and inequalities ---------------- */
(function trigeq(){
  const cv=$('#te-canvas');if(!cv)return;
  const S3=Math.sqrt(3);
  const FN={sin:{f:Math.sin,sol:k=>{if(Math.abs(k)>1+1e-12)return [];const a=Math.asin(clamp(k,-1,1));return [a,Math.PI-a];},snap:[0,.5,Math.SQRT2/2,S3/2,1],kin:[-1.3,1.3],per:'2π'},
    cos:{f:Math.cos,sol:k=>{if(Math.abs(k)>1+1e-12)return [];const a=Math.acos(clamp(k,-1,1));return [a,-a];},snap:[0,.5,Math.SQRT2/2,S3/2,1],kin:[-1.3,1.3],per:'2π'},
    tan:{f:Math.tan,sol:k=>{const a=Math.atan(k);return [a,a+Math.PI];},snap:[0,S3/3,1,S3],kin:[-4,4],per:'π'}};
  let fn='sin',op='eq',k=.5,snap=true,lay=null;const kEl=$('#te-k');
  /* solutions in [0, 2π), sorted, without repeats */
  const sols=()=>{const out=[];FN[fn].sol(k).forEach(a=>{const t=wrap2pi(a);const u=Math.abs(t-TAU)<1e-9?0:t;if(!out.some(s=>Math.abs(s-u)<1e-7))out.push(u);});return out.sort((a,b)=>a-b);};
  const holds=t=>{const v=FN[fn].f(t);if(!isFinite(v)||Math.abs(v)>1e6)return false;return op==='gt'?v>k+1e-12:v<k-1e-12;};
  /* pieces of [0, 2π) where the inequality holds: boundaries are the solutions (and tangent's asymptotes) */
  function intervals(){const B=[0,...sols(),...(fn==='tan'?[Math.PI/2,3*Math.PI/2]:[]),TAU].sort((a,b)=>a-b).filter((x,i,A)=>!i||x-A[i-1]>1e-9),out=[];
    for(let i=0;i<B.length-1;i++){const a=B[i],b=B[i+1];if(holds((a+b)/2))out.push([a,b]);}return out;}
  const ptx=t=>{const s=piText(t);return s.includes('π')||s==='0'?s:fmt(t,3);};
  function ivText(I){if(!I.length)return 'nowhere in [0, 2π)';return I.map(([a,b])=>`${a<1e-9&&holds(0)?'[':'('}${ptx(a)}, ${ptx(b)})`).join(' ∪ ');}
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.42,280,380):clamp(w*1.35,480,600),draw(ctx,w,h){
    const L=lay=circLayout(w,h),{cx,cy,R}=L,S=sols(),F=FN[fn];circBase(ctx,L,false);
    /* arcs of the circle where the inequality holds */
    if(op!=='eq'){ctx.save();ctx.strokeStyle=T.cv;ctx.lineWidth=6;ctx.lineCap='round';let pen=false;ctx.beginPath();for(let i=0;i<=720;i++){const t=i/720*TAU;if(holds(t)){const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);pen?ctx.lineTo(x,y):ctx.moveTo(x,y);pen=true;}else pen=false;}ctx.stroke();ctx.restore();}
    /* the line for the value k: horizontal for sin, vertical for cos, through the origin for tan */
    ctx.save();ctx.setLineDash([6,4]);ctx.strokeStyle=T.hot;ctx.lineWidth=1.8;ctx.beginPath();
    if(fn==='sin'){ctx.moveTo(cx-R-16,cy-R*k);ctx.lineTo(cx+R+16,cy-R*k);}else if(fn==='cos'){ctx.moveTo(cx+R*k,cy-R-16);ctx.lineTo(cx+R*k,cy+R+16);}
    else{const u=(R+16)/Math.hypot(1,k);ctx.moveTo(cx-u,cy+u*k);ctx.lineTo(cx+u,cy-u*k);}ctx.stroke();ctx.restore();
    label(ctx,fn==='sin'?`y = ${fmt(k,2)}`:fn==='cos'?`x = ${fmt(k,2)}`:`slope ${fmt(k,2)}`,L.wide?12:cx-R-10,L.wide?20:14,T.hot,'left','middle',LABEL);
    S.forEach(t=>{const x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);ctx.strokeStyle=T.ink;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();dot(ctx,x,y,6.5,T.hot,T.surface);
      label(ctx,ptx(t),cx+(R+20)*Math.cos(t),cy-(R+16)*Math.sin(t),T.hot,'center','middle','600 11px "IBM Plex Mono",monospace');});
    const yr=fn==='tan'?[-4.5,4.5]:[-1.5,1.5],P=gpanel(ctx,{x:L.gx,y:L.gy,w:L.gw,h:L.gh},[0,TAU],yr,{xn:4,yn:4,xt:false});piTicks(ctx,P,0,TAU);
    if(op!=='eq')intervals().forEach(([a,b])=>{ctx.fillStyle=alpha(T.cv,.13);ctx.fillRect(P.X(a),P.box.y,P.X(b)-P.X(a),P.box.h);curveD(ctx,P,F.f,a+1e-4,b-1e-4,T.cv,5,300);});
    if(fn==='tan'){vline(ctx,P,Math.PI/2,T.ce,[6,4]);vline(ctx,P,3*Math.PI/2,T.ce,[6,4]);}
    curveD(ctx,P,F.f,0,TAU,T.cx,2.6,900);hline(ctx,P,k,T.hot,[6,4]);
    S.forEach((t,i)=>{line(ctx,P,t,0,t,k,alpha(T.hot,.6),1,[3,3]);dot(ctx,P.X(t),P.Y(k),6.5,T.hot,T.surface);label(ctx,ptx(t),P.X(t),P.Y(k)+(k>=0?-14:14),T.hot,'center','middle','600 11px "IBM Plex Mono",monospace');});},
    drag(kind,e){if(kind==='up'||!lay)return;const [x,y]=ptr(e,cv),L=lay;const inGraph=L.wide?x>L.gx-10:y>L.gy-20;
      if(inGraph){const yr=fn==='tan'?[-4.5,4.5]:[-1.5,1.5];k=yr[0]+(L.gy+L.gh-y)/L.gh*(yr[1]-yr[0]);}
      else if(fn==='sin')k=(L.cy-y)/L.R;else if(fn==='cos')k=(x-L.cx)/L.R;else{let a=Math.atan2(-(y-L.cy),x-L.cx);k=Math.abs(Math.cos(a))<.05?4*Math.sign(Math.sin(a)*Math.cos(a)||1):Math.tan(a);}
      k=clamp(k,+kEl.min,+kEl.max);setK(k);}});
  function snapK(v){if(!snap)return Math.round(v*100)/100;const F=FN[fn];for(const s of F.snap)for(const y of [s,-s])if(Math.abs(v-y)<(fn==='tan'?.08:.04))return y;return Math.round(v*100)/100;}
  function setK(v){k=snapK(v);kEl.value=k;const o=$('#te-k-out');if(o)o.textContent=kt();upd();}
  const kt=()=>{const e=exactTrig(k);return e.includes('√')||e.includes('/')?e:fmt(k,2);};
  function upd(){const S=sols(),F=FN[fn];setText('te-sol',S.length?S.map(ptx).join(', '):'none');
    setText('te-gen',!S.length?(fn==='tan'?'—':'no solution: |k| > 1'):fn==='tan'?`θ = ${ptx(S[0])} + kπ`:S.map(t=>`θ = ${ptx(t)} + 2kπ`).join(' or '));
    setText('te-int',op==='eq'?'choose > or < above':ivText(intervals()));sim.render();}
  bindRange('te-k',v=>{const e=exactTrig(snapK(v));return e.includes('√')||e.includes('/')?e:fmt(snapK(v),2);},v=>{k=snapK(v);upd();});
  segBind('te-fn','k',kk=>{fn=kk;const F=FN[fn];kEl.min=F.kin[0];kEl.max=F.kin[1];k=clamp(k,F.kin[0],F.kin[1]);setK(k);});
  segBind('te-op','k',kk=>{op=kk;upd();});
  $('#te-snap').addEventListener('change',e=>{snap=e.target.checked;setK(k);});

  /* sin(bθ) = k: b cycles, so up to 2b solutions */
  let b=2,k2=.5;
  const sols2=()=>{if(Math.abs(k2)>1)return [];const a=Math.asin(k2),out=[];for(let n=-1;n<=b+1;n++)[a+TAU*n,Math.PI-a+TAU*n].forEach(u=>{const t=u/b;if(t>=-1e-9&&t<TAU-1e-9&&!out.some(s=>Math.abs(s-t)<1e-7))out.push(Math.max(0,t));});return out.sort((x,y)=>x-y);};
  const sim2=glab('te-canvas2',{h:w=>clamp(w*.42,230,320),view:()=>({xr:[0,TAU],yr:[-1.4,1.4],xn:4,yn:4,xt:false}),draw(ctx,P){piTicks(ctx,P,0,TAU);
    curveD(ctx,P,t=>Math.sin(b*t),0,TAU,T.cx,2.6,900);hline(ctx,P,k2,T.hot,[6,4]);const S=sols2();
    S.forEach((t,i)=>{line(ctx,P,t,0,t,k2,alpha(T.hot,.5),1,[3,3]);dot(ctx,P.X(t),P.Y(k2),6,T.hot,T.surface);if(S.length<=8)label(ctx,ptx(t),P.X(t),P.Y(k2)+((i%2?1:-1)*(k2>=0?1:-1)*-14),T.hot,'center','middle','10px "IBM Plex Mono",monospace');});
    for(let n=1;n<b;n++)vline(ctx,P,n*TAU/b,alpha(T.ce,.6),[2,4]);label(ctx,`${b} cycle${b>1?'s':''}`,P.box.x+P.box.w-6,P.box.y+12,T.ce,'right','middle',MONO);}});
  function upd2(){const S=sols2();setText('te-cnt',`${S.length}${Math.abs(k2)<1&&Math.abs(k2)>0?` = 2 × ${b}`:''}`);setText('te-list',S.length?S.map(ptx).join(', '):'none');sim2.render();}
  bindRange('te-b',v=>String(v),v=>{b=v;upd2();});bindRange('te-k2',v=>fmt(v,2),v=>{k2=Math.round(v*100)/100;upd2();});
  drawers.trigeq=()=>{sim.render();sim2.render();};
  KEYS['te-canvas']=['Drag the line on either picture, or use the slider. Orange points solve the equation; green shows where the inequality holds.',[['cx','the function'],['hot','the value k and the solutions'],['cv','inequality holds'],['ce','asymptotes (tan)']]];
  KEYS['te-canvas2']=['Change b and k. Each full cycle of sin(bθ) meets the line twice (once at k = ±1).',[['cx','sin(bθ)'],['hot','solutions'],['ce','cycle boundaries']]];
  TIPS['te-k']=el=>{const v=+el.value;return fn!=='tan'&&Math.abs(v)>1?'|k| > 1: the line misses the wave and the circle. No solution.':fn!=='tan'&&Math.abs(Math.abs(v)-1)<.005?'k = ±1: the line just touches, one solution per period.':'Two solutions per period: find one, then use the symmetry of the circle.';};
  TIPS['te-fn:sin']='sin θ = k: a horizontal line at height k on the circle.';TIPS['te-fn:cos']='cos θ = k: a vertical line at width k on the circle.';TIPS['te-fn:tan']='tan θ = k: a line through the origin with slope k. Period π.';
  TIPS['te-op:gt']='Shaded green: where the graph is above the line.';TIPS['te-op:lt']='Shaded green: where the graph is below the line.';TIPS['te-op:eq']='Solve the equation: where the graph meets the line.';
  TIPS['te-snap']=el=>el.checked?'k snaps to the exact unit-circle values.':'k moves freely; solutions come out as decimals.';
  TIPS['te-b']=el=>`b = ${el.value}: sin(${el.value}θ) runs through ${el.value} full cycle${+el.value>1?'s':''} in [0, 2π).`;
  GLOSS['general solution']='Every solution of an equation, written as one or more starting solutions plus any whole number of periods.';
  TT.trigeq='Insist on a sketch (circle or graph) before any algebra: the picture tells students how many solutions to look for.';
  GLYPH.trigeq='<path d="M2 14 C5 4, 8 4, 11 14 S17 24, 22 10" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M2 9 H22" stroke="var(--hot)" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="4.6" cy="9" r="1.8" fill="var(--hot)"/><circle cx="8.4" cy="9" r="1.8" fill="var(--hot)"/>';
})();

(function(){
  const S2=Math.SQRT2/2,S3=Math.sqrt(3)/2;
  /* (function, value, value text): solutions in [0, 2π) come from the unit circle */
  const EQ=[['sin',.5,'1/2'],['sin',-.5,'−1/2'],['sin',S2,'√2/2'],['sin',-S3,'−√3/2'],['cos',.5,'1/2'],['cos',-S2,'−√2/2'],['cos',S3,'√3/2'],['cos',-.5,'−1/2'],['tan',1,'1'],['tan',-Math.sqrt(3),'−√3'],['tan',Math.sqrt(3)/3,'√3/3']];
  const F={sin:Math.sin,cos:Math.cos,tan:Math.tan};
  /* independent: scan [0, 2π) on a fine grid and keep the special angles that satisfy f(θ) = k */
  const scan=(fn,k)=>SPECIAL.map(([t])=>t).filter(t=>Math.abs(F[fn](t)-k)<1e-9);
  function setText2(fn,k){const a=fn==='sin'?Math.asin(k):fn==='cos'?Math.acos(k):Math.atan(k),c=fn==='sin'?[a,Math.PI-a]:fn==='cos'?[a,TAU-a]:[a,a+Math.PI];return c.map(wrap2pi).sort((x,y)=>x-y);}
  PROBS.push({id:'te-first',topic:'trigeq',title:'Smallest solution',gen(){const [fn,k,kt]=pick(EQ),S=setText2(fn,k),ans=S[0],ref=fn==='sin'?Math.asin(Math.abs(k)):fn==='cos'?Math.acos(Math.abs(k)):Math.atan(Math.abs(k));
    return {q:`Solve ${fn} θ = ${kt} on [0, 2π). Enter the smallest solution.`,ans,unit:'',abs:.002,chk:scan(fn,k)[0],show:piText(ans),hint:'Find the reference angle, then the quadrants where the sign is right.',
      sol:`Reference angle ${piText(ref)}. The solutions in [0, 2π) are ${S.map(piText).join(' and ')}, so the smallest is <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'te-count',topic:'trigeq',title:'How many solutions?',gen(){const b=pick([2,3,4,5]),[k,kt]=pick([[.5,'1/2'],[-.5,'−1/2'],[S2,'√2/2'],[0,'0'],[1,'1'],[-1,'−1'],[.3,'0.3']]),ans=Math.abs(k)===1?b:2*b;
    /* independent: list the solutions from both families and count the distinct ones in [0, 2π) */
    const a=Math.asin(k),set=[];for(let n=-2;n<=b+2;n++)[a+TAU*n,Math.PI-a+TAU*n].forEach(u=>{const t=u/b;if(t>=-1e-9&&t<TAU-1e-9&&!set.some(s=>Math.abs(s-t)<1e-7))set.push(t);});
    return {q:`How many solutions does sin(${b}θ) = ${kt} have on [0, 2π)?`,ans,unit:'',abs:0,chk:set.length,hint:`On [0, 2π), the inside ${b}θ runs over [0, ${2*b}π): ${b} full cycles.`,
      sol:`sin(${b}θ) completes ${b} cycles. ${Math.abs(k)===1?`The line y = ${kt} touches each cycle once`:`The line y = ${kt} crosses each cycle twice`}: <b>${ans}</b> solutions.`};}});
  PROBS.push({id:'te-ineq',topic:'trigeq',title:'Solve an inequality',gen(){const [fn,k,kt]=pick(EQ.filter(e=>e[0]!=='tan')),gt=pick([true,false]),f=F[fn],S=setText2(fn,k),[a,b]=S;
    const inside=gt===(f((a+b)/2)>k);/* true: the answer is the middle interval */
    const right=inside?`(${piText(a)}, ${piText(b)})`:`[0, ${piText(a)}) ∪ (${piText(b)}, 2π)`,wrong=inside?`[0, ${piText(a)}) ∪ (${piText(b)}, 2π)`:`(${piText(a)}, ${piText(b)})`;
    const other=fn==='sin'?setText2('cos',k):setText2('sin',k),w2=`(${piText(other[0])}, ${piText(other[1])})`;
    const {choices,ans}=mcq(right,[wrong,w2,`(${piText(a)}, 2π)`],4);
    return {q:`Solve ${fn} θ ${gt?'>':'<'} ${kt} on [0, 2π).`,choices,ans,hint:`Solve ${fn} θ = ${kt} first: those angles are the boundaries. Then test one point.`,
      sol:`${fn} θ = ${kt} at ${piText(a)} and ${piText(b)}. ${fn} θ is ${gt?'above':'below'} ${kt} on <b>${right}</b>.`};}});
})();
