/* ---------------- 1.1, 1.2 Change in tandem & rates of change ---------------- */
(function roc(){
  const cv=$('#ro-canvas');if(!cv)return;
  /* glass radius r(h) in cm, height 16 cm; poured at a steady rate that fills each glass in 12 s */
  const H=16,TF=12,GL={cyl:h=>4,cone:h=>Math.max(.05,h/2),flask:h=>7-.35*h,ball:h=>h<=14?Math.max(.12,Math.sqrt(Math.max(0,49-(h-7)**2))):1.2};
  const NOTE={cyl:'same width all the way up',cone:'wider and wider as it fills',flask:'narrower and narrower as it fills',ball:'widest halfway up, narrow at both ends'};
  const N=1600;let tab=null,Q=1,shape='cyl',t=4,play=false,lay=null;
  function build(){const r=GL[shape],V=[0];for(let i=1;i<=N;i++){const hm=(i-.5)*H/N;V.push(V[i-1]+Math.PI*r(hm)**2*H/N);}Q=V[N]/TF;tab=V.map(v=>v/Q);}
  const hOf=tt=>{if(tt<=0)return 0;if(tt>=TF)return H;let lo=0,hi=N;while(hi-lo>1){const m=(lo+hi)>>1;if(tab[m]<tt)lo=m;else hi=m;}const f=(tt-tab[lo])/(tab[hi]-tab[lo]||1);return (lo+f)*H/N;};
  const rate=h=>Q/(Math.PI*GL[shape](Math.min(h,H-1e-6))**2);
  const pb=$('#ro-play'),tEl=$('#ro-t');build();
  const sim=sim2d(cv,{h:w=>w>=560?clamp(w*.44,280,380):clamp(w*1.3,460,560),draw(ctx,w,h){const wide=w>=560;
    const G=wide?{x:14,y:16,w:w*.3,h:h-40}:{x:14,y:10,w:w-28,h:h*.42},B=wide?{x:w*.3+70,y:16,w:w*.7-84,h:h-48}:{x:46,y:h*.42+30,w:w-60,h:h*.58-60};lay=B;
    const s=Math.min(G.h/17.5,G.w/18),cx=G.x+G.w/2,by=G.y+G.h-4,X=x=>cx+x*s,Y=y=>by-y*s,r=GL[shape],hn=hOf(t);
    /* water, then the glass outline */
    ctx.fillStyle=alpha(T.cx,.28);ctx.beginPath();for(let i=0;i<=120;i++){const y=hn*i/120;ctx.lineTo(X(-r(y)),Y(y));}for(let i=120;i>=0;i--){const y=hn*i/120;ctx.lineTo(X(r(y)),Y(y));}ctx.closePath();ctx.fill();
    ctx.strokeStyle=T.cx;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X(-r(hn)),Y(hn));ctx.lineTo(X(r(hn)),Y(hn));ctx.stroke();
    ctx.strokeStyle=T.ink;ctx.lineWidth=2;[-1,1].forEach(sg=>{ctx.beginPath();for(let i=0;i<=160;i++){const y=H*i/160;i?ctx.lineTo(X(sg*r(y)),Y(y)):ctx.moveTo(X(sg*r(y)),Y(y));}ctx.stroke();});
    ctx.beginPath();ctx.moveTo(X(-r(0)),Y(0));ctx.lineTo(X(r(0)),Y(0));ctx.stroke();
    /* the steady stream */
    if(t<TF){ctx.strokeStyle=alpha(T.cx,.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,Y(H+1.2));ctx.lineTo(cx,Y(hn));ctx.stroke();}
    label(ctx,`h = ${fmt(hn,1)} cm`,X(r(hn))+8,Y(hn),T.cx,'left','middle',LABEL);
    const P=gpanel(ctx,B,[0,TF],[0,17],{xn:6,yn:4});
    curveD(ctx,P,hOf,0,TF,alpha(T.cx,.25),2,600);curveD(ctx,P,hOf,0,t,T.cx,3,600);
    const rt=rate(hn),dt=1.2;if(t>0&&t<TF&&rt<30)line(ctx,P,t-dt,hn-rt*dt,t+dt,hn+rt*dt,T.hot,1.8,[6,4]);
    dot(ctx,P.X(t),P.Y(hn),7,T.hot,T.surface);
    label(ctx,'t (s)',B.x+B.w-4,B.y+B.h-8,T.muted,'right','middle',MONO);label(ctx,'h (cm)',B.x+6,B.y+11,T.muted,'left','middle',MONO);},
    drag(kind,e){if(kind==='up'||!lay)return;const [x]=ptr(e,cv),B=lay;if(x<B.x-10)return;stop();t=clamp((x-B.x)/B.w*TF,0,TF);sync();}});
  function stop(){play=false;pb.textContent='Play';}
  function sync(){tEl.value=t;const o=$('#ro-t-out');if(o)o.textContent=fmt(t,2);upd();}
  function upd(){const hn=hOf(t),rt=rate(hn),dr=GL[shape](Math.min(hn+.05,H))-GL[shape](Math.max(hn-.05,0));
    setText('ro-h',`${fmt(hn,2)} cm`);setText('ro-rate',t>=TF?'full':rt>99?'very fast (narrow point)':`${fmt(rt,2)} cm/s`);
    setText('ro-cc',t>=TF?'—':`increasing, ${Math.abs(dr)<1e-6?'at a constant rate: a straight line':dr>0?'more and more slowly: concave down':'faster and faster: concave up'} (glass ${NOTE[shape]})`);sim.render();}
  bindRange('ro-t',v=>fmt(v,2),v=>{t=v;upd();});
  segBind('ro-shape','k',k=>{shape=k;build();stop();upd();});
  pb.addEventListener('click',()=>{play=!play;if(play&&t>=TF-1e-6)t=0;pb.textContent=play?'Pause':'Play';});
  $('#ro-lab').addEventListener('labreset',()=>{stop();shape='cyl';build();upd();});

  /* secant slopes on real data */
  const DATA={bike:{f:t=>.5*t*t+2*t,yr:[0,75],u:'m/s',yl:'d (m)',xl:'t (s)'},cool:{f:t=>20+70*Math.exp(-.2*t),yr:[0,100],u:'°C per min',yl:'T (°C)',xl:'t (min)'},
    plant:{f:t=>60/(1+Math.exp(-.8*(t-5))),yr:[0,65],u:'cm per day',yl:'h (cm)',xl:'t (days)'}};
  let dk='bike',a=2,b=4,shr=false,dr=-1;const aEl=$('#ro-a'),bEl=$('#ro-b'),sb=$('#ro-shrink');
  const sim2=glab('ro-canvas2',{h:w=>clamp(w*.45,250,340),view:()=>({xr:[0,10],yr:DATA[dk].yr,xn:10,yn:5}),draw(ctx,P){const D=DATA[dk],f=D.f,fa=f(a),fb=f(b);
    curveD(ctx,P,f,0,10,T.cx,2.8,600);
    const e=1e-5,m0=(f(a+e)-f(a-e))/(2*e);line(ctx,P,a-3,fa-3*m0,a+3,fa+3*m0,alpha(T.ce,.95),1.6,[6,4]);
    if(Math.abs(b-a)>1e-9){const m=(fb-fa)/(b-a);line(ctx,P,-1,fa+m*(-1-a),11,fa+m*(11-a),alpha(T.hot,.4),1.3);
      line(ctx,P,a,fa,b,fa,T.ca,2.2);line(ctx,P,b,fa,b,fb,T.cv,2.2);line(ctx,P,a,fa,b,fb,T.hot,3);
      if(Math.abs(P.X(b)-P.X(a))>40)label(ctx,`Δx = ${fmt(b-a,2)}`,P.X((a+b)/2),P.Y(fa)+(fb>=fa?14:-14),T.ca,'center','middle',MONO);
      if(Math.abs(P.Y(fb)-P.Y(fa))>26)label(ctx,`Δy = ${fmt(fb-fa,2)}`,P.X(b)+(b>=a?6:-6),P.Y((fa+fb)/2),T.cv,b>=a?'left':'right','middle',MONO);}
    dot(ctx,P.X(a),P.Y(fa),7,T.hot,T.surface);dot(ctx,P.X(b),P.Y(fb),6,T.hot,T.surface);
    label(ctx,'a',P.X(a)-8,P.Y(fa)-12,T.hot,'right','middle',LABEL);label(ctx,'b',P.X(b)+8,P.Y(fb)-12,T.hot,'left','middle',LABEL);
    label(ctx,D.xl,P.box.x+P.box.w-4,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);label(ctx,D.yl,P.box.x+6,P.box.y+11,T.muted,'left','middle',MONO);},
    drag(k,xx){if(k==='up'){dr=-1;return;}if(k==='down'){stopS();dr=Math.abs(xx-a)<=Math.abs(xx-b)?0:1;}const v=clamp(xx,0,10);if(dr===0)a=v;else if(dr===1)b=v;sync2();}});
  function stopS(){shr=false;sb.textContent='Shrink b toward a';}
  function sync2(){aEl.value=a;bEl.value=b;const oa=$('#ro-a-out'),ob=$('#ro-b-out');if(oa)oa.textContent=fmt(a,2);if(ob)ob.textContent=fmt(b,2);upd2();}
  function upd2(){const D=DATA[dk],f=D.f,e=1e-5,m0=(f(a+e)-f(a-e))/(2*e);
    if(Math.abs(b-a)<1e-9){setText('ro-avg','— (a = b)');setText('ro-dir','—');}
    else{const m=(f(b)-f(a))/(b-a);setText('ro-avg',`${fmt(m,3)} ${D.u}`);setText('ro-dir',m>0?'increasing on average':m<0?'decreasing on average':'no net change');}
    setText('ro-at',`${fmt(m0,3)} ${D.u}`);sim2.render();}
  bindRange('ro-a',v=>fmt(v,2),v=>{a=v;upd2();});bindRange('ro-b',v=>fmt(v,2),v=>{b=v;upd2();});
  segBind('ro-fn','k',k=>{dk=k;stopS();upd2();});
  sb.addEventListener('click',()=>{if(shr){stopS();return;}if(Math.abs(b-a)<.011)b=Math.min(10,a+2);shr=true;sb.textContent='Stop';});
  ticker('roc',d=>{if(play){t+=d*1.5;if(t>=TF){t=TF;stop();}sync();}
    if(shr){const gap=b-a,ng=gap*Math.pow(.25,d);b=a+(Math.abs(ng)<.01?.01*Math.sign(gap||1):ng);if(Math.abs(ng)<.01)stopS();sync2();}});
  $('#ro-lab2').addEventListener('labreset',()=>{stopS();dk='bike';upd2();});
  drawers.roc=()=>{sim.render();sim2.render();};
  KEYS['ro-canvas']=['Press Play, drag the time slider, or drag along the graph. Water pours in at a steady rate; the dashed orange line shows how fast the height is rising right now.',[['cx','water height h(t)'],['hot','now, and the rate now']]];
  KEYS['ro-canvas2']=['Drag a or b along the curve. The orange segment is the secant line; its slope is Δy/Δx. Gold dashed: the slope at a.',[['cx','the data'],['hot','secant line'],['ca','Δx'],['cv','Δy'],['ce','rate at a']]];
  TIPS['ro-t']=el=>`t = ${fmt(+el.value,2)} s: the same volume has been poured every second so far.`;
  TIPS['ro-shape:cyl']='Same width everywhere: the height rises steadily.';TIPS['ro-shape:cone']='Narrow at the bottom: fast at first, then slower.';
  TIPS['ro-shape:flask']='Narrow at the top: slow at first, then faster.';TIPS['ro-shape:ball']='Fast, slow, fast: watch the bend switch halfway up.';
  TIPS['ro-a']=el=>`a = ${fmt(+el.value,2)}.`;TIPS['ro-b']=el=>`b = ${fmt(+el.value,2)}. The secant slope is (f(b) − f(a))/(b − a).`;
  TIPS['ro-fn:cool']='Temperature falls, so every average rate is negative.';TIPS['ro-fn:plant']='Slow, then fast, then slow: the rates rise and then fall.';
  GLOSS['average rate of change']='(f(b) − f(a))/(b − a): the slope of the secant line on [a, b].';GLOSS['concave up']='Bending upward: the rate of change is increasing.';GLOSS['concave down']='Bending downward: the rate of change is decreasing.';
  TT.roc='Fill real glasses from a measuring cup and record heights every few seconds: students predict the graph from the glass shape before they see it.';
  GLYPH.roc='<path d="M3 20 C8 18, 12 10, 21 4" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M5 19 L18 6" stroke="var(--hot)" stroke-width="2"/>';
})();

(function(){
  const sg=v=>String(v).replace('-','−');
  PROBS.push({id:'ro-avg',topic:'roc',title:'Average rate from a formula',gen(){const c3=pick([0,0,1,-1]),c2=ri(-3,3),c1=ri(-5,5),c0=ri(-6,6),f=x=>c3*x**3+c2*x*x+c1*x+c0,a=ri(-3,2),b=a+ri(1,4);
    const ans=(f(b)-f(a))/(b-a),chk=c3*(a*a+a*b+b*b)+c2*(a+b)+c1,form=polyTxt([c3,c2,c1,c0].slice(c3?0:1));
    return {q:`f(x) = ${form}. Find the average rate of change of f on [${sg(a)}, ${sg(b)}].`,ans,unit:'',abs:.001,chk,show:frac(ans),hint:'(f(b) − f(a)) / (b − a).',
      sol:`f(${sg(a)}) = ${sg(f(a))} and f(${sg(b)}) = ${sg(f(b))}, so (${sg(f(b))} − ${pn(f(a))}) / (${sg(b)} − ${pn(a)}) = ${sg(f(b)-f(a))}/${b-a} = <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'ro-table',topic:'roc',title:'Average rate from a table',gen(){const ctx=pick([{n:'temperature of an oven',u:'°F',tu:'minute',start:ri(70,90),step:[ri(20,45)]},{n:'height of a sunflower',u:'cm',tu:'day',start:ri(10,30),step:[ri(2,6)]},{n:'water level in a reservoir',u:'ft',tu:'week',start:ri(40,60),step:[-ri(1,4)]}]);
    const ts=[0,2,5,7,10],vals=ts.map((t,i)=>i?0:ctx.start);for(let i=1;i<ts.length;i++)vals[i]=vals[i-1]+(ts[i]-ts[i-1])*ctx.step[0]+ri(-3,3);
    const i=ri(0,2),j=ri(i+1,4),ans=(vals[j]-vals[i])/(ts[j]-ts[i]);
    let s=0;for(let k=i;k<j;k++)s+=vals[k+1]-vals[k];
    return {q:`The ${ctx.n} was recorded. Time t (${ctx.tu}s): ${ts.join(', ')}. Value (${ctx.u}): ${vals.map(sg).join(', ')}. Find the average rate of change from t = ${ts[i]} to t = ${ts[j]}.`,ans,unit:`${ctx.u}/${ctx.tu}`,abs:.01,chk:s/(ts[j]-ts[i]),show:fmt(ans,3),
      hint:'Change in the quantity divided by the change in time.',sol:`(${sg(vals[j])} − ${sg(vals[i])}) / (${ts[j]} − ${ts[i]}) = ${sg(vals[j]-vals[i])}/${ts[j]-ts[i]} ≈ <b>${fmt(ans,3)} ${ctx.u} per ${ctx.tu}</b>.`};}});
  PROBS.push({id:'ro-est',topic:'roc',title:'Estimate a rate at a point',gen(){const p=pick([1,2,-1]),q=ri(-3,3),f=x=>p*x**3+q*x*x,a=ri(1,3),h=pick([.1,.01]),ans=(f(a+h)-f(a))/h;
    const chk=p*(3*a*a+3*a*h+h*h)+q*(2*a+h);
    return {q:`f(x) = ${polyTxt([p,q,0,0])}. Estimate the rate of change of f at x = ${a} using the average rate of change on [${a}, ${a+h}]. Give 4 decimal places.`,ans,unit:'',abs:.0005,chk,show:fmt(ans,4),
      hint:`Compute (f(${a+h}) − f(${a})) / ${h}.`,sol:`f(${a+h}) = ${fmt(f(a+h),6)} and f(${a}) = ${f(a)}, so the average rate is (${fmt(f(a+h),6)} − ${pn(f(a))})/${h} = <b>${fmt(ans,4)}</b>. A smaller interval gives a better estimate of the rate at x = ${a}.`.replace(/-(\d)/g,'−$1')};}});
})();
