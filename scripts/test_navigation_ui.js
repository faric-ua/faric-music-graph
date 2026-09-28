"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const NAV=require("../app/navigation-ui.js");

function node(id,kind,label){
  return {id,kind,label};
}

let state=G.createInitialState();
let items=NAV.breadcrumbItems(state);
assert.equal(items.length,1);
assert.equal(items[0].id,"universe");
assert.equal(items[0].current,true);
assert.equal(items[0].clickable,false);

let nav=NAV.deriveNavigationState(state,false);
assert.equal(nav.canBack,false);
assert.equal(nav.canHome,false);
assert.equal(nav.canEnter,false);

state=G.reducer(state,{
  type:G.COMMANDS.SELECT_NODE,
  node:node("artist:a","artist","Artist A")
});
nav=NAV.deriveNavigationState(state,true);
assert.equal(nav.canEnter,true);

state=G.reducer(state,{
  type:G.COMMANDS.ENTER_NODE,
  node:node("artist:a","artist","Artist A"),
  defaultFilters:{}
});
state=G.reducer(state,{
  type:G.COMMANDS.SELECT_NODE,
  node:node("release:a","release","Release A")
});
state=G.reducer(state,{
  type:G.COMMANDS.ENTER_NODE,
  node:node("release:a","release","Release A"),
  defaultFilters:{}
});

items=NAV.breadcrumbItems(state);
assert.deepEqual(
  items.map(item=>[item.label,item.depth,item.current,item.clickable]),
  [
    ["Universe",0,false,true],
    ["Artist A",1,false,true],
    ["Release A",2,true,false]
  ]
);
nav=NAV.deriveNavigationState(state,false);
assert.equal(nav.canBack,true);
assert.equal(nav.canHome,true);
assert.equal(nav.currentScope.id,"release:a");

state=G.reducer(state,{
  type:G.COMMANDS.JUMP_TO_DEPTH,
  depth:0
});
items=NAV.breadcrumbItems(state);
assert.equal(items.length,1);
assert.equal(items[0].id,"universe");
assert.equal(items[0].current,true);

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"app/app.css"),"utf8");
const app=fs.readFileSync(path.join(root,"app/app.js"),"utf8");

for(const id of ["navBack","navHome","breadcrumb","navEnter"]){
  assert(html.includes('id="'+id+'"'),"missing header navigation element "+id);
}
assert(css.includes(".breadcrumb{display:flex;align-items:center;gap:3px;min-width:0;overflow-x:auto"));
assert(css.includes(".graph-navigation{display:grid;grid-template-columns:44px 44px minmax(0,1fr) auto"));
assert(app.includes("type:G.COMMANDS.JUMP_TO_DEPTH"));
assert(app.includes("nodeUi.enter.onclick=enterSelectedScope"));
assert(app.includes("navUi.enter.onclick=enterSelectedScope"));
assert(app.includes("nodeUi.back.onclick=goBackScope"));
assert(app.includes("navUi.back.onclick=goBackScope"));
assert(app.includes("nodeUi.home.onclick=goHomeScope"));
assert(app.includes("navUi.home.onclick=goHomeScope"));

console.log("PASS: breadcrumb and shared Enter/Back/Home navigation contract tests");
