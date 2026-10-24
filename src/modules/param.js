/* ---------------- 4.1, 4.2, 4.4 Parametric functions ---------------- */
(function param(){
  const cv=$('#pa-canvas');if(!cv)return;
  const TP=(12+Math.sqrt(163.6))/9.8;
  const PRE={circ:{x:t=>3*Math.cos(t),y:t=>3*Math.sin(t),T:TAU,eq:'x = 3 cos t,  y = 3 sin t,  0 ≤ t ≤ 2π',bx:[-3.6,3.6],by:[-3.6,3.6],note:'x(t) is a cosine and y(t) a sine: counterclockwise from (3, 0)'},
    line:{x:t=>-3+1.5*t,y:t=>2-t,T:4,eq:'x = −3 + 1.5t,  y = 2 − t,  0 ≤ t ≤ 4',bx:[-4,4],by:[-2.8,2.8],note:'both linear: the same step every second, along a straight line'},
    proj:{x:t=>18*t,y:t=>1+12*t-4.9*t*t,T:TP,eq:'x = 18t,  y = 1 + 12t − 4.9t²  (meters, seconds)',bx:[-2,48],by:[-1,10],note:'x(t) is linear (18 m every second), y(t) a downward parabola'},
    liss:{x:t=>3*Math.sin(t),y:t=>2*Math.sin(2*t),T:TAU,eq:'x = 3 sin t,  y = 2 sin(2t),  0 ≤ t ≤ 2π',bx:[-3.6,3.6],by:[-2.6,2.6],note:'y(t) goes up and down twice for each left-right trip: a figure-eight'},
    cyc:{x:t=>t-Math.sin(t),y:t=>1-Math.cos(t),T:4*Math.PI,eq:'x = t − sin t,  y = 1 − cos t,  0 ≤ t ≤ 4π',bx:[-.4,13],by:[-.3,2.4],note:'a pebble in a rolling tire (radius 1): it touches down at t = 0, 2π, 4π'}};
  let k='circ',t=1,play=false,lay=null;const tEl=$('#pa-t'),pb=$('#pa-play');
  const sim=sim2d(cv,{h:w=>w>=640?clamp(w*.5,320,440):clamp(w*1.55,540,700),draw(ctx,w,h){const L=lay=paLayout(w,h),p=PRE[k],xs=p.x(t),ys=p.y(t);
    const pad=(a,b)=>[a-(b-a)*.08,b+(b-a)*.08];
    const PX=gpanel(ctx,L.X,[0,p.T],pad(...p.bx),{xn:4,yn:3}),PY=gpanel(ctx,L.Y,[0,p.T],pad(...p.by),{xn:4,yn:3});
    label(ctx,'x(t)',L.X.x+6,L.X.y+11,T.ca,'left','middle',LABEL);label(ctx,'y(t)',L.Y.x+6,L.Y.y+11,T.cv,'left','middle',LABEL);
    label(ctx,'t',L.X.x+L.X.w-4,L.X.y+L.X.h-8,T.muted,'right','middle',MONO);label(ctx,'t',L.Y.x+L.Y.w-4,L.Y.y+L.Y.h-8,T.muted,'right','middle',MONO);
    [[PX,p.x,T.ca,xs],[PY,p.y,T.cv,ys]].forEach(([P,f,col,v])=>{curveD(ctx,P,f,0,p.T,alpha(col,.3),2,400);curveD(ctx,P,f,0,t,col,2.8,400);vline(ctx,P,t,T.ce);dot(ctx,P.X(t),P.Y(v),6,T.hot,T.surface);});
    const P=eqPanel(ctx,L.B,p.bx,p.by);
    pathD(ctx,P,p.x,p.y,0,p.T,alpha(T.cx,.28),2.2);pathD(ctx,P,p.x,p.y,0,t,T.cx,3);
    [.12,.37,.62,.87].forEach(f=>{const u=f*p.T,e=p.T*1e-3,a=Math.atan2(-(P.Y(p.y(u+e))-P.Y(p.y(u-e))),P.X(p.x(u+e))-P.X(p.x(u-e)));arrowHead(ctx,P.X(p.x(u)),P.Y(p.y(u)),-a,alpha(T.cx,.75));});
    line(ctx,P,xs,ys,xs,0,alpha(T.ca,.8),1.4,[4,3]);line(ctx,P,xs,ys,0,ys,alpha(T.cv,.8),1.4,[4,3]);dot(ctx,P.X(xs),P.Y(0),4,T.ca);dot(ctx,P.X(0),P.Y(ys),4,T.cv);
    dot(ctx,P.X(xs),P.Y(ys),7.5,T.hot,T.surface);},
    drag(kind,e){if(kind==='up'||!lay)return;const [px,py]=ptr(e,cv),L=lay,p=PRE[k],inB=(B,m=10)=>px>=B.x-m&&px<=B.x+B.w+m&&py>=B.y-m&&py<=B.y+B.h+m;stop();
      if(inB(L.X)||inB(L.Y)){const B=inB(L.X)?L.X:L.Y;t=clamp((px-B.x)/B.w*p.T,0,p.T);}
      else if(inB(L.B,0)){/* nearest point of the path to the pointer */const sx=L.B.w/(p.bx[1]-p.bx[0]),sy=L.B.h/(p.by[1]-p.by[0]),s=Math.min(sx,sy),cx=(p.bx[0]+p.bx[1])/2,cy=(p.by[0]+p.by[1])/2;
        const X=x=>L.B.x+L.B.w/2+(x-cx)*s,Y=y=>L.B.y+L.B.h/2-(y-cy)*s;let best=t,bd=1e9;for(let i=0;i<=800;i++){const u=p.T*i/800,d=Math.hypot(X(p.x(u))-px,Y(p.y(u))-py);if(d<bd){bd=d;best=u;}}t=best;}
      sync();}});
  function stop(){play=false;pb.textContent='Play';}
  const tl=v=>{const s=k==='circ'||k==='liss'||k==='cyc'?piText(v):'';return s.includes('π')?`${fmt(v,3)} (${s})`:fmt(v,3);};
  function sync(){tEl.value=t;const o=$('#pa-t-out');if(o)o.textContent=tl(t);upd();}
  function upd(){const p=PRE[k],h=p.T*1e-4,a=Math.max(0,t-h),b=Math.min(p.T,t+h),dx=(p.x(b)-p.x(a))/(b-a),dy=(p.y(b)-p.y(a))/(b-a);
    setHTML('pa-eq',p.eq);setText('pa-xy',`(${fmt(p.x(t),3)}, ${fmt(p.y(t),3)})`);
    setText('pa-dir',`${dirText(dx,dy,1e-3)}: x(t) ${Math.abs(dx)<1e-3?'level':dx>0?'increasing':'decreasing'}, y(t) ${Math.abs(dy)<1e-3?'level':dy>0?'increasing':'decreasing'}`);setText('pa-note',p.note);sim.render();}
  bindRange('pa-t',tl,v=>{t=v;upd();});
  segBind('pa-pre','k',kk=>{const f=t/PRE[k].T;k=kk;const p=PRE[k];tEl.max=p.T;tEl.step=p.T/1000;t=clamp(f*p.T,0,p.T);stop();sync();});
  pb.addEventListener('click',()=>{play=!play;if(play&&t>=PRE[k].T-1e-6)t=0;pb.textContent=play?'Pause':'Play';});
  ticker('param',dt=>{if(!play)return;const p=PRE[k];t+=dt*p.T/7;if(t>=p.T){t=p.T;stop();}sync();});
  tEl.max=TAU;tEl.step=TAU/1000;
  $('#pa-lab').addEventListener('labreset',()=>{stop();sim.render();});

  /* design x(t) and y(t): 7 draggable values each at t = 0, 1, ..., 6 */
  const N=7,PR2={line:()=>[[...Array(N)].map((_,i)=>i-3),[...Array(N)].map((_,i)=>2*i/3-2)],
    circ:()=>[[...Array(N)].map((_,i)=>+(3*Math.cos(i*Math.PI/3)).toFixed(2)),[...Array(N)].map((_,i)=>+(3*Math.sin(i*Math.PI/3)).toFixed(2))],
    stop:()=>{const X=[-3,-1,1,2,2,0,-3];return [X,X.map(x=>(x-1)/2)];},
    rand:()=>[0,0].map(()=>[...Array(N)].map(()=>Math.round((Math.random()*7-3.5)*4)/4))};
  let [XV,YV]=PR2.line(),t2=2,lay2=null,dr=null;const cv2=$('#pa-canvas2'),R=4.5;
  const xf=u=>crSpline(XV,u),yf=u=>crSpline(YV,u);
  const sim2=sim2d(cv2,{h:w=>w>=640?clamp(w*.5,320,440):clamp(w*1.55,540,700),draw(ctx,w,h){const L=lay2=paLayout(w,h);
    const PX=gpanel(ctx,L.X,[0,6],[-R,R],{xn:6,yn:4}),PY=gpanel(ctx,L.Y,[0,6],[-R,R],{xn:6,yn:4}),P=eqPanel(ctx,L.B,[-R,R],[-R,R]);lay2.P=[PX,PY,P];
    label(ctx,'x(t)',L.X.x+6,L.X.y+11,T.ca,'left','middle',LABEL);label(ctx,'y(t)',L.Y.x+6,L.Y.y+11,T.cv,'left','middle',LABEL);
    [[PX,xf,XV,T.ca],[PY,yf,YV,T.cv]].forEach(([Q,f,V,col])=>{curveD(ctx,Q,f,0,6,col,2.6,400);V.forEach((v,i)=>dot(ctx,Q.X(i),Q.Y(v),dr&&dr.i===i?8.5:6.5,col,T.surface));vline(ctx,Q,t2,T.ce);dot(ctx,Q.X(t2),Q.Y(f(t2)),5,T.hot);});
    pathD(ctx,P,xf,yf,0,6,T.cx,2.8,600);
    [1,3,5].forEach(i=>{const u=i+.5,e=1e-3,a=Math.atan2(-(P.Y(yf(u+e))-P.Y(yf(u-e))),P.X(xf(u+e))-P.X(xf(u-e)));if(Math.hypot(xf(u+e)-xf(u-e),yf(u+e)-yf(u-e))>1e-6)arrowHead(ctx,P.X(xf(u)),P.Y(yf(u)),-a,alpha(T.cx,.8));});
    XV.forEach((x,i)=>{dot(ctx,P.X(x),P.Y(YV[i]),5,T.cx,T.surface);label(ctx,`t=${i}`,P.X(x)+7,P.Y(YV[i])-9,T.muted,'left','middle','10px "IBM Plex Mono",monospace');});
    dot(ctx,P.X(xf(t2)),P.Y(yf(t2)),7.5,T.hot,T.surface);},
    drag(kind,e){if(!lay2||!lay2.P)return;if(kind==='up'){dr=null;sim2.render();return;}const [px,py]=ptr(e,cv2),L=lay2,[PX,PY,P]=L.P,inB=(B,m=12)=>px>=B.x-m&&px<=B.x+B.w+m&&py>=B.y-m&&py<=B.y+B.h+m;
      const val=(Q,y)=>clamp(Math.round((Q.yr[0]+(Q.box.y+Q.box.h-y)/Q.box.h*(Q.yr[1]-Q.yr[0]))*4)/4,-R+.25,R-.25);
      if(kind==='down'){dr=null;if(inB(L.X)||inB(L.Y)){const Q=inB(L.X)?PX:PY;dr={w:Q===PX?'x':'y',i:clamp(Math.round((px-Q.box.x)/Q.box.w*6),0,6)};}
        else{let bi=-1,bd=34;XV.forEach((x,i)=>{const d=Math.hypot(P.X(x)-px,P.Y(YV[i])-py);if(d<bd){bd=d;bi=i;}});if(bi>=0)dr={w:'xy',i:bi};}}
      if(!dr)return;if(dr.w==='x')XV[dr.i]=val(PX,py);else if(dr.w==='y')YV[dr.i]=val(PY,py);
      else{const [x,y]=inv(P,px,py);XV[dr.i]=clamp(Math.round(x*4)/4,-R+.25,R-.25);YV[dr.i]=clamp(Math.round(y*4)/4,-R+.25,R-.25);}upd2();}});
  function upd2(){const h=1e-4,a=Math.max(0,t2-h),b=Math.min(6,t2+h),dx=(xf(b)-xf(a))/(b-a),dy=(yf(b)-yf(a))/(b-a);
    setText('pa-xy2',`(${fmt(xf(t2),2)}, ${fmt(yf(t2),2)})`);setText('pa-mv',`${dirText(dx,dy,.02)} (x(t) ${Math.abs(dx)<.02?'level':dx>0?'rising':'falling'}, y(t) ${Math.abs(dy)<.02?'level':dy>0?'rising':'falling'})`);sim2.render();}
  bindRange('pa-t2',v=>fmt(v,2),v=>{t2=v;upd2();});
  segBind('pa-pre2','k',kk=>{[XV,YV]=PR2[kk]();upd2();});
  $('#pa-lab2').addEventListener('labreset',()=>{[XV,YV]=PR2.line();upd2();});
  drawers.param=()=>{sim.render();sim2.render();};
  KEYS['pa-canvas']=['Press Play, or drag along any of the three pictures. Dashed lines carry x and y from the path to the axes.',[['ca','x(t)'],['cv','y(t)'],['cx','the path'],['hot','the point at time t']]];
  KEYS['pa-canvas2']=['Drag the dots on x(t) or y(t) up and down, or drag a dot on the path to move both at once. The path follows.',[['ca','x(t)'],['cv','y(t)'],['cx','the path'],['hot','time t']]];
  TIPS['pa-t']=el=>{const p=PRE[k],u=+el.value;return `t = ${fmt(u,3)}: the point is at (${fmt(p.x(u),2)}, ${fmt(p.y(u),2)}).`;};
  TIPS['pa-pre:circ']='A circle of radius 3, once around counterclockwise.';TIPS['pa-pre:line']='A segment from (−3, 2) to (3, −2) at constant speed.';TIPS['pa-pre:proj']='The kicked ball from the worked example, in meters and seconds.';
  TIPS['pa-pre:liss']='A Lissajous figure: two sine waves at different speeds.';TIPS['pa-pre:cyc']='A cycloid: the path of a point on the rim of a rolling wheel.';
  TIPS['pa-t2']=el=>`t = ${fmt(+el.value,2)}: read x(t) and y(t) on the left; the orange point on the path is (x(t), y(t)).`;
  TIPS['pa-pre2:stop']='Both graphs flatten together, then reverse: the point stops and comes back along the same line.';
  GLOSS['parameter']='An extra variable (often time t) that both coordinates depend on.';
  GLOSS['parametric function']='A function that gives a point (x(t), y(t)) for each value of the parameter t.';
  TT.param='Act it out: one student calls the time, one walks the x-coordinate along a line, one the y-coordinate; a third traces the path on the floor.';
  GLYPH.param='<path d="M3 18 C6 6, 12 4, 15 10 S20 18, 21 8" fill="none" stroke="var(--cx)" stroke-width="2"/><path d="M15 10 l3 -1.5 l-0.6 3.2 z" fill="var(--hot)"/>';
})();

(function(){
  PROBS.push({id:'pa-point',topic:'param',title:'Find the point',gen(){const a=pick([-4,-3,-2,-1,1,2,3,5]),b=pick([2,3,-2,4]),c=ri(-3,3),d=pick([1,2,-1]),X=a+b*ri(1,4);const ans=c+d*Math.pow((X-a)/b,2);
    const yt=c?`${nz(c)}${d<0?' − ':' + '}${Math.abs(d)===1?'':Math.abs(d)}t²`:`${d===1?'':d===-1?'−':nz(d)}t²`;
    return {q:`A particle moves with x(t) = ${nz(a)}${sgn(b)}t and y(t) = ${yt}. Find y when x = ${nz(X)}.`,ans,unit:'',abs:.001,chk:(()=>{const t=solve(u=>a+b*u-X,-20,20);return c+d*t*t;})(),
      hint:'Find t from the x equation first, then put that t into y(t).',sol:`${nz(a)}${sgn(b)}t = ${nz(X)} gives t = ${nz((X-a)/b)}. Then y = ${c?nz(c)+sgn(d):d===1?'':d===-1?'−':nz(d)}(${nz((X-a)/b)})² = <b>${nz(ans)}</b>.`};}});
  PROBS.push({id:'pa-elim',topic:'param',title:'Eliminate the parameter',gen(){const a=pick([2,3]),b=pick([1,-1,2]),c=pick([1,3,-2]);
    const right=`y = ((x ${b<0?'+':'−'} ${Math.abs(b)})/${a})² ${c<0?'−':'+'} ${Math.abs(c)}`;
    const {choices,ans}=mcq(right,[`y = (${a}x ${b<0?'−':'+'} ${Math.abs(b)})² ${c<0?'−':'+'} ${Math.abs(c)}`,`y = ((x ${b<0?'−':'+'} ${Math.abs(b)})/${a})² ${c<0?'−':'+'} ${Math.abs(c)}`,`y = (x ${b<0?'+':'−'} ${Math.abs(b)})/${a} ${c<0?'−':'+'} ${Math.abs(c)}`]);
    return {q:`Eliminate the parameter: x = ${a}t ${b<0?'−':'+'} ${Math.abs(b)}, y = t² ${c<0?'−':'+'} ${Math.abs(c)}.`,choices,ans,hint:'Solve the x equation for t, then substitute.',
      sol:`t = (x ${b<0?'+':'−'} ${Math.abs(b)})/${a}, so <b>${right}</b>.`};}});
  PROBS.push({id:'pa-maxh',topic:'param',title:'Highest point of a launch',gen(){const v=pick([8,10,12,15,18]),u=pick([9,12,14,16,20]),h0=pick([0,1,1.5,2]),ans=h0+u*u/(2*9.8);
    return {q:`A ball moves with x(t) = ${v}t and y(t) = ${h0?h0+' + ':''}${u}t − 4.9t² (meters, seconds). Find its greatest height, to two decimals.`,ans,unit:'m',abs:.01,chk:(()=>{const y=t=>h0+u*t-4.9*t*t;return y(argmax(y,0,10));})(),
      hint:'y(t) is a quadratic opening down: its vertex is at t = −b/(2a).',sol:`t = ${u}/9.8 ≈ ${fmt(u/9.8,3)} s. y = ${h0?h0+' + ':''}${u}²/19.6 ≈ <b>${fmt(ans,2)} m</b>. (x(t) does not matter for the height.)`};}});
  PROBS.push({id:'pa-lap',topic:'param',title:'Time for one revolution',gen(){const r=ri(2,6),[w,wt]=pick([[Math.PI/3,'π/3'],[Math.PI/6,'π/6'],[Math.PI/4,'π/4'],[2,'2'],[Math.PI/10,'π/10']]),ans=TAU/w;
    return {q:`A point moves with x(t) = ${r} cos(${wt} t), y(t) = ${r} sin(${wt} t), t in seconds. How long does one full trip around the circle take?`,ans,unit:'s',abs:.005,chk:roots(t=>Math.sin(w*t),.01,ans*1.5,3000).find(t=>t>Math.PI/w+.01),
      hint:'One trip is when the inside of cos and sin has grown by 2π.',sol:`${wt} · t = 2π gives t = 2π ÷ ${wt} = <b>${fmt(ans,3)} s</b>.`};}});
})();
