"use strict";

const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const P=require("../app/graph-projection.js");
const F=require("../app/filter-model.js");
const W=require("../app/nested-world-model.js");
const X=require("../app/prototype-fixtures.js");
const D=require("../app/sample-data.js");
const S=require("../app/session-persistence.js");

class MemoryStorage{
  constructor(){this.data=new Map();}
  getItem(key){return this.data.has(key)?this.data.get(key):null;}
  setItem(key,value){this.data.set(key,String(value));}
  removeItem(key){this.data.delete(key);}
}

const graph=P.createProjectionGraph(
  W.buildNestedGraph(
    X.accountDocument,
    D,
    X.assignments
  )
);

function directChild(state,label){
  const world=P.projectWorld(graph,state);
  const node=world.nodes.find(item=>
    item.projection&&item.projection.role==="child"&&item.label===label
  );
  assert(node,"missing direct child "+label+" under "+state.currentScope.label);
  return node;
}

function enter(state,label){
  const child=directChild(state,label);
  state=G.reducer(state,{
    type:G.COMMANDS.SELECT_NODE,
    node:child
  });
  return G.reducer(state,{
    type:G.COMMANDS.ENTER_NODE,
    node:child,
    defaultFilters:F.defaultFilters()
  });
}

let state=G.createInitialState({
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
state=enter(state,"FARIC UA");
state=enter(state,"1994");
state=enter(state,"Big Beat");
state=enter(state,"The Prodigy");
state=enter(state,"Music for the Jilted Generation");

state=G.reducer(state,{
  type:G.COMMANDS.SET_DRAFT_FILTER,
  key:"search",
  value:"voodoo"
});
state=G.reducer(state,{type:G.COMMANDS.APPLY_FILTERS});

const track=directChild(state,"Voodoo People");
state=G.reducer(state,{
  type:G.COMMANDS.SELECT_NODE,
  node:track
});
state=G.reducer(state,{
  type:G.COMMANDS.OPEN_INSPECTOR,
  nodeId:track.id,
  mode:"track-terminal"
});
state=G.reducer(state,{
  type:G.COMMANDS.SET_FILTER_PANEL_OPEN,
  open:true
});
state=G.reducer(state,{
  type:G.COMMANDS.SET_DRAFT_FILTER,
  key:"search",
  value:"Voodoo People"
});
state=G.reducer(state,{
  type:G.COMMANDS.SET_RENDERER_MODE,
  mode:"sphere"
});

assert.equal(G.filtersPending(state),true);
assert.equal(state.drillPath.length,6);
assert.equal(state.selectedNode.id,track.id);
assert.equal(state.filterPanelOpen,true);
assert.equal(state.inspector.open,true);

const storage=new MemoryStorage();
assert.equal(S.saveSession(storage,G,state),true);

const noReplayGraphState={
  ...G,
  reducer(){
    throw new Error("restore must not dispatch semantic commands");
  }
};

const result=S.restoreSession({
  storage,
  graphState:noReplayGraphState,
  graph,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});

assert.equal(result.restored,true);
assert.equal(result.reason,"ok");
const restored=result.state;
assert.deepEqual(
  restored.drillPath.map(node=>node.id),
  state.drillPath.map(node=>node.id),
  "drill path must restore without replaying Enter"
);
assert.equal(restored.currentScope.id,state.currentScope.id);
assert.equal(restored.selectedNode.id,track.id);
assert.deepEqual(restored.appliedFilters,state.appliedFilters);
assert.deepEqual(restored.draftFilters,state.draftFilters);
assert.equal(G.filtersPending(restored),true);
assert.equal(restored.filterPanelOpen,true);
assert.deepEqual(restored.inspector,{
  open:true,
  nodeId:track.id,
  mode:"track-terminal"
});
assert.equal(restored.rendererMode,"sphere");
assert.equal(restored.history.length,state.history.length);

const restoredWorld=P.projectWorld(graph,restored);
assert(
  restoredWorld.nodes.some(node=>node.id===track.id),
  "restored selected Track must still be present in the restored world"
);

const inspectorCorrupt=JSON.parse(G.serializeState(state));
inspectorCorrupt.inspector={
  open:true,
  nodeId:"missing:track",
  mode:"track-terminal"
};
storage.setItem(S.STORAGE_KEY,JSON.stringify(inspectorCorrupt));
const inspectorResult=S.restoreSession({
  storage,
  graphState:G,
  graph,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
assert.equal(inspectorResult.restored,true);
assert.deepEqual(inspectorResult.state.inspector,{
  open:false,
  nodeId:null,
  mode:null
});
assert.equal(
  inspectorResult.state.selectedNode.id,
  track.id,
  "invalid inspector target must not discard otherwise-valid semantic selection"
);

const stale=JSON.parse(G.serializeState(state));
stale.drillPath[stale.drillPath.length-1]={
  id:"missing:release",
  kind:"release",
  label:"Missing"
};
stale.currentScope=stale.drillPath[stale.drillPath.length-1];
storage.setItem(S.STORAGE_KEY,JSON.stringify(stale));
const staleResult=S.restoreSession({
  storage,
  graphState:G,
  graph,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
assert.equal(staleResult.restored,false);
assert.equal(staleResult.reason,"invalid_graph_path");
assert.equal(staleResult.state.currentScope.id,"universe");
assert.equal(storage.getItem(S.STORAGE_KEY),null,"stale semantic path must be discarded");

storage.setItem(S.STORAGE_KEY,"{not json");
const invalidResult=S.restoreSession({
  storage,
  graphState:G,
  graph,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
assert.equal(invalidResult.restored,false);
assert.equal(invalidResult.reason,"invalid_serialized_state");
assert.equal(invalidResult.state.currentScope.id,"universe");

const blockedStorage={
  getItem(){throw new Error("blocked");},
  setItem(){throw new Error("blocked");},
  removeItem(){throw new Error("blocked");}
};
const blockedResult=S.restoreSession({
  storage:blockedStorage,
  graphState:G,
  graph,
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
assert.equal(blockedResult.restored,false);
assert.equal(blockedResult.state.currentScope.id,"universe");
assert.equal(S.saveSession(blockedStorage,G,state),false);

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const app=fs.readFileSync(path.join(root,"app/app.js"),"utf8");

assert(html.includes('src="session-persistence.js"'));
assert(app.includes("S.restoreSession"));
assert(app.includes("S.saveSession"));
assert(app.includes("renderInspectorState"));
assert(app.includes('$("#view").value=state.view'));
assert(app.includes("window.localStorage"));

console.log("PASS: semantic session restoration contract tests");
