/* ---------------- 1.11 Equivalent forms: division ---------------- */
(function equiv(){
  const cv=$('#eq-canvas');if(!cv)return;
  let C=[2,-3,1,5],r=2,step=4;
  const sgn=v=>fmt(v,0).replace('-','−');
  function synth(){const bot=[C[0]],prod=[0];for(let i=1;i<C.length;i++){prod.push(bot[i-1]*r);bot.push(C[i]+prod[i]);}return {bot,prod};}
  const sim=sim2d(cv,{h:w=>clamp(w*.4,230,290),draw(ctx,w,h){const {bot,prod}=synth(),n=C.length,cw=Math.min(74,(w-110)/(n+1)),x0=Math.max(70,(w-cw*n-50)/2+50),ys=[h*.2,h*.42,h*.64];
    label(ctx,sgn(r),x0-cw*.75,ys[0],T.ce,'center','middle','700 20px "IBM Plex Mono",monospace');
    line2(ctx,x0-cw*.4,ys[0]-22,x0-cw*.4,ys[2]+22,T.line);line2(ctx,x0-cw*.4,ys[1]+h*.11,x0+cw*(n-.4),ys[1]+h*.11,T.line);
    C.forEach((a,i)=>label(ctx,sgn(a),x0+cw*i,ys[0],T.ink,'center','middle','700 20px "IBM Plex Mono",monospace'));
    for(let i=0;i<n;i++){if(i>=step)break;if(i>=1)label(ctx,sgn(prod[i]),x0+cw*i,ys[1],T.hot,'center','middle','600 17px "IBM Plex Mono",monospace');
      const last=i===n-1;label(ctx,sgn(bot[i]),x0+cw*i,ys[2],last?T.ca:T.cx,'center','middle','700 20px "IBM Plex Mono",monospace');}
    if(step>0&&step<=n){const i=step-1;ctx.strokeStyle=T.hot;ctx.lineWidth=2;ctx.strokeRect(x0+cw*i-cw*.42,ys[0]-20,cw*.84,ys[2]-ys[0]+40);}
    label(ctx,'× r','bold'.length?x0-cw*.75:0,ys[1],T.hot,'center','middle',MONO);
    if(step>=n){const q=bot.slice(0,-1),R=bot[n-1];label(ctx,`quotient ${polyTxt(q)}   remainder ${sgn(R)}`,w/2,h*.9,T.ink,'center','middle','600 14px "IBM Plex Mono",monospace');}
    else label(ctx,'bring down · multiply by r · add',w/2,h*.9,T.muted,'center','middle',MONO);}});
  function line2(ctx,x1,y1,x2,y2,c){ctx.strokeStyle=c;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function upd(){const {bot}=synth(),n=C.length,R=bot[n-1],pr=C.reduce((s,a,i)=>s+a*Math.pow(r,n-1-i),0);
    setText('eq-q',polyTxt(bot.slice(0,-1)));setText('eq-rem',sgn(R)+(R===0?' → (x '+(r<0?'+ ':'− ')+Math.abs(r)+') is a factor':''));setText('eq-chk',`p(${sgn(r)}) = ${sgn(pr)}`);sim.render();}
  ['a','b','c','d'].forEach((k,i)=>bindRange('eq-'+k,sgn,v=>{C[i]=v;step=C.length;upd();}));
  bindRange('eq-r',sgn,v=>{r=v;step=C.length;upd();});
  $('#eq-step').addEventListener('click',()=>{step=step>=C.length?1:step+1;upd();});
  $('#eq-all').addEventListener('click',()=>{step=C.length;upd();});
  $('#eq-lab').addEventListener('labreset',()=>{step=C.length;upd();});

  /* p/d = quotient + R/d */
  const FN={a:{m:1,k:4,R:9,p:1,t:'(x² + 3x + 5)/(x − 1)'},b:{m:1,k:-6,R:14,p:-2,t:'(x² − 4x + 2)/(x + 2)'},c:{m:2,k:3,R:-3,p:1,t:'(2x² + x − 6)/(x − 1)'}};
  let fk='a',x=4;
  const f=F=>t=>(F.m*t+F.k)+F.R/(t-F.p);
  const sim2=glab('eq-canvas2',{h:w=>clamp(w*.46,270,360),view:()=>({xr:[-8,8],yr:[-14,14],xn:8,yn:4}),draw(ctx,P){const F=FN[fk];
    vline(ctx,P,F.p,T.ce,[6,4]);line(ctx,P,-8,-8*F.m+F.k,8,8*F.m+F.k,T.ce,1.8,[2,4]);
    curveD(ctx,P,f(F),-8,8,T.cx,3,1800);
    if(Math.abs(x-F.p)>1e-9){const yl=F.m*x+F.k,yf=f(F)(x);line(ctx,P,x,yl,x,yf,T.hot,3.4);dot(ctx,P.X(x),P.Y(yf),5.5,T.cx,T.surface);dot(ctx,P.X(x),P.Y(yl),4.5,T.ce,T.surface);}
    label(ctx,`f(x) = ${F.t}`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);}});
  function upd2(){const F=FN[fk],q=`${F.m===1?'':F.m}x ${F.k<0?'−':'+'} ${Math.abs(F.k)}`;
    setText('eq-form',`${q} ${F.R<0?'−':'+'} ${Math.abs(F.R)}/(x ${F.p<0?'+':'−'} ${Math.abs(F.p)})`);
    if(Math.abs(x-F.p)<1e-9){setText('eq-gap','undefined (÷ 0)');setText('eq-tot','undefined (÷ 0)');}
    else{setText('eq-gap',fmt(F.R/(x-F.p),3));setText('eq-tot',fmt(f(F)(x),3));}sim2.render();}
  bindRange('eq-x',v=>fmt(v,1),v=>{x=v;upd2();});segBind('eq-fn','k',k=>{fk=k;upd2();});
  drawers.equiv=()=>{sim.render();sim2.render();};
  KEYS['eq-canvas']=['Pick a polynomial and r. Press Next step to fill the table one column at a time. Orange numbers are the products by r; blue are the sums.',[['ink','coefficients of p'],['hot','products by r'],['cx','running sums'],['ca','remainder']]];
  KEYS['eq-canvas2']=['Blue: the rational function. Gold dotted: the slanted line (the quotient). Orange: the gap, which is the remainder term R/d.',[['cx','f(x)'],['ce','quotient line / asymptote'],['hot','remainder term']]];
  TIPS['eq-r']=el=>`Dividing by (x ${+el.value<0?'+':'−'} ${Math.abs(el.value)}).`;TIPS['eq-x']='Watch the orange gap shrink as |x| grows.';
  GLOSS['remainder theorem']='The remainder when p(x) is divided by (x − r) equals p(r).';GLOSS['synthetic division']='A shortcut for dividing by (x − r): bring down, multiply by r, add, repeat.';GLOSS['slanted asymptote']='An asymptote that is a slanted line y = mx + k, found as the quotient when the top has one more degree than the bottom.';
  TT.equiv='Do one synthetic division on the board by hand before the stepper. Then connect the remainder to p(r) and to the slanted asymptote.';
  GLYPH.equiv='<path d="M3 6 H21 M8 6 V18 M3 18 H21" stroke="var(--cx)" stroke-width="2" fill="none"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(v).replace('-','−'),rs=[-4,-3,-2,2,3,4];
  const synth=(c,r)=>{const b=[c[0]];for(let i=1;i<c.length;i++)b.push(c[i]+b[i-1]*r);return b;};
  const lin=r=>`(x ${r<0?'+':'−'} ${Math.abs(r)})`;
  PROBS.push({id:'eq-rem',topic:'equiv',title:'Remainder by division',gen(){const r=pick(rs),c=[ri(1,3),ri(-6,6),ri(-6,6),ri(-9,9)],b=synth(c,r),ans=b[3];
    return {q:`Find the remainder when p(x) = ${polyTxt(c)} is divided by ${lin(r)}.`,ans,unit:'',abs:0,chk:c.reduce((s,a,i)=>s+a*Math.pow(r,3-i),0),hint:'Use synthetic division with r, or the Remainder Theorem: the remainder is p(r).',
      sol:`With r = ${sg(r)}: bottom row ${b.map(sg).join(', ')}. The remainder is <b>${sg(ans)}</b>, which equals p(${sg(r)}).`};}});
  PROBS.push({id:'eq-quot',topic:'equiv',title:'Coefficient of the quotient',gen(){const r=pick(rs),c=[ri(1,3),ri(-6,6),ri(-6,6),ri(-9,9)],b=synth(c,r),ans=b[1];
    const p=x=>c.reduce((s,a,i)=>s+a*Math.pow(x,3-i),0),R=p(r),q=x=>(p(x)-R)/(x-r),chk=(q(1)-q(-1))/2;
    return {q:`p(x) = ${polyTxt(c)} is divided by ${lin(r)}. The quotient is ax² + bx + c. Find b.`,ans,unit:'',abs:1e-6,chk,hint:'Synthetic division: the bottom row (without the last number) holds a, b, c.',
      sol:`With r = ${sg(r)}: bottom row ${b.map(sg).join(', ')}. The quotient is ${polyTxt(b.slice(0,3))}, so b = <b>${sg(ans)}</b> (the remainder is ${sg(b[3])}).`};}});
  PROBS.push({id:'eq-slant',topic:'equiv',title:'Slanted asymptote',gen(){const a=ri(1,3),b=ri(-6,6),c=ri(-8,8),r=pick(rs),k=b+a*r,f=x=>(a*x*x+b*x+c)/(x-r);
    return {q:`The graph of f(x) = (${polyTxt([a,b,c])}) / (x ${r<0?'+':'−'} ${Math.abs(r)}) has a slanted asymptote y = ${a===1?'':a}x + k. Find k.`,ans:k,unit:'',abs:.001,chk:f(1e6)-a*1e6,hint:'Divide by (x − r): the quotient ax + k is the asymptote. Here k = b + ar.',
      sol:`Synthetic division with r = ${sg(r)}: bottom row ${synth([a,b,c],r).map(sg).join(', ')}. The quotient is ${a===1?'':a}x ${k<0?'−':'+'} ${Math.abs(k)}, so k = <b>${sg(k)}</b>.`};}});
  PROBS.push({id:'eq-test',topic:'equiv',title:'Is it a factor?',gen(){const r=pick(rs),good=Math.random()<.5,q=[ri(1,3),ri(-4,4),ri(-5,5)],c=[q[0],q[1]-r*q[0],q[2]-r*q[1],-r*q[2]+(good?0:pick([-3,-2,-1,1,2,3]))];
    const p=x=>c.reduce((s,a,i)=>s+a*Math.pow(x,3-i),0),R=synth(c,r)[3],right=R===0?'Yes':'No',{choices,ans}=mcq(right,['Yes','No'],2);
    return {q:`Is ${lin(r)} a factor of p(x) = ${polyTxt(c)}?`,choices,ans,chk:Math.abs(p(r))<1e-9?1:0,hint:'(x − r) is a factor exactly when the remainder is 0, that is, when p(r) = 0.',
      sol:`p(${sg(r)}) = ${sg(p(r))}. ${R===0?'The remainder is 0, so it <b>is</b> a factor.':'The remainder is not 0, so it is <b>not</b> a factor.'}`};}});
})();
