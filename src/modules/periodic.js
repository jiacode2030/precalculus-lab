/* ---------------- 3.1 Periodic phenomena ---------------- */
(function periodic(){
  const cv=$('#pe-canvas');if(!cv)return;
  /* one cycle: 6 values at equal steps across [0, p), joined by a periodic Catmull–Rom curve */
  const N=6,PRE={bump:()=>[0,1.73,1.73,0,-1.73,-1.73].map(v=>+v.toFixed(2)),saw:()=>[-2,-1.2,-.4,.4,1.2,2],pulse:()=>[-1,-1,3,3,-1,-1],rand:()=>Array.from({length:N},()=>Math.round((Math.random()*6-3)*4)/4)};
  let V=PRE.bump(),p=4,x=1,dr=-1;
  const F=t=>{const u=((t%p)+p)%p/p*N,i=Math.floor(u)%N,s=u-Math.floor(u),p0=V[(i+N-1)%N],p1=V[i],p2=V[(i+1)%N],p3=V[(i+2)%N];
    return .5*((2*p1)+(-p0+p2)*s+(2*p0-5*p1+4*p2-p3)*s*s+(-p0+3*p1-3*p2+p3)*s*s*s);};
  const ext=()=>{let mx=-1e9,mn=1e9;for(let i=0;i<=600;i++){const v=F(i/600*p);mx=Math.max(mx,v);mn=Math.min(mn,v);}return [mx,mn];};
  const sim=glab('pe-canvas',{h:w=>clamp(w*.45,250,340),view:()=>({xr:[-10,10],yr:[-4.2,4.2],xn:10,yn:4}),draw(ctx,P){const [mx,mn]=ext();
    ctx.fillStyle=alpha(T.ce,.12);ctx.fillRect(P.X(0),P.box.y,P.X(p)-P.X(0),P.box.h);label(ctx,'one cycle',P.X(p/2),P.box.y+12,T.ce,'center','middle',MONO);
    hline(ctx,P,(mx+mn)/2,alpha(T.ce,.8),[6,4]);
    curveD(ctx,P,F,-10,10,alpha(T.cx,.55),2.2,1600);curveD(ctx,P,F,0,p,T.cx,3.2,400);
    for(let k=-6;k<=6;k++){const xx=x+k*p;if(xx<-10||xx>10)continue;line(ctx,P,xx,0,xx,F(xx),alpha(T.hot,.6),1.2,[3,3]);dot(ctx,P.X(xx),P.Y(F(xx)),k?5:7,T.hot,T.surface);}
    V.forEach((v,i)=>dot(ctx,P.X(i*p/N),P.Y(v),i===dr?9:7,T.cx,T.surface));},
    drag(k,xx,yy){if(k==='up'){dr=-1;sim.render();return;}
      if(k==='down'){dr=-1;let bd=.6;V.forEach((v,i)=>{const d=Math.hypot((xx-i*p/N)/1.4,(yy-v)/1.2);if(d<bd){bd=d;dr=i;}});}
      if(dr>=0){V[dr]=clamp(Math.round(yy*4)/4,-4,4);upd();}}});
  function upd(){const [mx,mn]=ext();setText('pe-same',`f(${fmt(x-p,2)}) = f(${fmt(x,2)}) = f(${fmt(x+p,2)}) = ${fmt(F(x),2)}`);
    setText('pe-amp',`${fmt(mx,2)} · ${fmt(mn,2)}`);setText('pe-mid',`y = ${fmt((mx+mn)/2,2)} · ${fmt((mx-mn)/2,2)}`);sim.render();}
  bindRange('pe-p',v=>fmt(v,1),v=>{p=v;upd();});bindRange('pe-x',v=>fmt(v,2),v=>{x=v;upd();});
  segBind('pe-pre','k',k=>{V=PRE[k]();upd();});
  $('#pe-lab').addEventListener('labreset',()=>{V=PRE.bump();upd();});

  /* real rhythms and two cursors */
  const ecg=t=>{let u=((t-.2)%.8+.8)%.8;if(u>.4)u-=.8;return 1.6*Math.exp(-((u/.018)**2))-.25*Math.exp(-(((u+.04)/.015)**2))-.3*Math.exp(-(((u-.04)/.02)**2))+.35*Math.exp(-(((u-.28)/.05)**2))+.15*Math.exp(-(((u+.17)/.035)**2));};
  const DATA={heart:{f:ecg,xr:[0,4],yr:[-.6,2],u:'s',per:.8,rate:d=>`${fmt(60/d,1)} beats per minute`,c:[.2,1]},
    breath:{f:t=>{const u=((t%4)+4)%4;return u<1.6?Math.sin(u/1.6*Math.PI/2)**2*2.5:2.5*Math.exp(-(u-1.6)*1.6);},xr:[0,16],yr:[-.3,3],u:'s',per:4,rate:d=>`${fmt(60/d,1)} breaths per minute`,c:[1.6,5.6]},
    tide:{f:t=>1.5*Math.cos(TAU*t/12.42)+.45*Math.cos(TAU*t/24.84)+2.5,xr:[0,50],yr:[0,5],u:'h',per:24.84,rate:d=>`${fmt(24/d,2)} cycles per day`,c:[0,12.42]}};
  let dk='heart',C=DATA.heart.c.slice(),snap=true,dc=-1;
  const peakNear=(f,x0,span)=>{let best=x0,bv=-1e9;for(let i=0;i<=400;i++){const t=x0-span+2*span*i/400,v=f(t);if(v>bv){bv=v;best=t;}}return best;};
  const sim2=glab('pe-canvas2',{h:w=>clamp(w*.4,220,300),view:()=>({xr:DATA[dk].xr,yr:DATA[dk].yr,xn:8,yn:4}),draw(ctx,P){const D=DATA[dk];
    curveD(ctx,P,D.f,D.xr[0],D.xr[1],T.cx,2.2,2400);
    C.forEach((c,i)=>{vline(ctx,P,c,T.hot,[1,0]);dot(ctx,P.X(c),P.Y(D.f(c)),6.5,T.hot,T.surface);label(ctx,i?'B':'A',P.X(c)+6,P.box.y+12,T.hot,'left','middle',LABEL);});
    line(ctx,P,C[0],D.yr[1]-(D.yr[1]-D.yr[0])*.1,C[1],D.yr[1]-(D.yr[1]-D.yr[0])*.1,T.hot,2);label(ctx,D.u==='h'?'time (h)':'time (s)',P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);},
    drag(k,xx){if(k==='up'){dc=-1;return;}const D=DATA[dk];if(k==='down')dc=Math.abs(xx-C[0])<Math.abs(xx-C[1])?0:1;
      let v=clamp(xx,D.xr[0],D.xr[1]);if(snap)v=peakNear(D.f,v,(D.xr[1]-D.xr[0])/30);C[dc]=v;upd2();}});
  function upd2(){const D=DATA[dk],d=Math.abs(C[1]-C[0]);setText('pe-dt',`${fmt(d,D.u==='h'?2:3)} ${D.u}`);setText('pe-rate',d>1e-6?D.rate(d):'—');sim2.render();}
  segBind('pe-data','k',k=>{dk=k;C=DATA[k].c.slice();upd2();});
  $('#pe-snap').addEventListener('change',e=>{snap=e.target.checked;});
  upd2();
  drawers.periodic=()=>{sim.render();sim2.render();};
  KEYS['pe-canvas']=['Drag the six points in the gold band to reshape one cycle; every copy changes. Orange points are one period apart.',[['cx','f(x)'],['ce','one cycle and the midline'],['hot','x, x ± p, x ± 2p']]];
  KEYS['pe-canvas2']=['Drag the two cursors. Line them up on matching features to measure the period.',[['cx','the signal'],['hot','cursors A and B']]];
  TIPS['pe-p']=el=>`Period ${fmt(+el.value,1)}: the cycle is stretched to that width and repeated.`;
  TIPS['pe-x']=el=>`x = ${fmt(+el.value,2)}. Every point a whole number of periods away has the same height.`;
  TIPS['pe-snap']=el=>el.checked?'Cursors jump to the nearest peak.':'Cursors go exactly where you drop them.';
  TIPS['pe-data:tide']='A mixed tide: two high tides a day, but of different heights. Measure carefully.';
  GLOSS['periodic']='Repeating: f(x + p) = f(x) for every x, for some fixed p > 0.';
  GLOSS['cycle']='One full period of a periodic graph; the whole graph is copies of it.';
  TT.periodic='Bring a real ECG strip or tide table: students find the period by measuring between matching features before seeing any equation.';
  GLYPH.periodic='<path d="M2 16 L6 6 L10 16 L14 6 L18 16 L22 6" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M6 20 H14" stroke="var(--hot)" stroke-width="2"/>';
})();

(function(){
  PROBS.push({id:'pe-value',topic:'periodic',title:'Values from one cycle',gen(){const p=pick([4,5,6]),vals=Array.from({length:p},()=>ri(-5,9)),k=ri(2,9),r=ri(0,p-1),neg=pick([false,true]),x=neg?r-k*p:r+k*p,ans=vals[r];
    const m=v=>String(v).replace('-','−');
    return {q:`A periodic function f has period ${p}. Its values for x = 0 to ${p-1} are ${vals.map(m).join(', ')}. Find f(${m(x)}).`,ans,unit:'',abs:0,chk:vals[((x%p)+p)%p],hint:'Add or subtract whole periods until the input lands in 0 to '+(p-1)+'.',
      sol:`${m(x)} = ${r} ${neg?'−':'+'} ${k}(${p}), so f(${m(x)}) = f(${r}) = <b>${m(ans)}</b>.`};}});
  PROBS.push({id:'pe-next',topic:'periodic',title:'When is the next one?',gen(){const t0=pick([.3,.5,1.2,2]),per=pick([.75,.8,1.25,1.5,2.4]),n=ri(5,20),ans=t0+(n-1)*per;
    return {q:`A signal has peaks at t = ${t0} s and then every ${per} s. When is peak number ${n}?`,ans,unit:'s',abs:.001,chk:[...Array(n)].reduce((t,_,i)=>i?t+per:t,t0),hint:'Peak 1 is at the start; each later peak adds one period.',
      sol:`${t0} + (${n} − 1)(${per}) = <b>${fmt(ans,2)} s</b>.`};}});
  PROBS.push({id:'pe-rate',topic:'periodic',title:'Period and frequency',gen(){const per=pick([.6,.75,.8,1,1.2,1.5]),ans=60/per;
    return {q:`A heart-monitor strip shows one beat every ${per} s. What is the heart rate in beats per minute?`,ans,unit:'beats/min',abs:.05,chk:(1/per)*60,hint:'Frequency = 1 / period, in beats per second. Then multiply by 60.',
      sol:`1/${per} = ${fmt(1/per,3)} beats per second, times 60 = <b>${fmt(ans,1)} beats per minute</b>.`};}});
})();
