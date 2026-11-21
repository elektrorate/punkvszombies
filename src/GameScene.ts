import Phaser from "phaser";

export type UnitType = "plant" | "stone" | "molotov" | "shield";
type Def = {type:UnitType; lane:number; col:number; hp:number; maxHp:number; cooldown:number; growth:number};
type Enemy = {lane:number; x:number; hp:number; maxHp:number; speed:number; kind:"basic"|"fast"|"cone"|"police"; attack:number; seed:number};
type Shot = {lane:number;x:number;y:number;damage:number;speed:number;kind:"stone"|"fire";splash:number};
type Leaf = {x:number;y:number;value:number;life:number};
type Spawn = {at:number;lane:number;kind:Enemy["kind"]};
const COST:Record<UnitType,number>={plant:50,stone:50,molotov:100,shield:75};
const MAX_HP:Record<UnitType,number>={plant:70,stone:100,molotov:90,shield:400};
const X=130,Y=136,CW=104,CH=99,COLS=9,LANES=5;
const LX=X+CW*COLS;
const WAVES=[ [0,14,27], [48,57,65,74], [105,113,121,130,138], [170,178,187,195,204,214], [247,255,264,271,280,290,300,310] ];
const waveTimes=WAVES.map(v=>v[0]);
const totalSpawns=WAVES.reduce((n,w)=>n+w.length,0);
const descriptions:{kind:Enemy["kind"];speed:number;hp:number}[]=[
 {kind:"basic",speed:19,hp:100},{kind:"fast",speed:29,hp:70},{kind:"cone",speed:16,hp:165},{kind:"police",speed:17,hp:190}
];

export class GameScene extends Phaser.Scene {
 private g!:Phaser.GameObjects.Graphics;
 private labels!:Phaser.GameObjects.Text;
 private selected:UnitType="plant";
 private defs:Def[]=[];
 private zombies:Enemy[]=[];
 private shots:Shot[]=[];
 private leaves:Leaf[]=[];
 private schedule:Spawn[]=[];
 private elapsed=0;
 private clockAccumulator=0;
 private spawnIndex=0;
 private deadCount=0;
 private resources=150;
 private barricades=Array.from({length:LANES},()=>true);
 private state:"ready"|"playing"|"paused"|"won"|"lost"="ready";
 private picked=0;
 private notice="";
 private noticeUntil=0;
 private hudLeaves!:HTMLElement;
 private hudWave!:HTMLElement;
 private hudState!:HTMLElement;
 private overlay!:HTMLElement;
 private startButton!:HTMLButtonElement;
 private buttons:HTMLButtonElement[]=[];
 constructor(){super("GameScene");}
 create(){
  this.g=this.add.graphics();
  this.labels=this.add.text(0,0,"",{fontFamily:"Arial",fontSize:"18px",fontStyle:"bold",color:"#ffffff"}).setDepth(2);
  this.input.on("pointerdown",(pointer:Phaser.Input.Pointer)=>{
   if(this.state!=="playing")return;
   const wx=pointer.x,wy=pointer.y;
   const clicked=this.leaves.findIndex(v=>Math.abs(wx-v.x)<29&&Math.abs(wy-v.y)<28);
   if(clicked>=0){this.resources+=this.leaves[clicked].value;this.leaves.splice(clicked,1);this.refreshHUD();return;}
   const col=Math.floor((wx-X)/CW),lane=Math.floor((wy-Y)/CH);
   if(col<0||col>=COLS||lane<0||lane>=LANES)return;
   if(this.defs.some(u=>u.col===col&&u.lane===lane)){this.flash("Casilla ocupada");return;}
   if(this.resources<COST[this.selected]){this.flash("No tienes hojas suficientes");return;}
   this.resources-=COST[this.selected];
   this.defs.push({type:this.selected,lane,col,hp:MAX_HP[this.selected],maxHp:MAX_HP[this.selected],cooldown:0,growth:0});
   this.refreshHUD();
  });
  this.setupHUD();
  this.reset();
 }
 private setupHUD(){
  const root=document.querySelector<HTMLElement>("#game-hud")!;
  this.hudLeaves=root.querySelector<HTMLElement>("[data-leaves]")!;
  this.hudWave=root.querySelector<HTMLElement>("[data-wave]")!;
  this.hudState=root.querySelector<HTMLElement>("[data-state]")!;
  this.overlay=document.querySelector<HTMLElement>("#game-modal")!;
  this.startButton=this.overlay.querySelector<HTMLButtonElement>("button")!;
  this.startButton.onclick=()=>this.start();
  root.querySelector<HTMLButtonElement>("[data-pause]")!.onclick=()=>{
   if(this.state==="playing")this.state="paused";
   else if(this.state==="paused")this.state="playing";
   this.refreshHUD();
  };
  this.buttons=Array.from(root.querySelectorAll<HTMLButtonElement>("[data-unit]"));
  this.buttons.forEach(b=>b.onclick=()=>{this.selected=b.dataset.unit as UnitType;this.refreshHUD();});
 }
 private reset(){
  this.elapsed=0;this.clockAccumulator=0;this.spawnIndex=0;this.deadCount=0;this.resources=150;
  this.defs=[];this.zombies=[];this.shots=[];this.leaves=[];this.barricades.fill(true);
  this.picked=0;this.notice="";this.selected="plant";
  this.schedule=[];
  WAVES.forEach((times,wave)=>times.forEach((at,i)=>{
   // Los policías y los zombis con cono son variantes provisionales; los sprites definitivos se añadirán después.
   const kind:Enemy["kind"]=wave===0?"basic":wave===1?(i===times.length-1?"fast":"basic"):wave===2?(i===times.length-1?"cone":"basic"):wave===3?(i%3===0?"police":"basic"):(i%3===0?"cone":i%3===1?"police":"fast");
   this.schedule.push({at,lane:(i*3+wave*2)%LANES,kind});
  }));
  this.schedule.sort((a,b)=>a.at-b.at);
  this.state="ready";this.overlay.hidden=false;
  this.overlay.querySelector<HTMLElement>("h2")!.textContent="DEFENDE LA AZOTEA";
  this.overlay.querySelector<HTMLElement>("p")!.textContent="5 carriles · 5 oleadas · Recoge hojas y coloca tus defensores.";
  this.startButton.textContent="EMPEZAR NIVEL 1";
  this.refreshHUD();this.draw();
 }
 private start(){
  if(this.state==="won"||this.state==="lost")this.reset();
  this.state="playing";this.overlay.hidden=true;this.refreshHUD();
 }
 private flash(s:string){this.notice=s;this.noticeUntil=this.elapsed+2;}
 private spawn(data:Spawn){
  const stat=descriptions.find(k=>k.kind===data.kind)!;
  this.zombies.push({lane:data.lane,x:LX+30,hp:stat.hp,maxHp:stat.hp,speed:stat.speed,kind:data.kind,attack:0,seed:Math.random()*7});
 }
 private currentWave(){let w=0;for(let i=0;i<waveTimes.length;i++)if(this.elapsed>=waveTimes[i])w=i;return w;}
 private refreshHUD(){
  this.hudLeaves.textContent=String(this.resources);
  this.hudWave.textContent=(this.currentWave()+1)+" / 5";
  this.hudState.textContent=this.state==="paused"?"PAUSA":this.state==="playing"?"EN COMBATE":this.state==="ready"?"PREPARADO":this.state==="won"?"VICTORIA":"DERROTA";
  this.buttons.forEach(b=>{const id=b.dataset.unit as UnitType;b.classList.toggle("chosen",id===this.selected);b.disabled=this.resources<COST[id]||this.state==="won"||this.state==="lost";});
  const p=document.querySelector<HTMLButtonElement>("[data-pause]")!;
  p.textContent=this.state==="paused"?"REANUDAR":"PAUSA";
 }
 private finish(win:boolean){
  this.state=win?"won":"lost";this.overlay.hidden=false;
  this.overlay.querySelector<HTMLElement>("h2")!.textContent=win?"¡AZOTEA DEFENDIDA!":"LA HORDA HA ENTRADO";
  this.overlay.querySelector<HTMLElement>("p")!.textContent=win?"Has sobrevivido a las cinco oleadas.": "Los zombis han atravesado una barricada ya consumida.";
  this.startButton.textContent="REPETIR NIVEL";
  if(win){try{localStorage.setItem("punk-garden-level1","complete");}catch{}}
  this.refreshHUD();
 }
 update(_time:number,delta:number){
  if(this.state==="playing"){
   this.clockAccumulator+=Math.min(delta,100)/1000;
   let ticks=0;
   while(this.clockAccumulator>=1/60&&ticks++<8&&this.state==="playing"){this.step(1/60);this.clockAccumulator-=1/60;}
  }
  this.draw();
 }
 private step(dt:number){
  this.elapsed+=dt;
  while(this.spawnIndex<this.schedule.length&&this.schedule[this.spawnIndex].at<=this.elapsed)this.spawn(this.schedule[this.spawnIndex++]);
  for(const u of this.defs){
   u.cooldown-=dt;
   if(u.type==="plant"){
    u.growth+=dt;
    if(u.growth>=8){
     u.growth-=8;
     this.leaves.push({x:X+(u.col+.5)*CW,y:Y+(u.lane+.5)*CH-28,value:25,life:10});
    }
    continue;
   }
   const sx=X+(u.col+.5)*CW,sy=Y+(u.lane+.5)*CH;
   const ahead=this.zombies.filter(z=>z.lane===u.lane&&z.x>sx&&z.x<LX+50);
   if(u.cooldown<=0&&ahead.length&&u.type!=="shield"){
    if(u.type==="stone"){
     this.shots.push({lane:u.lane,x:sx+25,y:sy-10,damage:25,speed:360,kind:"stone",splash:0});
     // Doble disparo ligeramente retrasado en el prototipo.
     this.shots.push({lane:u.lane,x:sx+8,y:sy+8,damage:20,speed:335,kind:"stone",splash:0});
     u.cooldown=2.25;
    }else{
     this.shots.push({lane:u.lane,x:sx+20,y:sy,damage:60,speed:260,kind:"fire",splash:70});
     u.cooldown=3.7;
    }
   }
  }
  for(const leaf of this.leaves)leaf.life-=dt;
  this.leaves=this.leaves.filter(l=>l.life>0);
  for(const shot of this.shots){
   const before=shot.x;shot.x+=shot.speed*dt;
   const target=this.zombies.filter(z=>z.lane===shot.lane&&z.x>=before-14&&z.x<=shot.x+22&&z.hp>0).sort((a,b)=>a.x-b.x)[0];
   if(target){
    target.hp-=shot.damage;
    if(shot.splash)for(const other of this.zombies)if(other!==target&&other.lane===target.lane&&Math.abs(other.x-target.x)<=shot.splash)other.hp-=shot.damage*.5;
    shot.x=2000;
   }
  }
  this.shots=this.shots.filter(s=>s.x<LX+55);
  for(const z of this.zombies){
   if(z.hp<=0)continue;
   const target=this.defs.find(u=>u.lane===z.lane&&Math.abs(z.x-(X+(u.col+.5)*CW))<45);
   if(target){
    z.attack+=dt;
    if(z.attack>=.8){target.hp-=z.kind==="police"?32:18;z.attack=0;}
   }else{
    z.x-=z.speed*dt;
    z.attack=0;
   }
   if(z.x<X-42){
    if(this.barricades[z.lane]){this.barricades[z.lane]=false;z.hp=0;this.flash("¡Barricada activada en carril "+(z.lane+1)+"!");}
    else {this.finish(false);return;}
   }
  }
  this.defs=this.defs.filter(u=>u.hp>0);
  const before=this.zombies.length;
  this.zombies=this.zombies.filter(z=>z.hp>0);
  this.deadCount+=before-this.zombies.length;
  if(this.spawnIndex===totalSpawns&&this.zombies.length===0){this.finish(true);return;}
  this.refreshHUD();
 }
 private draw(){
  const g=this.g;g.clear();
  g.fillStyle(0x10131b);g.fillRect(0,0,1280,720);
  g.fillStyle(0x292234);g.fillRect(0,0,1280,114);
  g.fillStyle(0xb7e53a);g.fillRect(0,111,1280,6);
  // Horizonte urbano.
  for(let i=0;i<25;i++){const h=32+(i*57)%61;g.fillStyle(i%2?0x302e36:0x24232d);g.fillRect(i*53,116-h,45,h);}
  for(let lane=0;lane<LANES;lane++){
   g.fillStyle(lane%2?0x393d36:0x30362f);g.fillRect(X,Y+lane*CH,COLS*CW,CH);
   for(let col=0;col<COLS;col++){
    g.lineStyle(1,0x6e7862,.55);g.strokeRect(X+col*CW,Y+lane*CH,CW,CH);
   }
   g.fillStyle(this.barricades[lane]?0xdafe39:0x5b5860);
   g.fillRoundedRect(X-56,Y+lane*CH+23,41,55,5);
   g.fillStyle(0x0f1212);g.fillRect(X-53,Y+lane*CH+35,35,8);
  }
  g.fillStyle(0x171b1e);g.fillRect(LX+2,Y,75,LANES*CH);
  for(const u of this.defs){
   const x=X+(u.col+.5)*CW,y=Y+(u.lane+.5)*CH;
   const colors:Record<UnitType,number>={plant:0x99eb31,stone:0xeb4692,molotov:0xf3a23e,shield:0x65b8ec};
   g.fillStyle(0x15151b);g.fillEllipse(x+3,y+24,66,17);
   g.fillStyle(colors[u.type]);g.fillRoundedRect(x-25,y-28,50,59,9);
   g.lineStyle(4,0x101019);g.strokeRoundedRect(x-25,y-28,50,59,9);
   g.fillStyle(0x17151a);g.fillCircle(x-8,y-8,5);g.fillCircle(x+9,y-8,5);
   if(u.type==="plant"){g.fillStyle(0x2e8531);g.fillTriangle(x,y-39,x-21,y-6,x+21,y-6);}
   if(u.type==="shield"){g.fillStyle(0x334f64);g.fillRoundedRect(x+14,y-13,24,38,3);}
   if(u.type==="molotov"){g.fillStyle(0xffdb44);g.fillCircle(x+24,y-31,9);}
   g.fillStyle(0x0e1117);g.fillRect(x-23,y+34,46,5);g.fillStyle(0x9ade35);g.fillRect(x-23,y+34,46*Math.max(0,u.hp/u.maxHp),5);
  }
  for(const shot of this.shots){g.fillStyle(shot.kind==="fire"?0xff9d2f:0xe3e1cd);g.fillCircle(shot.x,shot.y,shot.kind==="fire"?12:7);}
  for(const z of this.zombies){
   const y=Y+(z.lane+.5)*CH,walk=Math.sin(this.elapsed*5+z.seed)*5;
   g.fillStyle(0x101214);g.fillEllipse(z.x,y+36,66,15);
   g.fillStyle(z.kind==="police"?0x40485c:0xe8742c);
   g.fillRoundedRect(z.x-25,y-17+walk,52,57,8);
   g.lineStyle(4,0x17131a);g.strokeRoundedRect(z.x-25,y-17+walk,52,57,8);
   g.fillStyle(0x8ab98a);g.fillCircle(z.x,y-32+walk,27);
   g.fillStyle(0x171a19);g.fillCircle(z.x-9,y-35+walk,5);g.fillCircle(z.x+10,y-35+walk,5);
   if(z.kind==="cone"){g.fillStyle(0xec981c);g.fillTriangle(z.x-22,y-51+walk,z.x,y-95+walk,z.x+22,y-51+walk);}
   if(z.kind==="police"){g.fillStyle(0x262d3b);g.fillRect(z.x-25,y-61+walk,50,13);}
   g.fillStyle(0xffffff);
   // Inicial de facción K; el polizombi conservará la insignia POLI en los sprites finales.
   g.fillStyle(0x101113);g.fillRect(z.x-25,y+42,50,5);
   g.fillStyle(0xd7ef35);g.fillRect(z.x-25,y+42,50*Math.max(0,z.hp/z.maxHp),5);
  }
  for(const leaf of this.leaves){g.fillStyle(leaf.life<2&&Math.floor(leaf.life*8)%2?0xffffff:0xc5ff48);g.fillCircle(leaf.x,leaf.y,20);g.fillStyle(0x192219);g.fillCircle(leaf.x,leaf.y,5);}
  if(this.noticeUntil>this.elapsed){g.fillStyle(0x14131a,.92);g.fillRoundedRect(372,641,540,42,8);}
  this.labels.setText(this.noticeUntil>this.elapsed?this.notice:"");
  this.labels.setPosition(390,650);
 }
}
