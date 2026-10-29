// Motor del juego: shooter top-down por oleadas
const Game={
 cv:null,c:null,run:false,paused:false,keys:{},mouse:{x:0,y:0,down:false},last:0,t:0,fpsA:0,fpsN:0,
 init(){this.cv=document.getElementById('game');this.c=this.cv.getContext('2d');
  const rs=()=>{this.cv.width=innerWidth;this.cv.height=innerHeight};rs();addEventListener('resize',rs);
  addEventListener('keydown',e=>{if(!this.run)return;this.keys[e.code]=1;const k=Store.d.keys;if(e.code==k.pause)this.pause(!this.paused);if(e.code==k.dash)this.dash();if(this.p&&!this.paused){if(e.code==k.weapon)this.p.weapon=(this.p.weapon+1)%3;if(e.code=='Digit1')this.p.weapon=0;if(e.code=='Digit2')this.p.weapon=1;if(e.code=='Digit3')this.p.weapon=2}if(e.code.startsWith('Arrow')||e.code=='Space')e.preventDefault()});
  addEventListener('keyup',e=>delete this.keys[e.code]);
  this.cv.addEventListener('mousemove',e=>{this.mouse.x=e.clientX;this.mouse.y=e.clientY});
  this.cv.addEventListener('mousedown',()=>this.mouse.down=true);addEventListener('mouseup',()=>this.mouse.down=false);
  this.cv.addEventListener('contextmenu',e=>e.preventDefault())},
 start(){const W=this.cv.width,H=this.cv.height;this.mult=+Store.d.difficulty;
  this.p={x:W/2,y:H/2,vx:0,vy:0,hp:100,cd:0,dashT:0,dashCd:0,ang:0,inv:0,rapid:0,weapon:0};this.hint();
  this.b=[];this.eb=[];this.en=[];this.pt=[];this.pk=[];this.score=0;this.wave=0;this.queue=0;this.spT=0;this.shake=0;this.t=0;
  this.run=true;this.paused=false;this.dead=false;this.nextWave();this.last=performance.now();requestAnimationFrame(n=>this.loop(n))},
 pause(v){this.paused=v;document.getElementById('pause').hidden=!v;if(!v){this.last=performance.now();requestAnimationFrame(n=>this.loop(n))}},
 stop(){this.run=false;Audio_.stop()},
 nextWave(){this.wave++;this.queue=Math.round((4+this.wave*2.5)*this.mult);this.spT=0;this.banner('OLEADA '+this.wave);Audio_.sfx('wave');document.getElementById('wave').textContent='OLEADA '+this.wave;
  if(this.wave%5==0){this.queue=Math.round(this.queue/2);this.banner('¡JEFE! OLEADA '+this.wave);this.en.push({x:this.cv.width/2,y:-60,type:'boss',hp:50+this.wave*6,maxhp:50+this.wave*6,sp:45,r:46,col:'#ff2a2a',sc:500,fire:2})}},
 banner(t){const b=document.getElementById('banner');b.textContent=t;b.style.opacity=1;setTimeout(()=>b.style.opacity=0,1400)},
 dash(){const p=this.p;if(!p||p.dashCd>0||this.paused)return;let dx=(this.keys[Store.d.keys.right]?1:0)-(this.keys[Store.d.keys.left]?1:0),dy=(this.keys[Store.d.keys.down]?1:0)-(this.keys[Store.d.keys.up]?1:0);
  if(!dx&&!dy){dx=Math.cos(p.ang);dy=Math.sin(p.ang)}const l=Math.hypot(dx,dy);p.vx=dx/l*900;p.vy=dy/l*900;p.dashT=.18;p.inv=.3;p.dashCd=1.2;Audio_.sfx('dash')},
 spawn(){const W=this.cv.width,H=this.cv.height,s=Math.random()*4|0,x=s<2?(s?W+30:-30):Math.random()*W,y=s>=2?(s==3?H+30:-30):Math.random()*H;
  const r=Math.random(),w=this.wave,type=r<.15+w*.02&&w>2?'tank':r<.35+w*.02&&w>1?'shooter':'chaser';
  const T={chaser:{hp:2,sp:100,r:14,col:'#ff3a6a',sc:10},shooter:{hp:3,sp:70,r:15,col:'#ffb13a',sc:25},tank:{hp:9,sp:55,r:26,col:'#b13aff',sc:60}}[type];
  this.en.push({x,y,type,...T,maxhp:T.hp,fire:1+Math.random()*2,sp:T.sp*(1+w*.03)*Math.min(1.3,this.mult)})},
 WEAPONS:[{n:'PISTOLA',r:.16,k:1,sp:.04,l:1.2,v:750},{n:'ESCOPETA',r:.55,k:7,sp:.35,l:.55,v:700},{n:'AMETRALLADORA',r:.075,k:1,sp:.14,l:1.1,v:850}],
 hint(){const h=document.getElementById('hint');h.style.opacity=1;setTimeout(()=>h.style.opacity=0,7000)},
 fire(){const p=this.p,w=this.WEAPONS[p.weapon];p.cd=w.r*(p.rapid>0?.55:1);
  for(let i=0;i<w.k;i++){const a=p.ang+(Math.random()-.5)*w.sp,v=w.v*(.9+Math.random()*.2);this.b.push({x:p.x+Math.cos(p.ang)*30,y:p.y+Math.sin(p.ang)*30,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:w.l})}
  Audio_.sfx('shoot');this.shake=Math.max(this.shake,p.weapon==1?5:1.5)},
 burst(x,y,col,n,sp=200){const k=Store.d.particles/100;n=Math.round(n*k);for(let i=0;i<n;i++){const a=Math.random()*6.28,s=Math.random()*sp;this.pt.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.5+Math.random()*.4,col})}},
 loop(now){if(!this.run||this.paused)return;const dt=Math.min(.05,(now-this.last)/1000);this.last=now;this.t+=dt;this.update(dt);this.draw();
  if(Store.d.fps){this.fpsA+=dt;this.fpsN++;if(this.fpsA>.5){document.getElementById('fpsBox').textContent=Math.round(this.fpsN/this.fpsA)+' FPS';this.fpsA=this.fpsN=0}}
  if(!this.dead)requestAnimationFrame(n=>this.loop(n))},
 hurt(d){const p=this.p;if(p.inv>0)return;p.hp-=d;p.inv=.5;this.shake=12;Audio_.sfx('hurt');this.burst(p.x,p.y,'#f33',14);
  if(p.hp<=0){this.dead=true;Audio_.sfx('over');Audio_.stop();const nb=this.score>Store.d.best;if(nb){Store.d.best=this.score;Store.save()}
   document.getElementById('overS').textContent=`Puntos: ${this.score} · Oleada ${this.wave}${nb?' · ¡NUEVO RÉCORD!':''}`;document.getElementById('pname').value=Store.d.name||'';document.getElementById('saveScore').hidden=false;document.getElementById('over').hidden=false}},
 update(dt){const p=this.p,K=Store.d.keys,W=this.cv.width,H=this.cv.height;
  let dx=(this.keys[K.right]?1:0)-(this.keys[K.left]?1:0),dy=(this.keys[K.down]?1:0)-(this.keys[K.up]?1:0);const l=Math.hypot(dx,dy)||1;
  if(p.dashT>0){p.dashT-=dt}else{p.vx+=(dx/l*260-p.vx)*Math.min(1,dt*12);p.vy+=(dy/l*260-p.vy)*Math.min(1,dt*12)}
  p.x=Math.max(16,Math.min(W-16,p.x+p.vx*dt));p.y=Math.max(16,Math.min(H-16,p.y+p.vy*dt));p.ang=Math.atan2(this.mouse.y-p.y,this.mouse.x-p.x);
  p.cd-=dt;p.inv-=dt;p.dashCd-=dt;p.rapid-=dt;
  if((this.mouse.down||this.keys[Store.d.keys.fire])&&p.cd<=0)this.fire();
  if(Store.d.quality!='low'&&(Math.abs(p.vx)+Math.abs(p.vy)>50))this.pt.push({x:p.x,y:p.y,vx:0,vy:0,l:.3,col:SKINS.find(s=>s.id==Store.d.skin).trail,trail:1});
  if(this.queue>0){this.spT-=dt;if(this.spT<=0){this.spawn();this.queue--;this.spT=Math.max(.25,1-this.wave*.05)}}
  else if(!this.en.length){this.score+=this.wave*50;this.nextWave()}
  for(const b of this.b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt}this.b=this.b.filter(b=>b.l>0&&b.x>0&&b.y>0&&b.x<W&&b.y<H);
  for(const b of this.eb){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(Math.hypot(b.x-p.x,b.y-p.y)<18){b.l=0;this.hurt(10*Math.min(1.5,this.mult))}}this.eb=this.eb.filter(b=>b.l>0);
  for(const e of this.en){const a=Math.atan2(p.y-e.y,p.x-e.x),d=Math.hypot(p.x-e.x,p.y-e.y);
   if(e.type=='shooter'&&d<280){e.x-=Math.cos(a)*e.sp*dt*.5}else{e.x+=Math.cos(a)*e.sp*dt;e.y+=Math.sin(a)*e.sp*dt}
   if(e.type=='boss'){e.fire-=dt;if(e.fire<=0){e.fire=2.2;for(let i=0;i<14;i++){const q=i*6.283/14+this.t;this.eb.push({x:e.x,y:e.y,vx:Math.cos(q)*220,vy:Math.sin(q)*220,l:5})}}}
   if(e.type=='shooter'){e.fire-=dt;if(e.fire<=0){e.fire=2;this.eb.push({x:e.x,y:e.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,l:4})}}
   if(d<e.r+14)this.hurt(e.type=='boss'?30:e.type=='tank'?20:12);
   for(const b of this.b)if(b.l>0&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+4){b.l=0;e.hp--;this.burst(b.x,b.y,e.col,3,120);Audio_.sfx('hit')}
   if(e.hp<=0){this.score+=e.sc;this.burst(e.x,e.y,e.col,26,300);this.shake=Math.max(this.shake,6);Audio_.sfx('boom');if(Math.random()<.14)this.pk.push({x:e.x,y:e.y,k:Math.random()<.6?'hp':'rf',l:9})}}
  this.en=this.en.filter(e=>e.hp>0);
  for(const k of this.pk){k.l-=dt;if(Math.hypot(k.x-p.x,k.y-p.y)<26){k.l=0;Audio_.sfx('pick');if(k.k=='hp')p.hp=Math.min(100,p.hp+25);else p.rapid=6}}this.pk=this.pk.filter(k=>k.l>0);
  for(const q of this.pt){q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt}this.pt=this.pt.filter(q=>q.l>0);this.shake*=.88;
  document.getElementById('hp').style.width=Math.max(0,p.hp)+'%';document.getElementById('score').textContent=this.score;document.getElementById('weapon').textContent='🔫 '+this.WEAPONS[p.weapon].n+(p.rapid>0?' ⚡':'')},
 draw(){const c=this.c,W=this.cv.width,H=this.cv.height,hi=Store.d.quality=='high',q=Store.d.quality,p=this.p,sk=SKINS.find(s=>s.id==Store.d.skin);
  c.save();c.fillStyle='#03222d';c.fillRect(0,0,W,H);const sh=this.shake*Store.d.shake/100;if(sh>.3)c.translate((Math.random()-.5)*sh*2,(Math.random()-.5)*sh*2);
  c.strokeStyle='#0b4152';c.lineWidth=1;c.beginPath();const o=(this.t*20)%50;for(let x=-o;x<W;x+=50){c.moveTo(x,0);c.lineTo(x,H)}for(let y=-o;y<H;y+=50){c.moveTo(0,y);c.lineTo(W,y)}c.stroke();
  for(const q2 of this.pt){c.globalAlpha=Math.max(0,q2.l*2);c.fillStyle=q2.col;const s=q2.trail?10:3;c.fillRect(q2.x-s/2,q2.y-s/2,s,s)}c.globalAlpha=1;
  for(const k of this.pk){c.fillStyle=k.k=='hp'?'#3f8':'#fd3';if(hi){c.shadowColor=c.fillStyle;c.shadowBlur=16}c.font='24px sans-serif';c.textAlign='center';c.fillText(k.k=='hp'?'❤':'⚡',k.x,k.y+8);c.shadowBlur=0}
  c.fillStyle='#ff0';if(hi){c.shadowColor='#ff0';c.shadowBlur=12}for(const b of this.b){c.beginPath();c.arc(b.x,b.y,4,0,7);c.fill()}
  c.fillStyle='#f55';if(hi)c.shadowColor='#f00';for(const b of this.eb){c.beginPath();c.arc(b.x,b.y,6,0,7);c.fill()}c.shadowBlur=0;
  for(const e of this.en){c.fillStyle=e.col;c.strokeStyle='#fff';c.lineWidth=2;if(hi){c.shadowColor=e.col;c.shadowBlur=16}c.beginPath();
   if(e.type=='chaser')c.arc(e.x,e.y,e.r,0,7);else{const n=e.type=='boss'?8:e.type=='tank'?6:4;for(let i=0;i<n;i++){const a=i*6.28/n+this.t;c.lineTo(e.x+Math.cos(a)*e.r,e.y+Math.sin(a)*e.r)}c.closePath()}c.fill();c.stroke();c.shadowBlur=0;
   if(e.maxhp>3){c.fillStyle='#000a';c.fillRect(e.x-e.r,e.y-e.r-10,e.r*2,5);c.fillStyle='#3f8';c.fillRect(e.x-e.r,e.y-e.r-10,e.r*2*e.hp/e.maxhp,5)}}
  if(p.inv>0&&((p.inv*20)|0)%2)c.globalAlpha=.4;drawSkin(c,sk,p.x,p.y,16,p.ang,this.t,hi);c.globalAlpha=1;
  if(Store.d.showName!==false){c.font='700 14px Roboto,sans-serif';c.textAlign='center';c.fillStyle='#fff';c.shadowColor='#0ff';c.shadowBlur=hi?8:0;c.fillText(Store.d.name||'Jugador',p.x,p.y-42);c.shadowBlur=0}
  c.strokeStyle='#fff8';c.lineWidth=1.5;c.beginPath();c.arc(this.mouse.x,this.mouse.y,10,0,7);c.moveTo(this.mouse.x-16,this.mouse.y);c.lineTo(this.mouse.x+16,this.mouse.y);c.moveTo(this.mouse.x,this.mouse.y-16);c.lineTo(this.mouse.x,this.mouse.y+16);c.stroke();
  c.restore();if(q!='low'){const g=c.createRadialGradient(W/2,H/2,H*.4,W/2,H/2,H*.9);g.addColorStop(0,'#0000');g.addColorStop(1,'#000b');c.fillStyle=g;c.fillRect(0,0,W,H)}}
};
