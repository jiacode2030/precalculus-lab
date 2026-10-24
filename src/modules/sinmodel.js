/* ---------------- 3.7 Sinusoidal models ---------------- */
(function sinmodel(){
  const cv=$('#sm-canvas');if(!cv)return;
  /* daylight: computed from the sun's declination at 40° N on the 21st of each month */
  const dayLen=n=>{const phi=40*Math.PI/180,dec=23.44*Math.PI/180*Math.sin(TAU*(284+n)/365);return 24/Math.PI*Math.acos(-Math.tan(phi)*Math.tan(dec));};
  /* fixed measurement wiggles (not random, so every visit shows the same data) */
  const wig=i=>.55*Math.sin(i*12.9898)*Math.cos(i*4.1414);
  const DS={day:{pts:[21,52,80,111,141,172,202,233,264,294,325,355].map(n=>[n,dayLen(n)]),xr:[0,365],yr:[6,18],u:'day',v:'hours',rng:{a:[0,6,.01],P:[200,500,1],h:[0,365,1],d:[6,18,.01]},guess:{a:2,P:300,h:150,d:12.5}},
    wheel:{pts:Array.from({length:33},(_,i)=>[i/2,30-25*Math.cos(TAU*(i/2)/8)+wig(i)]),xr:[0,16],yr:[0,60],u:'min',v:'m',rng:{a:[0,40,.1],P:[2,20,.05],h:[0,16,.05],d:[0,60,.1]},guess:{a:20,P:7,h:3,d:28}},
    tide:{pts:Array.from({length:37},(_,i)=>[i,3+1.5*Math.cos(TAU*(i-2)/12.42)+wig(i+50)*.25]),xr:[0,36],yr:[0,6],u:'h',v:'m',rng:{a:[0,3,.01],P:[6,30,.02],h:[0,36,.05],d:[0,6,.01]},guess:{a:1,P:10,h:0,d:3.3}}};
  let dk='day',M={...DS.day.guess};
  const f=t=>M.a*Math.cos(TAU*(t-M.h)/M.P)+M.d;
  const sim=glab('sm-canvas',{h:w=>clamp(w*.48,260,360),view:()=>({xr:DS[dk].xr,yr:DS[dk].yr,xn:8,yn:6}),draw(ctx,P){const D=DS[dk];
    hline(ctx,P,M.d,alpha(T.ce,.8),[6,4]);curveD(ctx,P,f,D.xr[0],D.xr[1],T.cx,2.8,800);
    D.pts.forEach(([t,v])=>{line(ctx,P,t,v,t,f(t),T.hot,2);dot(ctx,P.X(t),P.Y(v),4.5,T.ink,T.surface);});
    vline(ctx,P,M.h,alpha(T.ca,.7));label(ctx,'h',P.X(M.h)+5,P.box.y+12,T.ca,'left','middle',LABEL);
    label(ctx,`${D.v} vs ${D.u}`,P.box.x+P.box.w-4,P.box.y+12,T.muted,'right','middle',MONO);}});
  const rms=()=>{const D=DS[dk];return Math.sqrt(D.pts.reduce((s,[t,v])=>s+(v-f(t))**2,0)/D.pts.length);};
  function setSl(id,v){const el=$('#'+id);el.value=v;const o=$('#'+id+'-out');if(o)o.textContent=nz(+(+v).toFixed(2));}
  function upd(){const D=DS[dk],e=rms(),span=D.yr[1]-D.yr[0];
    setHTML('sm-eq',`f(t) = ${nz(+M.a.toFixed(2))} cos(2π(t − ${nz(+M.h.toFixed(2))}) / ${nz(+M.P.toFixed(2))}) + ${nz(+M.d.toFixed(2))}`);
    setText('sm-err',`${fmt(e,3)} ${D.v}`);setText('sm-fit',e<span*.02?'excellent: small, patternless misses':e<span*.06?'decent: look for a pattern in the misses':'poor: adjust the parameters');sim.render();}
  [['sm-a','a'],['sm-P','P'],['sm-h','h'],['sm-d','d']].forEach(([id,k])=>bindRange(id,v=>nz(+(+v).toFixed(2)),v=>{M[k]=v;upd();}));
  function load(k){dk=k;const D=DS[k];M={...D.guess};[['sm-a','a'],['sm-P','P'],['sm-h','h'],['sm-d','d']].forEach(([id,q])=>{const el=$('#'+id),[lo,hi,st]=D.rng[q];el.min=lo;el.max=hi;el.step=st;setSl(id,M[q]);});upd();}
  segBind('sm-data','k',load);
  /* fit from the data's max and min: midline, amplitude, time of the max; the period from max to the next min (half a period) */
  $('#sm-auto').addEventListener('click',()=>{const D=DS[dk];let mx=D.pts[0],mn=D.pts[0];D.pts.forEach(q=>{if(q[1]>mx[1])mx=q;});
    const after=D.pts.filter(q=>q[0]>mx[0]);mn=(after.length>2?after:D.pts).reduce((a,q)=>q[1]<a[1]?q:a);
    M.d=(mx[1]+mn[1])/2;M.a=(mx[1]-mn[1])/2;M.h=mx[0];M.P=dk==='day'?365:2*Math.abs(mn[0]-mx[0]);
    [['sm-a','a'],['sm-P','P'],['sm-h','h'],['sm-d','d']].forEach(([id,q])=>setSl(id,M[q]));upd();});
  load('day');

  /* a wheel turning beside its height graph */
  let r=25,c=30,Tp=8,t=0,start='bottom',play=false,lay=null;const tEl=$('#sm-t'),pb=$('#sm-play');
  const ang0=()=>start==='bottom'?-Math.PI/2:start==='top'?Math.PI/2:0;
  const H=u=>c+r*Math.sin(ang0()+TAU*u/Tp);
  const cv2=$('#sm-canvas2');
  const sim2=sim2d(cv2,{h:w=>w>=560?clamp(w*.42,280,380):clamp(w*1.3,460,580),draw(ctx,w,h){const wide=w>=560,yr=[0,130],lw=Math.min(w*.36,300);
    const gb=wide?{x:lw+40,y:14,w:w-lw-54,h:h-42}:{x:44,y:h*.5+10,w:w-58,h:h*.5-38};
    const sc=wide?gb.h/130:(h*.5-24)/130,gx=wide?lw/2+10:w/2,gy=wide?gb.y+gb.h:h*.5-8;
    /* ground, tower, wheel */
    ctx.strokeStyle=T.muted;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx-120,gy);ctx.lineTo(gx+120,gy);ctx.stroke();
    const hy=gy-c*sc,R=r*sc,a=ang0()+TAU*t/Tp;ctx.strokeStyle=T.ink;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx,hy);ctx.stroke();
    ctx.strokeStyle=alpha(T.muted,.8);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(gx,hy,R,0,TAU);ctx.stroke();
    for(let k=0;k<8;k++){const b=a+k*Math.PI/4;ctx.strokeStyle=alpha(T.muted,.5);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gx,hy);ctx.lineTo(gx+R*Math.cos(b),hy-R*Math.sin(b));ctx.stroke();}
    const px=gx+R*Math.cos(a),py=hy-R*Math.sin(a);ctx.strokeStyle=T.ink;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(gx,hy);ctx.lineTo(px,py);ctx.stroke();
    line(ctx,{box:{x:0,y:0,w,h},X:v=>v,Y:v=>v},px,py,px,gy,alpha(T.hot,.6),1.2,[3,3]);dot(ctx,px,py,7,T.hot,T.surface);dot(ctx,gx,hy,4,T.ink);
    if(wide){ctx.save();ctx.setLineDash([4,4]);ctx.strokeStyle=alpha(T.hot,.6);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(gb.x,py);ctx.stroke();ctx.restore();}
    const P=gpanel(ctx,gb,[0,20],yr,{xn:10,yn:6});
    hline(ctx,P,c,alpha(T.ce,.8),[6,4]);curveD(ctx,P,H,0,20,alpha(T.cx,.3),2,600);curveD(ctx,P,H,0,t,T.cx,3,600);vline(ctx,P,t,alpha(T.hot,.6),[1,0]);dot(ctx,P.X(t),P.Y(H(t)),6.5,T.hot,T.surface);
    label(ctx,'t (min)',P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,'h (m)',P.box.x+6,P.box.y+10,T.muted,'left','middle',MONO);}});
  function eq2(){const k=`2πt/${nz(Tp)}`;return start==='bottom'?`h(t) = ${c} − ${r} cos(${k})`:start==='top'?`h(t) = ${c} + ${r} cos(${k})`:`h(t) = ${c} + ${r} sin(${k})`;}
  function stop(){play=false;pb.textContent='Play';}
  function upd2(){setText('sm-eq2',eq2());setText('sm-ht',`${fmt(H(t),2)} m at t = ${fmt(t,2)} min`);sim2.render();}
  bindRange('sm-r',v=>v+' m',v=>{r=v;upd2();});bindRange('sm-c',v=>v+' m',v=>{c=Math.max(v,r);upd2();});bindRange('sm-per',v=>nz(v)+' min',v=>{Tp=v;upd2();});
  bindRange('sm-t',v=>fmt(v,2)+' min',v=>{t=v;stop();upd2();});
  segBind('sm-start','k',k=>{start=k;upd2();});
  pb.addEventListener('click',()=>{play=!play;if(play&&t>=19.95)t=0;pb.textContent=play?'Pause':'Play';});
  ticker('sinmodel',dt=>{if(!play)return;t+=dt*Tp/6;if(t>=20){t=20;stop();}tEl.value=t;const o=$('#sm-t-out');if(o)o.textContent=fmt(t,2)+' min';upd2();});
  $('#sm-lab2').addEventListener('labreset',()=>{stop();upd2();});
  drawers.sinmodel=()=>{sim.render();sim2.render();};
  KEYS['sm-canvas']=['Adjust the four parameters, or press "Fit from the max and min". Orange segments are the residuals: data minus model.',[['cx','the model'],['ink','data'],['hot','residuals'],['ce','midline'],['ca','time of a maximum']]];
  KEYS['sm-canvas2']=['Press Play or move the time slider. The point on the wheel and its height on the graph move together.',[['hot','the point'],['cx','its height h(t)'],['ce','center height (midline)']]];
  TIPS['sm-a']=el=>`Amplitude ${nz(+el.value)}: how far the model swings above and below the midline.`;
  TIPS['sm-P']=el=>`Period ${nz(+el.value)}: one full cycle. Watch the residuals: a wrong period makes them grow across the graph.`;
  TIPS['sm-h']=el=>`The model peaks at t = ${nz(+el.value)} (and every period after).`;
  TIPS['sm-d']=el=>`Midline ${nz(+el.value)}: the average level.`;
  TIPS['sm-r']=el=>`Radius ${el.value} m: the amplitude.`;TIPS['sm-c']=el=>`Center ${el.value} m above the ground: the midline.`;TIPS['sm-per']=el=>`One turn takes ${el.value} min: the period, so b = 2π/${el.value}.`;
  TIPS['sm-start:bottom']='Starting at the bottom: a flipped cosine, c − r cos(…).';TIPS['sm-start:side']='Starting level with the center and rising: a sine.';TIPS['sm-start:top']='Starting at the top: a cosine.';
  GLOSS['residual']='Data value minus model value at the same input: how much the model misses by.';
  TT.sinmodel='Have pairs fit the daylight data by hand with the four-number recipe, then compare RMS errors: the winning pair explains why.';
  GLYPH.sinmodel='<circle cx="4" cy="14" r="1.6" fill="currentColor"/><circle cx="9" cy="6" r="1.6" fill="currentColor"/><circle cx="15" cy="18" r="1.6" fill="currentColor"/><circle cx="20" cy="9" r="1.6" fill="currentColor"/><path d="M2 12 C5 2, 10 2, 12 12 S19 22, 22 10" fill="none" stroke="var(--cx)" stroke-width="2"/>';
})();

(function(){
  PROBS.push({id:'sm-build',topic:'sinmodel',title:'Build a model from max and min',gen(){const mx=ri(12,40),mn=mx-2*ri(3,10),tmax=ri(1,6),half=pick([2,3,4,5,6]),which=pick(['a','d','b']);
    const ans=which==='a'?(mx-mn)/2:which==='d'?(mx+mn)/2:Math.PI/half;
    return {q:`A quantity reaches its maximum ${mx} at t = ${tmax} and its next minimum ${nz(mn)} at t = ${tmax+half}. For the model f(t) = a cos(b(t − ${tmax})) + d, find ${which==='a'?'a':which==='d'?'d':'b (exact or to three decimals)'}.`,ans,unit:'',abs:.002,
      chk:which==='a'?Math.abs(mn-mx)/2:which==='d'?mn+(mx-mn)/2:TAU/(2*half),show:which==='b'?piText(ans):undefined,hint:'Midline (max + min)/2, amplitude (max − min)/2, and max to the next min is half a period.',
      sol:which==='a'?`a = (${mx} − ${pn(mn)})/2 = <b>${ans}</b>.`:which==='d'?`d = (${mx} + ${pn(mn)})/2 = <b>${nz(ans)}</b>.`:`Half a period is ${half}, so the period is ${2*half} and b = 2π/${2*half} = <b>${piText(ans)}</b>.`};}});
  PROBS.push({id:'sm-predict',topic:'sinmodel',title:'Use the model',gen(){const c=ri(20,60),r=ri(8,c-5),T=pick([4,6,8,10,12]),t=+(Math.random()*T*1.5).toFixed(1),ans=c-r*Math.cos(TAU*t/T);
    return {q:`A Ferris wheel car's height is h(t) = ${c} − ${r} cos(2πt/${T}) meters, t in minutes. Find h(${t}), to two decimals.`,ans,unit:'m',abs:.01,chk:c+r*Math.sin(TAU*t/T-Math.PI/2),hint:'Radian mode. Evaluate the inside first.',
      sol:`h(${t}) = ${c} − ${r} cos(${fmt(TAU*t/T,4)}) ≈ <b>${fmt(ans,2)} m</b>.`};}});
  PROBS.push({id:'sm-above',topic:'sinmodel',title:'Time above a level',gen(){const c=ri(30,80),r=ri(10,25),T=pick([2,4,6,8,10]),lv=pick([c+r/2,c,c-r/2]),k=(lv-c)/r,ans=T*Math.acos(k)/Math.PI;
    /* independent: count time on a fine grid */
    let n=0;const N=20000;for(let i=0;i<N;i++){const t=(i+.5)/N*T;if(c-r*Math.cos(TAU*t/T)>lv)n++;}
    return {q:`h(t) = ${c} − ${r} cos(2πt/${T}) meters, t in seconds. During one period, for how many seconds is h(t) above ${lv} m?`,ans,unit:'s',abs:.01,chk:n/N*T,hint:'Solve h(t) = level for the two boundary times in one period, then subtract.',
      sol:`h(t) &gt; ${lv} when cos(2πt/${T}) &lt; ${fmt(-k,3)}. The boundaries are t = ${fmt(T*Math.acos(-k)/TAU,3)} and t = ${fmt(T-T*Math.acos(-k)/TAU,3)}, so the time above is <b>${fmt(ans,3)} s</b>.`};}});
})();
