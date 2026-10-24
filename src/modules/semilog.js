/* ---------------- 2.15 Semi-log plots ---------------- */
(function semilog(){
  const cv=$('#sl-canvas');if(!cv)return;
  const L10=Math.log10;
  const DATA={exp:{x:[0,1,2,3,4,5,6],y:[100,210,385,820,1590,3150,6500],yl:'bacteria',a:100,b:2},
    decay:{x:[0,1,2,3,4,5,6,7,8],y:[800,410,195,102,49,26,12,6.5,3],yl:'mg of medicine',a:800,b:.5},
    quad:{x:[1,2,3,4,5,6,7,8],y:[1,4,9,16,25,36,49,64],yl:'y = x²',a:1,b:1.5},
    lin:{x:[0,1,2,3,4,5,6,7,8],y:[20,50,80,110,140,170,200,230,260],yl:'y = 20 + 30x',a:20,b:1.3}};
  let dk='exp',ax='lin',a=100,b=1.5;
  const set=(id,v)=>{const e=$('#'+id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const pw=k=>k>=0?String(Math.pow(10,k)):String(+Math.pow(10,k).toFixed(-k));
  const reg=D=>{const n=D.x.length,mx=D.x.reduce((s,v)=>s+v,0)/n,ly=D.y.map(L10),my=ly.reduce((s,v)=>s+v,0)/n;let sxy=0,sxx=0,syy=0;D.x.forEach((x,i)=>{sxy+=(x-mx)*(ly[i]-my);sxx+=(x-mx)**2;syy+=(ly[i]-my)**2;});const m=sxy/sxx;return {m,c:my-m*mx,r2:sxy*sxy/(sxx*syy)};};
  const sim=sim2d(cv,{h:w=>clamp(w*.6,320,440),draw(ctx,w,h){const D=DATA[dk],log=ax==='log',f=x=>a*Math.pow(b,x);
    const xr=[Math.min(...D.x)-.5,Math.max(...D.x)+.5];let yr,P;
    if(log){const ly=D.y.map(L10),lo=Math.floor(Math.min(...ly,L10(a))-.1),hi0=Math.ceil(Math.max(...ly)+.1),hi=Math.max(hi0,lo+2);yr=[lo,hi];
      P=gpanel(ctx,{x:50,y:12,w:w-66,h:h-40},xr,yr,{xn:6,yn:hi-lo,yt:false});
      for(let k=lo;k<=hi;k++){label(ctx,pw(k),P.box.x-6,P.Y(k),T.muted,'right','middle',MONO);if(k<hi)for(let m=2;m<=9;m++)line(ctx,P,xr[0],k+L10(m),xr[1],k+L10(m),alpha(T.grid,.55),.6);}
      line(ctx,P,xr[0],L10(a)+xr[0]*L10(b),xr[1],L10(a)+xr[1]*L10(b),T.cv,3);
      D.x.forEach((x,i)=>dot(ctx,P.X(x),P.Y(L10(D.y[i])),5.5,T.cx,T.surface));
      label(ctx,'log scale: '+D.yl,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}
    else{const top=Math.max(...D.y)*1.12;yr=[0,top];P=gpanel(ctx,{x:50,y:12,w:w-66,h:h-40},xr,yr,{xn:6,yn:4});
      curveD(ctx,P,f,xr[0],xr[1],T.cv,3,300);
      D.x.forEach((x,i)=>dot(ctx,P.X(x),P.Y(D.y[i]),5.5,T.cx,T.surface));
      label(ctx,'ordinary axes: '+D.yl,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}}});
  function upd(){const D=DATA[dk],r=reg(D);
    setText('sl-eq',`y = ${f2(a)} · ${f2(b)}^x`);setText('sl-slope',`log b = ${fmt(L10(b),3)}`);
    setText('sl-r2',`${fmt(r.r2,3)}  ${r.r2>.99?'(straight: exponential)':'(bends: not exponential)'}`);sim.render();}
  bindRange('sl-a',f2,v=>{a=v;upd();});bindRange('sl-b',f2,v=>{b=v;upd();});
  const pick0=()=>{const D=DATA[dk];set('sl-a',D.a);set('sl-b',D.b);};
  segBind('sl-set','k',k=>{dk=k;pick0();});segBind('sl-ax','k',k=>{ax=k;upd();});
  $('#sl-best').addEventListener('click',()=>{const r=reg(DATA[dk]);set('sl-a',clamp(Math.round(Math.pow(10,r.c)),1,1000));set('sl-b',clamp(+Math.pow(10,r.m).toFixed(2),.3,4));});
  $('#sl-lab').addEventListener('labreset',()=>{dk='exp';ax='lin';pick0();});

  /* reading the model from a line */
  const CS={a:{x1:2,y1:200,x2:6,y2:12.5,a:800,b:.5,xm:10,u:'hours'},b:{x1:1,y1:6,x2:4,y2:162,a:2,b:3,xm:8,u:'days'},c:{x1:0,y1:50,x2:3,y2:3200,a:50,b:4,xm:5,u:'ms'}};
  let ck='a',xh=5;
  const g=()=>CS[ck];
  const sim2=glab('sl-canvas2',{h:w=>clamp(w*.46,260,350),mx:50,view:()=>{const c=g(),ly=[L10(c.a),L10(c.a*Math.pow(c.b,c.xm))],lo=Math.floor(Math.min(...ly)-.05),hi=Math.ceil(Math.max(...ly)+.05);return {xr:[0,c.xm],yr:[lo,hi],xn:5,yn:hi-lo,yt:false};},
    draw(ctx,P){const c=g(),lo=P.yr[0],hi=P.yr[1];
      for(let k=lo;k<=hi;k++){label(ctx,pw(k),P.box.x-6,P.Y(k),T.muted,'right','middle',MONO);if(k<hi)for(let m=2;m<=9;m++)line(ctx,P,0,k+L10(m),c.xm,k+L10(m),alpha(T.grid,.55),.6);}
      line(ctx,P,0,L10(c.a),c.xm,L10(c.a)+c.xm*L10(c.b),T.cv,3);
      [[c.x1,c.y1],[c.x2,c.y2]].forEach(([x,y])=>{dot(ctx,P.X(x),P.Y(L10(y)),6,T.cx,T.surface);label(ctx,`(${f2(x)}, ${f2(y)})`,P.X(x)+10,P.Y(L10(y))-12,T.cx,'left','middle',MONO);});
      const x=Math.min(xh,c.xm),y=c.a*Math.pow(c.b,x);line(ctx,P,x,lo,x,L10(y),alpha(T.hot,.6),1.4,[4,3]);line(ctx,P,0,L10(y),x,L10(y),alpha(T.hot,.6),1.4,[4,3]);dot(ctx,P.X(x),P.Y(L10(y)),6.5,T.hot,T.surface);
      c.b>1?label(ctx,'log y-axis',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO):label(ctx,'log y-axis',P.box.x+P.box.w-8,P.box.y+12,T.muted,'right','middle',MONO);}});
  function upd2(){const c=g(),x=Math.min(xh,c.xm),y=c.a*Math.pow(c.b,x);
    setText('sl-md',`y = ${f2(c.a)} · ${f2(c.b)}^x  (x in ${c.u})`);setText('sl-fac',`${f2(c.b)}`);setText('sl-val',fmt(y,y<1?3:2));
    setText('sl-tm',c.b>1?`doubling time = ln 2 / ln ${f2(c.b)} = ${fmt(Math.LN2/Math.log(c.b),2)} ${c.u}`:`half-life = ln 2 / −ln ${f2(c.b)} = ${fmt(Math.LN2/-Math.log(c.b),2)} ${c.u}`);sim2.render();}
  bindRange('sl-x',f2,v=>{xh=v;upd2();});
  segBind('sl-case','k',k=>{ck=k;const e=$('#sl-x');e.max=g().xm;if(+e.value>g().xm)set('sl-x',g().xm);upd2();});
  drawers.semilog=()=>{sim.render();sim2.render();};
  KEYS['sl-canvas']=['Blue dots: data. Green: your model y = a·bˣ. On a log y-axis the gridlines are powers of 10 and an exponential model is a straight line.',[['cx','data'],['cv','model']]];
  KEYS['sl-canvas2']=['Blue dots: two points read from the graph. Green: the straight line they determine. Orange: the point you slide along it.',[['cx','known points'],['cv','line'],['hot','your x']]];
  TIPS['sl-ax:log']='On a log axis, equal distances mean equal ratios, so exponential data becomes a line.';
  GLOSS['semi-log plot']='A graph with an ordinary x-axis and a logarithmic y-axis. Exponential data is a straight line on it.';
  TT.semilog='Have students plot both a table of exponential data and a table of quadratic data on log paper: only one is a line.';
  GLYPH.semilog='<path d="M3 5v15h19" stroke="var(--muted)" stroke-width="1.6" fill="none"/><path d="M5 18 L21 6" stroke="var(--cv)" stroke-width="2.2" fill="none"/><circle cx="8" cy="15.5" r="1.8" fill="var(--cx)"/><circle cx="13" cy="11.5" r="1.8" fill="var(--cx)"/><circle cx="18" cy="8" r="1.8" fill="var(--cx)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),B=[2,3,4,5,10,.5,.25,.2],f3=v=>(+v.toFixed(3)).toString();
  PROBS.push({id:'sl-slope',topic:'semilog',title:'Slope on a semi-log plot',gen(){const a=pick([2,5,10,20,50]),b=pick(B),ans=Math.log10(b),f=x=>a*Math.pow(b,x);
    return {q:`A quantity follows y = ${a}·${f3(b)}^x. On a plot of log₁₀ y against x, what is the slope of the line? Round to 3 decimal places.`,ans,unit:'',abs:.002,chk:(Math.log10(f(7))-Math.log10(f(2)))/5,show:ans.toFixed(3),hint:'log y = log a + x·log b, so the slope is log₁₀ of the factor b.',sol:`log₁₀ y = log₁₀ ${a} + x·log₁₀ ${f3(b)}, so the slope is log₁₀ ${f3(b)} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'sl-base',topic:'semilog',title:'Find b from a semi-log line',gen(){const a=pick([2,5,10,20,50]),b=pick(B),x1=pick([0,1,2]),x2=x1+pick([2,3,4]),y1=a*Math.pow(b,x1),y2=a*Math.pow(b,x2),r=v=>+v.toPrecision(10);
    return {q:`Points (${x1}, ${f3(r(y1))}) and (${x2}, ${f3(r(y2))}) lie on a straight line on a semi-log plot (log y-axis). Find the base b of the model y = a·bˣ.`,ans:b,unit:'',abs:.005,chk:Math.exp((Math.log(y2)-Math.log(y1))/(x2-x1)),show:String(b),hint:'Divide: y₂/y₁ = b^(x₂ − x₁). Then take the root.',sol:`y₂/y₁ = ${f3(r(y2/y1))} = b^${x2-x1}, so b = ${f3(r(y2/y1))}^(1/${x2-x1}) = <b>${f3(b)}</b>.`};}});
  PROBS.push({id:'sl-start',topic:'semilog',title:'Find the starting value',gen(){const a=pick([2,5,10,20,50,100]),b=pick([2,3,4,5,.5,.25]),x1=pick([1,2,3]),x2=x1+pick([1,2,3]),y1=a*Math.pow(b,x1),y2=a*Math.pow(b,x2),r=v=>+v.toPrecision(10),bb=Math.pow(y2/y1,1/(x2-x1));
    return {q:`A straight line on a semi-log plot passes through (${x1}, ${f3(r(y1))}) and (${x2}, ${f3(r(y2))}). What is the value of y at x = 0?`,ans:a,unit:'',tol:.01,chk:y1/Math.pow(bb,x1),show:String(a),hint:'First find b from the ratio of the y-values. Then go back x₁ steps: a = y₁ / b^x₁.',sol:`b = (${f3(r(y2/y1))})^(1/${x2-x1}) = ${f3(b)}. Then a = ${f3(r(y1))} / ${f3(b)}^${x1} = <b>${a}</b>.`};}});
  PROBS.push({id:'sl-pred',topic:'semilog',title:'Predict from a semi-log line',gen(){const a=pick([2,5,10,20,50]),b=pick([2,3,.5,1.5]),x1=pick([0,1,2]),x2=x1+pick([2,3]),x3=x2+pick([1,2,3]),y1=a*Math.pow(b,x1),y2=a*Math.pow(b,x2),ans=a*Math.pow(b,x3),r=v=>+v.toPrecision(10);
    return {q:`A straight line on a semi-log plot passes through (${x1}, ${f3(r(y1))}) and (${x2}, ${f3(r(y2))}). Predict y at x = ${x3}.`,ans,unit:'',tol:.01,chk:y1*Math.exp((x3-x1)*(Math.log(y2)-Math.log(y1))/(x2-x1)),show:f3(r(ans)),hint:'Find b from the two points, then multiply y₂ by b for each extra step of x.',sol:`b = ${f3(b)}. From x = ${x2} to x = ${x3} is ${x3-x2} step${x3-x2>1?'s':''}, so y = ${f3(r(y2))}·${f3(b)}^${x3-x2} = <b>${f3(r(ans))}</b>.`};}});
  PROBS.push({id:'sl-time',topic:'semilog',title:'Doubling time from the factor',gen(){const b=pick([1.1,1.2,1.5,1.8,2.5,3]),ans=Math.log(2)/Math.log(b);let lo=0,hi=100;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(Math.pow(b,m)<2)lo=m;else hi=m;}
    return {q:`The log graph of a culture is a straight line, and y is multiplied by ${b} every hour. How long does it take to double? Round to 2 decimal places.`,ans,unit:'hours',abs:.006,chk:(lo+hi)/2,show:ans.toFixed(2),hint:'Solve b^t = 2 with a logarithm.',sol:`${b}^t = 2, so t = ln 2 / ln ${b} = ${Math.log(2).toFixed(4)} / ${Math.log(b).toFixed(4)} ≈ <b>${ans.toFixed(2)} hours</b>.`};}});
  PROBS.push({id:'sl-which',topic:'semilog',title:'Which axes make a straight line?',gen(){const t=pick(['exp','lin','log']),A=ri(2,9);let xs,ys,right;
    if(t==='exp'){const b=pick([2,3]);xs=[0,1,2,3,4];ys=xs.map(x=>A*Math.pow(b,x));right='y on a log axis against ordinary x (semi-log)';}
    else if(t==='lin'){const d=ri(2,9);xs=[0,1,2,3,4];ys=xs.map(x=>A+d*x);right='y against x on ordinary axes';}
    else{const d=ri(2,9);xs=[1,2,4,8,16];ys=xs.map((x,i)=>A+d*i);right='ordinary y against x on a log x-axis';}
    const {choices,ans}=mcq(right,['y on a log axis against ordinary x (semi-log)','y against x on ordinary axes','ordinary y against x on a log x-axis'].filter(v=>v!==right),3);
    return {q:`x = ${xs.join(', ')} and y = ${ys.join(', ')}. Which graph of this data is a straight line?`,choices,ans,hint:'Equal steps in y for equal steps in x is linear. A constant factor in y for equal steps in x is exponential. Equal steps in y for a constant factor in x is logarithmic.',sol:t==='exp'?'y is multiplied by the same factor each step: exponential, so it is a line on a <b>log y-axis</b>.':t==='lin'?'y goes up by the same amount each step: linear, a line on <b>ordinary axes</b>.':'x is multiplied by 2 while y goes up by the same amount: logarithmic, a line on a <b>log x-axis</b>.'};}});
})();
