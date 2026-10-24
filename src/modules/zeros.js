/* ---------------- 1.5 Zeros & complex zeros ---------------- */
(function zeros(){
  const cv=$('#zr-canvas');if(!cv)return;
  /* three zeros with multiplicities; tap a zero to cycle its multiplicity 1 → 2 → 3 → 1 */
  let Z=[{r:-2,m:1},{r:0,m:1},{r:2,m:1}],sgn=1,dr=-1,moved=false,lay=null;
  const f=x=>sgn*Z.reduce((p,z)=>p*(x-z.r)**z.m,1);
  const deg=()=>Z.reduce((s,z)=>s+z.m,0);
  const sim=sim2d(cv,{h:w=>clamp(w*.5,300,400),draw(ctx,w,h){const B={x:46,y:12,w:w-60,h:h-34},s=Math.max(1,...[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(x=>Math.abs(f(x)))),yr=[-s*.6,s*.6];
    const P=lay=gpanel(ctx,B,[-5,5],yr,{xn:10,yn:4});
    curveD(ctx,P,f,-5,5,T.cx,2.8,900);
    Z.forEach((z,i)=>{const X=P.X(z.r),Y=P.Y(0);dot(ctx,X,Y,i===dr?10:8,T.hot,T.surface);label(ctx,`×${z.m}`,X,Y-16,T.hot,'center','middle',LABEL);});
    label(ctx,'drag a zero · tap to change its multiplicity',B.x+8,B.y+12,T.muted,'left','middle',MONO);},
    drag(kind,e){if(!lay)return;const [px,py]=ptr(e,cv),P=lay;
      if(kind==='down'){dr=-1;moved=false;let bd=24;Z.forEach((z,i)=>{const d=Math.hypot(P.X(z.r)-px,P.Y(0)-py);if(d<bd){bd=d;dr=i;}});}
      else if(kind==='up'){if(dr>=0&&!moved){Z[dr].m=Z[dr].m%3+1;upd();}dr=-1;sim.render();return;}
      if(dr>=0&&kind!=='down'){const x=P.xr[0]+(px-P.box.x)/P.box.w*(P.xr[1]-P.xr[0]);const v=clamp(Math.round(x*2)/2,-4.5,4.5);if(v!==Z[dr].r)moved=true;Z[dr].r=v;upd();}}});
  const fact=z=>{const a=z.r===0?'x':`(x ${z.r<0?'+':'−'} ${Math.abs(z.r)})`;return a+(z.m>1?['','²','³'][z.m-1]:'');};
  function upd(){const S=[...Z].sort((a,b)=>a.r-b.r);setText('zr-form',`${sgn<0?'−':''}${S.map(fact).join('')}`);
    setText('zr-deg',`degree ${deg()}: zeros ${S.map(z=>fmt(z.r,1)+(z.m>1?` (×${z.m})`:'')).join(', ')}`);
    let ev=true,od=true;for(let x=.3;x<5;x+=.7){if(Math.abs(f(-x)-f(x))>1e-6*(1+Math.abs(f(x))))ev=false;if(Math.abs(f(-x)+f(x))>1e-6*(1+Math.abs(f(x))))od=false;}
    setText('zr-sym',ev?'even: mirror image in the y-axis':od?'odd: symmetric about the origin':'neither even nor odd');sim.render();}
  segBind('zr-sgn','k',k=>{sgn=k==='pos'?1:-1;upd();});
  $('#zr-lab').addEventListener('labreset',()=>{Z=[{r:-2,m:1},{r:0,m:1},{r:2,m:1}];sgn=1;upd();});
  upd();

  /* f(x) = (x + 2)(x² − 2px + p² + k): the other two zeros are p ± √(−k) */
  let p=1,k=1;const g=x=>(x+2)*(x*x-2*p*x+p*p+k);
  const sim2=sim2d($('#zr-canvas2'),{h:w=>w>=560?clamp(w*.4,280,360):clamp(w*1.2,420,500),draw(ctx,w,h){const wide=w>=560,A=wide?{x:46,y:14,w:w*.38,h:h-40}:{x:46,y:12,w:w-60,h:h*.44},B=wide?{x:w*.38+90,y:14,w:w*.62-104,h:h-40}:{x:46,y:h*.44+34,w:w-60,h:h*.56-56};
    const C=gpanel(ctx,A,[-4,5],[-3,3],{xn:9,yn:6});label(ctx,'Re',A.x+A.w-4,A.y+A.h/2-10,T.muted,'right','middle',MONO);label(ctx,'Im',A.x+8,A.y+10,T.muted,'left','middle',MONO);
    const re=-k>=0,r=Math.sqrt(Math.abs(k));
    dot(ctx,C.X(-2),C.Y(0),7,T.hot,T.surface);
    if(re){if(r<1e-6){dot(ctx,C.X(p),C.Y(0),9,T.hot,T.surface);label(ctx,'×2',C.X(p),C.Y(0)-16,T.hot,'center','middle',LABEL);}else{dot(ctx,C.X(p-r),C.Y(0),7,T.hot,T.surface);dot(ctx,C.X(p+r),C.Y(0),7,T.hot,T.surface);}}
    else{dot(ctx,C.X(p),C.Y(r),7,T.ca,T.surface);dot(ctx,C.X(p),C.Y(-r),7,T.ca,T.surface);line(ctx,C,p,r,p,-r,alpha(T.ca,.5),1.3,[4,4]);}
    const s=Math.max(2,...[-4,-3,-2,-1,0,1,2,3,4,5].map(x=>Math.abs(g(x)))),P=gpanel(ctx,B,[-4,5],[-s*.55,s*.55],{xn:9,yn:4});
    curveD(ctx,P,g,-4,5,T.cx,2.8,700);
    const rz=[-2].concat(re?(r<1e-6?[p]:[p-r,p+r]):[]);rz.forEach(x=>dot(ctx,P.X(x),P.Y(0),6.5,T.hot,T.surface));
    label(ctx,'complex plane',A.x+8,A.y+A.h-8,T.muted,'left','middle',MONO);label(ctx,'y = f(x)',B.x+8,B.y+10,T.cx,'left','middle',LABEL);}});
  const cx=(re,im)=>Math.abs(im)<1e-9?fmt(re,2):`${fmt(re,2)} ${im<0?'−':'+'} ${fmt(Math.abs(im),2)}i`;
  function upd2(){const r=Math.sqrt(Math.abs(k));
    setText('zr-list',k<=0?(r<1e-6?`−2, ${fmt(p,2)} (×2)`:`−2, ${fmt(p-r,2)}, ${fmt(p+r,2)}`):`−2, ${cx(p,r)}, ${cx(p,-r)}`);
    setText('zr-real',k<=0?(r<1e-6?'2 distinct: the graph touches at the double zero':'3 x-intercepts'):'1 x-intercept (x = −2)');
    setText('zr-note',k>0?'the pair is non-real: p ± i√k. They are conjugates, and you cannot see them on the graph':r<1e-6?'the pair merged into a double zero':'the pair split onto the real axis');sim2.render();}
  bindRange('zr-p',v=>fmt(v,2),v=>{p=v;upd2();});bindRange('zr-k',v=>fmt(v,2),v=>{k=Math.abs(v)<.025?0:v;upd2();});
  drawers.zeros=()=>{sim.render();sim2.render();};
  KEYS['zr-canvas']=['Drag the orange zeros along the x-axis, or tap one to change its multiplicity (×1, ×2, ×3). The graph is the product of the factors.',[['cx','f(x)'],['hot','zeros and their multiplicity']]];
  KEYS['zr-canvas2']=['Left: all three zeros in the complex plane (horizontal: real part, vertical: imaginary part). Right: the graph. Only real zeros appear on the graph.',[['hot','real zeros'],['ca','non-real zeros'],['cx','f(x)']]];
  TIPS['zr-sgn:pos']='Leading coefficient positive.';TIPS['zr-sgn:neg']='Leading coefficient negative: the graph is flipped upside down.';
  TIPS['zr-p']=el=>`The pair sits above and below x = ${fmt(+el.value,2)}.`;TIPS['zr-k']=el=>+el.value>0?`k = ${fmt(+el.value,2)} > 0: no real zeros from the quadratic factor.`:+el.value===0?'k = 0: a double zero.':`k = ${fmt(+el.value,2)} < 0: two real zeros p ± √|k|.`;
  GLOSS['multiplicity']='How many times a factor (x − a) appears. Odd: the graph crosses at a. Even: it touches and turns back.';
  GLOSS['conjugate']='a + bi and a − bi: the non-real zeros of a real polynomial come in such pairs.';
  GLOSS['even function']='f(−x) = f(x): the graph is mirrored in the y-axis.';GLOSS['odd function']='f(−x) = −f(x): the graph is symmetric about the origin.';
  TT.zeros='Ask students to sketch (x + 3)(x − 1)²(x − 4) from the factors only, then check on the lab: multiplicity as shape.';
  GLYPH.zeros='<path d="M2 12 H22" stroke="var(--muted)" stroke-width="1"/><path d="M2 20 C6 2, 9 2, 12 12 C14 18, 16 18, 18 12 C19 8, 21 6, 22 4" fill="none" stroke="var(--cx)" stroke-width="2"/><circle cx="12" cy="12" r="2.2" fill="var(--hot)"/>';
})();

(function(){
  const sg=v=>String(v).replace('-','−');
  const FACT=(r,m)=>(r===0?'x':`(x ${r<0?'+':'−'} ${Math.abs(r)})`)+(m>1?['','²','³'][m-1]:'');
  PROBS.push({id:'zr-mult',topic:'zeros',title:'What does the graph do at the zero?',gen(){const rs=pick([[-3,0,2],[-2,1,4],[-4,-1,3],[-1,2,5]]),ms=[ri(1,3),ri(1,3),ri(1,3)],i=ri(0,2),f=x=>rs.reduce((p,r,j)=>p*(x-r)**ms[j],1);
    const m=ms[i],right=m===1?'crosses':m===2?'touches and turns back':'flattens and crosses';
    /* independent: compare the signs just left and right of the zero */
    const e=.01,cross=f(rs[i]-e)*f(rs[i]+e)<0,flat=Math.abs(f(rs[i]+e))<Math.abs(f(rs[i]+e*2))/3,chk=!cross?2:flat?3:1;
    const {choices,ans}=mcq(right,['crosses','touches and turns back','flattens and crosses'].filter(s=>s!==right),3);
    return {q:`f(x) = ${rs.map((r,j)=>FACT(r,ms[j])).join('')}. At x = ${sg(rs[i])}, the graph of f`,choices,ans,chk,hint:'Look at the exponent on the factor: odd crosses, even touches, 3 also flattens.',
      sol:`The factor ${FACT(rs[i],m)} has multiplicity ${m}, so the graph <b>${right}</b> there.`};}});
  PROBS.push({id:'zr-conj',topic:'zeros',title:'Find the missing zero',gen(){const a=ri(-4,4),b=ri(1,5),r=ri(-5,5),n=pick([3,4]);
    const ans=n===3?`${a} − ${b}i`:`${a} − ${b}i`,sgn=v=>String(v).replace('-','−');
    /* independent: the product (x − (a+bi))(x − (a−bi)) has real coefficients only when the second zero is the conjugate */
    const mid=-2*a,cst=a*a+b*b;
    /* complex-number text without "0 +" or "1i": cx(0,2) -> "2i", cx(3,-1) -> "3 − i" */
    const cx=(re,im)=>{const m=Math.abs(im)===1?'i':Math.abs(im)+'i';return re===0?(im<0?'−':'')+m:`${sgn(re)} ${im<0?'−':'+'} ${m}`;};
    const {choices,ans:ix}=mcq(cx(a,-b),[cx(-a,b),cx(-a,-b),cx(b,a)],4);
    return {q:`A polynomial of degree ${n} with real coefficients has zeros ${sgn(r)}${n===4?`, ${sgn(r)}`:''} and ${cx(a,b)}. Which of these must also be a zero?`,choices,ans:ix,chk:cst,hint:'Non-real zeros of a polynomial with real coefficients come in conjugate pairs.',
      sol:`The conjugate of ${cx(a,b)} is <b>${cx(a,-b)}</b>. Together they give x² ${mid<0?'−':'+'} ${Math.abs(mid)||''}x + ${cst}, which has real coefficients.`.replace('x² + x','x² + x')};}});
  PROBS.push({id:'zr-sign',topic:'zeros',title:'Where is the polynomial positive?',gen(){let rs;do{rs=[ri(-4,4),ri(-4,4),ri(-4,4)].sort((a,b)=>a-b);}while(rs[0]===rs[1]||rs[1]===rs[2]);const lead=pick([1,-1]),f=x=>lead*rs.reduce((p,r)=>p*(x-r),1);
    /* count the length of the intervals (within [-6, 6]) where f > 0 */
    let L=0;const N=12000;for(let i=0;i<N;i++)if(f(-6+12*(i+.5)/N)>0)L+=12/N;
    const left=lead>0?[[rs[0],rs[1]],[rs[2],6]]:[[-6,rs[0]],[rs[1],rs[2]]],ans=left.reduce((s,[a,b])=>s+(b-a),0);
    const form=`${lead<0?'−':''}${rs.map(r=>FACT(r,1)).join('')}`;
    return {q:`For f(x) = ${form}, f(x) > 0 on two intervals. Find the total length of the part of [−6, 6] where f(x) > 0.`,ans,unit:'',abs:.02,chk:L,hint:'Zeros split the line into 4 pieces; the sign alternates across each simple zero. Check the sign at the right end first.',
      sol:`Zeros ${rs.map(sg).join(', ')}. ${lead>0?'Positive leading coefficient: f is positive on the far right, then alternates':'Negative leading coefficient: f is negative on the far right, then alternates'}. So f > 0 on ${left.map(([a,b])=>`(${sg(a)}, ${sg(b)})`).join(' and ')}, total length <b>${ans}</b>.`};}});
})();
