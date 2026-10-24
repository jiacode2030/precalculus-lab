/* ---------------- 2.7 Composition of functions ---------------- */
(function compose(){
  const cv=$('#cp-canvas');if(!cv)return;
  const G={lin:x=>2*x+1,sq:x=>x*x,sh:x=>x-3},F={rt:u=>u>=0?Math.sqrt(u):NaN,inv:u=>u!==0?1/u:NaN,tri:u=>3*u-2};
  const GN={lin:'2x + 1',sq:'x²',sh:'x − 3'},FN={rt:'√x',inv:'1/x',tri:'3x − 2'};
  const DOM={fg:{rt:{lin:'x ≥ −1/2',sq:'all real numbers',sh:'x ≥ 3'},inv:{lin:'x ≠ −1/2',sq:'x ≠ 0',sh:'x ≠ 3'},tri:{lin:'all real numbers',sq:'all real numbers',sh:'all real numbers'}},
    gf:{rt:'x ≥ 0',inv:'x ≠ 0',tri:'all real numbers'}};
  let gk='lin',fk='rt',ord='fg',x=2;
  const comp=(t,o=ord)=>o==='fg'?F[fk](G[gk](t)):G[gk](F[fk](t));
  const f2=v=>isFinite(v)?fmt(v,2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1'):'no value';
  const sim=glab('cp-canvas',{h:w=>clamp(w*.5,290,400),view:()=>({xr:[-6,6],yr:[-6,6],xn:6,yn:4}),draw(ctx,P){
    curveD(ctx,P,G[gk],-6,6,alpha(T.cv,.85),2.2,500);curveD(ctx,P,F[fk],-6,6,alpha(T.ca,.85),2.2,500);curveD(ctx,P,t=>comp(t),-6,6,T.cx,3.6,900);
    const inner=ord==='fg'?G[gk](x):F[fk](x),c=comp(x);
    if(isFinite(inner)){dot(ctx,P.X(x),P.Y(inner),5,ord==='fg'?T.cv:T.ca,T.surface);line(ctx,P,x,0,x,inner,alpha(T.hot,.55),1.3,[4,3]);}
    if(isFinite(c)){dot(ctx,P.X(x),P.Y(c),6.5,T.hot,T.surface);line(ctx,P,x,inner,x,c,alpha(T.hot,.55),1.3,[4,3]);}
    label(ctx,`blue: ${ord==='fg'?'f(g(x))':'g(f(x))'}   green: g   magenta: f`,P.box.x+8,P.box.y+12,T.muted,'left','middle',MONO);}});
  function upd(){const inner=ord==='fg'?G[gk](x):F[fk](x),c=comp(x);
    setText('cp-step',ord==='fg'?`g(${f2(x)}) = ${f2(inner)}, then f(${f2(inner)}) = ${f2(c)}`:`f(${f2(x)}) = ${f2(inner)}, then g(${f2(inner)}) = ${f2(c)}`);
    setText('cp-dom',ord==='fg'?DOM.fg[fk][gk]:DOM.gf[fk]);setText('cp-both',`f(g(x)) = ${f2(comp(x,'fg'))};  g(f(x)) = ${f2(comp(x,'gf'))}`);sim.render();}
  bindRange('cp-x',f2,v=>{x=v;upd();});segBind('cp-g','k',k=>{gk=k;upd();});segBind('cp-f','k',k=>{fk=k;upd();});segBind('cp-ord','k',k=>{ord=k;upd();});

  /* tables */
  const gt={1:3,2:1,3:4,4:2,5:5},ft={1:6,2:-1,3:0,4:7,5:2};let t0=2;
  const sim2=sim2d($('#cp-canvas2'),{h:w=>clamp(w*.42,250,300),draw(ctx,w,h){const cw=Math.min(76,(w-110)/5),x0=90,rows=[h*.14,h*.3,h*.58,h*.74];
    const cell=(i,y,txt,on,c)=>{const X=x0+cw*i;ctx.fillStyle=on?alpha(c,.22):alpha(T.muted,.07);ctx.fillRect(X-cw/2+2,y-14,cw-4,28);ctx.strokeStyle=on?c:T.line;ctx.lineWidth=on?2:1;ctx.strokeRect(X-cw/2+2,y-14,cw-4,28);label(ctx,txt,X,y,on?T.ink:T.muted,'center','middle','600 14px "IBM Plex Mono",monospace');};
    label(ctx,'x',x0-cw*.75,rows[0],T.muted,'right','middle',MONO);label(ctx,'g(x)',x0-cw*.75,rows[1],T.cv,'right','middle',MONO);label(ctx,'x',x0-cw*.75,rows[2],T.muted,'right','middle',MONO);label(ctx,'f(x)',x0-cw*.75,rows[3],T.ca,'right','middle',MONO);
    for(let i=1;i<=5;i++){const gv=gt[t0];cell(i-1,rows[0],String(i),i===t0,T.hot);cell(i-1,rows[1],String(gt[i]),i===t0,T.cv);cell(i-1,rows[2],String(i),i===gv,T.hot);cell(i-1,rows[3],String(ft[i]).replace('-','−'),i===gv,T.ca);}
    const gv=gt[t0];arrow(ctx,x0+cw*(t0-1),rows[1]+16,x0+cw*(gv-1),rows[2]-18,T.hot,2.6);}});
  function upd2(){const gv=gt[t0],fv=ft[gv],fx=ft[t0],gfx=gt[fx];
    setText('cp-gx',String(gv));setText('cp-fgx',String(fv).replace('-','−'));setText('cp-gfx',gfx===undefined?`no value: f(${t0}) = ${String(fx).replace('-','−')} is not in the table for g`:String(gfx));sim2.render();}
  bindRange('cp-t',String,v=>{t0=v;upd2();});
  drawers.compose=()=>{sim.render();sim2.render();};
  KEYS['cp-canvas']=['Blue is the composite. Green is g and magenta is f. The orange dot follows x: first the inner function (small dot), then the outer function (orange).',[['cx','composite'],['cv','g'],['ca','f'],['hot','x through the chain']]];
  KEYS['cp-canvas2']=['Read g first (top row pair), then follow the orange arrow to that value in the f table.',[['cv','g table'],['ca','f table'],['hot','the chain']]];
  TIPS['cp-ord:fg']='f of g of x: g works first.';TIPS['cp-ord:gf']='g of f of x: f works first.';
  GLOSS['composition']='Using the output of one function as the input of another: (f∘g)(x) = f(g(x)).';GLOSS['inner function']='The function applied first in a composition.';GLOSS['outer function']='The function applied last in a composition.';
  TT.compose='Have students say it aloud: "g first, then f". Evaluate from the inside out, in both orders, before using the graph.';
  GLYPH.compose='<rect x="2" y="8" width="7" height="8" rx="1.5" fill="none" stroke="var(--cv)" stroke-width="2"/><rect x="15" y="8" width="7" height="8" rx="1.5" fill="none" stroke="var(--ca)" stroke-width="2"/><path d="M9 12 H15" stroke="var(--hot)" stroke-width="2"/>';
  upd();upd2();
})();

(function(){
  const sg=v=>String(+(+v).toFixed(4)).replace('-','−'),lin=(a,b)=>`${a===1?'':a===-1?'−':sg(a)}x${b?(b<0?' − ':' + ')+Math.abs(b):''}`;
  PROBS.push({id:'cp-eval',topic:'compose',title:'Evaluate a composition',gen(){const a=pick([-3,-2,2,3,4]),b=ri(-6,6),c=pick([-2,-1,1,2,3]),d=ri(-5,5),k=ri(-3,3),f=x=>a*x+b,g=x=>c*x*x+d,inner=g(k),ans=f(inner),flip=Math.random()<.5;
    const fg=flip?`(f∘g)(${sg(k)})`:`f(g(${sg(k)}))`;
    return {q:`f(x) = ${lin(a,b)} and g(x) = ${c===1?'':c===-1?'−':sg(c)}x²${d?(d<0?' − ':' + ')+Math.abs(d):''}. Find ${fg}.`,ans,unit:'',abs:0,chk:f(g(k)),hint:'Work from the inside: find g first, then put that number into f.',sol:`g(${sg(k)}) = ${sg(inner)}. Then f(${sg(inner)}) = ${a<0?'(':''}${sg(a)}${a<0?')':''}(${sg(inner)}) ${b<0?'−':'+'} ${Math.abs(b)} = <b>${sg(ans)}</b>.`.replace(/ [−+] 0(?= =)/g,'')};}});
  PROBS.push({id:'cp-order',topic:'compose',title:'Does the order matter?',gen(){const a=pick([2,3,-2,4]),b=ri(-5,5)||3,c=pick([2,3,-1,5]),d=ri(-5,5)||2,k=ri(-3,4),f=x=>a*x+b,g=x=>c*x+d,ans=f(g(k))-g(f(k));
    return {q:`f(x) = ${lin(a,b)} and g(x) = ${lin(c,d)}. Find f(g(${sg(k)})) − g(f(${sg(k)})).`,ans,unit:'',abs:0,chk:(a*(c*k+d)+b)-(c*(a*k+b)+d),hint:'Compute each composition separately, working from the inside out.',sol:`f(g(${sg(k)})) = f(${sg(g(k))}) = ${sg(f(g(k)))}. g(f(${sg(k)})) = g(${sg(f(k))}) = ${sg(g(f(k)))}. Difference: <b>${sg(ans)}</b>.`};}});
  PROBS.push({id:'cp-form',topic:'compose',title:'Formula for a composition',gen(){const a=pick([2,3,-2,4,5]),b=ri(-6,6),c=pick([2,3,-1,5]),d=ri(-6,6)||1,which=pick(['slope','constant']),P=a*c,Q=a*d+b;
    return {q:`f(x) = ${lin(a,b)} and g(x) = ${lin(c,d)}. Then f(g(x)) = px + q. Find ${which==='slope'?'p':'q'}.`,ans:which==='slope'?P:Q,unit:'',abs:0,chk:which==='slope'?(a*(c*1+d)+b)-(a*(c*0+d)+b):a*(c*0+d)+b,hint:'Replace x in f by the whole expression for g, then simplify.',sol:`f(g(x)) = ${a<0?'':''}${sg(a)}(${lin(c,d)}) ${b<0?'−':'+'} ${Math.abs(b)} = ${sg(P)}x ${Q<0?'−':'+'} ${Math.abs(Q)}. So ${which==='slope'?'p':'q'} = <b>${sg(which==='slope'?P:Q)}</b>.`.replace(/ [−+] 0(?= =)/g,'')};}});
  PROBS.push({id:'cp-dom',topic:'compose',title:'Domain of a square root composite',gen(){const m=pick([1,2,3,-1,-2]),n=ri(-9,9),k=pick(['≥','≤']),thr=-n/m,ge=(m>0)===(k==='≥')?'≥':'≤';
    /* √(m·x + n) needs m·x + n ≥ 0 */
    const right=(m>0?`x ≥ ${sg(thr)}`:`x ≤ ${sg(thr)}`),all=[`x ≥ ${sg(thr)}`,`x ≤ ${sg(thr)}`,`x ≠ ${sg(thr)}`,'all real numbers'],{choices,ans}=mcq(right,all.filter(s=>s!==right),4);
    const f=x=>Math.sqrt(m*x+n),ok=m>0?f(thr+1e-6)>=0&&isNaN(f(thr-1))===true:f(thr-1e-6)>=0&&isNaN(f(thr+1))===true;
    return {q:`What is the domain of h(x) = √(${lin(m,n)})?`,choices,ans,hint:'The expression under the square root must be at least 0. Solve the inequality (flip it when dividing by a negative).',sol:`Need ${lin(m,n)} ≥ 0, so ${m>0?`x ≥ ${sg(thr)}`:`x ≤ ${sg(thr)}`}. Domain: <b>${right}</b>.`};}});
  PROBS.push({id:'cp-table',topic:'compose',title:'Composition from a table',gen(){const xs=[1,2,3,4,5],gv=xs.map(()=>pick(xs)),fv=xs.map(()=>ri(-5,9)),t=ri(1,5),ans=fv[gv[t-1]-1];
    return {q:`g: x = 1, 2, 3, 4, 5 → ${gv.join(', ')}. f: x = 1, 2, 3, 4, 5 → ${fv.map(sg).join(', ')}. Find f(g(${t})).`,ans,unit:'',abs:0,chk:fv[gv[t-1]-1],hint:'Read g(x) from the first table, then find that number in the x-row of the second.',sol:`g(${t}) = ${gv[t-1]}, and f(${gv[t-1]}) = <b>${sg(ans)}</b>.`};}});
})();
