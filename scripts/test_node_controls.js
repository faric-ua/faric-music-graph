"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const N=require("../app/node-controls.js");

const nodes=[
  {id:"universe",kind:"universe",label:"Universe"},
  {id:"artist:a",kind:"artist",label:"Artist A"},
  {id:"release:a",kind:"release",label:"Release A"},
  {id:"track:a",kind:"track",label:"Track A"},
  {id:"artist:b",kind:"artist",label:"Artist B"}
];
const edges=[
  ["universe","artist:a"],
  ["artist:a","release:a"],
  ["release:a","track:a"],
  ["universe","artist:b"]
];

assert.deepEqual(
  N.expandableNodeIds(nodes,edges).sort(),
  ["artist:a","release:a","universe"].sort()
);

let state=G.createInitialState();
let controls=N.deriveControlState(state,nodes,edges);
assert.equal(controls.canBack,false);
assert.equal(controls.canHome,false);
assert.equal(controls.canEnter,false);
assert.equal(controls.canExpandAll,true);
assert.equal(controls.canCollapseAll,false);
assert.equal(controls.canFit,true);

state=G.reducer(state,{
  type:G.COMMANDS.SELECT_NODE,
  node:{id:"artist:a",kind:"artist",label:"Artist A"}
});
controls=N.deriveControlState(state,nodes,edges);
assert.equal(controls.canExpandSelected,true);
assert.equal(controls.canCollapseSelected,false);
assert.equal(controls.canEnter,true);

state=G.reducer(state,{type:G.COMMANDS.EXPAND_NODE,id:"artist:a"});
controls=N.deriveControlState(state,nodes,edges);
assert.equal(controls.canExpandSelected,false);
assert.equal(controls.canCollapseSelected,true);
assert.equal(controls.canCollapseAll,true);

state=G.reducer(state,{
  type:G.COMMANDS.ENTER_NODE,
  node:{id:"artist:a",kind:"artist",label:"Artist A"},
  defaultFilters:{}
});
controls=N.deriveControlState(state,nodes,edges);
assert.equal(controls.canBack,true);
assert.equal(controls.canHome,true);
assert.equal(controls.scopeId,"artist:a");

state=G.reducer(state,{
  type:G.COMMANDS.SELECT_NODE,
  node:{id:"track:a",kind:"track",label:"Track A"}
});
controls=N.deriveControlState(state,nodes,edges);
assert.equal(controls.canEnter,false,"terminal node without children must not be enterable");
assert.equal(controls.canExpandSelected,false);

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"app/app.css"),"utf8");
const app=fs.readFileSync(path.join(root,"app/app.js"),"utf8");

for(const id of [
  "expandAll",
  "collapseAll",
  "expandNode",
  "collapseNode",
  "backScope",
  "enterNode",
  "homeScope",
  "fit"
]){
  assert(html.includes('id="'+id+'"'),"missing node control "+id);
}
assert(css.includes("background:rgba(14,16,22,.52)"),"palette must keep approximately 50% transparent surface");
assert(css.includes("min-width:48px;min-height:48px"),"node controls must preserve touch targets");
assert(html.includes('id="nodeControlsToggle"'),"mobile node-control menu toggle is required");
assert(css.includes(".node-controls.mobile-open{display:grid}"),"mobile palette must open only on demand");
assert(css.includes(".mobile-graph-controls{top:8px;right:8px;bottom:auto;gap:6px}"),"mobile quick controls must live in one compact top row");
assert(!app.includes('"track-terminal":"node-debug"'),"non-track selection must not open the debug inspector");
assert(app.includes('if(n.kind==="track"){'),"Track remains the only automatic inspector path");
assert(app.includes("setGraphSession(next);\n  rebuild();"),"selection must rebuild capabilities so Enter becomes available immediately");
assert(app.includes("function activateNode(n){"),"tap activation helper is required");
assert(app.includes("else activateNode(node);"),"short tap must activate/drill directly");
assert(app.includes("heldFor>=450"),"long press must preserve explicit selection for advanced controls");
assert(app.includes("type:G.COMMANDS.ENTER_NODE"),"direct drill must still use semantic ENTER_NODE");
assert(html.includes('id="orbitHold"'),"3D hold-to-orbit control is required");
assert(app.includes("state.orbitHold"),"3D orbit modifier state is required");
assert(app.includes("state.spherePanX+=dx"),"3D drag without HOLD must pan the sphere");
assert(app.includes("state.yaw+=dx*.009"),"3D HOLD drag must rotate the sphere");
assert(css.includes(".orbit-hold.active"),"HOLD control needs an active pressed state");
assert(app.includes("const FIT_OCCUPANCY=.80"),"Fit must reserve about 20% viewport breathing room");
assert(app.includes("function isEdgeBackGesture(g,end){"),"edge-swipe one-level back gesture is required");
assert(app.includes("goBackScope();\n      return;"),"edge-swipe must route through semantic BACK_SCOPE");
assert(app.includes("if(graphSession.inspector&&graphSession.inspector.open){\n          closeInspector();"),"empty graph tap must dismiss Track inspector");
assert(app.includes('nodeUi.root.classList.contains("mobile-open")'),"empty graph tap must dismiss the advanced node menu");
assert(html.includes('aria-label="На рівень вище"'),"header Back must be clearly labeled as one level up");
assert(html.includes('id="nodeHint"'),"transient node feedback hint surface is required");
assert(css.includes(".node-hint.visible"),"node feedback hint needs visible/fade states");
assert(app.includes("function showNodeHint(node,point,prefix){"),"tap feedback hint logic is required");
assert(app.includes('account:"Акаунт"'),"node hints must identify node kind in user-facing language");
assert(app.includes("focus.sx=0;\n    focus.sy=0;\n    focus.sz=0;"),"current Sphere scope must stay at the 3D center");
assert(app.includes("goldenAngle=Math.PI*(3-Math.sqrt(5))"),"Sphere children must use deterministic spherical distribution");
assert(app.includes("function buildHistoryLayers(){"),"semantic history worlds must be reconstructed for 3D background depth");
assert(app.includes("function drawHistoryField(width,height){"),"3D history starfield renderer is required");
assert(app.includes("G.normalizeState({"),"history layers must reconstruct from semantic GraphSessionState snapshots");
assert(app.includes("HISTORY_LAYER_LIMIT=5"),"history starfield must keep a bounded background depth");
assert(app.includes("layerScale=1-(1-layerScale)*transitionT"),"the outgoing world must recede into depth during drill transition");
assert(app.includes("camera:snapshot.camera||{}"),"each prior world must retain its own frozen camera");
assert(app.includes("rotatedSphereCoordsAt(node,camera)"),"history worlds must render from their saved camera rather than active Sphere camera");
assert(app.includes("function rendererCameraSnapshot(){"),"active renderer camera snapshot is required before drill");
assert(app.includes("type:G.COMMANDS.SET_CAMERA"),"drill must persist the current renderer camera into semantic history");
assert(app.includes("function applyRendererCamera(camera){"),"Back must be able to restore the parent camera");
assert(app.includes("applyRendererCamera(graphSession.camera)"),"Back/depth jump must restore the saved parent camera");
assert(app.includes("function startReturnTransition(childFrame){"),"parent world must animate forward on Back");
assert(app.includes("function drawTransientChildFrame(frame,width,height){"),"child world must fade away during Back transition");
assert(app.includes("navigationTarget=navigationHitTest(end)"),"tapping the nearest parent history world must support backward navigation");
assert(app.includes('ctx.fillText("← "+layer.scope.label'),"nearest parent world must expose a visible Back target");
assert(app.includes("function startEntryTransition(fromPoint){"),"drill transition feedback is required");
assert(app.includes("x:scopeBase.x+(base.x-scopeBase.x)*transitionT"),"new child world must expand out from the current focus");
assert(app.includes('showNodeHint(navigationTarget.node,end,"Назад")'),"back ghost tap must provide visible feedback");

console.log("PASS: frozen-history spatial drill, Back restore, dismiss, fit and mobile 3D interaction contract tests");
