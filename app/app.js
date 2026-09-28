(()=>{
"use strict";

const D=window.MUSIC_SAMPLE;
const $=s=>document.querySelector(s);
const canvas=$("#graph");
const ctx=canvas.getContext("2d");
const G=window.GraphState;
const F=window.FilterModel;

if(!G||!F){
  throw new Error("Music Graph: GraphState and FilterModel are required");
}

let graphSession=G.createInitialState({
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});

const state={
  structure:"artist",
  view:"map",
  scale:1,
  ox:52,
  oy:70,
  sphereZoom:1,
  yaw:-0.45,
  pitch:0.22,
  nodes:[],
  edges:[],
  hit:[],
  selectedId:null,
  pointers:new Map(),
  gesture:null
};

const colors={
  root:"#8b6cff",
  artist:"#25c6f7",
  year:"#f4ad45",
  genre:"#39d98a",
  release:"#f15a9c",
  track:"#d9deea"
};

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

const filterUi={
  panel:$("#filters"),
  toggle:$("#filterToggle"),
  badge:$("#filterBadge"),
  pending:$("#filterPending"),
  close:$("#filterClose"),
  scrim:$("#filterScrim"),
  search:$("#search"),
  artist:$("#artist"),
  yearMin:$("#yearMin"),
  yearMax:$("#yearMax"),
  genre:$("#genre"),
  releaseType:$("#releaseType"),
  reset:$("#resetFilters"),
  apply:$("#applyFilters")
};

function setGraphSession(next){
  graphSession=next;
  renderFilterState();
}

function dispatchGraph(action){
  setGraphSession(G.reducer(graphSession,action));
}

function setFilterPanelOpen(open){
  dispatchGraph({
    type:G.COMMANDS.SET_FILTER_PANEL_OPEN,
    open:Boolean(open)
  });
}

function setDraftFilter(key,value){
  dispatchGraph({
    type:G.COMMANDS.SET_DRAFT_FILTER,
    key,
    value
  });
}

function draftYearRange(){
  const year=graphSession.draftFilters&&graphSession.draftFilters.year;
  return {
    min:year&&Number.isFinite(Number(year.min))?Number(year.min):null,
    max:year&&Number.isFinite(Number(year.max))?Number(year.max):null
  };
}

function setDraftYearBound(bound,rawValue){
  const current=draftYearRange();
  const value=rawValue===""?null:Number(rawValue);
  current[bound]=Number.isFinite(value)?value:null;
  setDraftFilter("year",current);
}

function syncDraftControls(){
  const draft=F.normalizeFilters(graphSession.draftFilters);
  filterUi.search.value=draft.search;
  filterUi.artist.value=draft.artist;
  filterUi.yearMin.value=draft.year.min==null?"":String(draft.year.min);
  filterUi.yearMax.value=draft.year.max==null?"":String(draft.year.max);
  filterUi.genre.value=draft.genre;
  filterUi.releaseType.value=draft.releaseType;
}

function renderFilterState(){
  const open=Boolean(graphSession.filterPanelOpen);
  const pending=G.filtersPending(graphSession);
  const active=F.activeFilterCount(graphSession.appliedFilters);

  document.body.classList.toggle("filters-open",open);
  filterUi.panel.setAttribute("aria-hidden",String(!open));
  filterUi.toggle.setAttribute("aria-expanded",String(open));

  filterUi.badge.hidden=active===0;
  filterUi.badge.textContent=String(active);
  filterUi.pending.hidden=!pending;
  filterUi.apply.disabled=!pending;
}

function resetDraftFilters(){
  graphSession=G.reducer(graphSession,{
    type:G.COMMANDS.RESET_DRAFT_FILTERS,
    defaults:F.defaultFilters()
  });
  syncDraftControls();
  renderFilterState();
}

function applyDraftFilters(){
  const normalized=F.normalizeFilters(graphSession.draftFilters);
  graphSession=G.reducer(graphSession,{
    type:G.COMMANDS.RESET_DRAFT_FILTERS,
    defaults:normalized
  });
  graphSession=G.reducer(graphSession,{
    type:G.COMMANDS.APPLY_FILTERS
  });
  syncDraftControls();
  renderFilterState();
  state.selectedId=null;
  $("#inspector").classList.remove("open");
  rebuild();
  fitView();
}

function pointFromEvent(e){
  const r=canvas.getBoundingClientRect();
  return {x:e.clientX-r.left,y:e.clientY-r.top};
}

function resize(){
  const r=canvas.getBoundingClientRect();
  const d=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.max(1,Math.round(r.width*d));
  canvas.height=Math.max(1,Math.round(r.height*d));
  ctx.setTransform(d,0,0,d,0,0);
  draw();
}

function addNode(list,id,label,kind,level,meta){
  if(!list.some(v=>v.id===id)){
    list.push({id,label,kind,l:level,meta:meta||{}});
  }
}

function layoutMap(nodes){
  const levels={};
  nodes.forEach(n=>(levels[n.l]??=[]).push(n));
  Object.entries(levels).forEach(([level,list])=>{
    list.forEach((n,i)=>{
      n.px=Number(level)*245;
      n.py=45+i*70;
      n.r=n.kind==="root"?23:n.kind==="artist"?18:n.kind==="release"?12:8;
    });
  });
}

function layoutSphere(nodes){
  const levels={};
  let maxLevel=0;
  nodes.forEach(n=>{
    maxLevel=Math.max(maxLevel,n.l);
    (levels[n.l]??=[]).push(n);
  });

  Object.entries(levels).forEach(([levelText,list])=>{
    const level=Number(levelText);
    if(level===0){
      list.forEach(n=>{
        n.sx=0;
        n.sy=1;
        n.sz=0;
      });
      return;
    }

    const t=maxLevel<=1?0.5:(level-1)/Math.max(1,maxLevel-1);
    const latitude=(58-t*116)*Math.PI/180;
    const ring=Math.cos(latitude);
    const offset=(level%2)*0.38;

    list.forEach((n,i)=>{
      const longitude=(i/Math.max(1,list.length))*Math.PI*2+offset;
      n.sx=ring*Math.cos(longitude);
      n.sy=Math.sin(latitude);
      n.sz=ring*Math.sin(longitude);
    });
  });
}

function rebuild(){
  const releases=F.filterReleases(D,graphSession.appliedFilters);

  const nodes=[];
  const edges=[];
  const edge=(a,b)=>edges.push([a,b]);
  addNode(nodes,"root","MUSIC","root",0,{});

  if(state.structure==="artist"){
    for(const artist of D.artists.filter(a=>releases.some(r=>r.artistId===a.id))){
      const aid="a:"+artist.id;
      addNode(nodes,aid,artist.name,"artist",1,artist);
      edge("root",aid);

      for(const release of releases.filter(r=>r.artistId===artist.id)){
        const rid="r:"+release.id;
        addNode(nodes,rid,release.title,"release",2,release);
        edge(aid,rid);

        release.tracks.forEach((title,i)=>{
          const tid=rid+":t:"+i;
          addNode(nodes,tid,title,"track",3,{title,release:release.title,artist:artist.name});
          edge(rid,tid);
        });
      }
    }
  }else{
    for(const release of releases){
      const year=release.year??"Unknown";
      const yid="y:"+year;
      addNode(nodes,yid,String(year),"year",1,{year:release.year});
      edge("root",yid);

      const artist=D.artists.find(a=>a.id===release.artistId);
      const genre=artist.genres[0];
      const gid=yid+":g:"+genre;
      addNode(nodes,gid,genre,"genre",2,{genre});
      edge(yid,gid);

      const aid=gid+":a:"+artist.id;
      addNode(nodes,aid,artist.name,"artist",3,artist);
      edge(gid,aid);

      const rid="r:"+release.id;
      addNode(nodes,rid,release.title,"release",4,release);
      edge(aid,rid);
    }
  }

  layoutMap(nodes);
  layoutSphere(nodes);
  state.nodes=nodes;
  state.edges=edges;

  const activeFilters=F.activeFilterCount(graphSession.appliedFilters);
  $("#stats").innerHTML="<b>"+releases.length+"</b> релізів у view<br><b>"+nodes.length+"</b> вузлів<br><b>"+activeFilters+"</b> активних фільтрів<br><b>"+(state.view==="map"?"2D Map":"Sphere 3D")+"</b>";
  $("#viewBadge").textContent=state.view==="map"?"2D Map":"Sphere 3D";
  draw();
}

function mapPosition(n){
  return {
    x:n.px*state.scale+state.ox,
    y:n.py*state.scale+state.oy,
    z:0,
    p:state.scale
  };
}

function spherePosition(n){
  const cy=Math.cos(state.yaw);
  const sy=Math.sin(state.yaw);
  const cp=Math.cos(state.pitch);
  const sp=Math.sin(state.pitch);

  const x1=n.sx*cy+n.sz*sy;
  const z1=-n.sx*sy+n.sz*cy;
  const y2=n.sy*cp-z1*sp;
  const z2=n.sy*sp+z1*cp;

  const r=canvas.getBoundingClientRect();
  const radius=Math.min(r.width,r.height)*0.37*state.sphereZoom;
  const perspective=1/(1.45-z2*0.28);

  return {
    x:r.width/2+x1*radius*perspective,
    y:r.height/2-y2*radius*perspective,
    z:z2,
    p:perspective
  };
}

function position(n){
  return state.view==="map"?mapPosition(n):spherePosition(n);
}

function drawSphereGuide(width,height){
  const radius=Math.min(width,height)*0.37*state.sphereZoom;
  ctx.save();
  ctx.strokeStyle="rgba(139,108,255,.24)";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.arc(width/2,height/2,radius,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(width/2,height/2,radius,radius*.25,state.yaw,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(width/2,height/2,radius*.25,radius,state.pitch,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

function draw(){
  const r=canvas.getBoundingClientRect();
  ctx.clearRect(0,0,r.width,r.height);
  if(!state.nodes.length)return;

  if(state.view==="sphere"){
    drawSphereGuide(r.width,r.height);
  }

  const byId=new Map(state.nodes.map(n=>[n.id,n]));

  for(const [a,b] of state.edges){
    const A=byId.get(a);
    const B=byId.get(b);
    if(!A||!B)continue;
    const pa=position(A);
    const pb=position(B);
    const depth=state.view==="sphere"?clamp(((pa.z+pb.z)/2+1)/2,0,1):1;
    ctx.save();
    ctx.globalAlpha=state.view==="sphere"?.14+.48*depth:.65;
    ctx.strokeStyle="#4a5368";
    ctx.lineWidth=state.view==="sphere"?Math.max(.6,1.1*depth):1;
    ctx.beginPath();
    ctx.moveTo(pa.x,pa.y);
    ctx.lineTo(pb.x,pb.y);
    ctx.stroke();
    ctx.restore();
  }

  const ordered=[...state.nodes].map(n=>({n,p:position(n)}));
  if(state.view==="sphere")ordered.sort((a,b)=>a.p.z-b.p.z);

  state.hit=[];
  for(const item of ordered){
    const n=item.n;
    const p=item.p;
    const base=n.r||8;
    const depthScale=state.view==="sphere"?(.62+(p.z+1)*.26):state.scale;
    const rr=clamp(base*depthScale,4,30);
    const selected=n.id===state.selectedId;

    ctx.save();
    ctx.globalAlpha=state.view==="sphere"?clamp(.38+(p.z+1)*.31,.3,1):1;
    if(selected){
      ctx.beginPath();
      ctx.fillStyle="rgba(255,255,255,.20)";
      ctx.arc(p.x,p.y,rr+7,0,Math.PI*2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle=colors[n.kind]||"#fff";
    ctx.arc(p.x,p.y,rr,0,Math.PI*2);
    ctx.fill();

    const showLabel=state.view==="map"||p.z>-.18||selected||n.kind==="artist";
    if(showLabel){
      ctx.globalAlpha=state.view==="sphere"?clamp(.5+(p.z+1)*.25,.45,1):1;
      ctx.fillStyle="#dce2f0";
      const fontSize=state.view==="sphere"?clamp(10*depthScale,9,14):clamp(12*state.scale,9,17);
      ctx.font=fontSize+"px system-ui";
      ctx.fillText(n.label,p.x+rr+7,p.y+4);
    }
    ctx.restore();

    state.hit.push({n,x:p.x,y:p.y,r:Math.max(18,rr+5),z:p.z});
  }
}

function showNode(n){
  state.selectedId=n.id;
  const details=$("#details");
  details.textContent="";

  const pill=document.createElement("span");
  pill.className="pill";
  pill.textContent=n.kind;

  const h=document.createElement("h2");
  h.textContent=n.label;

  const pre=document.createElement("pre");
  pre.textContent=JSON.stringify(n.meta,null,2);

  details.append(pill,h,pre);
  $("#inspector").classList.add("open");
  draw();
}

function hitTest(p){
  const candidates=state.hit
    .map(h=>({...h,d:Math.hypot(h.x-p.x,h.y-p.y)}))
    .filter(h=>h.d<=h.r);

  if(!candidates.length)return null;

  candidates.sort((a,b)=>{
    const da=a.d-a.z*5;
    const db=b.d-b.z*5;
    return da-db;
  });
  return candidates[0].n;
}

function zoomMapAt(factor,cx,cy){
  const old=state.scale;
  const next=clamp(old*factor,.28,4.5);
  const gx=(cx-state.ox)/old;
  const gy=(cy-state.oy)/old;
  state.scale=next;
  state.ox=cx-gx*next;
  state.oy=cy-gy*next;
}

function zoomBy(factor,at){
  const r=canvas.getBoundingClientRect();
  const p=at||{x:r.width/2,y:r.height/2};
  if(state.view==="map"){
    zoomMapAt(factor,p.x,p.y);
  }else{
    state.sphereZoom=clamp(state.sphereZoom*factor,.55,3.4);
  }
  draw();
}

function fitView(){
  const r=canvas.getBoundingClientRect();
  if(state.view==="sphere"){
    state.sphereZoom=1;
    state.yaw=-.45;
    state.pitch=.22;
    draw();
    return;
  }

  if(!state.nodes.length)return;
  const xs=state.nodes.map(n=>n.px);
  const ys=state.nodes.map(n=>n.py);
  const minX=Math.min(...xs);
  const maxX=Math.max(...xs);
  const minY=Math.min(...ys);
  const maxY=Math.max(...ys);
  const margin=55;
  const w=Math.max(1,maxX-minX);
  const h=Math.max(1,maxY-minY);
  state.scale=clamp(Math.min((r.width-margin*2)/w,(r.height-margin*2)/h),.28,2.2);
  state.ox=(r.width-(minX+maxX)*state.scale)/2;
  state.oy=(r.height-(minY+maxY)*state.scale)/2;
  draw();
}

function startGesture(){
  const points=[...state.pointers.values()];
  if(points.length===1){
    state.gesture={
      multi:false,
      moved:0,
      last:{...points[0]}
    };
  }else if(points.length>=2){
    const a=points[0],b=points[1];
    const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};
    state.gesture={
      multi:true,
      moved:999,
      startDist:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),
      startScale:state.scale,
      startSphereZoom:state.sphereZoom,
      startMid:mid,
      startOx:state.ox,
      startOy:state.oy
    };
  }
}

canvas.addEventListener("pointerdown",e=>{
  const p=pointFromEvent(e);
  state.pointers.set(e.pointerId,p);
  try{canvas.setPointerCapture(e.pointerId)}catch(_){}
  if(state.pointers.size<=2)startGesture();
});

canvas.addEventListener("pointermove",e=>{
  if(!state.pointers.has(e.pointerId))return;
  const p=pointFromEvent(e);
  state.pointers.set(e.pointerId,p);
  const points=[...state.pointers.values()];

  if(points.length>=2){
    if(!state.gesture||!state.gesture.multi)startGesture();
    const g=state.gesture;
    const a=points[0],b=points[1];
    const dist=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
    const factor=dist/g.startDist;
    const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};

    if(state.view==="map"){
      const next=clamp(g.startScale*factor,.28,4.5);
      const gx=(g.startMid.x-g.startOx)/g.startScale;
      const gy=(g.startMid.y-g.startOy)/g.startScale;
      state.scale=next;
      state.ox=mid.x-gx*next;
      state.oy=mid.y-gy*next;
    }else{
      state.sphereZoom=clamp(g.startSphereZoom*factor,.55,3.4);
    }
    draw();
    return;
  }

  if(points.length===1&&state.gesture&&!state.gesture.multi){
    const g=state.gesture;
    const dx=p.x-g.last.x;
    const dy=p.y-g.last.y;
    g.moved+=Math.hypot(dx,dy);
    g.last={...p};

    if(state.view==="map"){
      state.ox+=dx;
      state.oy+=dy;
    }else{
      state.yaw+=dx*.009;
      state.pitch=clamp(state.pitch+dy*.009,-1.42,1.42);
    }
    draw();
  }
});

function endPointer(e){
  const end=pointFromEvent(e);
  state.pointers.delete(e.pointerId);

  if(state.pointers.size===0){
    const g=state.gesture;
    if(g&&!g.multi&&g.moved<8){
      const node=hitTest(end);
      if(node)showNode(node);
    }
    state.gesture=null;
  }else{
    startGesture();
    if(state.gesture)state.gesture.multi=true;
  }
}

canvas.addEventListener("pointerup",endPointer);
canvas.addEventListener("pointercancel",endPointer);

canvas.addEventListener("wheel",e=>{
  e.preventDefault();
  zoomBy(e.deltaY<0?1.12:.89,pointFromEvent(e));
},{passive:false});

$("#zoomIn").onclick=()=>zoomBy(1.22);
$("#zoomOut").onclick=()=>zoomBy(.82);
$("#fit").onclick=fitView;

$("#close").onclick=()=>{
  $("#inspector").classList.remove("open");
  state.selectedId=null;
  draw();
};

filterUi.artist.innerHTML='<option value="all">Усі</option>'+
  D.artists.map(a=>'<option value="'+a.id+'">'+a.name+"</option>").join("");

const genres=[...new Set(D.artists.flatMap(a=>a.genres||[]))]
  .sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:"base"}));
filterUi.genre.innerHTML='<option value="all">Усі</option>'+
  genres.map(genre=>'<option value="'+genre+'">'+genre+"</option>").join("");

const releaseTypes=[...new Set(D.releases.map(r=>r.type).filter(Boolean))]
  .sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:"base"}));
filterUi.releaseType.innerHTML='<option value="all">Усі</option>'+
  releaseTypes.map(type=>'<option value="'+type+'">'+type+"</option>").join("");

filterUi.toggle.onclick=()=>setFilterPanelOpen(!graphSession.filterPanelOpen);
filterUi.close.onclick=()=>setFilterPanelOpen(false);
filterUi.scrim.onclick=()=>setFilterPanelOpen(false);
filterUi.reset.onclick=resetDraftFilters;
filterUi.apply.onclick=applyDraftFilters;

filterUi.search.oninput=e=>setDraftFilter("search",e.target.value);
filterUi.artist.onchange=e=>setDraftFilter("artist",e.target.value);
filterUi.yearMin.oninput=e=>setDraftYearBound("min",e.target.value);
filterUi.yearMax.oninput=e=>setDraftYearBound("max",e.target.value);
filterUi.genre.onchange=e=>setDraftFilter("genre",e.target.value);
filterUi.releaseType.onchange=e=>setDraftFilter("releaseType",e.target.value);

$("#structure").onchange=e=>{
  state.structure=e.target.value;
  rebuild();
  fitView();
};

$("#view").onchange=e=>{
  state.view=e.target.value;
  graphSession=G.reducer(graphSession,{
    type:G.COMMANDS.SET_RENDERER_MODE,
    mode:e.target.value
  });
  rebuild();
  fitView();
};

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&graphSession.filterPanelOpen){
    setFilterPanelOpen(false);
  }
});

syncDraftControls();
renderFilterState();

addEventListener("resize",resize);
resize();
rebuild();
fitView();
})();
