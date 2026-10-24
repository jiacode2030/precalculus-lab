/* ---------------- 2.1 Arithmetic & geometric sequences ---------------- */
(function seqs(){
  const cv=$('#sq-canvas');if(!cv)return;
  let kind='arith',a0=2,d=3,r=1.5;
  const terms=n=>{const o=[a0];for(let i=1;i<=n;i++)o.push(kind==='arith'?o[i-1]+d:o[i-1]*r);return o;};
  const sim=sim2d(cv,{h:w=>clamp(w*.62,360,470),draw(ctx,w,h){const A=terms(10),B=A.slice(1).map((v,i)=>kind==='arith'?v-A[i]:(A[i]===0?0:v/A[i]));
    let lo=Math.min(0,...A),hi=Math.max(1,...A);const pd=(hi-lo)*.12+.5;lo-=pd;hi+=pd;
    const gh=(h-40)*.62,P=gpanel(ctx,{x:46,y:12,w:w-60,h:gh},[-.5,10.5],[lo,hi],{xn:10,yn:4});
    ctx.strokeStyle=alpha(T.ce,.8);ctx.lineWidth=1.4;ctx.setLineDash([5,4]);ctx.beginPath();A.forEach((v,i)=>{i?ctx.lineTo(P.X(i),P.Y(v)):ctx.moveTo(P.X(i),P.Y(v));});ctx.stroke();ctx.setLineDash([]);
    A.forEach((v,i)=>dot(ctx,P.X(i),P.Y(v),5.5,T.cx,T.surface));
    label(ctx,'a(n)',P.box.x+8,P.box.y+11,T.muted,'left','middle',MONO);label(ctx,'n',P.box.x+P.box.w-6,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);
    const geo=kind==='geom',m=Math.max(...B.map(Math.abs),geo?2:1)*1.3,lo2=geo?0:Math.min(0,...B)<0?-m:-m*.15,hi2=geo?m:Math.max(0,...B)>0?m:m*.15,Q=gpanel(ctx,{x:46,y:12+gh+28,w:w-60,h:h-gh-58},[-.5,10.5],[lo2,hi2],{xn:10,yn:2});
    const bw=Math.max(6,(Q.X(1)-Q.X(0))*.5);B.forEach((v,i)=>{const x0=Q.X(i+.5)-bw/2,y0=Q.Y(geo?0:0),y1=Q.Y(v);ctx.fillStyle=alpha(T.hot,.78);ctx.fillRect(x0,Math.min(y0,y1),bw,Math.abs(y1-y0));
      if(i<8)label(ctx,fmt(v,2),Q.X(i+.5),y1+(v>=0?-9:9),T.hot,'center','middle','600 10px "IBM Plex Mono",monospace');});
    if(geo)line(ctx,Q,-.5,1,10.5,1,alpha(T.ce,.9),1.2,[4,4]);
    label(ctx,geo?'ratio of each term to the one before (gold: 1)':'difference: each term minus the one before',Q.box.x+6,Q.box.y+10,T.hot,'left','middle',MONO);}});
  const f2=v=>fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
  function upd(){const A=terms(10),geo=kind==='geom';
    setText('sq-terms',A.slice(0,6).map(f2).join(', ')+', …');
    setText('sq-rule',geo?`aₙ = ${f2(a0)}·(${f2(r)})ⁿ`:`aₙ = ${f2(a0)} ${d<0?'−':'+'} ${f2(Math.abs(d))}n`);
    setText('sq-const',geo?(a0===0?'all terms are 0: no ratio':`the ratio, ${f2(r)}  (differences change)`):`the difference, ${f2(d)}  (ratios change)`);sim.render();}
  bindRange('sq-a',String,v=>{a0=v;upd();});bindRange('sq-d',v=>f2(v),v=>{d=v;upd();});bindRange('sq-r',v=>f2(v),v=>{r=v;upd();});
  segBind('sq-kind','k',k=>{kind=k;upd();});

  /* recursive chain versus explicit formula */
  let k2='arith',n=6;
  const val=i=>k2==='arith'?1+3*i:2**i;
  const sim2=sim2d($('#sq-canvas2'),{h:w=>clamp(w*.46,250,320),draw(ctx,w,h){const A=Array.from({length:11},(_,i)=>val(i)),hi=Math.max(...A)*1.15,P=gpanel(ctx,{x:46,y:14,w:w-60,h:h-40},[-.5,10.5],[0,hi],{xn:10,yn:4});
    for(let i=0;i<=10;i++){const on=i<=n;if(i>0&&i<=n){const x1=P.X(i-1),y1=P.Y(A[i-1]),x2=P.X(i),y2=P.Y(A[i]);arrow(ctx,x1+6,y1-4,x2-6,y2+(y2<y1?5:-5)*0,T.hot,1.8);}
      dot(ctx,P.X(i),P.Y(A[i]),i===n?8:5,on?T.cx:alpha(T.muted,.5),T.surface);}
    ctx.strokeStyle=alpha(T.ce,.9);ctx.lineWidth=1.4;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(P.X(n),P.Y(0));ctx.lineTo(P.X(n),P.Y(A[n]));ctx.stroke();ctx.setLineDash([]);
    label(ctx,`a(${n}) = ${A[n]}`,P.X(n),P.Y(A[n])-15,T.hot,'center','middle','600 12px "IBM Plex Mono",monospace');}});
  function upd2(){const seq=Array.from({length:n+1},(_,i)=>val(i)),shown=seq.length>7?[...seq.slice(0,5),'…',seq[n]]:seq;
    setText('sq-chain',shown.join(' → '));
    setText('sq-jump',k2==='arith'?`a${n} = 1 + 3·${n} = ${val(n)}`:`a${n} = 1·2^${n} = ${val(n)}`);setText('sq-val',String(val(n)));sim2.render();}
  bindRange('sq-n',String,v=>{n=v;upd2();});segBind('sq-kind2','k',k=>{k2=k;upd2();});
  drawers.seqs=()=>{sim.render();sim2.render();};
  KEYS['sq-canvas']=['Pick a rule. Blue dots are the terms. Orange bars: the difference (arithmetic) or the ratio (geometric) from each term to the next. Equal bars mean the rule is working.',[['cx','terms'],['hot','difference or ratio'],['ce','guide']]];
  KEYS['sq-canvas2']=['Orange arrows build each term from the one before. The dotted line is the same term reached directly by the explicit formula.',[['cx','terms'],['hot','step by step'],['ce','jump']]];
  TIPS['sq-d']=el=>+el.value===0?'d = 0: every term is the same.':`d = ${el.value}: each term is ${Math.abs(el.value)} ${+el.value<0?'less':'more'} than the last.`;
  TIPS['sq-r']=el=>+el.value<1?`r = ${el.value}: multiplying by a number between 0 and 1 shrinks the terms.`:`r = ${el.value}: each term is ${el.value} times the last.`;
  GLOSS['arithmetic sequence']='A sequence with a constant difference between consecutive terms.';GLOSS['geometric sequence']='A sequence with a constant ratio between consecutive terms.';GLOSS['common difference']='The constant d added to get from each term to the next.';GLOSS['common ratio']='The constant r multiplied to get from each term to the next.';
  TT.seqs='Start with a table of values and ask for "what stays the same". Differences or ratios: the answer names the function family.';
  GLYPH.seqs='<circle cx="4" cy="19" r="2" fill="var(--cx)"/><circle cx="9" cy="15" r="2" fill="var(--cx)"/><circle cx="14" cy="10" r="2" fill="var(--cx)"/><circle cx="19" cy="3.5" r="2" fill="var(--cx)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),pg=v=>v<0?`(${sg(v)})`:sg(v);
  PROBS.push({id:'sq-arith',topic:'seqs',title:'A term of an arithmetic sequence',gen(){const k=ri(1,4),d=pick([-5,-4,-3,-2,2,3,4,5,6,7]),ak=ri(-10,20),n=k+ri(5,12),ans=ak+d*(n-k);
    let t=ak;for(let i=k;i<n;i++)t+=d;
    return {q:`In an arithmetic sequence, a${k} = ${sg(ak)} and the common difference is ${sg(d)}. Find a${n}.`,ans,unit:'',abs:0,chk:t,hint:'From the known term, add the common difference once for each step: aₙ = aₖ + d(n − k).',
      sol:`There are ${n-k} steps from term ${k} to term ${n}: a${n} = ${sg(ak)} + ${pg(d)}(${n-k}) = <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'sq-geom',topic:'seqs',title:'A term of a geometric sequence',gen(){const k=ri(0,2),r=pick([2,3,.5,-2,1.5,.1,4]),ak=pick([1,2,3,4,5,8,10,16,20,40]),n=k+ri(3,6),ans=ak*Math.pow(r,n-k);
    let t=ak;for(let i=k;i<n;i++)t*=r;
    return {q:`In a geometric sequence, a${k} = ${ak} and the common ratio is ${sg(r)}. Find a${n}. Round to 3 decimal places if needed.`,ans,unit:'',abs:.0006,chk:t,show:sg(+ans.toFixed(3)),hint:'Multiply by the common ratio once for each step: aₙ = aₖ·rⁿ⁻ᵏ.',
      sol:`There are ${n-k} steps: a${n} = ${ak}·(${sg(r)})^${n-k} = <b>${sg(+ans.toFixed(3))}</b>.`};}});
  PROBS.push({id:'sq-diff',topic:'seqs',title:'Common difference from two terms',gen(){const d=pick([-6,-4,-3,-2,2,3,5,7]),j=ri(1,4),k=j+ri(2,6),aj=ri(-8,15),ak=aj+d*(k-j);
    let best=0,bd=1e9;for(let t=-20;t<=20;t+=.25){const e=Math.abs(aj+t*(k-j)-ak);if(e<bd){bd=e;best=t;}}
    return {q:`In an arithmetic sequence, a${j} = ${sg(aj)} and a${k} = ${sg(ak)}. Find the common difference d.`,ans:d,unit:'',abs:0,chk:best,hint:'The change from term j to term k is d times the number of steps.',
      sol:`${sg(ak)} − ${pg(aj)} = ${sg(ak-aj)} over ${k-j} steps, so d = ${sg(ak-aj)}/${k-j} = <b>${sg(d)}</b>.`};}});
  PROBS.push({id:'sq-ratio',topic:'seqs',title:'Common ratio from two terms',gen(){const r=pick([2,3,4,.5,5]),j=ri(0,3),s=ri(2,4),k=j+s,aj=pick([1,2,3,5,6,12,32]),ak=aj*Math.pow(r,s);
    let best=0,bd=1e9;for(let t=.05;t<=10;t+=.05){const e=Math.abs(aj*Math.pow(t,s)-ak);if(e<bd){bd=e;best=t;}}
    return {q:`A geometric sequence has a${j} = ${sg(aj)} and a${k} = ${sg(ak)}, with all terms positive. Find the common ratio r.`,ans:r,unit:'',abs:.001,chk:best,hint:`a${k} = a${j}·r^${s}, so r^${s} = ${sg(ak)}/${sg(aj)}. Take the ${s===2?'square root':s===3?'cube root':s+'th root'}.`,
      sol:`r^${s} = ${sg(ak)}/${sg(aj)} = ${sg(ak/aj)}, so r = <b>${sg(r)}</b>.`};}});
  PROBS.push({id:'sq-first',topic:'seqs',title:'First term over a target',gen(){const geo=Math.random()<.5;let a0,s,T0,f;
    if(geo){a0=pick([2,5,10,50,100]);s=pick([1.1,1.2,1.5,2]);T0=a0*pick([5,10,20,50]);f=i=>a0*Math.pow(s,i);}else{a0=ri(1,10);s=pick([2,3,4,5,7]);T0=a0+s*ri(10,30)+ri(1,s-1);f=i=>a0+s*i;}
    let n=0;while(f(n)<=T0)n++;
    let m=0;for(let i=0;i<500;i++){if(f(i)>T0){m=i;break;}}
    return {q:`${geo?`aₙ = ${a0}(${s})ⁿ`:`aₙ = ${a0} + ${s}n`}. Find the smallest whole number n for which aₙ > ${T0}.`,ans:n,unit:'',abs:0,chk:m,hint:geo?'Try values, or find where the formula crosses the target and round up.':'Solve the inequality and round up to a whole number.',
      sol:`${geo?`aₙ passes ${T0} at n = ${(Math.log(T0/a0)/Math.log(s)).toFixed(2)}, so the first whole number is`:`${s}n > ${T0-a0}, so n > ${((T0-a0)/s).toFixed(2)}, and the first whole number is`} <b>${n}</b>.`};}});
})();
