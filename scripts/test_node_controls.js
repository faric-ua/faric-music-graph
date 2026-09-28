"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const G=require("../app/graph-state.js");
const NC=require("../app/node-controls.js");

function node(id,kind,label){
  return {id,kind,label:label||id};
}

let s=G.createInitialState({defaultFilters:{search:""}});
s=G.reducer(s,{
  type:G.COMMANDS.SELECT_NODE,
  node:node("account:a","account","Account A")
});

const context={
  visibleNodeIds:["universe","account:a","account:b"],
  expandableNodeIds:["account:a","account:b"],
  enterableNodeIds:["account:a"]
};

let controls=NC.deriveControlState(s,context);
assert.equal(G.COMMANDS.FIT_VIEW,"FIT_VIEW");
assert.equal(controls.canExpandSelected,true);
assert.equal(controls.canCollapseSelected,false);
assert.equal(controls.canEnter,true);
assert.equal(controls.canBack,false);
assert.equal(controls.canFit,true);

s=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  defaultFilters:{search:""}
},G.COMMANDS.EXPAND_NODE);
assert.deepEqual(s.expandedNodeIds,["account:a"]);

controls=NC.deriveControlState(s,context);
assert.equal(controls.canExpandSelected,false);
assert.equal(controls.canCollapseSelected,true);
assert.equal(controls.canCollapseAll,true);

s=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  defaultFilters:{search:""}
},G.COMMANDS.EXPAND_ALL);
assert.deepEqual([...s.expandedNodeIds].sort(),["account:a","account:b"]);

s=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  defaultFilters:{search:""}
},G.COMMANDS.COLLAPSE_NODE);
assert.equal(s.expandedNodeIds.includes("account:a"),false);
assert.equal(s.collapsedNodeIds.includes("account:a"),true);

let fitCalls=0;
const beforeFit=G.serializeState(s);
const afterFit=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  fitView:()=>{fitCalls+=1;}
},G.COMMANDS.FIT_VIEW);
assert.equal(fitCalls,1);
assert.equal(G.serializeState(afterFit),beforeFit,"FIT_VIEW must not pollute durable session state");

s=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  defaultFilters:()=>({search:""})
},G.COMMANDS.ENTER_NODE);
assert.equal(s.currentScope.id,"account:a");
assert.deepEqual(s.drillPath.map(n=>n.id),["universe","account:a"]);

let nestedContext={
  visibleNodeIds:["account:a","year:1997"],
  expandableNodeIds:["year:1997"],
  enterableNodeIds:["year:1997"]
};
controls=NC.deriveControlState(s,nestedContext);
assert.equal(controls.canBack,true);
assert.equal(controls.canHome,true);

s=NC.executeCommand({
  graphState:G,
  state:s,
  context:nestedContext
},G.COMMANDS.BACK_SCOPE);
assert.equal(s.currentScope.id,"universe");

s=G.reducer(s,{type:G.COMMANDS.SELECT_NODE,node:node("account:a","account","Account A")});
s=NC.executeCommand({
  graphState:G,
  state:s,
  context,
  defaultFilters:{}
},G.COMMANDS.ENTER_NODE);
s=NC.executeCommand({
  graphState:G,
  state:s,
  context:nestedContext
},G.COMMANDS.HOME_SCOPE);
assert.equal(s.currentScope.id,"universe");
assert.equal(s.drillPath.length,1);

const html=fs.readFileSync(path.join(__dirname,"../app/index.html"),"utf8");
const css=fs.readFileSync(path.join(__dirname,"../app/app.css"),"utf8");
for(const id of [
  "expandAll","collapseAll","expandNode","collapseNode",
  "backScope","enterNode","homeScope","fitView"
]){
  assert.ok(html.includes('id="'+id+'"'),"missing palette control "+id);
}
assert.ok(html.includes('src="node-controls.js"'),"node-controls.js must load in app");
assert.ok(css.includes("background:rgba(20,23,32,.52)"),"palette must use approximately 50% transparent background");

console.log("PASS: floating node-control palette command contract tests");
