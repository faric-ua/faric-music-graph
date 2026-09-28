"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const P=require("../app/graph-projection.js");
const W=require("../app/nested-world-model.js");
const D=require("../app/sample-data.js");
const X=require("../app/prototype-fixtures.js");

const root=path.resolve(__dirname,"..");
const accountJson=JSON.parse(fs.readFileSync(path.join(root,"data/accounts.fixture.json"),"utf8"));

assert.deepEqual(
  X.accountDocument,
  accountJson,
  "browser account fixture must stay byte-semantically aligned with canonical JSON fixture"
);
assert.equal(X.assignments.prototypeOnly,true);
assert.equal(X.assignments.status,"PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY");

const raw=W.buildNestedGraph(X.accountDocument,D,X.assignments);
const graph=P.createProjectionGraph(raw);
assert.equal(raw.meta.prototypeOnly,true);
assert.equal(raw.meta.sampleReleaseCount,7);
assert.equal(new Set(raw.nodes.map(n=>n.id)).size,raw.nodes.length);
assert(raw.edges.every(e=>graph.byId.has(e.source)&&graph.byId.has(e.target)));

let state=G.createInitialState();
let world=P.projectWorld(graph,state);
const accounts=world.nodes.filter(n=>n.kind==="account");
assert.equal(accounts.length,2);
assert(accounts.some(n=>n.id==="account:youtube_music:faric_ua"));
assert(accounts.some(n=>n.id==="account:fixture:secondary"));
assert.equal(world.edges.filter(e=>e.kind==="RELATED_ACCOUNT").length,1);

function selectAndEnter(label,kind){
  world=P.projectWorld(graph,state);
  const node=world.nodes.find(n=>n.kind===kind&&n.label===label);
  assert(node,"expected visible "+kind+" "+label);
  state=G.reducer(state,{
    type:G.COMMANDS.SELECT_NODE,
    node:{id:node.id,kind:node.kind,label:node.label}
  });
  state=G.reducer(state,{
    type:G.COMMANDS.ENTER_NODE,
    node:{id:node.id,kind:node.kind,label:node.label},
    defaultFilters:{}
  });
  return node;
}

selectAndEnter("FARIC UA","account");
world=P.projectWorld(graph,state);
assert.equal(world.scopeKind,"account");
assert.equal(world.nextKind,"year");
assert.deepEqual(
  world.nodes.filter(n=>n.kind==="year").map(n=>n.label),
  ["1992","1994","2000","2003","2024","Unknown year"]
);

selectAndEnter("1994","year");
world=P.projectWorld(graph,state);
assert.equal(world.nextKind,"genre");
assert.deepEqual(
  world.nodes.filter(n=>n.kind==="genre").map(n=>n.label).sort(),
  ["Big Beat","Breakbeat","Electronic","Rave"].sort()
);

selectAndEnter("Big Beat","genre");
world=P.projectWorld(graph,state);
assert.deepEqual(world.nodes.filter(n=>n.kind==="artist").map(n=>n.label),["The Prodigy"]);

const contextualArtist=selectAndEnter("The Prodigy","artist");
assert.equal(contextualArtist.canonicalId,"artist:the-prodigy");
world=P.projectWorld(graph,state);
assert.deepEqual(
  world.nodes.filter(n=>n.kind==="release").map(n=>n.label),
  ["Music for the Jilted Generation"]
);

const contextualRelease=selectAndEnter("Music for the Jilted Generation","release");
assert.equal(contextualRelease.canonicalId,"release:prodigy-jilted");
world=P.projectWorld(graph,state);
assert.equal(world.nextKind,"track");
assert.deepEqual(
  world.nodes.filter(n=>n.kind==="track").map(n=>n.label),
  ["Voodoo People","Poison","No Good (Start the Dance)"]
);

const track=selectAndEnter("Voodoo People","track");
assert(track.canonicalId.startsWith("track:prodigy-jilted:01:voodoo-people"));
world=P.projectWorld(graph,state);
assert.equal(world.scopeKind,"track");
assert.equal(world.terminal,true);
assert.equal(world.nextKind,null);
assert.equal(world.nodes.length,1);
assert.equal(world.breadcrumb.length,7);

const sameReleaseNodes=raw.nodes.filter(n=>n.canonicalId==="release:prodigy-experience");
assert(sameReleaseNodes.length>=4,"same canonical release should project into multiple genre contexts");
assert(new Set(sameReleaseNodes.map(n=>n.id)).size===sameReleaseNodes.length);

let searchState=G.createInitialState();
searchState=G.reducer(searchState,{
  type:G.COMMANDS.ENTER_NODE,
  node:{id:"account:youtube_music:faric_ua",kind:"account",label:"FARIC UA"},
  defaultFilters:{}
});
searchState=G.reducer(searchState,{type:G.COMMANDS.SET_DRAFT_FILTER,key:"search",value:"Numb"});
searchState=G.reducer(searchState,{type:G.COMMANDS.APPLY_FILTERS});
world=P.projectWorld(graph,searchState);
assert(
  world.nodes.some(n=>n.kind==="year"&&n.label==="2003"),
  "ancestor search enrichment must preserve a path to matching descendant content"
);

assert.throws(
  ()=>W.buildNestedGraph(
    X.accountDocument,
    D,
    {...X.assignments,prototypeOnly:false}
  ),
  /explicitly non-inventory/
);

console.log("PASS: canonical prototype nested drill Account → Year → Genre → Artist → Release → Track");
