/* ---------------- 3.14 Polar graphs ---------------- */
(function polargraph(){
  const cv=$('#pg-canvas');if(!cv)return;
  let fam='rose',a=3,b=2,th=2.2,play=false,whole=true,lay=null;
  const n=()=>Math.max(1,Math.round(b));
  const F=()=>fam==='rose'?t=>a*Math.cos(n()*t):fam==='lim'?t=>a+b*Math.cos(t):fam==='lims'?t=>a+b*Math.sin(t):fam==='circ'?t=>a*Math.cos(t):t=>a/6*t;
  const eq=()=>fam==='rose'?`r = ${nz(a)} cos(${n()}θ)`:fam==='lim'?`r = ${nz(a)} + ${nz(b)} cos θ`:fam==='lims'?`r = ${nz(a)} + ${nz(b)} sin θ`:fam==='circ'?`r = ${nz(a)} cos θ`:`r = ${fmt(a/6,3)}θ`;
  const rmaxOf=f=>{let m=0;for(let i=0;i<=720;i++)m=Math.max(m,Math.abs(f(i/720*TAU)));return Math.max(m,.5);};
  const sim=sim2d(cv,{h:w=>w>=620?clamp(w*.45,320,420):clamp(w*1.45,520,680),draw(ctx,w,h){const f=F(),rm=rmaxOf(f);const L=lay=polarPanels(ctx,w,h,rm),G=L.G,Pp=L.Pp;
    /* (θ, r) graph */
    hline(ctx,G,0,T.muted,[1,0]);polarStroke(ctx,G,f,0,TAU,2,.25,true);polarStroke(ctx,G,f,0,th,2.8,1,true);
    vline(ctx,G,th,T.ce);dot(ctx,G.X(th),G.Y(f(th)),6.5,T.hot,T.surface);
    /* polar curve */
    if(whole)polarStroke(ctx,Pp,f,0,TAU,2,.22);polarStroke(ctx,Pp,f,0,th,2.8);
    const r=f(th),s=rm*1.15,x=r*Math.cos(th),y=r*Math.sin(th);
    line(ctx,Pp,0,0,s*Math.cos(th),s*Math.sin(th),T.ce,1.4,[5,4]);if(r<0)line(ctx,Pp,0,0,-s*Math.cos(th),-s*Math.sin(th),alpha(T.ca,.6),1.2,[2,4]);
    line(ctx,Pp,0,0,x,y,T.hot,3);dot(ctx,Pp.X(x),Pp.Y(y),7,T.hot,T.surface);
    label(ctx,eq(),Pp.box.x+6,Pp.box.y+12,T.cx,'left','middle','600 13px "IBM Plex Mono",monospace');
    label(ctx,`θ = ${fmt(th,2)}  r = ${fmt(r,2)}`,G.box.x+26,G.box.y+12,T.hot,'left','middle','600 12px "IBM Plex Mono",monospace');},
    drag(kind,e){if(kind==='up'||!lay)return;const [px,py]=ptr(e,cv),G=lay.G,Pp=lay.Pp;play=false;pb.textContent='Play';
      if(px>=G.box.x&&px<=G.box.x+G.box.w&&py>=G.box.y-10&&py<=G.box.y+G.box.h+10)th=clamp((px-G.box.x)/G.box.w*TAU,0,TAU);
      else{let t=Math.atan2(-(py-Pp.Y(0)),px-Pp.X(0));if(t<0)t+=TAU;th=t;}sync();}});
  const thEl=$('#pg-th');
  function sync(){thEl.value=th;const o=$('#pg-th-out');if(o)o.textContent=`${fmt(th,2)} rad (${Math.round(th*180/Math.PI)}°)`;upd();}
  function upd(){const f=F(),r=f(th);setHTML('pg-eq',eq());setText('pg-r',fmt(r,3));setText('pg-xy',`(${fmt(r*Math.cos(th),3)}, ${fmt(r*Math.sin(th),3)})`);
    setText('pg-note',Math.abs(r)<.03?'r ≈ 0: the curve passes through the origin':r<0?'r < 0: the point is on the opposite ray (magenta)':'r > 0: the point is on the ray θ');
    const bo=$('#pg-b-out');if(bo)bo.textContent=fam==='rose'?`n = ${n()}`:fam==='lim'||fam==='lims'?nz(b):'(not used)';sim.render();}
  bindRange('pg-th',v=>`${fmt(v,2)} rad (${Math.round(v*180/Math.PI)}°)`,v=>{th=v;upd();});bindRange('pg-a',nz,v=>{a=v;upd();});bindRange('pg-b',nz,v=>{b=v;upd();});
  segBind('pg-fam','k',k=>{fam=k;upd();});
  const pb=$('#pg-play');pb.addEventListener('click',()=>{play=!play;if(play&&th>=TAU-.01)th=0;pb.textContent=play?'Pause':'Play';});
  $('#pg-trail').addEventListener('click',e=>{whole=!whole;e.target.textContent=whole?'Hide the rest of the curve':'Show whole curve';sim.render();});$('#pg-trail').textContent='Hide the rest of the curve';
  ticker('polargraph',dt=>{if(!play)return;th+=dt*.9;if(th>TAU){th=TAU;play=false;pb.textContent='Play';}sync();});
  $('#pg-lab').addEventListener('labreset',()=>{play=false;pb.textContent='Play';whole=true;$('#pg-trail').textContent='Hide the rest of the curve';sim.render();});

  /* drag r(θ): 12 control points, periodic cubic (Catmull–Rom) between them */
  const N=12,PRE={flat:()=>Array(N).fill(2),card:()=>Array.from({length:N},(_,k)=>1.5+1.5*Math.cos(k*TAU/N)),rose:()=>Array.from({length:N},(_,k)=>3*Math.cos(2*k*TAU/N)),
    rand:()=>Array.from({length:N},()=>Math.round((Math.random()*6-1.5)*4)/4)};
  let V=PRE.flat(),drag=-1,lay2=null;
  const G2=t=>{const u=wrap2pi(t)/TAU*N,i=Math.floor(u)%N,s=u-Math.floor(u),p0=V[(i+N-1)%N],p1=V[i],p2=V[(i+1)%N],p3=V[(i+2)%N];
    return .5*((2*p1)+(-p0+p2)*s+(2*p0-5*p1+4*p2-p3)*s*s+(-p0+3*p1-3*p2+p3)*s*s*s);};
  const cv2=$('#pg-canvas2');
  const sim2=sim2d(cv2,{h:w=>w>=620?clamp(w*.45,320,420):clamp(w*1.45,520,680),draw(ctx,w,h){const L=lay2=polarPanels(ctx,w,h,4,[-4,4]),G=L.G,Pp=L.Pp;
    hline(ctx,G,0,T.muted,[1,0]);polarStroke(ctx,G,G2,0,TAU,2.6,1,true);polarStroke(ctx,Pp,G2,0,TAU,2.8);
    V.forEach((v,k)=>{const t=k*TAU/N;dot(ctx,G.X(t),G.Y(v),k===drag?9:7,v<0?T.ca:T.cx,T.surface);dot(ctx,Pp.X(v*Math.cos(t)),Pp.Y(v*Math.sin(t)),4,v<0?T.ca:T.cx);});
    dot(ctx,G.X(TAU),G.Y(V[0]),5,alpha(T.cx,.5),T.surface);},
    drag(kind,e){if(!lay2)return;const [px,py]=ptr(e,cv2),G=lay2.G;
      if(kind==='up'){drag=-1;sim2.render();return;}
      if(kind==='down'){let best=-1,bd=40;V.forEach((v,k)=>{const d=Math.hypot(G.X(k*TAU/N)-px,G.Y(v)-py);if(d<bd){bd=d;best=k;}});
        if(best<0&&px>=G.box.x&&px<=G.box.x+G.box.w){best=Math.round((px-G.box.x)/G.box.w*N)%N;}drag=best;}
      if(drag>=0){const v=G.yr[0]+(G.box.y+G.box.h-py)/G.box.h*(G.yr[1]-G.yr[0]);V[drag]=clamp(Math.round(v*4)/4,-4,4);upd2();}}});
  function upd2(){let bm=0,bt=0;for(let i=0;i<=720;i++){const t=i/720*TAU,v=Math.abs(G2(t));if(v>bm){bm=v;bt=t;}}
    setText('pg-max',`|r| = ${fmt(bm,2)} at θ ≈ ${fmt(bt,2)} (${Math.round(bt*180/Math.PI)}°)`);
    const z=roots(G2,0,TAU-1e-6,720).map(t=>`${Math.round(t*180/Math.PI)}°`);setText('pg-zero',z.length?z.join(', '):'never (r never changes sign)');sim2.render();}
  segBind('pg-pre','k',k=>{V=PRE[k]();upd2();});upd2();
  drawers.polargraph=()=>{sim.render();sim2.render();};
  KEYS['pg-canvas']=['Press Play, or drag along either picture to set θ. Blue is r ≥ 0, magenta is r < 0. Orange is the point and its distance r.',[['cx','r ≥ 0'],['ca','r < 0'],['hot','the point'],['ce','the ray θ']]];
  KEYS['pg-canvas2']=['Drag the dots on the left graph up or down. Each dot is r at one angle; below the axis means negative r. The polar curve follows.',[['cx','r ≥ 0'],['ca','r < 0']]];
  TIPS['pg-th']=el=>`θ = ${fmt(+el.value,2)}: the ray points at ${Math.round(+el.value*180/Math.PI)}°, and the point sits r units along it (or behind the origin if r < 0).`;
  TIPS['pg-a']=el=>fam==='rose'?`a = ${nz(+el.value)}: every petal is ${nz(+el.value)} long.`:fam==='lim'||fam==='lims'?`a = ${nz(+el.value)}, b = ${nz(b)}: ${Math.abs(+el.value)<Math.abs(b)-1e-9?'|a| < |b|, an inner loop':Math.abs(+el.value-b)<1e-9?'|a| = |b|, a cardioid':Math.abs(+el.value)<2*Math.abs(b)?'|b| < |a| < 2|b|, a dimple':'|a| ≥ 2|b|, convex'}.`:`a = ${nz(+el.value)} sets the size.`;
  TIPS['pg-b']=el=>fam==='rose'?`n = ${Math.round(+el.value)}: ${Math.round(+el.value)%2?Math.round(+el.value)+' petals (odd n)':2*Math.round(+el.value)+' petals (even n gives 2n)'}.`:fam==='lim'||fam==='lims'?`b = ${nz(+el.value)}: compare with a = ${nz(a)} to name the limaçon.`:'This family does not use b.';
  TIPS['pg-fam:spir']='Spiral r = kθ: r grows steadily, so the curve winds outward. On the (θ, r) graph it is a straight line.';
  GLOSS['limaçon']='A polar curve r = a + b cos θ or a + b sin θ. Inner loop if |a| < |b|, cardioid if |a| = |b|.';
  GLOSS['cardioid']='A heart-shaped limaçon, r = a + a cos θ, with a cusp at the origin.';
  GLOSS['polar function']='A rule r = f(θ) that gives a distance from the origin for each angle.';
  TT.polargraph='Before Play, have students sketch the (θ, r) graph and predict where the polar curve hits the origin. The drill below trains the same translation.';
  GLYPH.polargraph='<path d="M12 12 C16 4, 21 9, 12 12 C20 16, 15 21, 12 12 C8 20, 3 15, 12 12 C4 8, 9 3, 12 12" fill="none" stroke="var(--cx)" stroke-width="1.8"/>';
})();

(function(){
  PROBS.push({id:'pg-petals',topic:'polargraph',title:'Petals of a rose',gen(){const nn=ri(2,9),a=ri(1,6),fn=pick(['sin','cos']),ans=nn%2?nn:2*nn;
    return {q:`How many petals does the polar curve r = ${a} ${fn}(${nn}θ) have?`,ans,unit:'',abs:.01,chk:nn*(1+(nn+1)%2),hint:'Odd n: n petals. Even n: 2n petals.',sol:`n = ${nn} is ${nn%2?'odd':'even'}, so there are <b>${ans}</b> petals.`};}});
  PROBS.push({id:'pg-zero',topic:'polargraph',title:'Where the curve hits the origin',gen(){const [a,b,t,nm]=pick([[1,2,2*Math.PI/3,'2π/3'],[2,2,Math.PI,'π'],[1,-2,Math.PI/3,'π/3'],[3,-3,0,'0'],[Math.sqrt(2),2,3*Math.PI/4,'3π/4']]),ans=t;
    const at=Math.abs(a-Math.SQRT2)<1e-9?'√2':nz(a);
    return {q:`r = ${at} ${b<0?'−':'+'} ${Math.abs(b)} cos θ. Find the smallest θ in [0, 2π) where the curve passes through the origin.`,ans,unit:'rad',abs:.005,chk:Math.acos(-a/b),show:nm,hint:'Set r = 0 and solve for cos θ.',
      sol:`${at} ${b<0?'−':'+'} ${Math.abs(b)} cos θ = 0 gives cos θ = ${fmt(-a/b,3)}${Math.abs(-a/b)===.5||Math.abs(-a/b)===1?'':' ('+exactTrig(-a/b)+')'}. The smallest such θ is <b>${nm}</b>.`};}});
  PROBS.push({id:'pg-point',topic:'polargraph',title:'A point on a polar curve',gen(){const a=ri(1,4),b=ri(1,4),[t,nm]=pick(SPECIAL.slice(1,12)),r=a+b*Math.sin(t),which=pick(['x','y']),ans=which==='x'?r*Math.cos(t):r*Math.sin(t);
    return {q:`On r = ${a} + ${b} sin θ, find the ${which}-coordinate of the point where θ = ${nm} (three decimals).`,ans:Math.abs(ans)<1e-12?0:ans,unit:'',abs:.005,chk:(a+b*Math.sin(t))*(which==='x'?Math.cos(t):Math.sin(t)),
      hint:'Find r first, then x = r cos θ or y = r sin θ.',sol:`r = ${a} + ${b} sin(${nm}) = ${fmt(r,4)}. ${which} = r ${which==='x'?'cos':'sin'}(${nm}) = <b>${fmt(ans,3)}</b>.`};}});
  PROBS.push({id:'pg-shape',topic:'polargraph',title:'Name the limaçon',gen(){const [a,b,k]=pick([[1,3,0],[2,4,0],[3,3,1],[5,5,1],[3,2,2],[5,3,2],[5,2,3],[7,3,3]]);const names=['Limaçon with an inner loop','Cardioid','Dimpled limaçon','Convex limaçon'];
    const {choices,ans}=mcq(names[k],names.filter((_,i)=>i!==k));
    return {q:`Which describes the graph of r = ${a} + ${b} cos θ?`,choices,ans,hint:'Compare |a| with |b| and with 2|b|.',sol:`|a| = ${a}, |b| = ${b}: ${k===0?'|a| < |b|':k===1?'|a| = |b|':k===2?'|b| < |a| < 2|b|':'|a| ≥ 2|b|'}, so <b>${names[k].toLowerCase()}</b>.`};}});
})();
