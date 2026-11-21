export function installRadioKlandestina(hud:HTMLElement=document.body) {
 const songNames=["Adiós, reina mía","Anti Todo","Cerebros destruidos","Cuidado","En la luna","Historia triste","Mucha policía, poca diversión","Ratas en Bizkaia","Ya no quedan más cojones / Este maldito país / Eskorbuto a las elecciones"];
 type Track={title:string;src:string};
 let tracks:Track[]=songNames.map((title,i)=>({title,src:"/audio/punk-radio/"+String(i+1).padStart(2,"0")+".mp3"}));
 const audio=new Audio();audio.preload="none";
 let index=0,shuffle=false,opened=false,urls:string[]=[];
 try {const s=JSON.parse(localStorage.getItem("punk-radio")||"{}");index=Math.max(0,Math.min(8,Number(s.index)||0));shuffle=!!s.shuffle;audio.volume=typeof s.volume==="number"?s.volume:0.6;}catch{audio.volume=0.6;}
 const save=()=>{try{localStorage.setItem("punk-radio",JSON.stringify({index,shuffle,volume:audio.volume}));}catch{}};
 const toggle=document.createElement("button");toggle.className="radio-toggle";toggle.textContent="☠ RADIO KLANDESTINA";toggle.type="button";
 const overlay=document.createElement("div");overlay.className="radio-overlay";overlay.hidden=true;
 overlay.innerHTML=[
 '<div class="radio-backdrop" data-close></div>',
 '<section class="radio-panel" role="dialog" aria-modal="true" aria-label="Radio Klandestina" tabindex="-1">',
 '<header><b>☠ RADIO KLANDESTINA</b><button data-close aria-label="Cerrar radio">✕</button></header>',
 '<p class="radio-frequency">TRANSMISIÓN CLANDESTINA · 99.9 FM</p>',
 '<h2 data-title></h2><p>EN ANTENA</p>',
 '<nav><button data-action="prev" aria-label="Anterior">⏮</button><button data-action="play" aria-label="Reproducir">▶</button><button data-action="next" aria-label="Siguiente">⏭</button><button data-action="shuffle" aria-label="Aleatorio">⇄</button></nav>',
 '<label>VOLUMEN <input data-volume type="range" min="0" max="100" step="1"></label>',
 '<div class="radio-tracks" data-list></div>',
 '<label class="radio-import">CARGAR MIS CANCIONES <input data-import type="file" accept="audio/*" multiple></label>',
 '<p data-message role="status">Pulsa reproducir o carga archivos del dispositivo.</p>',
 '</section>'
 ].join("");
 hud.appendChild(toggle);document.body.appendChild(overlay);
 const panel=overlay.querySelector<HTMLElement>(".radio-panel")!;
 const title=overlay.querySelector<HTMLElement>("[data-title]")!;
 const list=overlay.querySelector<HTMLElement>("[data-list]")!;
 const volume=overlay.querySelector<HTMLInputElement>("[data-volume]")!;
 const importer=overlay.querySelector<HTMLInputElement>("[data-import]")!;
 const msg=overlay.querySelector<HTMLElement>("[data-message]")!;
 const play=overlay.querySelector<HTMLButtonElement>('[data-action="play"]')!;
 const random=overlay.querySelector<HTMLButtonElement>('[data-action="shuffle"]')!;
 function render(){
  title.textContent=tracks[index]?.title??"Sin canciones";
  play.textContent=audio.paused?"▶":"⏸";
  volume.value=String(Math.round(audio.volume*100));
  random.classList.toggle("active",shuffle);
  list.replaceChildren(...tracks.map((t,i)=>{const b=document.createElement("button");b.type="button";b.dataset.track=String(i);b.textContent=String(i+1).padStart(2,"0")+" · "+t.title;b.className=i===index?"active":"";return b;}));
 }
 function load(){audio.src=tracks[index]?.src??"";audio.load();save();render();}
 async function start(){try{await audio.play();msg.textContent="EN ANTENA";}catch{msg.textContent="No se puede reproducir. Carga archivos locales o coloca los MP3 en public/audio/punk-radio/."; }render();}
 async function select(i:number,autoplay=!audio.paused){if(i<0||i>=tracks.length)return;index=i;load();if(autoplay)await start();}
 async function next(autoplay=!audio.paused||audio.ended){const n=tracks.length;index=shuffle&&n>1?(index+1+Math.floor(Math.random()*(n-1)))%n:(index+1)%n;load();if(autoplay)await start();}
 function setOpen(v:boolean){opened=v;overlay.hidden=!v;toggle.setAttribute("aria-expanded",String(v));if(v)panel.focus();else toggle.focus();}
 toggle.addEventListener("click",()=>setOpen(!opened));
 overlay.addEventListener("click",e=>{
  const el=e.target as HTMLElement;
  if(el.closest("[data-close]")){setOpen(false);return;}
  const track=el.closest<HTMLButtonElement>("[data-track]");if(track){void select(Number(track.dataset.track));return;}
  const action=el.closest<HTMLButtonElement>("[data-action]")?.dataset.action;
  if(action==="play"){if(audio.paused)void start();else audio.pause();}
  if(action==="prev")void select((index-1+tracks.length)%tracks.length);
  if(action==="next")void next();
  if(action==="shuffle"){shuffle=!shuffle;save();render();}
 });
 for(const name of ["pointerdown","pointerup","wheel"])overlay.addEventListener(name,e=>e.stopPropagation());
 const key=(e:KeyboardEvent)=>{if(opened&&e.key==="Escape")setOpen(false);};
 document.addEventListener("keydown",key);
 volume.addEventListener("input",()=>{audio.volume=Number(volume.value)/100;save();});
 importer.addEventListener("change",()=>{
  const files=Array.from(importer.files??[]).filter(f=>f.type.startsWith("audio/"));
  if(!files.length)return;
  audio.pause();audio.removeAttribute("src");urls.forEach(u=>URL.revokeObjectURL(u));
  urls=files.map(f=>URL.createObjectURL(f));tracks=files.map((f,i)=>({title:f.name.replace(/\.[^.]+$/,""),src:urls[i]}));
  index=0;load();msg.textContent="Canciones locales cargadas. Pulsa reproducir.";
 });
 audio.addEventListener("ended",()=>void next(true));
 audio.addEventListener("play",render);audio.addEventListener("pause",render);
 load();
 return {audio,open:()=>setOpen(true),close:()=>setOpen(false),dispose:()=>{audio.pause();audio.removeAttribute("src");urls.forEach(u=>URL.revokeObjectURL(u));document.removeEventListener("keydown",key);overlay.remove();toggle.remove();}};
}