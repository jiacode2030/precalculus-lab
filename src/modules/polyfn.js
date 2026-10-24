/* ---------------- 1.4 Polynomial functions and rates of change ---------------- */
(function polyfn(){
  const cv=$('#py-canvas');if(!cv)return;
  const PRE={3:[[-3,-2],[-1,2],[1,-1],[3,2]],4:[[-3.5,3],[-1.75,-1],[0,1.5],[1.75,-1.5],[3.5,2.5]],5:[[-3.5,-3],[-2.1,1.5],[-.7,-1],[.7,1],[2.1,-1.5],[3.5,3]]};
  let deg=3,pts=PRE[3].map(p=>p.slice()),dr=-1,lay=null;
  /* the polynomial through the points (Lagrange form) */
  const f=x=>pts.reduce((s,[xi,yi],i)=>s+yi*pts.reduce((p,[xj],j)=>j===i?p:p*(x-xj)/(xi-xj),1),0);
  const d1=x=>(f(x+1e-4)-f(x-1e-4))/2e-4,d2=x=>(f(x+1e-3)-2*f(x)+f(x-1e-3))/1e-6;
  const zs=(g,a,b)=>{const out=[];const n=1500;let x0=a,v0=g(a);for(let i=1;i<=n;i++){const x1=a+(b-a)*i/n,v1=g(x1);if(v0*v1<0)out.push(solve(g,x0,x1,60));x0=x1;v0=v1;}return out;};
  const sim=sim2d(cv,{h:w=>clamp(w*.6,340,460),draw(ctx,w,h){const B={x:46,y:12,w:w-60,h:h-78},P=lay=gpanel(ctx,B,[-5,5],[-6,6],{xn:10,yn:6});
    const E=zs(d1,-5,5),I=zs(d2,-5,5);
    curveD(ctx,P,f,-5,5,T.cx,2.8,800);
    I.forEach(x=>{const X=P.X(x),Y=P.Y(f(x));if(Y<B.y||Y>B.y+B.h)return;ctx.fillStyle=T.ce;ctx.beginPath();ctx.moveTo(X,Y-7);ctx.lineTo(X+7,Y);ctx.lineTo(X,Y+7);ctx.lineTo(X-7,Y);ctx.closePath();ctx.fill();});
    E.forEach(x=>{const y=f(x),Y=P.Y(y);if(Y<B.y||Y>B.y+B.h)return;const mx=d2(x)<0;dot(ctx,P.X(x),Y,5.5,T.hot,T.surface);label(ctx,mx?'max':'min',P.X(x),Y+(mx?-14:15),T.hot,'center','middle',MONO);});
    pts.forEach(([x,y],i)=>dot(ctx,P.X(x),P.Y(y),i===dr?9:7,alpha(T.cx,.9),T.surface));
    /* two strips: direction, then bending */
    const sy=B.y+B.h+26,band=(y0,lab,fn)=>{label(ctx,lab,8,y0+6,T.muted,'left','middle',MONO);for(let i=0;i<300;i++){const x=-5+10*(i+.5)/300,[col,tx]=fn(x);ctx.fillStyle=col;ctx.fillRect(P.X(-5+10*i/300),y0,P.X(-5+10*(i+1)/300)-P.X(-5+10*i/300)+.6,12);}};
    band(sy,'rate',x=>[d1(x)>0?alpha(T.cv,.7):alpha(T.ca,.7)]);band(sy+20,'bend',x=>[d2(x)>0?alpha(T.cx,.35):alpha(T.muted,.35)]);
    const cuts=[-5,...I.filter(x=>x>-5&&x<5),5];for(let i=0;i<cuts.length-1;i++){const m=(cuts[i]+cuts[i+1])/2;if(P.X(cuts[i+1])-P.X(cuts[i])>16)label(ctx,d2(m)>0?'∪':'∩',P.X(m),sy+26,T.ink,'center','middle',LABEL);}
    if(B.w>420)label(ctx,'green: increasing · magenta: decreasing',B.x+B.w-6,B.y+12,T.muted,'right','middle',MONO);},
    drag(kind,e){if(!lay)return;if(kind==='up'){dr=-1;sim.render();return;}const [px,py]=ptr(e,cv),P=lay;
      if(kind==='down'){dr=-1;let bd=22;pts.forEach(([x,y],i)=>{const d=Math.hypot(P.X(x)-px,P.Y(y)-py);if(d<bd){bd=d;dr=i;}});}
      if(dr>=0){const yr=P.yr,y=yr[0]+(P.box.y+P.box.h-py)/P.box.h*(yr[1]-yr[0]);pts[dr][1]=clamp(Math.round(y*4)/4,-5.75,5.75);upd();}}});
  const pt=x=>`(${fmt(x,2)}, ${fmt(f(x),2)})`;
  function upd(){const E=zs(d1,-5,5),I=zs(d2,-5,5);
    setText('py-ext',E.length?E.map(x=>`${d2(x)<0?'max':'min'} ${pt(x)}`).join(', '):'none: always '+(d1(0)>0?'increasing':'decreasing'));
    setText('py-inf',I.length?I.map(pt).join(', '):'none');setText('py-cnt',`${E.length} (a degree-${deg} polynomial has at most ${deg-1})`);sim.render();}
  segBind('py-deg','k',k=>{deg=+k.slice(1);pts=PRE[deg].map(p=>p.slice());upd();});
  $('#py-lab').addEventListener('labreset',()=>{deg=3;pts=PRE[3].map(p=>p.slice());upd();});
  upd();

  /* absolute extrema on [a, b] */
  const FN={cubic:{f:x=>x**3-6*x*x+9*x+1,xr:[-1,5],yr:[-6,13],r:[-1,5],ab:[-.5,4.5]},quart:{f:x=>.3*(x+.5)*(x-1)*(x-3)*(x-4.5),xr:[-1,5],yr:[-4,6],r:[-1,5],ab:[-.5,4.5]},
    box:{f:x=>x*(20-2*x)*(30-2*x),xr:[0,10],yr:[-50,1200],r:[0,10],ab:[1,8]}};
  let fk='cubic',a=-.5,b=4.5;const aEl=$('#py-a'),bEl=$('#py-b');
  const ext=()=>{const g=FN[fk].f,lo=Math.min(a,b),hi=Math.max(a,b);let mx=[lo,g(lo)],mn=[lo,g(lo)];for(let i=0;i<=4000;i++){const x=lo+(hi-lo)*i/4000,v=g(x);if(v>mx[1])mx=[x,v];if(v<mn[1])mn=[x,v];}return {mx,mn,lo,hi};};
  const sim2=glab('py-canvas2',{h:w=>clamp(w*.45,250,340),view:()=>({xr:FN[fk].xr,yr:FN[fk].yr,xn:6,yn:4}),draw(ctx,P){const g=FN[fk].f,{mx,mn,lo,hi}=ext();
    ctx.fillStyle=alpha(T.ce,.12);ctx.fillRect(P.X(lo),P.box.y,P.X(hi)-P.X(lo),P.box.h);vline(ctx,P,lo,T.ce,[5,4]);vline(ctx,P,hi,T.ce,[5,4]);
    curveD(ctx,P,g,FN[fk].xr[0],FN[fk].xr[1],alpha(T.cx,.3),2,600);curveD(ctx,P,g,lo,hi,T.cx,3,600);
    dot(ctx,P.X(mx[0]),P.Y(mx[1]),7.5,T.hot,T.surface);dot(ctx,P.X(mn[0]),P.Y(mn[1]),7.5,T.hot,T.surface);
    label(ctx,'abs max',P.X(mx[0]),P.Y(mx[1])-14,T.hot,'center','middle',LABEL);label(ctx,'abs min',P.X(mn[0]),P.Y(mn[1])+16,T.hot,'center','middle',LABEL);}});
  function upd2(){const {mx,mn,lo,hi}=ext(),where=x=>Math.abs(x-lo)<1e-6||Math.abs(x-hi)<1e-6?'an endpoint':'a turning point';
    setText('py-max',`${fmt(mx[1],3)} at x = ${fmt(mx[0],2)}`);setText('py-min',`${fmt(mn[1],3)} at x = ${fmt(mn[0],2)}`);setText('py-why',`max: ${where(mx[0])}; min: ${where(mn[0])}`);sim2.render();}
  bindRange('py-a',v=>fmt(v,2),v=>{a=v;upd2();});bindRange('py-b',v=>fmt(v,2),v=>{b=v;upd2();});
  segBind('py-fn','k',k=>{fk=k;const F=FN[k];[aEl,bEl].forEach(el=>{el.min=F.r[0];el.max=F.r[1];});[a,b]=F.ab;aEl.value=a;bEl.value=b;
    const oa=$('#py-a-out'),ob=$('#py-b-out');if(oa)oa.textContent=fmt(a,2);if(ob)ob.textContent=fmt(b,2);upd2();});
  drawers.polyfn=()=>{sim.render();sim2.render();};
  KEYS['py-canvas']=['Drag the blue points up or down; the polynomial goes through all of them. Orange: relative max and min. Gold diamonds: inflection points.',[['cx','f(x)'],['hot','relative extrema'],['ce','inflection points'],['cv','increasing'],['ca','decreasing']]];
  KEYS['py-canvas2']=['Move a and b. The gold band is the interval; orange marks the highest and lowest points on it.',[['cx','f on [a, b]'],['ce','the interval'],['hot','absolute max and min']]];
  TIPS['py-deg:d3']='4 points fix a cubic: at most 2 turning points, exactly 1 inflection.';TIPS['py-deg:d4']='5 points fix a quartic: at most 3 turning points.';TIPS['py-deg:d5']='6 points fix a quintic: at most 4 turning points.';
  TIPS['py-a']=el=>`Left end a = ${fmt(+el.value,2)}.`;TIPS['py-b']=el=>`Right end b = ${fmt(+el.value,2)}. Compare the endpoint values with the turning points inside.`;
  TIPS['py-fn:box']='V(x) = x(20 − 2x)(30 − 2x): only 0 < x < 10 makes sense.';
  GLOSS['relative maximum']='A point where f switches from increasing to decreasing: higher than all nearby points.';GLOSS['point of inflection']='A point where the graph switches concavity.';
  GLOSS['absolute maximum']='The greatest output of f on the whole interval being considered.';
  TT.polyfn='Ask "how many times can a degree-5 polynomial turn?" and let students try to break the rule with the draggable points.';
  GLYPH.polyfn='<path d="M2 18 C6 2, 10 2, 12 12 S18 22, 22 6" fill="none" stroke="var(--cx)" stroke-width="2"/><circle cx="7" cy="6" r="2" fill="var(--hot)"/><circle cx="17" cy="18" r="2" fill="var(--hot)"/>';
})();

(function(){
  const sg=v=>String(v).replace('-','−');
  PROBS.push({id:'py-deg',topic:'polyfn',title:'How many can there be?',gen(){const n=ri(3,8),w=pick(['ext','zero','infl']),ans=w==='ext'?n-1:w==='zero'?n:n-2;
    /* independent: count the turning points, zeros and inflections of a polynomial with n distinct real zeros (which reaches every maximum) */
    const f=x=>{let p=1;for(let k=0;k<n;k++)p*=(x-k);return p;},c=(g)=>{let m=0,v0=g(-.5);for(let i=1;i<=4000;i++){const x=-.5+(n)*(i+.1234567)/4000,v1=g(x);if(v0*v1<0)m++;v0=v1;}return m;};
    const chk=w==='ext'?c(x=>(f(x+1e-5)-f(x-1e-5))):w==='zero'?c(f):c(x=>f(x+1e-3)-2*f(x)+f(x-1e-3));
    return {q:`What is the greatest possible number of ${w==='ext'?'relative extrema (turning points)':w==='zero'?'real zeros':'points of inflection'} of a polynomial of degree ${n}?`,ans,unit:'',abs:0,chk,
      hint:w==='ext'?'The direction can switch at most n − 1 times.':w==='zero'?'A degree-n polynomial has n complex zeros, counting multiplicity.':'The bending can switch at most n − 2 times.',
      sol:`Degree ${n}: at most <b>${ans}</b> ${w==='ext'?'turning points (n − 1)':w==='zero'?'real zeros (n)':'inflection points (n − 2)'}.`};}});
  PROBS.push({id:'py-abs',topic:'polyfn',title:'Absolute extremum on an interval',gen(){const p=pick([-2,-1,1,2]),h=ri(-2,4),k=ri(-6,6),f=x=>p*(x-h)**2+k,a=ri(-4,2),b=a+ri(2,5),w=pick(['max','min']);
    const cand=[a,b].concat(h>a&&h<b?[h]:[]),vals=cand.map(f),ans=w==='max'?Math.max(...vals):Math.min(...vals);
    let chk=f(a);for(let i=0;i<=6000;i++){const v=f(a+(b-a)*i/6000);chk=w==='max'?Math.max(chk,v):Math.min(chk,v);}
    const form=`${p===1?'':p===-1?'−':sg(p)}(x ${h<0?'+':'−'} ${Math.abs(h)})²${k?` ${k<0?'−':'+'} ${Math.abs(k)}`:''}`.replace('(x − 0)','x').replace('(x + 0)','x');
    return {q:`f(x) = ${form}. Find the absolute ${w}imum value of f on [${sg(a)}, ${sg(b)}].`,ans,unit:'',abs:0,chk,hint:'Compare the values at the endpoints and at the vertex, if the vertex is inside the interval.',
      sol:`Vertex x = ${sg(h)} ${h>a&&h<b?'is':'is not'} in the interval. Candidates: ${cand.map(x=>`f(${sg(x)}) = ${sg(f(x))}`).join(', ')}. The absolute ${w}imum is <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'py-ext',topic:'polyfn',title:'Value of a relative extremum',gen(){const q=pick([1,2,3]),c=ri(-10,10),sgn=pick([1,-1]),f=x=>sgn*(x**3-3*q*q*x)+c,w=pick(['max','min']);
    /* x³ − 3q²x turns at ±q: max at −q and min at q when the leading coefficient is positive */
    const xm=(w==='max')===(sgn>0)?-q:q,ans=f(xm);
    const g=w==='max'?f:x=>-f(x),xs=argmax(g,(xm<0?-q-2:0),(xm<0?0:q+2)),chk=f(xs);
    return {q:`The graph of f(x) = ${polyTxt([sgn,0,-sgn*3*q*q,c])} has turning points at x = −${q} and x = ${q}. What is the relative ${w}imum value?`,ans,unit:'',abs:.001,chk,
      hint:`Decide which turning point is the ${w} from the end behavior (leading coefficient ${sgn>0?'positive':'negative'}), then evaluate.`,
      sol:`With a ${sgn>0?'positive':'negative'} leading coefficient the graph ${sgn>0?'rises, falls, then rises':'falls, rises, then falls'}, so the relative ${w} is at x = ${sg(xm)}: f(${sg(xm)}) = <b>${sg(ans)}</b>.`};}});
})();
