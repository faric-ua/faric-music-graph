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

console.log("PASS: floating node-control palette model/wiring contract tests");
