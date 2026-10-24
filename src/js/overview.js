
/* ---------------- Overview: spin the unit circle, draw a polar rose, unroll a sinusoid ---------------- */
(function hero(){
  const cv=$('#hero-canvas'),seg=$('#hero-fn'),cap=$('#hero-cap');if(!cv)return;
  const MODES=[['circle','Unit circle','Drag the point around the circle. Its height is sin θ (blue) and its width is cos θ (magenta).'],
    ['rose','Polar rose','r = 2 cos(3θ). Drag around the circle to set θ: the orange ray has length r, and the curve draws itself up to that angle.'],
    ['wave','Sinusoid','The same height, unrolled: as θ grows, sin θ traces a wave with period 2π.'],
    ['expo','Exponential','y = 2ˣ multiplies by 2 for every step of 1. Drag along the curve to see the factor stay the same.']];
  let cur=0,th=2*Math.PI/3,x0=1;
  seg.innerHTML=MODES.map(([k,l],i)=>`<button type="button" data-k="${i}" aria-pressed="${i===0}">${l}</button>`).join('');
  const say=()=>{cap.textContent=MODES[cur][2];};say();
  const R=(t)=>2*Math.cos(3*t);
  let P=null;
  const sim=sim2d(cv,{h:w=>clamp(w*.78,250,350),draw(ctx,w,h){
    if(cur===0||cur===1){const s=cur===0?1.25:2.3,asp=(w-48)/(h-34);P=gpanel(ctx,{x:34,y:12,w:w-48,h:h-34},[-s*asp,s*asp],[-s,s],{xn:6,yn:4});
      if(cur===0){ctx.save();ctx.strokeStyle=T.muted;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),P.X(1)-P.X(0),0,7);ctx.stroke();ctx.restore();
        const c=Math.cos(th),sn=Math.sin(th);line(ctx,P,0,0,c,sn,T.ink,2);line(ctx,P,c,0,c,sn,T.cx,3.5);line(ctx,P,0,0,c,0,T.ca,3.5);
        ctx.save();ctx.strokeStyle=T.ce;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(P.X(0),P.Y(0),(P.X(1)-P.X(0))*.22,0,-((th%(2*Math.PI))+2*Math.PI)%(2*Math.PI),true);ctx.stroke();ctx.restore();
        dot(ctx,P.X(c),P.Y(sn),7,T.hot,T.surface);
        label(ctx,`θ = ${fmt(th*180/Math.PI,0)}°`,P.box.x+10,P.box.y+14,T.ce,'left','middle','600 14px "IBM Plex Mono",monospace');
        label(ctx,`sin θ = ${fmt(sn,3)}`,P.box.x+10,P.box.y+34,T.cx,'left','middle',MONO);label(ctx,`cos θ = ${fmt(c,3)}`,P.box.x+10,P.box.y+50,T.ca,'left','middle',MONO);}
      else{ctx.save();clip(ctx,P);ctx.strokeStyle=alpha(T.cx,.18);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=400;i++){const t=i/400*Math.PI,r=R(t);i?ctx.lineTo(P.X(r*Math.cos(t)),P.Y(r*Math.sin(t))):ctx.moveTo(P.X(r*Math.cos(t)),P.Y(r*Math.sin(t)));}ctx.stroke();
        ctx.strokeStyle=T.cx;ctx.lineWidth=2.8;ctx.beginPath();const tt=th%Math.PI;for(let i=0;i<=300;i++){const t=tt*i/300,r=R(t);i?ctx.lineTo(P.X(r*Math.cos(t)),P.Y(r*Math.sin(t))):ctx.moveTo(P.X(r*Math.cos(t)),P.Y(r*Math.sin(t)));}ctx.stroke();ctx.restore();
        const r=R(tt);line(ctx,P,0,0,2.2*Math.cos(tt),2.2*Math.sin(tt),T.ce,1.2,[4,4]);line(ctx,P,0,0,r*Math.cos(tt),r*Math.sin(tt),T.hot,3);dot(ctx,P.X(r*Math.cos(tt)),P.Y(r*Math.sin(tt)),7,T.hot,T.surface);
        label(ctx,`θ = ${fmt(tt*180/Math.PI,0)}°`,P.box.x+10,P.box.y+14,T.ce,'left','middle','600 14px "IBM Plex Mono",monospace');label(ctx,`r = ${fmt(r,2)}`+(r<0?'  (r < 0: plotted on the opposite ray)':''),P.box.x+10,P.box.y+34,T.hot,'left','middle',MONO);}}
    else if(cur===2){P=gpanel(ctx,{x:34,y:12,w:w-48,h:h-34},[0,2*Math.PI],[-1.4,1.4],{xn:4,yn:4,xt:false});curveD(ctx,P,Math.sin,0,2*Math.PI,alpha(T.cx,.25),2.2);curveD(ctx,P,Math.sin,0,th%(2*Math.PI),T.cx,3);
      vline(ctx,P,th%(2*Math.PI),T.hot);dot(ctx,P.X(th%(2*Math.PI)),P.Y(Math.sin(th)),7,T.hot,T.surface);hline(ctx,P,0,T.ce);
      label(ctx,`θ = ${fmt((th%(2*Math.PI))/Math.PI,2)}π   sin θ = ${fmt(Math.sin(th),3)}`,P.box.x+10,P.box.y+14,T.cx,'left','middle','600 13px "IBM Plex Mono",monospace');}
    else{P=gpanel(ctx,{x:34,y:12,w:w-48,h:h-34},[-2,4],[-1,17],{xn:6,yn:4});const f=x=>Math.pow(2,x);curveD(ctx,P,f,-2,4,T.cx,2.8);
      const a=Math.floor(x0*100)/100;line(ctx,P,a,f(a),a+1,f(a),T.ce,1.6,[4,4]);line(ctx,P,a+1,f(a),a+1,f(a+1),T.hot,3);dot(ctx,P.X(a),P.Y(f(a)),6,T.hot,T.surface);dot(ctx,P.X(a+1),P.Y(f(a+1)),6,T.hot,T.surface);
      label(ctx,`f(${fmt(a,2)}) = ${fmt(f(a),2)}  →  f(${fmt(a+1,2)}) = ${fmt(f(a+1),2)}`,P.box.x+10,P.box.y+14,T.hot,'left','middle','600 13px "IBM Plex Mono",monospace');label(ctx,'ratio = 2 every time',P.box.x+10,P.box.y+34,T.muted,'left','middle',MONO);}},
    drag(kind,e){if(kind==='up'||!P)return;const [px,py]=ptr(e,cv),[x,y]=inv(P,px,py);
      if(cur===0||cur===1){let a=Math.atan2(y,x);if(a<0)a+=2*Math.PI;th=a;}else if(cur===2)th=clamp(x,0,2*Math.PI-1e-3);else x0=clamp(x,-2,2.9);sim.render();}});
  if(!REDUCE){let last=0;const spin=ts=>{if(current==='overview'&&!document.hidden&&last&&!spin.held){th+=(ts-last)/1000*.5;sim.render();}last=ts;requestAnimationFrame(spin);};
    cv.addEventListener('pointerdown',()=>spin.held=true);requestAnimationFrame(spin);}
  segBind('hero-fn','k',k=>{cur=+k;say();sim.render();});
  drawers.overview=()=>sim.render();
})();

function renderMods(){const solved=store('prec-solved')||{};const cnt={};let k=0;PROBS.forEach(p=>{const c=cnt[p.topic]=cnt[p.topic]||[0,0];c[1]++;if(solved[p.id])c[0]++;});
  $('#modgrid').innerHTML=ROADMAP.map(g=>`<div class="modgroup${g.bc?' bc':''}"><div class="eyebrow">${g.w}${g.bc?' <span class="bcbadge">not on exam</span>':''}</div><h3 class="gtitle">${g.name}</h3><div class="modgrid-inner">${g.ids.map(id=>{const m=MODS[id],c=cnt[id]||[0,0];
    return `<a class="mod" href="#${id}" style="--i:${Math.min(k++,14)}">${GLYPH[id]?`<span class="glyph" aria-hidden="true"><svg viewBox="0 0 24 24">${GLYPH[id]}</svg></span>`:''}<h3>${m.t}</h3><p>${m.d}</p><div class="row"><span class="tag ${apTag(id)}">${m.ap}</span><span class="prog">${c[1]?`${c[0]}/${c[1]} solved`:''}</span></div></a>`;}).join('')}${g.soon.map(id=>{const m=MODS[id];
    return `<div class="mod soon" aria-disabled="true"><h3>${m.t}</h3><p>${m.d}</p><div class="row"><span class="tag na">Coming soon</span></div></div>`;}).join('')}</div></div>`).join('');}
(function ovStatic(){
  const first=GROUPS.length?GROUPS[0].ids[0]:null,st=$('#ov-start');if(first&&st){st.href='#'+first;st.textContent='Start with '+MODS[first].t;}
  $('#ov-map').innerHTML=ROADMAP.map(g=>`<tr${g.bc?' class="bc"':''}><td>${g.w.replace('Unit ','')}</td><td>${g.name}</td><td>${g.ids.map(id=>`<a href="#${id}">${MODS[id].t}</a>`).concat(g.soon.map(id=>`<span class="small">${MODS[id].t} (soon)</span>`)).join(', ')}</td></tr>`).join('');
})();

/* ---------------- Side menu: one link per module, grouped by unit, then the review pages ---------------- */
(function buildNav(){let nh='<a href="#overview" data-view="overview">Overview</a>',sh='<option value="overview">Overview</option>';
  let bcStart=false;
  GROUPS.forEach(g=>{const lab=g.w==='Optional'||g.w==='BC'?g.name:`${g.w} · ${g.name}`;
    if(g.bc&&!bcStart){bcStart=true;nh+='<div class="bcdiv bc">Not on the AP exam</div>';sh+='<option disabled class="bc">── Not on the AP exam ──</option>';}
    nh+=`<div class="grp${g.bc?' bc':''}">${lab}</div>`;sh+=`<optgroup label="${lab}"${g.bc?' class="bc"':''}>`;
    g.ids.forEach(id=>{nh+=`<a href="#${id}" data-view="${id}"${g.bc?' class="bc"':''}>${MODS[id].t}</a>`;sh+=`<option value="${id}">${MODS[id].t}</option>`;});sh+='</optgroup>';});
  const REV=[['practice','Practice set'],['methods','Which tool?'],['exam','Exam review'],['review','Review my mistakes'],['frq','FRQ practice']];
  nh+='<div class="grp">Review</div>'+REV.map(([v,t])=>`<a href="#${v}" data-view="${v}">${t}</a>`).join('');
  sh+='<optgroup label="Review">'+REV.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')+'</optgroup>';
  $('#nav').innerHTML=nh;const sel=$('#navsel');sel.innerHTML=sh;sel.addEventListener('change',()=>{location.hash=sel.value;});})();
