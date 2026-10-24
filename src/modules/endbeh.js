/* ---------------- 1.6 End behavior ---------------- */
(function endbeh(){
  const cv=$('#eb-canvas');if(!cv)return;
  const FN={a:{f:x=>x**3-6*x*x+4,lead:'x³',L:x=>x**3,txt:'x³ − 6x² + 4'},b:{f:x=>-(x**4)+4*x**3+2*x,lead:'−x⁴',L:x=>-(x**4),txt:'−x⁴ + 4x³ + 2x'},
    c:{f:x=>.5*x**5-5*x**3+4*x,lead:'0.5x⁵',L:x=>.5*x**5,txt:'0.5x⁵ − 5x³ + 4x'},d:{f:x=>-((x-3)**2)*(x+1),lead:'−x³',L:x=>-(x**3),txt:'−(x − 3)²(x + 1)'}};
  let fk='a',zl=.7;const zEl=$('#eb-z');
  const half=()=>10**zl;
  const sim=glab('eb-canvas',{h:w=>clamp(w*.45,260,360),view:()=>{const W=half(),F=FN[fk],ys=[-1,-.5,0,.5,1].map(t=>F.L(t*W)),m=Math.max(...ys.map(Math.abs));return {xr:[-W,W],yr:[-m*1.1,m*1.1],xn:8,yn:4};},
    draw(ctx,P){const F=FN[fk],W=half();curveD(ctx,P,F.L,-W,W,alpha(T.ca,.9),2,800,[7,5]);curveD(ctx,P,F.f,-W,W,T.cx,3,1600);
      label(ctx,`f(x) = ${F.txt}`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);label(ctx,`dashed: leading term ${F.lead}`,P.box.x+8,P.box.y+28,T.ca,'left','middle',LABEL);
      label(ctx,`window: −${fmt(W,W<10?1:0)} ≤ x ≤ ${fmt(W,W<10?1:0)}`,P.box.x+P.box.w-6,P.box.y+P.box.h-8,T.muted,'right','middle',MONO);}});
  const ends=F=>{const R=F.f(1e4),L=F.f(-1e4);return `${R>0?'up':'down'} on the right, ${L>0?'up':'down'} on the left`;};
  function upd(){const F=FN[fk],W=half(),r=F.f(W)/F.L(W);setText('eb-lead',F.lead);setText('eb-ratio',fmt(r,4));setText('eb-ends',ends(F));sim.render();}
  bindRange('eb-z',v=>`±${fmt(10**v,v<1?1:0)}`,v=>{zl=v;upd();});segBind('eb-fn','k',k=>{fk=k;upd();});
  $('#eb-lab').addEventListener('labreset',()=>{zl=.7;upd();});

  /* a·xⁿ */
  let sg=1,n=3;
  const sim2=sim2d($('#eb-canvas2'),{h:w=>w>=560?clamp(w*.38,260,330):clamp(w*.95,330,400),draw(ctx,w,h){const wide=w>=560,G=wide?{x:46,y:14,w:w*.55,h:h-38}:{x:46,y:12,w:w-60,h:h*.55},g=x=>sg*x**n;
    const s=n<=2?1.6:n<=4?1.4:1.3,yr=[-s,s],P=gpanel(ctx,G,[-1.5,1.5],yr,{xn:6,yn:4});
    curveD(ctx,P,g,-1.5,1.5,T.cx,3,500);
    const rv=g(1.5)>0,lv=g(-1.5)>0;[[1.5,rv,-1],[-1.5,lv,1]].forEach(([x,u,d])=>{const X=P.X(x)+d*10,Y=P.Y(Math.max(-s,Math.min(s,g(x))));arrow(ctx,X+d*0,Y+(u?18:-18),X,Y+(u?-2:2),T.hot,2.6);});
    /* the four cases */
    const C=wide?{x:G.x+G.w+30,y:14,w:w-G.x-G.w-44,h:h-38}:{x:46,y:G.y+G.h+22,w:w-60,h:h-G.h-48},cw=C.w/2,ch=C.h/2,even=n%2===0;
    [[0,0,'even n, a > 0','up · up'],[1,0,'even n, a < 0','down · down'],[0,1,'odd n, a > 0','down · up'],[1,1,'odd n, a < 0','up · down']].forEach(([i,j,t,e])=>{const on=(even===(j===0))&&((sg>0)===(i===0));
      ctx.fillStyle=on?alpha(T.hot,.25):alpha(T.muted,.08);ctx.fillRect(C.x+i*cw+2,C.y+j*ch+2,cw-4,ch-4);ctx.strokeStyle=on?T.hot:T.line;ctx.lineWidth=on?2:1;ctx.strokeRect(C.x+i*cw+2,C.y+j*ch+2,cw-4,ch-4);
      label(ctx,t,C.x+(i+.5)*cw,C.y+(j+.5)*ch-8,on?T.ink:T.muted,'center','middle',on?'600 11px "IBM Plex Mono",monospace':MONO);label(ctx,e+' (left · right)'.replace(' (left · right)',''),C.x+(i+.5)*cw,C.y+(j+.5)*ch+10,on?T.hot:T.muted,'center','middle',MONO);});
    label(ctx,`y = ${sg<0?'−':''}x${n===1?'':polyTxt([1,0]).length&&'⁰¹²³⁴⁵⁶⁷⁸⁹'[n]}`,G.x+8,G.y+12,T.cx,'left','middle',LABEL);}});
  function upd2(){const e=n%2===0;setText('eb-lim',`x→∞: ${sg>0?'+∞':'−∞'};  x→−∞: ${(e?sg>0:sg<0)?'+∞':'−∞'}`);setText('eb-case',`${e?'even':'odd'} degree, ${sg>0?'positive':'negative'} coefficient`);sim2.render();}
  segBind('eb-s','k',k=>{sg=k==='pos'?1:-1;upd2();});bindRange('eb-n',String,v=>{n=v;upd2();});
  drawers.endbeh=()=>{sim.render();sim2.render();};
  KEYS['eb-canvas']=['Zoom out with the slider. Blue is the polynomial; the dashed magenta curve is only its leading term. Far enough out they are the same.',[['cx','f(x)'],['ca','leading term']]];
  KEYS['eb-canvas2']=['Left: y = ax^n with arrows showing where each end goes. Right: the four cases; the lit box is yours.',[['cx','a·xⁿ'],['hot','end directions']]];
  TIPS['eb-z']=el=>`Window half-width ${fmt(10**(+el.value),+el.value<1?1:0)}: the closer the ratio is to 1, the more the leading term dominates.`;
  TIPS['eb-fn:d']='Expand the leading terms of the factors: −(x)(x)(x) = −x³.';TIPS['eb-n']=el=>`Degree ${el.value} (${+el.value%2?'odd':'even'}).`;
  GLOSS['end behavior']='What f(x) does as x → ∞ and as x → −∞.';GLOSS['leading term']='The term with the highest power of x. It alone decides the end behavior.';
  TT.endbeh='Before zooming, ask students to sketch the ends from the formula. The lab then proves the middle never matters far out.';
  GLYPH.endbeh='<path d="M2 4 C8 20, 14 20, 22 4" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M4 4 V8 M20 4 V8" stroke="var(--hot)" stroke-width="2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(v).replace('-','−'),UP=['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
  PROBS.push({id:'eb-ends',topic:'endbeh',title:'End behavior from the formula',gen(){const n=ri(2,7),a=pick([-5,-3,-2,2,3,4]),b=ri(-9,9)||3,c=ri(-9,9),form=`${a<0?'−':''}${Math.abs(a)===1?'':Math.abs(a)}x${UP[n]} ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}x${n>2?UP[n-1]:''} ${c<0?'−':'+'} ${Math.abs(c)}`;
    const R=a>0?'up':'down',L=(n%2===0)===(a>0)?'up':'down',right=`down on the left, ${R} on the right`.replace(/^.*$/,`${L} on the left, ${R} on the right`);
    const f=x=>a*x**n+b*x**(n>2?n-1:1)+c,chk=(f(-300)>0?1:0)*2+(f(300)>0?1:0),want=(L==='up'?2:0)+(R==='up'?1:0);
    const all=['up on the left, up on the right','down on the left, down on the right','down on the left, up on the right','up on the left, down on the right'],{choices,ans}=mcq(right,all.filter(s=>s!==right),4);
    return {q:`Describe the end behavior of f(x) = ${form}.`,choices,ans,chk,hint:'Only the highest-power term matters: check the parity of its exponent and the sign of its coefficient.',
      sol:`The leading term is ${a<0?'−':''}${Math.abs(a)===1?'':Math.abs(a)}x${UP[n]}: degree ${n} (${n%2?'odd':'even'}), coefficient ${a<0?'negative':'positive'}. So f is <b>${right}</b>.`};}});
  PROBS.push({id:'eb-fact',topic:'endbeh',title:'Degree of a product',gen(){const k=ri(2,4),ms=Array.from({length:k},()=>ri(1,3)),cs=Array.from({length:k},()=>pick([-1,1,2,-2,3])),rs=Array.from({length:k},()=>ri(-4,4)),lead=cs.reduce((p,c,i)=>p*c**ms[i],1),deg=ms.reduce((s,m)=>s+m,0);
    const form=ms.map((m,i)=>`(${cs[i]===1?'':cs[i]===-1?'−':sg(cs[i])}x${rs[i]===0?'':` ${rs[i]<0?'+':'−'} ${Math.abs(rs[i])}`})${m>1?UP[m]:''}`).join('');
    return {q:`Find the degree of f(x) = ${form}.`,ans:deg,unit:'',abs:0,chk:ms.reduce((s,m)=>s+m,0),hint:'Add the exponents of the factors.',sol:`The exponents add: ${ms.join(' + ')} = <b>${deg}</b>. (The leading coefficient is ${sg(lead)}.)`};}});
  PROBS.push({id:'eb-ratio',topic:'endbeh',title:'How much does the leading term explain?',gen(){const a=pick([1,2,3,-1,-2]),b=ri(1,9),c=ri(1,9),x=pick([10,20,50,100]),f=t=>a*t**3+b*t*t+c*t,ans=f(x)/(a*x**3);
    return {q:`f(x) = ${polyTxt([a,b,c,0])}. Divide f(${x}) by its leading term evaluated at x = ${x}, to 3 decimal places. The closer to 1, the more the leading term explains.`,ans,unit:'',abs:.0006,chk:1+(b*x*x+c*x)/(a*x**3),show:fmt(ans,3),hint:'Compute f(x) and the leading term separately, then divide.',
      sol:`f(${x}) = ${sg(f(x))} and the leading term is ${sg(a*x**3)}. Ratio ≈ <b>${fmt(ans,3)}</b>. As x grows this tends to 1.`};}});
})();
