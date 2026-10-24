/* ---------------- 3.12 Identities and equivalent forms ---------------- */
(function identities(){
  const cv=$('#id-canvas');if(!cv)return;
  const s=Math.sin,c=Math.cos;let fn='pyth',th=1,b=.79;
  /* each: left side, right side, the equation text, and an optional faint wrong guess */
  const ID={pyth:{L:t=>s(t)**2+c(t)**2,R:()=>1,eq:()=>'sin²θ + cos²θ = 1',yr:[-1.6,1.6]},
    dbl:{L:t=>s(2*t),R:t=>2*s(t)*c(t),eq:()=>'sin 2θ = 2 sin θ cos θ   (not 2 sin θ)',bad:t=>2*s(t),badT:'2 sin θ',yr:[-2.2,2.2]},
    cos2:{L:t=>c(2*t),R:t=>1-2*s(t)**2,eq:()=>'cos 2θ = 1 − 2 sin²θ = 2 cos²θ − 1',yr:[-1.6,1.6]},
    sum:{L:t=>s(t+b),R:t=>s(t)*c(b)+c(t)*s(b),eq:()=>`sin(θ + β) = sin θ cos β + cos θ sin β,  β = ${fmt(b,2)}`,yr:[-1.6,1.6]},
    trap:{L:t=>s(t+b),R:t=>s(t)+s(b),eq:()=>`sin(θ + β) vs sin θ + sin β,  β = ${fmt(b,2)}`,yr:[-2.2,2.2]}};
  const same=F=>[.3,1.1,2,2.7,4,5.2].every(t=>Math.abs(F.L(t)-F.R(t))<1e-9);
  const sim=glab('id-canvas',{h:w=>clamp(w*.42,240,320),view:()=>({xr:[0,TAU],yr:ID[fn].yr,xn:4,yn:4,xt:false}),draw(ctx,P){const F=ID[fn];piTicks(ctx,P,0,TAU);
    if(F.bad){curveD(ctx,P,F.bad,0,TAU,alpha(T.muted,.8),1.6,700,[2,4]);label(ctx,`dotted: ${F.badT}`,P.box.x+P.box.w-6,P.box.y+12,T.muted,'right','middle',MONO);}
    curveD(ctx,P,F.L,0,TAU,T.cx,4,900);curveD(ctx,P,F.R,0,TAU,T.hot,2.2,900,[7,5]);
    vline(ctx,P,th,alpha(T.ce,.8),[1,0]);dot(ctx,P.X(th),P.Y(F.L(th)),7,T.cx,T.surface);dot(ctx,P.X(th),P.Y(F.R(th)),4.5,T.hot,T.surface);}});
  function upd(){const F=ID[fn];setText('id-eq',F.eq());setText('id-l',fmt(F.L(th),4));setText('id-r',fmt(F.R(th),4));
    setText('id-ok',same(F)?'yes: the graphs match everywhere':Math.abs(F.L(th)-F.R(th))<1e-3?'not an identity (they only cross here)':'no: the graphs differ');sim.render();}
  bindRange('id-th',v=>fmt(v,2),v=>{th=v;upd();});bindRange('id-b',v=>fmt(v,2),v=>{b=v;upd();});segBind('id-fn','k',k=>{fn=k;upd();});

  /* why: squares on the legs, or two angles added */
  const cv2=$('#id-canvas2');let pic='sq',a2=.6,b2=.5;
  const sim2=sim2d(cv2,{h:w=>w>=560?clamp(w*.5,300,400):clamp(w*1.05,320,440),draw(ctx,w,h){
    const R=Math.min(w*.34,h*.36),ox=pic==='sq'?w*(w>=560?.36:.3):w*.4,oy=pic==='sq'?h*.55:h*.62,X=x=>ox+R*x,Y=y=>oy-R*y;
    const seg=(x1,y1,x2,y2,col,wd,dash)=>{ctx.save();ctx.strokeStyle=col;ctx.lineWidth=wd;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(X(x1),Y(y1));ctx.lineTo(X(x2),Y(y2));ctx.stroke();ctx.restore();};
    ctx.strokeStyle=T.grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X(-1.15),Y(0));ctx.lineTo(X(1.5),Y(0));ctx.moveTo(X(0),Y(-1.15));ctx.lineTo(X(0),Y(1.15));ctx.stroke();
    ctx.strokeStyle=alpha(T.ink,.45);ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(ox,oy,R,0,TAU);ctx.stroke();
    if(pic==='sq'){const C=c(a2),S=s(a2);
      ctx.fillStyle=alpha(T.ca,.16);ctx.fillRect(X(0),Y(0),R*C,R*C);ctx.strokeStyle=T.ca;ctx.lineWidth=1.5;ctx.strokeRect(X(0),Y(0),R*C,R*C);
      ctx.fillStyle=alpha(T.cx,.16);ctx.fillRect(X(C),Y(S),R*S,R*S);ctx.strokeStyle=T.cx;ctx.strokeRect(X(C),Y(S),R*S,R*S);
      label(ctx,`cos²θ = ${fmt(C*C,3)}`,X(C/2),Y(-C/2),T.ca,'center','middle',LABEL);label(ctx,`sin²θ = ${fmt(S*S,3)}`,X(C+S/2),Y(S)-12,T.cx,'center','middle',LABEL);
      seg(0,0,C,0,T.ca,3.5);seg(C,0,C,S,T.cx,3.5);seg(0,0,C,S,T.ink,2.2);angArc(ctx,ox,oy,R*.22,a2);dot(ctx,X(C),Y(S),6.5,T.hot,T.surface);
      label(ctx,'1',X(C/2)-8,Y(S/2)-8,T.ink,'right','middle',LABEL);
      /* the two areas stacked into one bar of height 1 */
      const bx=Math.min(w-34,X(1.5)+10),bh=R,by=Y(0)-bh;
      if(bx>X(C+S)+18){ctx.fillStyle=alpha(T.ca,.4);ctx.fillRect(bx,by+bh*(1-C*C),18,bh*C*C);ctx.fillStyle=alpha(T.cx,.4);ctx.fillRect(bx,by,18,bh*S*S);
        ctx.strokeStyle=T.ink;ctx.lineWidth=1.2;ctx.strokeRect(bx,by,18,bh);label(ctx,'1',bx+9,by-10,T.ink,'center','middle',LABEL);}
      setText('id-v1',`sin²θ + cos²θ = ${fmt(S*S,3)} + ${fmt(C*C,3)}`);setText('id-v2',`= ${fmt(S*S+C*C,3)} (radius² = 1)`);}
    else{const a=a2,bb=b2,Q=[c(bb)*c(a),c(bb)*s(a)],Pp=[c(a+bb),s(a+bb)];
      seg(0,0,1.12*c(a),1.12*s(a),alpha(T.muted,.8),1.2,[4,4]);
      angArc(ctx,ox,oy,R*.2,a,T.cx);ctx.save();ctx.strokeStyle=T.cv;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ox,oy,R*.3,-a-bb,-a,false);ctx.stroke();ctx.restore();
      label(ctx,'α',X(.27*c(a/2)),Y(.27*s(a/2)),T.cx,'center','middle',LABEL);label(ctx,'β',X(.38*c(a+bb/2)),Y(.38*s(a+bb/2)),T.cv,'center','middle',LABEL);
      seg(0,0,Pp[0],Pp[1],T.ink,2.2);seg(0,0,Q[0],Q[1],T.ca,3);seg(Q[0],Q[1],Pp[0],Pp[1],T.cv,3);
      /* the height of P in two pieces */
      seg(Q[0],0,Q[0],Q[1],T.cx,4);seg(Pp[0],Q[1],Q[0],Q[1],alpha(T.ce,.9),1.4,[3,3]);seg(Pp[0],Q[1],Pp[0],Pp[1],T.hot,4);seg(Pp[0],0,Pp[0],Q[1],alpha(T.ce,.9),1.4,[3,3]);
      dot(ctx,X(Q[0]),Y(Q[1]),4.5,T.ca,T.surface);dot(ctx,X(Pp[0]),Y(Pp[1]),6.5,T.hot,T.surface);
      const right=Q[0]>=Pp[0];
      label(ctx,'sin α cos β',X(Q[0])+(right?8:-8),Y(Q[1]/2)-8,T.cx,right?'left':'right','middle',LABEL);label(ctx,`= ${fmt(s(a)*c(bb),3)}`,X(Q[0])+(right?8:-8),Y(Q[1]/2)+8,T.cx,right?'left':'right','middle',LABEL);
      label(ctx,`cos α sin β = ${fmt(c(a)*s(bb),3)}`,X(Pp[0]),Y(Pp[1])-16,T.hot,'center','middle',LABEL);
      label(ctx,'cos β',X(Q[0]/2)+8*s(a),Y(Q[1]/2)+8*c(a),T.ca,'left','top',MONO);label(ctx,'sin β',X((Q[0]+Pp[0])/2)+6,Y((Q[1]+Pp[1])/2)-6,T.cv,'left','bottom',MONO);
      setText('id-v1',`sin(α + β) = sin ${fmt(a+bb,2)} = ${fmt(s(a+bb),3)}`);setText('id-v2',`${fmt(s(a)*c(bb),3)} + ${fmt(c(a)*s(bb),3)} = ${fmt(s(a)*c(bb)+c(a)*s(bb),3)}`);}}});
  bindRange('id-a2',v=>fmt(v,2),v=>{a2=v;sim2.render();});bindRange('id-b2',v=>fmt(v,2),v=>{b2=v;sim2.render();});segBind('id-pic','k',k=>{pic=k;sim2.render();});
  drawers.identities=()=>{sim.render();sim2.render();};
  KEYS['id-canvas']=['Pick an identity and slide θ. Blue is the left side, orange dashed the right. A true identity: the two curves coincide everywhere.',[['cx','left side'],['hot','right side'],['ce','the θ you chose']]];
  KEYS['id-canvas2']=['Drag the sliders. Squares: the two squares on the legs always add to 1. Adding angles: the height of P is built from two pieces.',[['ca','cos θ (or OQ = cos β)'],['cx','sin θ (or sin α cos β)'],['cv','QP = sin β'],['hot','cos α sin β, the point P']]];
  TIPS['id-fn:pyth']='Every point (cos θ, sin θ) is at distance 1 from the origin.';TIPS['id-fn:dbl']='Doubling the angle is not doubling the sine.';
  TIPS['id-fn:cos2']='Three forms of cos 2θ: pick the one that matches what you know.';TIPS['id-fn:sum']='Change β: the identity holds for every β.';
  TIPS['id-fn:trap']='The classic mistake. The curves touch only where sin β = 0 or at isolated points.';
  TIPS['id-th']=el=>`θ = ${fmt(+el.value,2)}: compare the two outputs below.`;TIPS['id-b']=el=>`β = ${fmt(+el.value,2)} (only used by the sum formulas).`;
  TIPS['id-pic:sq']='The Pythagorean theorem on the unit circle.';TIPS['id-pic:add']='OQ lies along angle α and has length cos β; QP is perpendicular with length sin β.';
  GLOSS['identity']='An equation that is true for every input where both sides are defined; the two sides have the same graph.';
  GLOSS['double-angle formula']='sin 2θ = 2 sin θ cos θ and cos 2θ = cos²θ − sin²θ.';
  TT.identities='Have students graph both sides on a calculator before proving anything: a false "identity" is caught in seconds.';
  GLYPH.identities='<path d="M2 14 C5 4, 8 4, 11 14 S17 24, 22 10" fill="none" stroke="var(--cx)" stroke-width="3.2"/><path d="M2 14 C5 4, 8 4, 11 14 S17 24, 22 10" fill="none" stroke="var(--hot)" stroke-width="1.4" stroke-dasharray="3 2"/>';
})();

(function(){
  const TRI=[[3,4,5],[5,12,13],[8,15,17],[7,24,25]],Q={2:{sin:1,cos:-1},3:{sin:-1,cos:-1},4:{sin:-1,cos:1}},QN={2:'II',3:'III',4:'IV'};
  const fr=(n,d)=>{const g=gcd(Math.abs(n),Math.abs(d)),neg=(n<0)!==(d<0)&&n!==0;return `${neg?'−':''}${Math.abs(n)/g}${Math.abs(d)/g===1?'':'/'+Math.abs(d)/g}`;};
  /* θ itself, built from the angle (not from the identity) for the checks */
  const angle=(known,k,q)=>{const al=known==='sin'?Math.asin(Math.abs(k)):Math.acos(Math.abs(k));return q===2?Math.PI-al:q===3?Math.PI+al:TAU-al;};
  function setup(){const [p,r,h]=pick(TRI),sw=pick([0,1]),n=sw?r:p,m=sw?p:r,q=pick([2,3,4]),known=pick(['sin','cos']),other=known==='sin'?'cos':'sin';
    return {n,m,h,q,known,other,kv:Q[q][known]*n,ov:Q[q][other]*m,th:angle(known,n/h,q)};}
  PROBS.push({id:'id-pyth',topic:'identities',title:'Pythagorean identity',gen(){const S=setup(),want=pick(['other','tan']),sv=S.known==='sin'?S.kv:S.ov,cvv=S.known==='sin'?S.ov:S.kv;
    const ans=want==='other'?S.ov/S.h:sv/cvv,chk=want==='other'?(S.other==='sin'?Math.sin(S.th):Math.cos(S.th)):Math.tan(S.th),wt=want==='other'?`${S.other} θ`:'tan θ';
    return {q:`${S.known} θ = ${fr(S.kv,S.h)} and θ is in quadrant ${QN[S.q]}. Find ${wt} exactly.`,ans,unit:'',abs:.001,chk,show:want==='other'?fr(S.ov,S.h):fr(sv,cvv),hint:'sin²θ + cos²θ = 1, then choose the sign from the quadrant.',
      sol:`${S.other}²θ = 1 − (${S.n}/${S.h})² = ${S.m*S.m}/${S.h*S.h}, so ${S.other} θ = ±${S.m}/${S.h}; in quadrant ${QN[S.q]} it is ${fr(S.ov,S.h)}.${want==='tan'?` tan θ = sin θ / cos θ = <b>${fr(sv,cvv)}</b>.`:` So ${wt} = <b>${fr(S.ov,S.h)}</b>.`}`};}});
  PROBS.push({id:'id-double',topic:'identities',title:'Double-angle values',gen(){const S=setup(),want=pick(['sin','cos']),sv=S.known==='sin'?S.kv:S.ov,cvv=S.known==='sin'?S.ov:S.kv,H=S.h*S.h;
    const num=want==='sin'?2*sv*cvv:cvv*cvv-sv*sv,ans=num/H,chk=want==='sin'?Math.sin(2*S.th):Math.cos(2*S.th);
    return {q:`${S.known} θ = ${fr(S.kv,S.h)} and θ is in quadrant ${QN[S.q]}. Find ${want} 2θ exactly.`,ans,unit:'',abs:.001,chk,show:fr(num,H),hint:`Find ${S.other} θ first (sign from the quadrant), then use ${want==='sin'?'sin 2θ = 2 sin θ cos θ':'cos 2θ = cos²θ − sin²θ'}.`,
      sol:`${S.other} θ = ${fr(S.ov,S.h)}. ${want==='sin'?`sin 2θ = 2(${fr(sv,S.h)})(${fr(cvv,S.h)})`:`cos 2θ = (${fr(cvv,S.h)})² − (${fr(sv,S.h)})²`} = <b>${fr(num,H)}</b>.`};}});
  /* exact values of sums of special angles */
  const ANG=[[45,30],[60,45],[45,-30],[60,-45],[90,15],[120,45],[135,30]],SV={15:['(√6 − √2)/4','(√6 + √2)/4'],75:['(√6 + √2)/4','(√6 − √2)/4'],105:['(√6 + √2)/4','−(√6 − √2)/4'],165:['(√6 − √2)/4','−(√6 + √2)/4']};
  const d2r=d=>d*Math.PI/180,trig={sin:d=>Math.sin(d2r(d)),cos:d=>Math.cos(d2r(d))};
  PROBS.push({id:'id-sum',topic:'identities',title:'Exact value with a sum formula',gen(){const [A,B0]=pick(ANG.filter(([a,b])=>SV[a+b]&&Math.abs(b)!==15)),fnn=pick(['sin','cos']),D=A+B0,sg=B0<0?'−':'+',B=Math.abs(B0);
    const ans=fnn==='sin'?trig.sin(A)*trig.cos(B0)+trig.cos(A)*trig.sin(B0):trig.cos(A)*trig.cos(B0)-trig.sin(A)*trig.sin(B0);
    return {q:`Use ${D}° = ${A}° ${sg} ${B}° to find ${fnn} ${D}° exactly.`,ans,unit:'',abs:.001,chk:trig[fnn](D),show:SV[D][fnn==='sin'?0:1],hint:fnn==='sin'?'sin(α ± β) = sin α cos β ± cos α sin β.':'cos(α ± β) = cos α cos β ∓ sin α sin β.',
      sol:`${fnn==='sin'?`sin ${A}° cos ${B}° ${sg} cos ${A}° sin ${B}°`:`cos ${A}° cos ${B}° ${B0<0?'+':'−'} sin ${A}° sin ${B}°`} = (${exactTrig(trig[fnn](A))})(${exactTrig(trig.cos(B))}) ${fnn==='sin'?sg:(B0<0?'+':'−')} (${exactTrig(trig[fnn==='sin'?'cos':'sin'](A))})(${exactTrig(trig.sin(B))}) = <b>${SV[D][fnn==='sin'?0:1]}</b> ≈ ${fmt(ans,4)}.`};}});
  /* equations that an identity turns into a quadratic or a product */
  const EQS=[{t:'cos 2θ = cos θ',f:t=>Math.cos(2*t)-Math.cos(t),w:'2cos²θ − cos θ − 1 = 0, so (2 cos θ + 1)(cos θ − 1) = 0',S:[0,2*Math.PI/3,4*Math.PI/3]},
    {t:'sin 2θ = sin θ',f:t=>Math.sin(2*t)-Math.sin(t),w:'2 sin θ cos θ − sin θ = 0, so sin θ (2 cos θ − 1) = 0',S:[0,Math.PI/3,Math.PI,5*Math.PI/3]},
    {t:'sin 2θ = cos θ',f:t=>Math.sin(2*t)-Math.cos(t),w:'2 sin θ cos θ − cos θ = 0, so cos θ (2 sin θ − 1) = 0',S:[Math.PI/6,Math.PI/2,5*Math.PI/6,3*Math.PI/2]},
    {t:'cos 2θ = sin θ',f:t=>Math.cos(2*t)-Math.sin(t),w:'1 − 2 sin²θ = sin θ, so (2 sin θ − 1)(sin θ + 1) = 0',S:[Math.PI/6,5*Math.PI/6,3*Math.PI/2]},
    {t:'cos 2θ + cos θ = 0',f:t=>Math.cos(2*t)+Math.cos(t),w:'2cos²θ + cos θ − 1 = 0, so (2 cos θ − 1)(cos θ + 1) = 0',S:[Math.PI/3,Math.PI,5*Math.PI/3]}];
  /* independent: local minima of |f| on a fine circular grid, refined, that reach 0 */
  function scanSols(f){const N=7200,h=TAU/N,g=t=>Math.abs(f(t)),out=[];for(let i=0;i<N;i++){const x=i*h;if(g(x)<=g(x-h)&&g(x)<=g(x+h)){let lo=x-h,hi=x+h;for(let k=0;k<80;k++){const m1=lo+(hi-lo)/3,m2=hi-(hi-lo)/3;if(g(m1)<g(m2))hi=m2;else lo=m1;}
    const r=wrap2pi((lo+hi)/2),u=Math.abs(r-TAU)<1e-6?0:r;if(g(u)<1e-9&&!out.some(v=>Math.abs(v-u)<1e-5))out.push(u);}}return out.sort((a,b)=>a-b);}
  PROBS.push({id:'id-solve',topic:'identities',title:'Solve with an identity',gen(){const E=pick(EQS),ask=pick(['count','max']),ans=ask==='count'?E.S.length:Math.max(...E.S),sc=scanSols(E.f);
    return {q:`Solve ${E.t} on [0, 2π). ${ask==='count'?'How many solutions are there?':'Enter the largest solution.'}`,ans,unit:'',abs:ask==='count'?0:.002,chk:ask==='count'?sc.length:Math.max(...sc),show:ask==='count'?String(ans):piText(ans),
      hint:'Rewrite the double angle so only one function of θ appears, move everything to one side and factor.',sol:`${E.w}. Solutions: ${E.S.map(piText).join(', ')}. ${ask==='count'?`That is <b>${ans}</b> solutions.`:`The largest is <b>${piText(ans)}</b>.`}`};}});
})();
