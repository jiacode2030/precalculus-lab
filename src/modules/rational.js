/* ---------------- 1.7, 1.8, 1.9 Rational functions ---------------- */
(function rational(){
  const cv=$('#ra-canvas');if(!cv)return;
  let kind='equal',z1=1,z2=-2,p1=3,p2=-1,K=1;
  const fac=r=>r===0?'x':`(x ${r<0?'+':'−'} ${fmt(Math.abs(r),1).replace(/\.0$/,'')})`;
  /* the factors in play, with common factors cancelled (those become holes) */
  function setup(){let nums=kind==='less'?[z1]:[z1,z2],dens=kind==='slant'?[p1]:[p1,p2];const holes=[];
    nums=nums.slice();dens=dens.slice();for(let i=nums.length-1;i>=0;i--){const j=dens.findIndex(d=>Math.abs(d-nums[i])<1e-9);if(j>=0){holes.push(nums[i]);nums.splice(i,1);dens.splice(j,1);}}
    return {nums,dens,holes};}
  const val=(S,x)=>K*S.nums.reduce((p,r)=>p*(x-r),1)/S.dens.reduce((p,r)=>p*(x-r),1);
  const sim=glab('ra-canvas',{h:w=>clamp(w*.48,280,380),view:()=>({xr:[-8,8],yr:[-8,8],xn:8,yn:4}),draw(ctx,P){const S=setup(),f=x=>val(S,x),dn=S.nums.length,dd=S.dens.length;
    [...new Set(S.dens)].forEach(c=>vline(ctx,P,c,T.ce,[6,4]));
    if(dn<dd)hline(ctx,P,0,alpha(T.ce,.9),[2,4]);else if(dn===dd)hline(ctx,P,K,T.ce,[2,4]);else{const m=K*(dn-dd===1?1:0);if(dn-dd===1){const b=f(1e5)-m*1e5;line(ctx,P,-8,-8*m+b,8,8*m+b,T.ce,1.6,[6,4]);}}
    curveD(ctx,P,f,-8,8,T.cx,3,1800);
    S.nums.forEach(r=>dot(ctx,P.X(r),P.Y(0),6.5,T.hot,T.surface));
    S.holes.forEach(h=>{const y=val(S,h);if(isFinite(y)){ctx.beginPath();ctx.arc(P.X(h),P.Y(y),6,0,TAU);ctx.fillStyle=T.surface;ctx.fill();ctx.strokeStyle=T.cx;ctx.lineWidth=2.4;ctx.stroke();}});}});
  function upd(){const S=setup(),f=x=>val(S,x),dn=S.nums.length,dd=S.dens.length;
    const all=[...(kind==='less'?[z1]:[z1,z2])],al=[...(kind==='slant'?[p1]:[p1,p2])];
    setHTML('ra-form',`f(x) = ${K!==1?(K===-1?'−':fmt(K,1)):''}${all.map(fac).join('')} / ${al.map(fac).join('')}`);
    setText('ra-zero',S.nums.length?[...new Set(S.nums)].map(r=>fmt(r,1)).join(', '):'none');
    setText('ra-va',S.dens.length?[...new Set(S.dens)].map(c=>`x = ${fmt(c,1)}`).join(', '):'none'+(S.holes.length?` (hole at x = ${S.holes.map(h=>fmt(h,1)).join(', ')} instead)`:''));
    setText('ra-ha',dn<dd?'y = 0 (bottom has the higher degree)':dn===dd?`y = ${fmt(K,2)} (ratio of leading coefficients)`:dn-dd===1?`no horizontal asymptote; follows the line y = ${fmt(K,2)}x + ${fmt(f(1e5)-K*1e5,2)}`:'no horizontal asymptote');sim.render();}
  const ctl=(id,set)=>bindRange(id,v=>fmt(v,1),v=>{set(v);upd();});
  ctl('ra-z1',v=>z1=v);ctl('ra-z2',v=>z2=v);ctl('ra-p1',v=>p1=v);ctl('ra-p2',v=>p2=v);ctl('ra-k',v=>K=Math.abs(v)<1e-9?.5:v);
  segBind('ra-case','k',k=>{kind=k;upd();});
  $('#ra-lab').addEventListener('labreset',()=>{kind='equal';upd();});

  /* behavior at a vertical asymptote x = 2 */
  let m=1,s=1;
  const g=x=>s/Math.pow(x-2,m)*(m%2===0?1:1);
  const sim2=glab('ra-canvas2',{h:w=>clamp(w*.4,240,320),view:()=>({xr:[-2,6],yr:[-8,8],xn:8,yn:4}),draw(ctx,P){vline(ctx,P,2,T.ce,[6,4]);
    const f=x=>s/(x-2)**m;curveD(ctx,P,f,-2,6,T.cx,3,1600);
    const L=Math.sign(s)*(m%2?-1:1),R=Math.sign(s);
    const arrowAt=(x,y0,up)=>{const X=P.X(x),Y=P.Y(y0);arrow(ctx,X,Y,X,Y+(up?-30:30),T.hot,3);};
    arrowAt(1.7,L>0?3:-3,L>0);arrowAt(2.3,R>0?3:-3,R>0);
    label(ctx,'x = 2',P.X(2)+6,P.box.y+12,T.ce,'left','middle',MONO);label(ctx,`y = ${s<0?'−':''}1/(x − 2)${['','','²','³'][m]}`,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);}});
  function upd2(){const L=s*(m%2?-1:1),R=s;setText('ra-left',L>0?'f(x) → +∞':'f(x) → −∞');setText('ra-right',R>0?'f(x) → +∞':'f(x) → −∞');
    setText('ra-rule',m%2?'odd power: the two sides go opposite ways':'even power: both sides go the same way');sim2.render();}
  bindRange('ra-s',v=>v>0?'positive':'negative',v=>{s=v>0?1:-1;upd2();});segBind('ra-m','k',k=>{m=+k.slice(1);upd2();});
  drawers.rational=()=>{sim.render();sim2.render();};
  KEYS['ra-canvas']=['Move the zeros and poles. Orange dots: zeros. Gold dashed: asymptotes. An open circle appears if a zero lands on a pole.',[['cx','f(x)'],['hot','zeros'],['ce','asymptotes']]];
  KEYS['ra-canvas2']=['Pick the power of (x − 2) and the sign. Orange arrows show where the graph goes on each side of the asymptote.',[['cx','f(x)'],['ce','vertical asymptote'],['hot','direction on each side']]];
  TIPS['ra-case:less']='Numerator degree 1, denominator degree 2: the bottom wins.';TIPS['ra-case:equal']='Both degree 2: the leading coefficients decide.';TIPS['ra-case:slant']='Numerator degree 2, denominator degree 1: a slanted line.';
  TIPS['ra-k']=el=>`Leading-coefficient ratio ${fmt(+el.value,1)}.`;TIPS['ra-m:1']='A single factor: the sign changes across the asymptote.';TIPS['ra-m:2']='A squared factor: no sign change.';
  GLOSS['vertical asymptote']='A vertical line x = c that the graph approaches (up or down) as x approaches c.';GLOSS['horizontal asymptote']='A horizontal line y = L that the graph approaches as x → ∞ or x → −∞.';GLOSS['rational function']='A ratio of two polynomials, p(x)/q(x).';
  TT.rational='Ask students to predict "up or down" on each side of every asymptote before showing the graph. The sign pattern is the skill.';
  GLYPH.rational='<path d="M3 4 C5 14, 9 18, 11 20" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M13 4 C15 6, 19 10, 21 12" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M12 2 V22" stroke="var(--ce)" stroke-width="1.4" stroke-dasharray="2 2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(v).replace('-','−'),fr=(c,v='x')=>c===1?v:c===-1?'−'+v:sg(c)+v,UP=['','','²','³'];
  const lin=(a,b)=>`${fr(a)}${b?(b<0?' − ':' + ')+Math.abs(b):''}`,quad=(a,b,c)=>`${fr(a,'x²')}${b?(b<0?' − ':' + ')+(Math.abs(b)===1?'':Math.abs(b))+'x':''}${c?(c<0?' − ':' + ')+Math.abs(c):''}`;
  PROBS.push({id:'ra-ha',topic:'rational',title:'Horizontal asymptote',gen(){const a=ri(-6,6)||3,b=pick([-4,-3,-2,-1,1,2,3,4,5]),n=pick([1,2]),p=ri(-5,5),q=ri(-5,5),r=ri(-6,6);
    const top=n===1?lin(a,p):quad(a,p,q),bot=n===1?lin(b,r):quad(b,q,r),ans=a/b;
    const f=n===1?x=>(a*x+p)/(b*x+r):x=>(a*x*x+p*x+q)/(b*x*x+q*x+r);
    return {q:`Find the horizontal asymptote y = L of f(x) = (${top}) / (${bot}). Enter L.`,ans,unit:'',abs:.001,chk:f(1e7),show:frac(ans),hint:'The degrees are equal, so L is the ratio of the leading coefficients.',
      sol:`Both have degree ${n}. L = ${sg(a)}/${pn(b)} = <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'ra-va',topic:'rational',title:'Count the vertical asymptotes',gen(){const r=()=>ri(-4,4);let a=r(),b=r(),c=r(),d=r();while(b===a)b=r();while(d===c)d=r();
    const share=pick([0,1,2]);if(share>=1)c=a;if(share>=2)d=b;if(c===d)d=c+1;
    const f=x=>(x-a)*(x-b)/((x-c)*(x-d)),cnt=[...new Set([c,d])].filter(z=>z!==a&&z!==b).length;
    /* independent: a root of the denominator is an asymptote when |f| explodes next to it */
    const chk=[...new Set([c,d])].filter(z=>Math.abs(f(z+1e-6))>1e4).length;
    const fm=(x,y)=>`(x ${x<0?'+':'−'} ${Math.abs(x)})`.replace('(x − 0)','x').replace('(x + 0)','x');
    return {q:`How many vertical asymptotes does f(x) = ${fm(a)}${fm(b)} / (${fm(c)}${fm(d)}) have?`.replace(/\) \/ \(/,')/(').replace('/ (','/ ('),ans:cnt,unit:'',abs:0,chk,hint:'A zero of the denominator is an asymptote unless the same factor is also in the numerator (then it is a hole).',
      sol:`The denominator is 0 at ${[...new Set([c,d])].map(sg).join(' and ')}. ${[...new Set([c,d])].filter(z=>z===a||z===b).length?`Those that also appear in the numerator are holes, not asymptotes. `:''}That leaves <b>${cnt}</b> vertical asymptote${cnt===1?'':'s'}.`};}});
  PROBS.push({id:'ra-lim',topic:'rational',title:'Which way does it go?',gen(){const c=ri(-4,4),m=pick([1,2,3]),s=pick([-1,1]),a=ri(1,3)*s,side=pick(['right','left']);
    const sign=side==='right'?Math.sign(a):Math.sign(a)*(m%2?-1:1),right=sign>0?'+∞':'−∞';
    const f=x=>a/((x-c)**m),chk=f(c+(side==='right'?1:-1)*1e-4)>0?1:-1;
    const {choices,ans}=mcq(right,['+∞','−∞','0','does not exist'].filter(v=>v!==right).slice(0,3).concat(['0']).slice(0,3),4);
    return {q:`f(x) = ${sg(a)} / (x ${c<0?'+':'−'} ${Math.abs(c)||''})${m>1?UP[m]:''}`.replace(' (x  )','x').replace('(x +  )','x').replace(/\(x [−+] \)/,'x')+`. What is lim f(x) as x → ${c<0?'−'+Math.abs(c):c}${side==='right'?'⁺':'⁻'}?`,choices,ans,chk,hint:'Check the sign of the denominator just to that side of the asymptote, remembering the power.',
      sol:`Just ${side} of x = ${sg(c)}, ${c===0?'x':`(x − ${pn(c)})`} is ${side==='right'?'positive':'negative'}${m>1?`, and raised to the power ${m} it is ${side==='right'||m%2===0?'positive':'negative'}`:''}. With numerator ${sg(a)}, f → <b>${right}</b>.`};}});
})();
