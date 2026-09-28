"use strict";
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const P=require("../app/graph-projection.js");

const nodes=[
  {id:"universe",kind:"universe",label:"Universe"},
  {id:"account:a",kind:"account",label:"Account A",facets:{provider:"youtube_music",status:"active"}},
  {id:"account:b",kind:"account",label:"Account B",facets:{provider:"youtube",status:"inactive"}},
  {id:"year:1997",kind:"year",label:"1997",sortKey:1997,facets:{year:1997}},
  {id:"year:2000",kind:"year",label:"2000",sortKey:2000,facets:{year:2000}},
  {id:"genre:big-beat",kind:"genre",label:"Big Beat",facets:{genre:"Big Beat"}},
  {id:"genre:rock",kind:"genre",label:"Rock",facets:{genre:"Rock"}},
  {id:"artist:prodigy",kind:"artist",label:"The Prodigy",facets:{artist:"The Prodigy"}},
  {id:"artist:lp",kind:"artist",label:"Linkin Park",facets:{artist:"Linkin Park"}},
  {id:"release:fat",kind:"release",label:"The Fat of the Land",facets:{releaseType:"studio"}},
  {id:"track:firestarter",kind:"track",label:"Firestarter",facets:{availability:"available"}}
];

const edges=[
  ["universe","account:a"],
  ["universe","account:b"],
  ["account:a","year:1997"],
  ["account:a","year:2000"],
  ["account:b","year:2000"],
  ["year:1997","genre:big-beat"],
  ["year:2000","genre:rock"],
  ["genre:big-beat","artist:prodigy"],
  ["genre:rock","artist:lp"],
  ["artist:prodigy","release:fat"],
  ["release:fat","track:firestarter"]
].map(([source,target],i)=>({id:"e"+i,source,target,kind:"NAV_CHILD"}));

const graph=P.createProjectionGraph({nodes,edges});
let state=G.createInitialState();

let world=P.projectWorld(graph,state);
assert.equal(world.scopeKind,"universe");
assert.equal(world.nextKind,"account");
assert.deepEqual(world.nodes.filter(n=>n.projection.depth===1).map(n=>n.id),["account:a","account:b"]);
assert.equal(world.metrics.directChildCount,2);
assert.equal(world.metrics.predictedFullyExpandedNodeCount,11);
assert.equal(world.actions.canBack,false);
assert.equal(world.actions.canHome,false);

state=G.reducer(state,{type:G.COMMANDS.SET_DRAFT_FILTER,key:"status",value:"active"});
world=P.projectWorld(graph,state);
assert.equal(world.metrics.directChildCount,2,"draft filter must not affect projection");

state=G.reducer(state,{type:G.COMMANDS.APPLY_FILTERS});
world=P.projectWorld(graph,state);
assert.deepEqual(world.nodes.filter(n=>n.projection.depth===1).map(n=>n.id),["account:a"]);

state=G.reducer(state,{type:G.COMMANDS.SELECT_NODE,node:{id:"account:a",kind:"account",label:"Account A"}});
world=P.projectWorld(graph,state);
assert.equal(world.selectedNode.id,"account:a");
assert.equal(world.actions.canEnter,true);
assert.equal(world.actions.canExpandSelected,true);

state=G.reducer(state,{type:G.COMMANDS.EXPAND_NODE,id:"account:a"});
world=P.projectWorld(graph,state);
assert(world.nodes.some(n=>n.id==="year:1997"&&n.projection.depth===2));
assert(world.nodes.some(n=>n.id==="year:2000"&&n.projection.depth===2));
assert(!world.nodes.some(n=>n.id==="genre:big-beat"),"grandchildren stay hidden until their parent expands");

state=G.reducer(state,{type:G.COMMANDS.EXPAND_NODE,id:"year:1997"});
world=P.projectWorld(graph,state);
assert(world.nodes.some(n=>n.id==="genre:big-beat"&&n.projection.depth===3));
assert(world.edges.every(e=>world.nodes.some(n=>n.id===e.source)&&world.nodes.some(n=>n.id===e.target)));

state=G.reducer(state,{type:G.COMMANDS.COLLAPSE_NODE,id:"account:a"});
world=P.projectWorld(graph,state);
assert(!world.nodes.some(n=>n.kind==="year"),"collapsed account hides descendants even if descendants remain marked expanded");

state=G.reducer(G.createInitialState(),{
  type:G.COMMANDS.ENTER_NODE,
  node:{id:"account:a",kind:"account",label:"Account A"},
  defaultFilters:{}
});
world=P.projectWorld(graph,state);
assert.equal(world.scope.id,"account:a");
assert.equal(world.nextKind,"year");
assert.deepEqual(world.nodes.filter(n=>n.projection.depth===1).map(n=>n.id),["year:1997","year:2000"]);
assert.equal(world.actions.canBack,true);
assert.equal(world.actions.canHome,true);
assert.equal(world.breadcrumb.length,2);

state=G.reducer(state,{type:G.COMMANDS.SET_DRAFT_FILTER,key:"year",value:{min:1998,max:2005}});
state=G.reducer(state,{type:G.COMMANDS.APPLY_FILTERS});
world=P.projectWorld(graph,state);
assert.deepEqual(world.nodes.filter(n=>n.projection.depth===1).map(n=>n.id),["year:2000"]);

state=G.reducer(state,{type:G.COMMANDS.RESET_DRAFT_FILTERS,defaults:{search:"fat"}});
state=G.reducer(state,{type:G.COMMANDS.APPLY_FILTERS});
world=P.projectWorld(graph,state);
assert.equal(world.metrics.directChildCount,0,"search filter applies to projected child nodes");

let deep=G.createInitialState();
for(const n of [
  {id:"account:a",kind:"account",label:"Account A"},
  {id:"year:1997",kind:"year",label:"1997"},
  {id:"genre:big-beat",kind:"genre",label:"Big Beat"},
  {id:"artist:prodigy",kind:"artist",label:"The Prodigy"},
  {id:"release:fat",kind:"release",label:"The Fat of the Land"},
  {id:"track:firestarter",kind:"track",label:"Firestarter"}
]){
  deep=G.reducer(deep,{type:G.COMMANDS.ENTER_NODE,node:n,defaultFilters:{}});
}
world=P.projectWorld(graph,deep);
assert.equal(world.scopeKind,"track");
assert.equal(world.terminal,true);
assert.equal(world.nextKind,null);
assert.equal(world.nodes.length,1);
assert.equal(world.actions.canBack,true);

assert.equal(P.matchesFilters({id:"x",label:"Firestarter",facets:{tags:["live","1997"],year:1997}},{search:"fire"}),true);
assert.equal(P.matchesFilters({id:"x",label:"Firestarter",facets:{tags:["live","1997"],year:1997}},{tags:"live"}),true);
assert.equal(P.matchesFilters({id:"x",label:"Firestarter",facets:{year:1997}},{year:{min:1998}}),false);

assert.throws(
  ()=>P.createProjectionGraph({nodes:[nodes[0]],edges:[{source:"universe",target:"missing"}]}),
  /dangling edge/
);

const relationGraph=P.createProjectionGraph({
  nodes:[
    {id:"universe",kind:"universe",label:"Universe"},
    {id:"account:a",kind:"account",label:"A"},
    {id:"account:b",kind:"account",label:"B"}
  ],
  edges:[
    {id:"ua",source:"universe",target:"account:a",kind:"NAV_CHILD",navigation:true},
    {id:"ub",source:"universe",target:"account:b",kind:"NAV_CHILD",navigation:true},
    {id:"related",source:"account:a",target:"account:b",kind:"RELATED_ACCOUNT",navigation:false}
  ]
});
const relationWorld=P.projectWorld(relationGraph,G.createInitialState());
assert.equal(relationWorld.edges.filter(e=>e.kind==="RELATED_ACCOUNT").length,1);

console.log("PASS: Nested world projection-engine tests");
