/* ---------------- 4.10, 4.11, 4.14 Matrices ---------------- */
(function matrices(){
  const cv=$('#mx-canvas');if(!cv)return;
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  const pn=v=>v<0?`(${sg(v)})`:sg(v);
  const f3=v=>fmt(v,3).replace(/\.?0+$/,'').replace('-','−');
  const get=ids=>ids.map(i=>+$('#'+i).value);
  const A=()=>{const v=get(['mx-a1','mx-a2','mx-a3','mx-a4']);return [[v[0],v[1]],[v[2],v[3]]];};
  const B=()=>{const v=get(['mx-b1','mx-b2','mx-b3','mx-b4']);return [[v[0],v[1]],[v[2],v[3]]];};
  const mul=(X,Y)=>[[X[0][0]*Y[0][0]+X[0][1]*Y[1][0],X[0][0]*Y[0][1]+X[0][1]*Y[1][1]],[X[1][0]*Y[0][0]+X[1][1]*Y[1][0],X[1][0]*Y[0][1]+X[1][1]*Y[1][1]]];
  const det=M=>M[0][0]*M[1][1]-M[0][1]*M[1][0];
  const txt=M=>`⟨${sg(M[0][0])} ${sg(M[0][1])}; ${sg(M[1][0])} ${sg(M[1][1])}⟩`;
  let cell='c11',ord='AB';
  const sim=sim2d(cv,{h:w=>clamp(w*.36,210,270),draw(ctx,w,h){const a=A(),b=B(),X=ord==='AB'?a:b,Y=ord==='AB'?b:a,C=mul(X,Y),i=+cell[1]-1,j=+cell[2]-1;
    const cs=Math.min(56,w/9.5),gap=cs*.95,tot=6*cs+2*gap,x0=(w-tot)/2,y0=(h-2*cs)/2-6,xs=[x0,x0+2*cs+gap,x0+4*cs+2*gap];
    const names=ord==='AB'?['A','B','A·B']:['B','A','B·A'],cols=[T.cx,T.cv,T.ca];
    const mat=(x,M,ci,hr,hc,hcell)=>{ctx.save();
      if(hr!=null){ctx.fillStyle=alpha(T.hot,.22);ctx.fillRect(x-3,y0+hr*cs+2,2*cs+6,cs-4);}
      if(hc!=null){ctx.fillStyle=alpha(T.ca,.18);ctx.fillRect(x+hc*cs+2,y0-3,cs-4,2*cs+6);}
      if(hcell){ctx.fillStyle=alpha(T.ce,.45);ctx.fillRect(x+hcell[1]*cs+2,y0+hcell[0]*cs+2,cs-4,cs-4);}
      ctx.strokeStyle=T.ink;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x-2,y0-4);ctx.lineTo(x-9,y0-4);ctx.lineTo(x-9,y0+2*cs+4);ctx.lineTo(x-2,y0+2*cs+4);ctx.moveTo(x+2*cs+2,y0-4);ctx.lineTo(x+2*cs+9,y0-4);ctx.lineTo(x+2*cs+9,y0+2*cs+4);ctx.lineTo(x+2*cs+2,y0+2*cs+4);ctx.stroke();ctx.restore();
      M.forEach((r,ri)=>r.forEach((v,cj)=>label(ctx,sg(v),x+cj*cs+cs/2,y0+ri*cs+cs/2,ci,'center','middle','700 '+Math.round(cs*.36)+'px "IBM Plex Mono",monospace')));
      label(ctx,names[ci===T.cx?0:ci===T.cv?1:2],x+cs,y0-16,ci,'center','middle',MONO);};
    mat(xs[0],X,T.cx,i,null,null);mat(xs[1],Y,T.cv,null,j,null);mat(xs[2],C,T.ca,null,null,[i,j]);
    label(ctx,'×',x0+2*cs+gap/2,y0+cs,T.muted,'center','middle','700 20px sans-serif');label(ctx,'=',x0+4*cs+gap*1.5,y0+cs,T.muted,'center','middle','700 20px sans-serif');}});
  function upd(){const a=A(),b=B(),X=ord==='AB'?a:b,Y=ord==='AB'?b:a,C=mul(X,Y),i=+cell[1]-1,j=+cell[2]-1,r=X[i],c=[Y[0][j],Y[1][j]];
    setText('mx-dot',`row ${i+1} · column ${j+1} = (${sg(r[0])}, ${sg(r[1])}) · (${sg(c[0])}, ${sg(c[1])}) = ${pn(r[0])}·${pn(c[0])} + ${pn(r[1])}·${pn(c[1])} = ${sg(C[i][j])}`);
    const ab=mul(a,b),ba=mul(b,a),same=ab.every((rw,ri)=>rw.every((v,cj)=>v===ba[ri][cj]));
    setText('mx-cmp',`AB = ${txt(ab)}, BA = ${txt(ba)}: ${same?'equal this time':'not equal'}`);
    setText('mx-det',`det A = ${sg(det(a))}, det B = ${sg(det(b))}, det(AB) = ${sg(det(ab))} = ${sg(det(a)*det(b))}`);sim.render();}
  ['a1','a2','a3','a4','b1','b2','b3','b4'].forEach(k=>bindRange('mx-'+k,sg,()=>upd()));
  segBind('mx-cell','k',k=>{cell=k;upd();});segBind('mx-ord','k',k=>{ord=k;upd();});

  /* solve with the inverse */
  let p=3,q=2,r=1,s=1,e=8,f=3;
  const view=(w,h)=>{const k=(w-60)/(h-36);return {xr:[-8*k,8*k],yr:[-8,8],xn:8,yn:8};};
  const eqLine=(ctx,P,a,b,c,col)=>{if(Math.abs(b)>1e-9)line(ctx,P,-40,(c+40*a)/b,40,(c-40*a)/b,col,3);else if(Math.abs(a)>1e-9)line(ctx,P,c/a,-40,c/a,40,col,3);};
  const sim2=glab('mx-canvas2',{h:w=>clamp(w*.56,300,420),view,draw(ctx,P){const d=p*s-q*r;eqLine(ctx,P,p,q,e,T.cx);eqLine(ctx,P,r,s,f,T.cv);
    if(Math.abs(d)>1e-9){const x=(e*s-q*f)/d,y=(p*f-e*r)/d;dot(ctx,P.X(x),P.Y(y),7,T.hot,T.surface);label(ctx,`(${f3(x)}, ${f3(y)})`,P.X(x)+10,P.Y(y)-12,T.hot,'left','middle',MONO);}
    label(ctx,'blue: line 1   green: line 2',P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd2(){const d=p*s-q*r;setText('mx-ad',`${p}·${s} − ${q}·${r} = ${sg(d)}`);
    if(Math.abs(d)>1e-9){const x=(e*s-q*f)/d,y=(p*f-e*r)/d;setText('mx-inv',`(1/${sg(d)})⟨${sg(s)} ${sg(-q)}; ${sg(-r)} ${sg(p)}⟩ = ⟨${f3(s/d)} ${f3(-q/d)}; ${f3(-r/d)} ${f3(p/d)}⟩`);setText('mx-sol',`X = ⟨${f3(x)}, ${f3(y)}⟩: x = ${f3(x)}, y = ${f3(y)}`);}
    else{setText('mx-inv','no inverse (det A = 0)');setText('mx-sol',(p*f-r*e===0&&q*f-s*e===0)?'infinitely many solutions (the lines are the same)':'no solution (the lines are parallel)');}sim2.render();}
  bindRange('mx-p',sg,v=>{p=v;upd2();});bindRange('mx-q',sg,v=>{q=v;upd2();});bindRange('mx-r',sg,v=>{r=v;upd2();});bindRange('mx-s',sg,v=>{s=v;upd2();});bindRange('mx-e',sg,v=>{e=v;upd2();});bindRange('mx-f',sg,v=>{f=v;upd2();});
  drawers.matrices=()=>{sim.render();sim2.render();};
  KEYS['mx-canvas']=['Blue: the left matrix, green: the right matrix, magenta: the product. The orange band is the row used, the magenta band the column, and the gold cell the result entry.',[['cx','left matrix'],['cv','right matrix'],['ca','product']]];
  KEYS['mx-canvas2']=['Blue: line 1, ax + by = e. Green: line 2, cx + dy = f. The orange dot is the solution: where both equations hold.',[['cx','line 1'],['cv','line 2'],['hot','solution']]];
  TIPS['mx-ord:BA']='Swap the order and compare: matrix multiplication is usually not commutative.';
  GLOSS['determinant']='For a 2 × 2 matrix ⟨a b; c d⟩ it is ad − bc. If it is 0 the matrix has no inverse.';
  GLOSS['matrix']='A rectangular array of numbers. Matrices of the right sizes can be added and multiplied.';
  TT.matrices='Have students compute AB and BA by hand for one pair first. Then connect det A = 0 to parallel lines.';
  GLYPH.matrices='<path d="M7 4H4v16h3M17 4h3v16h-3" stroke="var(--cx)" stroke-width="2" fill="none"/><circle cx="9.5" cy="9" r="1.5" fill="var(--cv)"/><circle cx="14.5" cy="9" r="1.5" fill="var(--cv)"/><circle cx="9.5" cy="15" r="1.5" fill="var(--cv)"/><circle cx="14.5" cy="15" r="1.5" fill="var(--cv)"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−');
  const MT=(a,b,c,d)=>`⟨${sg(a)} ${sg(b)}; ${sg(c)} ${sg(d)}⟩`;
  const nz=()=>{let v=0;while(!v)v=ri(-5,5);return v;};
  PROBS.push({id:'mx-det',topic:'matrices',title:'Determinant',gen(){const a=ri(-6,6),b=ri(-6,6),c=ri(-6,6),d=ri(-6,6),ans=a*d-b*c;
    return {q:`Find the determinant of ${MT(a,b,c,d)} (rows separated by a semicolon).`,ans,unit:'',abs:.01,chk:Math.round(a*d)-Math.round(b*c),show:String(ans),hint:'det ⟨a b; c d⟩ = ad − bc.',sol:`(${sg(a)})(${sg(d)}) − (${sg(b)})(${sg(c)}) = ${sg(a*d)} − (${sg(b*c)}) = <b>${sg(ans)}</b>.${ans===0?' It is 0, so this matrix has no inverse.':''}`};}});
  PROBS.push({id:'mx-prod',topic:'matrices',title:'An entry of a product',gen(){const a=ri(-4,4),b=ri(-4,4),c=ri(-4,4),d=ri(-4,4),e=ri(-4,4),f=ri(-4,4),g=ri(-4,4),h=ri(-4,4),i=pick([1,2]),j=pick([1,2]),X=[[a,b],[c,d]],Y=[[e,f],[g,h]],ans=X[i-1][0]*Y[0][j-1]+X[i-1][1]*Y[1][j-1];
    let chk=0;for(let k=0;k<2;k++)chk+=X[i-1][k]*Y[k][j-1];
    return {q:`Let A = ${MT(a,b,c,d)} and B = ${MT(e,f,g,h)}. Find the entry in row ${i}, column ${j} of AB.`,ans,unit:'',abs:.01,chk,show:String(ans),hint:'Take row '+i+' of A and column '+j+' of B and add the products of matching entries.',sol:`(${sg(X[i-1][0])})(${sg(Y[0][j-1])}) + (${sg(X[i-1][1])})(${sg(Y[1][j-1])}) = <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'mx-inv',topic:'matrices',title:'An entry of the inverse',gen(){let a,b,c,d,dt;do{a=ri(-5,5);b=ri(-5,5);c=ri(-5,5);d=ri(-5,5);dt=a*d-b*c;}while(dt===0);const ans=d/dt;
    let x;if(a!==0){const m=c/a,yy=-m/(d-m*b);x=(1-b*yy)/a;}else x=-d/(b*c);
    return {q:`Find the entry in row 1, column 1 of the inverse of ${MT(a,b,c,d)}. Round to 3 decimal places.`,ans,unit:'',abs:.0015,chk:x,show:ans.toFixed(3),hint:'A⁻¹ = (1/det)⟨d −b; −c a⟩. The (1, 1) entry is d/det.',sol:`det = ${sg(a)}·${sg(d)} − ${sg(b)}·${sg(c)} = ${sg(dt)}, so the entry is d/det = ${sg(d)}/${sg(dt)} ≈ <b>${ans.toFixed(3)}</b>.`};}});
  PROBS.push({id:'mx-sys',topic:'matrices',title:'Solve a system with matrices',gen(){let a,b,c,d,dt,x=ri(-5,5),y=ri(-5,5);do{a=nz();b=nz();c=nz();d=nz();dt=a*d-b*c;}while(dt===0);const e=a*x+b*y,f=c*x+d*y;
    let m=[[a,b,e],[c,d,f]];const k=m[1][0]/m[0][0];m[1]=m[1].map((v,i)=>v-k*m[0][i]);const y2=m[1][2]/m[1][1],x2=(m[0][2]-m[0][1]*y2)/m[0][0];
    return {q:`Solve ${sg(a)}x + ${sg(b)}y = ${sg(e)} and ${sg(c)}x + ${sg(d)}y = ${sg(f)}. Find x.`,ans:x,unit:'',abs:.01,chk:x2,show:String(x),hint:'Write AX = B and use X = A⁻¹B, or eliminate y.',sol:`det A = ${sg(dt)}, A⁻¹ = (1/${sg(dt)})${MT(d,-b,-c,a)}. Then x = (${sg(d)}·${sg(e)} + ${sg(-b)}·${sg(f)})/${sg(dt)} = <b>${sg(x)}</b> and y = ${sg(y)}.`};}});
  PROBS.push({id:'mx-size',topic:'matrices',title:'Size of a product',gen(){const m=ri(1,4),n=ri(1,4),q=ri(1,4),defd=Math.random()<.5;let n2=n;if(!defd){do{n2=ri(1,4);}while(n2===n);}const right=defd?`${m} × ${q}`:'not defined',{choices,ans}=mcq(right,[`${m} × ${q}`,`${n} × ${n2}`,`${m} × ${n}`,'not defined',`${q} × ${m}`].filter(v=>v!==right),4);
    return {q:`A is ${m} × ${n} and B is ${n2} × ${q}. What is the size of AB?`,choices,ans,hint:'AB is defined only if the number of columns of A equals the number of rows of B. Then the size is (rows of A) × (columns of B).',sol:n===n2?`Inner numbers match (${n}), so AB is <b>${m} × ${q}</b>.`:`A has ${n} columns but B has ${n2} rows: they do not match, so <b>AB is not defined</b>.`};}});
  PROBS.push({id:'mx-trans',topic:'matrices',title:'Next month in a transition model',gen(){const pa=pick([.7,.8,.9,.6]),pb=pick([.1,.2,.3,.4]),s=pick([30,40,50,60,70,80]),ans=pa*s+pb*(100-s);
    const T=[[pa,pb],[1-pa,1-pb]],X=[s,100-s];const chk=T[0][0]*X[0]+T[0][1]*X[1];
    return {q:`Each month ${Math.round(pa*100)}% of brand A's customers stay with A, and ${Math.round(pb*100)}% of brand B's customers switch to A. Now ${s}% use A and ${100-s}% use B. What percent use A next month? Round to 1 decimal place.`,ans,unit:'%',abs:.06,chk,show:ans.toFixed(1),hint:'Multiply the transition matrix by the current shares: the top entry is (A stays)·(share A) + (B to A)·(share B).',sol:`${pa}·${s} + ${pb}·${100-s} = ${(pa*s).toFixed(1)} + ${(pb*(100-s)).toFixed(1)} = <b>${ans.toFixed(1)}%</b>.`};}});
})();
