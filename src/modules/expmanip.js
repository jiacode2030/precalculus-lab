/* ---------------- 2.4 Exponent rules & rewriting ---------------- */
(function expmanip(){
  const cv=$('#em-canvas');if(!cv)return;
  let a=1.5,b=2,h=-2;
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1'),f4=v=>fmt(v,4);
  const g=x=>a*b**(x-h),A=()=>a*b**(-h);
  const sim=glab('em-canvas',{h:w=>clamp(w*.5,290,400),view:()=>{const M=clamp(Math.max(g(3),A()*b**3),4,80);return {xr:[-4,4],yr:[-M*.1,M],xn:8,yn:4};},
    draw(ctx,P){hline(ctx,P,0,alpha(T.ce,.9),[6,4]);
      curveD(ctx,P,x=>A()*b**x,-4,4,T.cx,5,500);curveD(ctx,P,g,-4,4,T.cv,2.2,500,[7,5]);
      dot(ctx,P.X(0),P.Y(A()),6.5,T.hot,T.surface);dot(ctx,P.X(h),P.Y(a),5.5,T.cv,T.surface);
      label(ctx,`blue: ${f2(A())}·${f2(b)}ˣ   green dashed: ${f2(a)}·${f2(b)}^(x ${h<0?'+':'−'} ${f2(Math.abs(h))})`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd(){const sh=h===0?'x':`x ${h<0?'+':'−'} ${f2(Math.abs(h))}`;
    setText('em-g',`${f2(a)}·${f2(b)}^(${sh})`);setText('em-f',`${f4(A())}·${f2(b)}ˣ  (a·b^(−h))`);setText('em-same',`${f4(g(0))} = ${f4(A())}`);sim.render();}
  bindRange('em-a',f2,v=>{a=v;upd();});bindRange('em-b',f2,v=>{b=v;upd();});bindRange('em-h',f2,v=>{h=v;upd();});

  let kd='dbl',Tp=3;const BASE={dbl:2,trp:3,hlf:.5},NAME={dbl:'2',trp:'3',hlf:'½'};
  const sim2=glab('em-canvas2',{h:w=>clamp(w*.44,260,340),view:()=>{const be=BASE[kd];return {xr:[0,3*Tp],yr:[0,be>1?100*be**3*1.08:112],xn:6,yn:4};},draw(ctx,P){const be=BASE[kd],f=t=>100*be**(t/Tp);
    curveD(ctx,P,f,0,3*Tp,T.cx,3.2,400);
    for(let t=0;t<=3*Tp+1e-9;t+=1)dot(ctx,P.X(t),P.Y(f(t)),3.6,alpha(T.cx,.8),T.surface);
    for(let i=0;i<=3;i++){dot(ctx,P.X(i*Tp),P.Y(f(i*Tp)),6.2,T.hot,T.surface);label(ctx,fmt(f(i*Tp),1).replace(/\.0$/,''),P.X(i*Tp),P.Y(f(i*Tp))-14,T.hot,i===0?'left':'center','middle','600 11px "IBM Plex Mono",monospace');}
    label(ctx,`orange: one period (${Tp}) apart, ×${NAME[kd]}   small blue: one unit apart`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd2(){const be=BASE[kd],b1=be**(1/Tp),pc=(b1-1)*100;
    setText('em-form',`100·${NAME[kd]}^(t/${f2(Tp)})`);setText('em-per',`${NAME[kd]}^(1/${f2(Tp)}) ≈ ${f4(b1)}`);setText('em-pct',`${pc>=0?'+':'−'}${fmt(Math.abs(pc),2)}% per unit`);sim2.render();}
  bindRange('em-T',f2,v=>{Tp=v;upd2();});segBind('em-kind','k',k=>{kd=k;upd2();});
  drawers.expmanip=()=>{sim.render();sim2.render();};
  KEYS['em-canvas']=['Blue (thick) and green (dashed) are the same graph. Orange: the y-intercept. Green dot: the point (h, a).',[['cx','unshifted form'],['cv','shifted form'],['hot','y-intercept']]];
  KEYS['em-canvas2']=['Orange dots are one period apart: the quantity is multiplied by 2, 3 or ½ each time. Small blue dots are one unit apart.',[['cx','A(t)'],['hot','one period apart']]];
  TIPS['em-h']=el=>`h = ${el.value}: moving the graph ${+el.value>=0?'right':'left'} ${Math.abs(el.value)} multiplies heights by ${f2(b**(-el.value))}.`;
  GLOSS['half-life']='The time it takes for a quantity decaying exponentially to fall to half its value.';GLOSS['doubling time']='The time it takes for a quantity growing exponentially to double.';
  TT.expmanip='Have students rewrite 2^(x+3) three ways before using the slider; the overlapping graphs then confirm the algebra.';
  GLYPH.expmanip='<path d="M2 20 C10 20, 14 17, 18 5" stroke="var(--cx)" stroke-width="3" fill="none"/><path d="M2 20 C10 20, 14 17, 18 5" stroke="var(--cv)" stroke-width="1.4" stroke-dasharray="3 2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  PROBS.push({id:'em-shift',topic:'expmanip',title:'Shift into stretch',gen(){const a=pick([2,3,5,.5,4]),b=pick([2,3,4,5]),k=ri(-3,4)||2,ans=a*Math.pow(b,k),f=x=>a*Math.pow(b,x+k);
    return {q:`Write ${a}·${b}^(x ${k<0?'−':'+'} ${Math.abs(k)}) in the form A·${b}ˣ. Find A.`,ans,unit:'',abs:.0006,chk:f(0),show:sg(+ans.toFixed(4)),hint:'Split the exponent: b^(x + k) = bˣ·bᵏ.',sol:`${a}·${b}^(x ${k<0?'−':'+'} ${Math.abs(k)}) = ${a}·${b}^${k<0?`(−${-k})`:k}·${b}ˣ, so A = ${a}(${sg(Math.pow(b,k))}) = <b>${sg(+ans.toFixed(4))}</b>.`};}});
  PROBS.push({id:'em-base',topic:'expmanip',title:'Per-unit factor from a doubling time',gen(){const kind=pick([['doubles',2],['triples',3],['halves',.5]]),T=pick([2,3,4,5,6,8,10]),ans=Math.pow(kind[1],1/T);
    let lo=.01,hi=5;for(let i=0;i<80;i++){const m=(lo+hi)/2;if(Math.pow(m,T)<kind[1])lo=m;else hi=m;}
    return {q:`A quantity ${kind[0]} every ${T} years. Find its growth factor per year, to 3 decimal places.`,ans,unit:'',abs:.0006,chk:(lo+hi)/2,show:ans.toFixed(3),hint:`If b is the yearly factor, then b^${T} = ${kind[1]===.5?'1/2':kind[1]}.`,sol:`b^${T} = ${kind[1]===.5?'1/2':kind[1]}, so b = (${kind[1]===.5?'1/2':kind[1]})^(1/${T}) ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'em-rules',topic:'expmanip',title:'Combine exponents',gen(){const m=ri(2,9),n=ri(2,9),p=ri(2,7),b=pick([2,3,5]),ans=m+n-p;
    return {q:`${b}^${m} · ${b}^${n} / ${b}^${p} = ${b}^k. Find k.`,ans,unit:'',abs:0,chk:Math.round(Math.log(Math.pow(b,m)*Math.pow(b,n)/Math.pow(b,p))/Math.log(b)),hint:'Add the exponents when multiplying and subtract when dividing.',sol:`k = ${m} + ${n} − ${p} = <b>${nz(ans)}</b>.`};}});
  PROBS.push({id:'em-frac',topic:'expmanip',title:'Fractional and negative exponents',gen(){const P=pick([[8,3],[27,3],[16,4],[125,3],[9,2],[32,5],[64,3],[81,4]]),base=P[0],q=P[1],p=pick([-3,-2,-1,1,2,3,4].filter(v=>gcd(Math.abs(v),q)===1)),r=Math.round(Math.pow(base,1/q)),ans=Math.pow(r,p);
    return {q:`Evaluate ${base}^(${p}/${q}). Enter a fraction or a number.`.replace('(-','(−'),ans,unit:'',abs:1e-6,chk:Math.pow(base,p/q),show:frac(ans),hint:`Take the ${q===2?'square root':q===3?'cube root':q+'th root'} first, then the power. A negative exponent means reciprocal.`,sol:p===1?`${base}^(1/${q}) is the ${q===2?'square':q===3?'cube':q+'th'} root of ${base}: <b>${r}</b>.`:`${base}^(1/${q}) = ${r}, so ${base}^(${sg(p)}/${q}) = ${r}^${p<0?`(${sg(p)})`:p} = <b>${frac(ans)}</b>.`};}});
})();
