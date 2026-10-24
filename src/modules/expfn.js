/* ---------------- 2.2, 2.3 Exponential functions ---------------- */
(function expfn(){
  const cv=$('#ex-canvas');if(!cv)return;
  let a=2,b=1.5;
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  const ymaxOf=()=>clamp(Math.abs(a)*Math.max(1,b>1?b**3:b**-2),3,40);
  const sim=glab('ex-canvas',{h:w=>clamp(w*.5,290,400),view:()=>{const M=ymaxOf();return {xr:[-3,4],yr:a>=0?[-M*.3,M]:[-M,M*.3],xn:7,yn:4};},
    draw(ctx,P){hline(ctx,P,0,alpha(T.ce,.95),[6,4]);
      curveD(ctx,P,x=>a*b**x,-3,4,T.cx,3.2,500);
      if(a!==0){[0,1,2,3].forEach(x=>{const y=a*b**x;if(x<3){const y2=a*b**(x+1);line(ctx,P,x,y,x+1,y2,alpha(T.hot,.7),1.6,[5,4]);label(ctx,'×'+f2(b),P.X(x+.5),P.Y((y+y2)/2)+(a>0?16:-16),T.hot,'center','middle',MONO);}
        dot(ctx,P.X(x),P.Y(y),x===0?6.5:4.5,x===0?T.hot:T.cx,T.surface);});}
      label(ctx,`f(x) = ${f2(a)}(${f2(b)})ˣ`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);label(ctx,'asymptote y = 0',P.box.x+P.box.w-6,P.Y(0)+(a>=0?-10:10),T.ce,'right','middle',MONO);}});
  function upd(){
    setText('ex-form',`f(x) = ${f2(a)}(${f2(b)})ˣ`);
    const pct=(b-1)*100;setText('ex-rate',`${pct>=0?'+':'−'}${f2(Math.abs(pct))}% per step (× ${f2(b)})`);
    const g=b>1,up=a>0;setText('ex-end',a===0?'f is just 0':`x → ∞: ${g?(up?'+∞':'−∞'):'0'};  x → −∞: ${g?'0':(up?'+∞':'−∞')}`);sim.render();}
  bindRange('ex-a',f2,v=>{a=v;upd();});bindRange('ex-b',f2,v=>{b=v;upd();});

  /* line versus exponential through the same first two points */
  let b2=1.5,h=1;const A0=2;
  const E=x=>A0*b2**x,L=x=>A0+A0*(b2-1)*x;
  const sim2=glab('ex-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[-.4,6.6],yr:[0,Math.max(E(6),L(6))*1.08],xn:6,yn:4}),draw(ctx,P){
    curveD(ctx,P,L,-.4,6.6,T.cv,2.8,300);curveD(ctx,P,E,-.4,6.6,T.cx,3.2,500);
    for(let x=0;x<=6+1e-9;x+=h){dot(ctx,P.X(x),P.Y(E(x)),5,T.cx,T.surface);dot(ctx,P.X(x),P.Y(L(x)),4.5,T.cv,T.surface);}
    label(ctx,'blue: exponential   green: line',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd2(){setText('ex-ladd',`+${f2(A0*(b2-1)*h)} (the same amount every step)`);setText('ex-emul',`× ${f2(b2**h)} (the same factor every step)`);setText('ex-six',`line ${f2(L(6))}   exponential ${f2(E(6))}`);sim2.render();}
  bindRange('ex-b2',f2,v=>{b2=v;upd2();});bindRange('ex-h',f2,v=>{h=v;upd2();});
  drawers.expfn=()=>{sim.render();sim2.render();};
  KEYS['ex-canvas']=['Change a and b. Orange dot: the y-intercept (0, a). Orange dashed segments: one step right, and the factor that multiplies the height. Gold: the horizontal asymptote.',[['cx','f(x)'],['hot','y-intercept and steps'],['ce','asymptote y = 0']]];
  KEYS['ex-canvas2']=['Both graphs start at the same two points. The line adds the same amount per step; the exponential multiplies by the same factor per step.',[['cx','exponential'],['cv','line']]];
  TIPS['ex-b']=el=>+el.value>1?`b = ${el.value}: growth, ${f2((el.value-1)*100)}% more each step.`:+el.value<1?`b = ${el.value}: decay, ${f2((1-el.value)*100)}% less each step.`:'b = 1: not exponential, just a constant.';
  TIPS['ex-a']=el=>`a = ${el.value}: the graph crosses the y-axis at ${el.value}.`;
  GLOSS['growth factor']='The number b that multiplies the output each time the input goes up by 1 in f(x) = a·bˣ.';GLOSS['exponential function']='A function f(x) = a·bˣ: equal steps in x multiply the output by the same factor.';GLOSS['decay']='Exponential change with 0 < b < 1: the outputs shrink toward 0.';
  TT.expfn='Make the contrast explicit: ask "adds or multiplies?" for every table before naming the function.';
  GLYPH.expfn='<path d="M2 21 C10 21, 15 18, 20 3" stroke="var(--cx)" stroke-width="2.4" fill="none"/><path d="M2 21 H22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  PROBS.push({id:'ex-eval',topic:'expfn',title:'Evaluate an exponential',gen(){const a=pick([2,3,5,10,50,100,250]),b=pick([1.5,2,3,.5,.8,1.1,1.05,.9,1.2]),x=ri(2,8),ans=a*Math.pow(b,x);let t=a;for(let i=0;i<x;i++)t*=b;
    return {q:`f(x) = ${a}(${b})ˣ. Find f(${x}) to 2 decimal places.`,ans,unit:'',abs:.006,chk:t,show:ans.toFixed(2),hint:'Raise b to the power x first, then multiply by a.',sol:`f(${x}) = ${a}(${b})^${x} = ${a}(${sg(Math.pow(b,x))}) ≈ <b>${ans.toFixed(2)}</b>.`};}});
  PROBS.push({id:'ex-factor',topic:'expfn',title:'Growth factor from a percent',gen(){const p=pick([2,3,5,6,7.5,8,10,12,15,20,25,40]),grow=Math.random()<.5,ans=grow?1+p/100:1-p/100;let t=100;t=t+(grow?1:-1)*t*p/100;
    return {q:`A quantity ${grow?'grows':'decays'} by ${p}% each year. What is the growth factor b in f(x) = a·bˣ?`,ans,unit:'',abs:1e-6,chk:t/100,show:sg(ans),hint:grow?'Growth factor = 1 + the rate (as a decimal).':'Decay factor = 1 − the rate (as a decimal).',sol:`b = 1 ${grow?'+':'−'} ${p/100} = <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'ex-two',topic:'expfn',title:'Extend an exponential table',gen(){const a=pick([2,3,5]),b=pick([2,3,4]),x1=ri(0,3),k=ri(3,5),y1=a*Math.pow(b,x1),y2=y1*b,ans=y2*Math.pow(b,k-1);let t=y2;for(let i=1;i<k;i++)t*=b;
    return {q:`f is exponential with f(${x1}) = ${y1} and f(${x1+1}) = ${y2}. Find f(${x1+k}).`,ans,unit:'',abs:0,chk:t,hint:'Equal steps multiply by the same factor: b = f(x + 1)/f(x).',sol:`b = ${y2}/${y1} = ${b}. From x = ${x1+1} to x = ${x1+k} is ${k-1} more step${k>2?'s':''}: f(${x1+k}) = ${y2}(${b})^${k-1} = <b>${ans}</b>.`};}});
  PROBS.push({id:'ex-end',topic:'expfn',title:'End behavior of a·bˣ',gen(){const a=pick([-4,-2,-1,1,2,3,5]),b=pick([.5,.8,.25,1.5,2,3]),right=Math.random()<.5,f=x=>a*Math.pow(b,x);
    const big=(b>1)===right,val=big?(a>0?'+∞':'−∞'):'0',all=['+∞','−∞','0','1'],{choices,ans}=mcq(val,all.filter(v=>v!==val),4);
    return {q:`f(x) = ${a}(${b})ˣ. What does f(x) approach as x → ${right?'∞':'−∞'}?`,choices,ans,chk:f(right?60:-60),hint:'Is b above or below 1? Then ask whether b to a huge power is huge or tiny. Finally use the sign of a.',
      sol:`b = ${b} is ${b>1?'above':'below'} 1, so bˣ ${big?'grows without bound':'shrinks to 0'} as x → ${right?'∞':'−∞'}.${big?` With a = ${sg(a)} that gives ${val}.`:' So f → 0.'} Answer: <b>${val}</b>.`};}});
})();
