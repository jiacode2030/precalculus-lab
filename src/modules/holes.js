/* ---------------- 1.10 Holes (removable discontinuities) ---------------- */
(function holes(){
  const cv=$('#ho-canvas');if(!cv)return;
  let h=1,b=-2,c=3,pw='a11';
  const fac=(r,e=1)=>(r===0?'x':`(x ${r<0?'+':'−'} ${fmt(Math.abs(r),1).replace(/\.0$/,'')})`)+(e>1?'²³'[e-2]:'');
  /* multiplicity of each root on top (n) and bottom (d), then cancel */
  function setup(){const p=+pw[1],q=+pw[2],N=new Map(),D=new Map(),add=(M,r,e)=>M.set(r,(M.get(r)||0)+e);
    add(N,h,p);add(N,b,1);add(D,h,q);add(D,c,1);
    const E=new Map(),holes=[];[...new Set([...N.keys(),...D.keys()])].forEach(r=>{const n=N.get(r)||0,d=D.get(r)||0;if(n&&d&&n>=d)holes.push(r);if(n!==d)E.set(r,n-d);});
    return {N,D,E,holes};}
  const val=(S,x)=>{let v=1;S.E.forEach((e,r)=>{v*=Math.pow(x-r,e);});return v;};
  const sim=glab('ho-canvas',{h:w=>clamp(w*.48,280,380),view:()=>({xr:[-6,6],yr:[-8,8],xn:6,yn:4}),draw(ctx,P){const S=setup(),f=x=>val(S,x);
    S.E.forEach((e,r)=>{if(e<0)vline(ctx,P,r,T.ce,[6,4]);});
    curveD(ctx,P,f,-6,6,T.cx,3,1800);
    S.holes.forEach(r=>{const y=f(r);if(isFinite(y)){ctx.beginPath();ctx.arc(P.X(r),P.Y(y),6.5,0,TAU);ctx.fillStyle=T.surface;ctx.fill();ctx.strokeStyle=T.hot;ctx.lineWidth=2.6;ctx.stroke();}});}});
  function upd(){const S=setup(),f=x=>val(S,x),top=[],bot=[];
    S.E.forEach((e,r)=>{(e>0?top:bot).push(fac(r,Math.abs(e)));});
    const T0=[],B0=[];S.N.forEach((n,r)=>T0.push(fac(r,n)));S.D.forEach((d,r)=>B0.push(fac(r,d)));
    setText('ho-form',`f(x) = ${T0.join('')} / ${B0.join('')}`);
    setText('ho-simp',`${top.join('')||'1'} / ${bot.join('')||'1'}  (x ≠ ${S.holes.map(r=>fmt(r,1)).join(', ')||'—'})`.replace(' / 1  (x ≠ —)','').replace('  (x ≠ —)',''));
    setText('ho-hole',S.holes.length?S.holes.map(r=>`(${fmt(r,1)}, ${fmt(f(r),2)})`).join(', '):'no hole');
    const va=[...S.E].filter(([r,e])=>e<0).map(([r])=>`x = ${fmt(r,1)}`);setText('ho-va',va.length?va.join(', '):'none');sim.render();}
  const ctl=(id,set)=>bindRange(id,v=>fmt(v,1),v=>{set(v);upd();});
  ctl('ho-h',v=>h=v);ctl('ho-b',v=>b=v);ctl('ho-c',v=>c=v);
  segBind('ho-pw','k',k=>{pw=k;upd();});
  $('#ho-lab').addEventListener('labreset',()=>{pw='a11';upd();});

  /* zoom in on x = 2 */
  const FN={hole:{f:x=>x+2,hole:true,at:4,half:z=>Math.max(.3,1.1*z),mid:4,txt:'f(x) = (x² − 4)/(x − 2)'},
    va:{f:x=>1/(x-2),half:z=>Math.max(1,1.3/z),mid:0,txt:'f(x) = 1/(x − 2)'},
    mix:{f:x=>(x+1)/(x-2),half:z=>Math.max(3,3.9/z),mid:0,txt:'f(x) = (x² − 1)/((x − 1)(x − 2))'}};
  let fk='hole',z=3;
  const sim2=glab('ho-canvas2',{h:w=>clamp(w*.4,240,320),view:()=>{const F=FN[fk],H=F.half(z);return {xr:[2-z,2+z],yr:[F.mid-H,F.mid+H],xn:6,yn:4};},
    draw(ctx,P){const F=FN[fk];
      if(!F.hole)vline(ctx,P,2,T.ce,[6,4]);
      curveD(ctx,P,F.f,2-z,2+z,T.cx,3,1800);
      if(F.hole){ctx.beginPath();ctx.arc(P.X(2),P.Y(F.at),6.5,0,TAU);ctx.fillStyle=T.surface;ctx.fill();ctx.strokeStyle=T.hot;ctx.lineWidth=2.6;ctx.stroke();}
      if(fk==='mix'&&z>1){ctx.beginPath();ctx.arc(P.X(1),P.Y(-2),6,0,TAU);ctx.fillStyle=T.surface;ctx.fill();ctx.strokeStyle=T.hot;ctx.lineWidth=2.4;ctx.stroke();}
      [2-z/2,2+z/2].forEach(x=>{const y=F.f(x);if(isFinite(y)&&Math.abs(y-F.mid)<F.half(z))dot(ctx,P.X(x),P.Y(y),5,T.hot,T.surface);});
      label(ctx,F.txt,P.box.x+8,P.box.y+12,T.cx,'left','middle',LABEL);}});
  function upd2(){const F=FN[fk],a=F.f(2-z/2),d=F.f(2+z/2),r=v=>fmt(v,2);
    setText('ho-near',`x = ${r(2-z/2)} → ${r(a)};  x = ${r(2+z/2)} → ${r(d)}`);
    setText('ho-verdict',fk==='hole'?'hole at (2, 4): the outputs settle near 4':fk==='va'?'vertical asymptote at x = 2: the outputs keep growing':'vertical asymptote at x = 2 (the hole is at x = 1)');sim2.render();}
  bindRange('ho-z',v=>`±${fmt(v,2)}`,v=>{z=v;upd2();});segBind('ho-fn','k',k=>{fk=k;upd2();});
  drawers.holes=()=>{sim.render();sim2.render();};
  KEYS['ho-canvas']=['Change the powers and zeros. An open orange circle marks a hole; gold dashed lines are asymptotes.',[['cx','f(x)'],['hot','hole'],['ce','vertical asymptote']]];
  KEYS['ho-canvas2']=['Zoom in on x = 2. Orange dots are the outputs beside it: they settle (hole) or run away (asymptote).',[['cx','f(x)'],['hot','test points / hole'],['ce','asymptote']]];
  TIPS['ho-pw:a11']='One factor on top, one on the bottom: it cancels completely.';TIPS['ho-pw:a12']='The bottom has one more copy than the top: one stays in the denominator.';TIPS['ho-pw:a21']='The top has an extra copy: the simplified function is zero at h.';
  GLOSS['hole']='A single missing point on a graph, drawn as an open circle. Also called a removable discontinuity.';GLOSS['removable discontinuity']='A discontinuity that could be repaired by defining one value: a hole.';
  TT.holes='Have students factor first, always. The pairing "cancelled completely → hole, left in the denominator → asymptote" is the whole skill.';
  GLYPH.holes='<path d="M2 20 L22 4" stroke="var(--cx)" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3.2" fill="var(--surface)" stroke="var(--hot)" stroke-width="2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(v).replace('-','−'),lin=r=>r===0?'x':`(x ${r<0?'+':'−'} ${Math.abs(r)})`,UP=['','','²','³'];
  const rr=()=>pick([-5,-4,-3,-2,-1,1,2,3,4,5]);
  PROBS.push({id:'ho-height',topic:'holes',title:'Height of the hole',gen(){const h=rr();let b=rr(),c=rr();while(b===h)b=rr();while(c===h)c=rr();
    const two=Math.random()<.5,top=polyTxt([1,-(h+b),h*b]),bot=two?polyTxt([1,-(h+c),h*c]):`x ${h<0?'+':'−'} ${Math.abs(h)}`,ans=two?(h-b)/(h-c):h-b;
    const f=two?x=>(x*x-(h+b)*x+h*b)/(x*x-(h+c)*x+h*c):x=>(x*x-(h+b)*x+h*b)/(x-h);
    return {q:`f(x) = (${top}) / (${bot}) has a hole at x = ${sg(h)}. Find the y-coordinate of the hole.`,ans,unit:'',abs:.001,chk:(f(h+1e-6)+f(h-1e-6))/2,show:frac(ans),hint:'Factor top and bottom, cancel the common factor, then plug x into what is left.',
      sol:`f(x) = ${lin(h)}${lin(b)} / ${two?lin(h)+lin(c):lin(h)}. Cancel (x ${h<0?'+':'−'} ${Math.abs(h)}): ${two?`${lin(b)} / ${lin(c)}`:lin(b)}. At x = ${sg(h)}: <b>${frac(ans)}</b>.`};}});
  PROBS.push({id:'ho-kind',topic:'holes',title:'Hole or asymptote?',gen(){const h=rr();let b=rr(),c=rr();while(b===h)b=rr();while(c===h)c=rr();const p=pick([1,2]),q=pick([1,2]),hole=q<=p;
    const right=hole?'a hole':'a vertical asymptote',all=['a hole','a vertical asymptote','a zero that is not a hole','a horizontal asymptote'],{choices,ans}=mcq(right,all.filter(s=>s!==right),4);
    const f=x=>Math.pow(x-h,p)*(x-b)/(Math.pow(x-h,q)*(x-c)),chk=Math.abs(f(h+1e-5))>1e3?0:1;
    return {q:`f(x) = ${lin(h)}${UP[p]}${lin(b)} / (${lin(h)}${UP[q]}${lin(c)}). At x = ${sg(h)}, the graph has`,choices,ans,chk,hint:'Cancel as many copies of the shared factor as you can, then look at what is left in the denominator.',
      sol:`The top has ${p} copy${p>1?'ies':''} of ${lin(h)} and the bottom has ${q}. ${hole?`After cancelling, none is left in the denominator, so it is <b>a hole</b>.`:`After cancelling, ${q-p} is left in the denominator, so it is <b>a vertical asymptote</b>.`}`};}});
  PROBS.push({id:'ho-lim',topic:'holes',title:'Limit at a hole',gen(){const h=rr(),r=rr(),a=pick([1,2,3,-1,-2]),f=x=>a*(x-h)*(x-r)/(x-h),ans=a*(h-r);
    return {q:`Find lim f(x) as x → ${sg(h)} for f(x) = (${polyTxt([a,-a*(h+r),a*h*r])}) / (x ${h<0?'+':'−'} ${Math.abs(h)}).`,ans,unit:'',abs:.001,chk:(f(h+1e-6)+f(h-1e-6))/2,hint:'The function is undefined at x itself, but the limit only cares about nearby x. Factor and cancel.',
      sol:`The top factors as ${a===1?'':sg(a)}${lin(h)}${lin(r)}. Cancel ${lin(h)}: ${a===1?'':sg(a)}${lin(r)}. At x = ${sg(h)}: <b>${sg(ans)}</b>.`};}});
})();
