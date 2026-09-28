(()=>{
"use strict";

const D=window.MUSIC_SAMPLE;
const $=s=>document.querySelector(s);
const canvas=$("#graph");
const ctx=canvas.getContext("2d");
const G=window.GraphState;
const P=window.GraphProjection;
const F=window.FilterModel;
const N=window.NodeControls;
const NAV=window.NavigationUi;
const W=window.NestedWorldModel;
const T=window.TrackDetails;
const S=window.SessionPersistence;
const E=window.ExpandAllGuard;
const X=window.MUSIC_PROTOTYPE_FIXTURES;

if(!G||!P||!F||!N||!NAV||!W||!T||!S||!E||!X){
  throw new Error("Music Graph: nested world, Track detail, persistence and expansion guard dependencies are required");
}

const canonicalPrototype=P.createProjectionGraph(
  W.buildNestedGraph(
    X.accountDocument,
    D,
    X.assignments
  )
);

function browserSemanticStorage(){
  try{return window.localStorage;}catch(_){return null;}
}

const semanticStorage=browserSemanticStorage();
const restoredSession=S.restoreSession({
  storage:semanticStorage,
  graphState:G,
  graph:canonicalPrototype,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
let graphSession=restoredSession.state;

const state={
  view:graphSession.rendererMode==="sphere"?"sphere":"map",
  scale:1,
  ox:52,
  oy:70,
  sphereZoom:1,
  spherePanX:0,
  spherePanY:0,
  yaw:-0.45,
  pitch:0.22,
  orbitHold:false,
  nodes:[],
  edges:[],
  fullNodes:canonicalPrototype.nodes,
  fullEdges:canonicalPrototype.edges
    .filter(edge=>edge.navigation)
    .map(edge=>[edge.source,edge.target]),
  currentWorld:null,
  hit:[],
  navigationHit:[],
  selectedId:null,
  pointers:new Map(),
  gesture:null,
  entryTransition:null,
  hintTimer:null
};

const colors={
  universe:"#8b6cff",
  root:"#8b6cff",
  account:"#9a7cff",
  artist:"#25c6f7",
  year:"#f4ad45",
  genre:"#39d98a",
  release:"#f15a9c",
  track:"#d9deea"
};

const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const FIT_OCCUPANCY=.80;
const EDGE_BACK_START_PX=28;
const EDGE_BACK_DISTANCE_PX=64;
const EDGE_BACK_MAX_VERTICAL_PX=56;

// Deliberately null until a real target-phone benchmark establishes a safe
// immediate expansion budget. Null means explicit confirmation is required.
const EXPAND_ALL_TESTED_IMMEDIATE_NODE_LIMIT=null;

const navUi={
  breadcrumb:$("#breadcrumb"),
  back:$("#navBack"),
  home:$("#navHome"),
  enter:$("#navEnter")
};

const orbitUi=$("#orbitHold");
const nodeHintUi=$("#nodeHint");

const nodeKindLabels=Object.freeze({
  universe:"Всесвіт",
  account:"Акаунт",
  year:"Рік",
  genre:"Жанр",
  artist:"Виконавець",
  release:"Реліз",
  track:"Трек"
});

const nodeUi={
  root:$("#nodeControls"),
  toggle:$("#nodeControlsToggle"),
  expandAll:$("#expandAll"),
  collapseAll:$("#collapseAll"),
  expandNode:$("#expandNode"),
  collapseNode:$("#collapseNode"),
  enter:$("#enterNode"),
  back:$("#backScope"),
  home:$("#homeScope"),
  fit:$("#fit"),
  status:$("#nodeControlStatus")
};

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

const expandGuardUi={
  root:$("#expandGuard"),
  summary:$("#expandGuardSummary"),
  visible:$("#expandGuardVisible"),
  predicted:$("#expandGuardPredicted"),
  budget:$("#expandGuardBudget"),
  cancel:$("#expandGuardCancel"),
  confirm:$("#expandGuardConfirm")
};
let pendingExpandAll=null;

function setGraphSession(next){
  graphSession=next;
  S.saveSession(semanticStorage,G,graphSession);
  renderFilterState();
  renderNodeControls();
  renderNavigationState();
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
  setGraphSession(G.reducer(graphSession,{
    type:G.COMMANDS.RESET_DRAFT_FILTERS,
    defaults:F.defaultFilters()
  }));
  syncDraftControls();
}

function applyDraftFilters(){
  const normalized=F.normalizeFilters(graphSession.draftFilters);
  let next=G.reducer(graphSession,{
    type:G.COMMANDS.RESET_DRAFT_FILTERS,
    defaults:normalized
  });
  next=G.reducer(next,{
    type:G.COMMANDS.APPLY_FILTERS
  });
  next=G.reducer(next,{
    type:G.COMMANDS.SELECT_NODE,
    node:null
  });
  next=G.reducer(next,{
    type:G.COMMANDS.CLOSE_INSPECTOR
  });
  setGraphSession(next);
  syncDraftControls();
  state.selectedId=null;
  $("#inspector").classList.remove("open","track-inspector");
  rebuild();
  fitView();
}

function currentControlCapabilities(){
  const base=N.deriveControlState(
    graphSession,
    state.fullNodes,
    state.fullEdges
  );
  const actions=state.currentWorld&&state.currentWorld.actions;
  if(!actions)return base;

  return {
    ...base,
    canExpandAll:actions.canExpandAll,
    canCollapseAll:actions.canCollapseAll,
    canExpandSelected:actions.canExpandSelected,
    canCollapseSelected:actions.canCollapseSelected,
    canEnter:actions.canEnter,
    canBack:actions.canBack,
    canHome:actions.canHome,
    canFit:actions.canFit
  };
}

function renderNavigationState(){
  if(!navUi.breadcrumb)return;

  const capabilities=currentControlCapabilities();
  const navigation=NAV.deriveNavigationState(
    graphSession,
    capabilities.canEnter
  );

  navUi.back.disabled=!navigation.canBack;
  navUi.home.disabled=!navigation.canHome;
  navUi.enter.disabled=!navigation.canEnter;

  navUi.breadcrumb.replaceChildren();

  for(const item of NAV.breadcrumbItems(graphSession)){
    const wrapper=document.createElement("span");
    wrapper.className="breadcrumb-item";

    const button=document.createElement("button");
    button.type="button";
    button.textContent=item.label;
    button.title=item.label;
    button.dataset.depth=String(item.depth);

    if(item.current){
      button.disabled=true;
      button.setAttribute("aria-current","page");
    }else{
      button.setAttribute(
        "aria-label",
        "Перейти до "+item.label
      );
      button.onclick=()=>jumpToDepth(item.depth);
    }

    wrapper.append(button);
    navUi.breadcrumb.append(wrapper);
  }

  const current=navUi.breadcrumb.querySelector('[aria-current="page"]');
  if(current&&typeof current.scrollIntoView==="function"){
    current.scrollIntoView({
      block:"nearest",
      inline:"nearest"
    });
  }
}

function renderNodeControls(){
  if(!nodeUi.expandAll)return;
  const capabilities=currentControlCapabilities();

  nodeUi.expandAll.disabled=!capabilities.canExpandAll;
  nodeUi.collapseAll.disabled=!capabilities.canCollapseAll;
  nodeUi.expandNode.disabled=!capabilities.canExpandSelected;
  nodeUi.collapseNode.disabled=!capabilities.canCollapseSelected;
  nodeUi.enter.disabled=!capabilities.canEnter;
  nodeUi.back.disabled=!capabilities.canBack;
  nodeUi.home.disabled=!capabilities.canHome;
  nodeUi.fit.disabled=!capabilities.canFit;

  const selected=graphSession.selectedNode;
  const scope=graphSession.currentScope||G.universeNode();
  nodeUi.status.textContent=selected
    ?scope.label+" · "+selected.label
    :scope.label;
  nodeUi.status.title=nodeUi.status.textContent;
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

function layoutMap(nodes){
  const levels={};
  nodes.forEach(n=>(levels[n.l]??=[]).push(n));
  Object.entries(levels).forEach(([level,list])=>{
    list.forEach((n,i)=>{
      n.px=Number(level)*245;
      n.py=45+i*70;
      const radii={
        universe:23,
        account:20,
        year:17,
        genre:15,
        artist:14,
        release:11,
        track:7
      };
      n.r=radii[n.kind]||9;
    });
  });
}

function layoutSphere(nodes){
  const scopeId=graphSession.currentScope&&graphSession.currentScope.id;
  const focus=nodes.find(n=>n.id===scopeId)||null;
  if(focus){
    focus.sx=0;
    focus.sy=0;
    focus.sz=0;
    focus.sphereRole="focus";
  }

  const orbitNodes=nodes
    .filter(n=>!focus||n.id!==focus.id)
    .sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  const count=orbitNodes.length;
  const goldenAngle=Math.PI*(3-Math.sqrt(5));

  orbitNodes.forEach((n,i)=>{
    const y=count<=1?0:1-2*((i+.5)/count);
    const ring=Math.sqrt(Math.max(0,1-y*y));
    const theta=i*goldenAngle;
    n.sx=ring*Math.cos(theta);
    n.sy=y;
    n.sz=ring*Math.sin(theta);
    n.sphereRole="orbit";
  });
}

function rebuild(){
  const world=P.projectWorld(
    canonicalPrototype,
    graphSession,
    {rendererHint:state.view}
  );
  state.currentWorld=world;

  state.nodes=world.nodes.map(node=>({
    ...node,
    l:node.projection.depth,
    meta:{
      canonicalId:node.canonicalId||node.id,
      contextPath:node.contextPath||[],
      facets:node.facets||{},
      projection:node.projection,
      account:node.account||null,
      artist:node.artist||null,
      release:node.release||null,
      track:node.track||null,
      prototypeOnly:Boolean(node.meta&&node.meta.prototypeOnly)
    }
  }));
  state.edges=world.edges.map(edge=>[edge.source,edge.target]);

  layoutMap(state.nodes);
  layoutSphere(state.nodes);

  const visibleIds=new Set(state.nodes.map(n=>n.id));
  if(graphSession.selectedNode&&!visibleIds.has(graphSession.selectedNode.id)){
    let nextSession=G.reducer(graphSession,{
      type:G.COMMANDS.SELECT_NODE,
      node:null
    });
    nextSession=G.reducer(nextSession,{
      type:G.COMMANDS.CLOSE_INSPECTOR
    });
    setGraphSession(nextSession);
    state.selectedId=null;
    $("#inspector").classList.remove("open","track-inspector");
  }else{
    state.selectedId=graphSession.selectedNode?graphSession.selectedNode.id:null;
  }

  const activeFilters=F.activeFilterCount(graphSession.appliedFilters);
  const next=world.nextKind||"terminal";
  $("#stats").innerHTML=
    "<b>"+world.scope.label+"</b> scope<br>"+
    "<b>"+world.metrics.visibleNodeCount+"</b> видимих вузлів<br>"+
    "<b>"+world.metrics.directChildCount+"</b> прямих "+next+"<br>"+
    "<b>"+world.metrics.predictedFullyExpandedNodeCount+"</b> вузлів при full expand<br>"+
    "<b>"+activeFilters+"</b> активних фільтрів";
  $("#viewBadge").textContent=
    (state.view==="map"?"2D Map":"Sphere 3D")+" · "+world.scopeKind;

  renderNodeControls();
  renderNavigationState();
  renderInspectorState();
  syncOrbitControl();
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
    x:r.width/2+state.spherePanX+x1*radius*perspective,
    y:r.height/2+state.spherePanY-y2*radius*perspective,
    z:z2,
    p:perspective
  };
}

function position(n){
  return state.view==="map"?mapPosition(n):spherePosition(n);
}

function showNodeHint(node,point,prefix){
  if(!nodeHintUi||!node||!point)return;
  if(state.hintTimer)clearTimeout(state.hintTimer);

  const kind=nodeKindLabels[node.kind]||"Нода";
  nodeHintUi.textContent=(prefix?prefix+" · ":"")+kind+" · "+node.label;
  nodeHintUi.style.left=point.x+"px";
  nodeHintUi.style.top=point.y+"px";
  nodeHintUi.classList.remove("fading");
  nodeHintUi.classList.add("visible");

  state.hintTimer=setTimeout(()=>{
    nodeHintUi.classList.add("fading");
    state.hintTimer=setTimeout(()=>{
      nodeHintUi.classList.remove("visible","fading");
      state.hintTimer=null;
    },220);
  },760);
}

function startEntryTransition(fromPoint){
  if(!state.entryTransition){
    state.entryTransition={
      from:{x:fromPoint.x,y:fromPoint.y},
      startedAt:performance.now(),
      duration:300
    };
  }

  function tick(now){
    const tr=state.entryTransition;
    if(!tr)return;
    if(now-tr.startedAt>=tr.duration){
      state.entryTransition=null;
      draw();
      return;
    }
    draw();
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function entryTransitionProgress(){
  const tr=state.entryTransition;
  if(!tr)return 1;
  const raw=clamp((performance.now()-tr.startedAt)/tr.duration,0,1);
  return 1-Math.pow(1-raw,3);
}

function drawScopeTrail(width,height){
  state.navigationHit=[];
  if(state.view!=="sphere")return;

  const path=Array.isArray(graphSession.drillPath)?graphSession.drillPath:[];
  if(path.length<=1)return;

  const cx=width/2+state.spherePanX;
  const cy=height/2+state.spherePanY;
  const ancestors=path.slice(0,-1).slice(-3).reverse();

  ancestors.forEach((node,index)=>{
    const distance=index+1;
    const x=cx-26*distance;
    const y=cy+20*distance;
    const radius=Math.max(7,13-distance*1.5);
    const alpha=Math.max(.08,.30-distance*.065);

    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.strokeStyle=colors[node.kind]||"#8b6cff";
    ctx.fillStyle="rgba(139,108,255,.16)";
    ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(cx,cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();

    if(index===0){
      ctx.globalAlpha=.54;
      ctx.fillStyle="#cbd3e6";
      ctx.font="11px system-ui";
      ctx.fillText("← "+node.label,x+radius+6,y+4);
    }
    ctx.restore();

    state.navigationHit.push({
      depth:path.length-2-index,
      node,
      x,
      y,
      r:Math.max(22,radius+7)
    });
  });
}

function navigationHitTest(point){
  const candidates=(state.navigationHit||[])
    .map(hit=>({...hit,d:Math.hypot(hit.x-point.x,hit.y-point.y)}))
    .filter(hit=>hit.d<=hit.r)
    .sort((a,b)=>a.d-b.d);
  return candidates.length?candidates[0]:null;
}

function drawSphereGuide(width,height){
  const radius=Math.min(width,height)*0.37*state.sphereZoom;
  const cx=width/2+state.spherePanX;
  const cy=height/2+state.spherePanY;
  ctx.save();
  ctx.strokeStyle="rgba(139,108,255,.24)";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.arc(cx,cy,radius,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx,cy,radius,radius*.25,state.yaw,0,Math.PI*2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx,cy,radius*.25,radius,state.pitch,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

function draw(){
  const r=canvas.getBoundingClientRect();
  ctx.clearRect(0,0,r.width,r.height);
  if(!state.nodes.length)return;

  if(state.view==="sphere"){
    drawSphereGuide(r.width,r.height);
    drawScopeTrail(r.width,r.height);
  }else{
    state.navigationHit=[];
  }

  const transitionT=entryTransitionProgress();
  const scopeId=graphSession.currentScope&&graphSession.currentScope.id;
  const scopeNode=state.nodes.find(n=>n.id===scopeId)||null;
  const scopeBase=scopeNode?position(scopeNode):{x:r.width/2,y:r.height/2,z:0,p:1};

  function visualFor(n){
    const base=position(n);
    if(!state.entryTransition)return {p:base,alpha:1,scale:1};

    if(n.id===scopeId){
      return {
        p:{
          ...base,
          x:state.entryTransition.from.x+(base.x-state.entryTransition.from.x)*transitionT,
          y:state.entryTransition.from.y+(base.y-state.entryTransition.from.y)*transitionT
        },
        alpha:1,
        scale:1.28-.28*transitionT
      };
    }

    return {
      p:{
        ...base,
        x:scopeBase.x+(base.x-scopeBase.x)*transitionT,
        y:scopeBase.y+(base.y-scopeBase.y)*transitionT
      },
      alpha:transitionT,
      scale:.72+.28*transitionT
    };
  }

  const visualById=new Map(
    state.nodes.map(n=>[n.id,{n,...visualFor(n)}])
  );

  for(const [a,b] of state.edges){
    const A=visualById.get(a);
    const B=visualById.get(b);
    if(!A||!B)continue;
    const pa=A.p;
    const pb=B.p;
    const depth=state.view==="sphere"?clamp(((pa.z+pb.z)/2+1)/2,0,1):1;
    ctx.save();
    ctx.globalAlpha=(state.view==="sphere"?.14+.48*depth:.65)*Math.min(A.alpha,B.alpha);
    ctx.strokeStyle="#4a5368";
    ctx.lineWidth=state.view==="sphere"?Math.max(.6,1.1*depth):1;
    ctx.beginPath();
    ctx.moveTo(pa.x,pa.y);
    ctx.lineTo(pb.x,pb.y);
    ctx.stroke();
    ctx.restore();
  }

  const ordered=[...visualById.values()];
  if(state.view==="sphere")ordered.sort((a,b)=>a.p.z-b.p.z);

  state.hit=[];
  for(const item of ordered){
    const n=item.n;
    const p=item.p;
    const base=n.r||8;
    const depthScale=(state.view==="sphere"?(.62+(p.z+1)*.26):state.scale)*item.scale;
    const rr=clamp(base*depthScale,4,30);
    const selected=n.id===state.selectedId;

    ctx.save();
    ctx.globalAlpha=(state.view==="sphere"?clamp(.38+(p.z+1)*.31,.3,1):1)*item.alpha;
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

function detailText(value){
  return value==null||value===""?"Невідомо":String(value);
}

function appendDetailRows(parent,title,rows){
  const section=document.createElement("section");
  section.className="track-detail-group";

  const heading=document.createElement("h3");
  heading.textContent=title;
  section.append(heading);

  const list=document.createElement("dl");
  list.className="track-detail-kv";

  for(const row of rows){
    const term=document.createElement("dt");
    term.textContent=row.label;
    const value=document.createElement("dd");
    value.textContent=detailText(row.value);
    if(row.mono)value.className="track-detail-code";
    list.append(term,value);
  }

  section.append(list);
  parent.append(section);
}

function appendDetailItems(parent,title,items,emptyText){
  const section=document.createElement("section");
  section.className="track-detail-group";

  const heading=document.createElement("h3");
  heading.textContent=title;
  section.append(heading);

  if(!items.length){
    const empty=document.createElement("p");
    empty.className="track-detail-empty";
    empty.textContent=emptyText||"Невідомо";
    section.append(empty);
  }else{
    const list=document.createElement("ul");
    list.className="track-detail-list";
    for(const text of items){
      const item=document.createElement("li");
      item.textContent=text;
      list.append(item);
    }
    section.append(list);
  }

  parent.append(section);
}

function renderTrackDetails(container,model){
  const article=document.createElement("article");
  article.className="track-detail";

  const header=document.createElement("header");
  header.className="track-detail-header";

  const pill=document.createElement("span");
  pill.className="pill";
  pill.textContent="Track";

  const title=document.createElement("h2");
  title.textContent=model.identity.title;

  const terminal=document.createElement("span");
  terminal.className="track-detail-terminal";
  terminal.textContent="Деталі треку";

  header.append(pill,title,terminal);
  article.append(header);

  appendDetailRows(article,"Де ви зараз",[
    {label:"Акаунт",value:model.currentContext.account&&model.currentContext.account.label},
    {label:"Рік",value:model.currentContext.year&&model.currentContext.year.label},
    {label:"Жанр",value:model.currentContext.genre&&model.currentContext.genre.label},
    {label:"Виконавець",value:model.currentContext.artist&&model.currentContext.artist.name},
    {label:"Реліз",value:model.currentContext.release&&model.currentContext.release.title},
    {label:"№ у релізі",value:model.identity.position}
  ]);

  appendDetailItems(
    article,
    "У бібліотеці",
    [
      ...model.appearances.accounts.map(item=>
        item.label+(item.handle?" · "+item.handle:"")
      ),
      "Плейлисти: "+(model.playlists.state==="unknown"?"ще не завантажено":model.playlists.state)
    ],
    "Дані бібліотеки ще не завантажені."
  );

  const mediaSection=document.createElement("section");
  mediaSection.className="track-detail-group";
  const mediaHeading=document.createElement("h3");
  mediaHeading.textContent="YouTube / YouTube Music";
  const mediaText=document.createElement("p");
  mediaText.className="track-detail-empty";
  const mediaKnown=Boolean(
    model.externalMedia.youtube.videoId||
    model.externalMedia.youtube.url||
    model.externalMedia.youtubeMusic.itemId||
    model.externalMedia.youtubeMusic.url
  );
  mediaText.textContent=mediaKnown
    ?"Для треку є зовнішні медіадані."
    :"Посилання та media ID ще не завантажені.";
  mediaSection.append(mediaHeading,mediaText);
  article.append(mediaSection);

  const dataSection=document.createElement("section");
  dataSection.className="track-detail-group track-detail-data-state";
  const dataHeading=document.createElement("h3");
  dataHeading.textContent="Стан даних";
  const dataText=document.createElement("p");
  dataText.className="track-detail-empty";
  dataText.textContent=
    "Каталог поки прототипний: точні YouTube/YTM дані, тривалість і зв’язки версій ще перевіряються.";
  dataSection.append(dataHeading,dataText);
  article.append(dataSection);

  const technical=document.createElement("details");
  technical.className="track-detail-technical";
  const summary=document.createElement("summary");
  summary.textContent="Технічні дані";
  const technicalBody=document.createElement("div");
  technicalBody.className="track-detail-technical-body";

  appendDetailRows(technicalBody,"Ідентичність",[
    {label:"Canonical ID",value:model.identity.canonicalId,mono:true},
    {label:"Projection ID",value:model.identity.projectionId,mono:true}
  ]);

  appendDetailRows(technicalBody,"Версія / перевірка",[
    {label:"TrackVersion",value:model.version.state==="unmodeled"?"Ще не змодельовано":model.version.state},
    {label:"Version relationships",value:model.version.relationships.length||"Невідомо"},
    {label:"Verification",value:model.version.verification},
    {label:"Availability",value:model.availability.state},
    {
      label:"Duration",
      value:model.availability.durationSeconds==null
        ?"Невідомо"
        :model.availability.durationSeconds+" s"
    },
    {label:"Assignment status",value:model.provenance.assignmentStatus,mono:true},
    {
      label:"Live account inventory",
      value:model.provenance.liveAccountInventoryVerified?"Перевірено":"Не перевірено"
    },
    {label:"Duplicate/mismatch review",value:model.review.status}
  ]);

  appendDetailRows(technicalBody,"Зовнішні ID",[
    {label:"YouTube videoId",value:model.externalMedia.youtube.videoId,mono:true},
    {label:"YouTube URL",value:model.externalMedia.youtube.url,mono:true},
    {label:"YTM itemId",value:model.externalMedia.youtubeMusic.itemId,mono:true},
    {label:"YTM URL",value:model.externalMedia.youtubeMusic.url,mono:true}
  ]);

  const warningSection=document.createElement("section");
  warningSection.className="track-detail-group";
  const warningHeading=document.createElement("h3");
  warningHeading.textContent="Попередження";
  warningSection.append(warningHeading);
  const warnings=document.createElement("ul");
  warnings.className="track-detail-list track-detail-warnings";
  for(const warning of model.warnings){
    const item=document.createElement("li");
    item.className="track-detail-warning";
    item.dataset.code=warning.code;
    item.textContent=warning.message;
    warnings.append(item);
  }
  warningSection.append(warnings);
  technicalBody.append(warningSection);

  technical.append(summary,technicalBody);
  article.append(technical);
  container.append(article);
}

function renderInspectorNode(n){
  const details=$("#details");
  const inspector=$("#inspector");

  if(n.kind!=="track"){
    inspector.classList.remove("open","track-inspector");
    details.textContent="";
    return;
  }

  details.textContent="";
  inspector.classList.add("track-inspector");

  const model=T.buildTrackDetails(canonicalPrototype,n.id,{
    assignmentStatus:X.assignments.status
  });
  renderTrackDetails(details,model);
  inspector.classList.add("open");
}

function renderInspectorState(){
  const inspector=$("#inspector");
  const stateValue=graphSession.inspector||{open:false};

  if(!stateValue.open||!stateValue.nodeId){
    inspector.classList.remove("open","track-inspector");
    return;
  }

  const node=canonicalPrototype.byId.get(stateValue.nodeId);
  if(!node||node.kind!=="track"){
    inspector.classList.remove("open","track-inspector");
    return;
  }

  renderInspectorNode(node);
}

function selectNode(n){
  state.selectedId=n.id;
  let next=G.reducer(graphSession,{
    type:G.COMMANDS.SELECT_NODE,
    node:{id:n.id,kind:n.kind,label:n.label}
  });

  if(n.kind==="track"){
    next=G.reducer(next,{
      type:G.COMMANDS.OPEN_INSPECTOR,
      nodeId:n.id,
      mode:"track-terminal"
    });
  }else{
    next=G.reducer(next,{
      type:G.COMMANDS.CLOSE_INSPECTOR
    });
  }

  setGraphSession(next);
  rebuild();
}

function nodeCanDrill(n){
  if(!n||n.kind==="track")return false;
  if(graphSession.currentScope&&n.id===graphSession.currentScope.id)return false;
  return state.fullEdges.some(([source])=>source===n.id);
}

function activateNode(n){
  if(!n)return;
  if(n.kind==="track"||!nodeCanDrill(n)){
    selectNode(n);
    return;
  }

  const fromPoint=position(n);
  const semanticNode={id:n.id,kind:n.kind,label:n.label};
  let next=G.reducer(graphSession,{
    type:G.COMMANDS.SELECT_NODE,
    node:semanticNode
  });
  next=G.reducer(next,{type:G.COMMANDS.CLOSE_INSPECTOR});
  next=G.reducer(next,{
    type:G.COMMANDS.ENTER_NODE,
    node:semanticNode,
    defaultFilters:F.defaultFilters()
  });

  state.entryTransition={
    from:{x:fromPoint.x,y:fromPoint.y},
    startedAt:performance.now(),
    duration:300
  };
  setGraphSession(next);
  state.selectedId=null;
  syncDraftControls();
  setNodeControlsOpen(false);
  rebuild();
  fitView();
  startEntryTransition(fromPoint);
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
    state.spherePanX=0;
    state.spherePanY=0;
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
  const w=Math.max(1,maxX-minX);
  const h=Math.max(1,maxY-minY);
  const usableWidth=Math.max(1,r.width*FIT_OCCUPANCY);
  const usableHeight=Math.max(1,r.height*FIT_OCCUPANCY);
  state.scale=clamp(Math.min(usableWidth/w,usableHeight/h),.28,2.2);
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
      startedAt:performance.now(),
      start:{...points[0]},
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
    }else if(state.orbitHold){
      state.yaw+=dx*.009;
      state.pitch=clamp(state.pitch+dy*.009,-1.42,1.42);
    }else{
      state.spherePanX+=dx;
      state.spherePanY+=dy;
    }
    draw();
  }
});

function isEdgeBackGesture(g,end){
  if(!g||g.multi||!g.start)return false;
  const dx=end.x-g.start.x;
  const dy=end.y-g.start.y;
  return (
    g.start.x<=EDGE_BACK_START_PX&&
    dx>=EDGE_BACK_DISTANCE_PX&&
    Math.abs(dy)<=EDGE_BACK_MAX_VERTICAL_PX
  );
}

function endPointer(e){
  const end=pointFromEvent(e);
  state.pointers.delete(e.pointerId);

  if(state.pointers.size===0){
    const g=state.gesture;

    if(isEdgeBackGesture(g,end)&&graphSession.drillPath.length>1){
      state.gesture=null;
      goBackScope();
      return;
    }

    if(g&&!g.multi&&g.moved<8){
      const navigationTarget=navigationHitTest(end);
      if(navigationTarget){
        showNodeHint(navigationTarget.node,end,"Назад");
        setNodeControlsOpen(false);
        jumpToDepth(navigationTarget.depth);
        state.gesture=null;
        return;
      }

      const node=hitTest(end);
      if(node){
        showNodeHint(node,end);
        const heldFor=performance.now()-(g.startedAt||performance.now());
        if(heldFor>=450)selectNode(node);
        else activateNode(node);
      }else{
        if(graphSession.inspector&&graphSession.inspector.open){
          closeInspector();
        }
        if(nodeUi.root&&nodeUi.root.classList.contains("mobile-open")){
          setNodeControlsOpen(false);
        }
      }
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

function setOrbitHold(active){
  state.orbitHold=Boolean(active)&&state.view==="sphere";
  if(!orbitUi)return;
  orbitUi.classList.toggle("active",state.orbitHold);
  orbitUi.setAttribute("aria-pressed",String(state.orbitHold));
}

function syncOrbitControl(){
  if(!orbitUi)return;
  orbitUi.hidden=state.view!=="sphere";
  if(orbitUi.hidden)setOrbitHold(false);
}

if(orbitUi){
  orbitUi.addEventListener("pointerdown",e=>{
    e.preventDefault();
    try{orbitUi.setPointerCapture(e.pointerId)}catch(_){}
    setOrbitHold(true);
  });
  orbitUi.addEventListener("pointerup",()=>setOrbitHold(false));
  orbitUi.addEventListener("pointercancel",()=>setOrbitHold(false));
}
addEventListener("blur",()=>setOrbitHold(false));

function setNodeControlsOpen(open){
  if(!nodeUi.root||!nodeUi.toggle)return;
  const next=Boolean(open);
  nodeUi.root.classList.toggle("mobile-open",next);
  nodeUi.toggle.setAttribute("aria-expanded",String(next));
}

if(nodeUi.toggle){
  nodeUi.toggle.onclick=()=>setNodeControlsOpen(
    !nodeUi.root.classList.contains("mobile-open")
  );
}
nodeUi.fit.onclick=fitView;

function refreshAfterNodeCommand(options){
  const opts=options||{};
  if(opts.syncFilters)syncDraftControls();
  rebuild();
  if(opts.fit!==false)fitView();
}

function closeExpandGuard(options){
  const opts=options||{};
  expandGuardUi.root.hidden=true;
  pendingExpandAll=null;
  if(opts.restoreFocus!==false){
    nodeUi.expandAll.focus();
  }
}

function openExpandGuard(plan){
  pendingExpandAll=plan;
  const assessment=plan.assessment;

  expandGuardUi.summary.textContent=
    assessment.reason==="UNMEASURED_DEVICE_BUDGET"
      ?"Безпечний auto-expand ліміт ще не виміряний на цільовому телефоні. Потрібне явне підтвердження."
      :"Прогноз перевищує перевірений ліміт цього пристрою. Потрібне явне підтвердження.";
  expandGuardUi.visible.textContent=String(assessment.visibleNodeCount);
  expandGuardUi.predicted.textContent=
    String(assessment.predictedFullyExpandedNodeCount)+
    " (+"+assessment.additionalNodeCount+")";
  expandGuardUi.budget.textContent=
    assessment.testedImmediateNodeLimit==null
      ?"Ще не виміряно"
      :String(assessment.testedImmediateNodeLimit);
  expandGuardUi.root.hidden=false;
  expandGuardUi.cancel.focus();
}

function applyExpandPlan(plan,confirmed){
  const next=E.applyDecision(
    G,
    graphSession,
    plan.ids,
    plan.assessment,
    confirmed
  );
  if(next===graphSession)return false;
  setGraphSession(next);
  refreshAfterNodeCommand({closeInspector:false});
  return true;
}

function requestExpandAll(){
  const world=state.currentWorld;
  if(!world)return;

  const ids=(world.bulkExpandNodeIds||[])
    .filter(id=>!(graphSession.expandedNodeIds||[]).includes(id));
  const assessment=E.assess({
    visibleNodeCount:world.metrics.visibleNodeCount,
    predictedFullyExpandedNodeCount:world.metrics.predictedFullyExpandedNodeCount,
    testedImmediateNodeLimit:EXPAND_ALL_TESTED_IMMEDIATE_NODE_LIMIT
  });
  const plan={ids,assessment};

  if(assessment.action==="noop")return;
  if(assessment.action==="apply"){
    applyExpandPlan(plan,false);
    return;
  }
  openExpandGuard(plan);
}

nodeUi.expandAll.onclick=requestExpandAll;

expandGuardUi.cancel.onclick=()=>closeExpandGuard();
expandGuardUi.root.onclick=e=>{
  if(e.target===expandGuardUi.root)closeExpandGuard();
};
expandGuardUi.confirm.onclick=()=>{
  const plan=pendingExpandAll;
  if(!plan)return;
  closeExpandGuard({restoreFocus:false});
  applyExpandPlan(plan,true);
  nodeUi.expandAll.focus();
};

nodeUi.collapseAll.onclick=()=>{
  const ids=state.currentWorld
    ?state.currentWorld.bulkExpandNodeIds||[]
    :[];
  dispatchGraph({
    type:G.COMMANDS.COLLAPSE_ALL,
    ids
  });
  refreshAfterNodeCommand({closeInspector:false});
};

nodeUi.expandNode.onclick=()=>{
  if(!graphSession.selectedNode)return;
  dispatchGraph({
    type:G.COMMANDS.EXPAND_NODE,
    id:graphSession.selectedNode.id
  });
  refreshAfterNodeCommand({closeInspector:false});
};

nodeUi.collapseNode.onclick=()=>{
  if(!graphSession.selectedNode)return;
  dispatchGraph({
    type:G.COMMANDS.COLLAPSE_NODE,
    id:graphSession.selectedNode.id
  });
  refreshAfterNodeCommand({closeInspector:false});
};

function enterSelectedScope(){
  if(!graphSession.selectedNode)return;
  const capabilities=currentControlCapabilities();
  if(!capabilities.canEnter)return;

  const selected=graphSession.selectedNode;
  dispatchGraph({
    type:G.COMMANDS.ENTER_NODE,
    node:selected,
    defaultFilters:F.defaultFilters()
  });
  state.selectedId=null;
  refreshAfterNodeCommand({syncFilters:true});
}

function goBackScope(){
  if(graphSession.drillPath.length<=1)return;
  dispatchGraph({type:G.COMMANDS.BACK_SCOPE});
  state.selectedId=graphSession.selectedNode?graphSession.selectedNode.id:null;
  refreshAfterNodeCommand({syncFilters:true});
}

function goHomeScope(){
  if(graphSession.currentScope.id==="universe")return;
  dispatchGraph({type:G.COMMANDS.HOME_SCOPE});
  state.selectedId=null;
  refreshAfterNodeCommand({syncFilters:true});
}

function jumpToDepth(depth){
  const currentDepth=graphSession.drillPath.length-1;
  if(!Number.isInteger(depth)||depth<0||depth>=currentDepth)return;
  dispatchGraph({
    type:G.COMMANDS.JUMP_TO_DEPTH,
    depth
  });
  state.selectedId=graphSession.selectedNode?graphSession.selectedNode.id:null;
  refreshAfterNodeCommand({syncFilters:true});
}

nodeUi.enter.onclick=enterSelectedScope;
nodeUi.back.onclick=goBackScope;
nodeUi.home.onclick=goHomeScope;
navUi.enter.onclick=enterSelectedScope;
navUi.back.onclick=goBackScope;
navUi.home.onclick=goHomeScope;

function closeInspector(){
  $("#inspector").classList.remove("open","track-inspector");
  state.selectedId=null;
  let next=G.reducer(graphSession,{
    type:G.COMMANDS.SELECT_NODE,
    node:null
  });
  next=G.reducer(next,{
    type:G.COMMANDS.CLOSE_INSPECTOR
  });
  setGraphSession(next);
  draw();
}

$("#close").onclick=closeInspector;

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

$("#view").onchange=e=>{
  state.view=e.target.value;
  syncOrbitControl();
  dispatchGraph({
    type:G.COMMANDS.SET_RENDERER_MODE,
    mode:e.target.value
  });
  rebuild();
  fitView();
};

document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;
  if(!expandGuardUi.root.hidden){
    closeExpandGuard();
    return;
  }
  if(graphSession.filterPanelOpen){
    setFilterPanelOpen(false);
  }
});

$("#view").value=state.view;
syncDraftControls();
renderFilterState();
renderNavigationState();

addEventListener("resize",resize);
resize();
rebuild();
fitView();
})();
