"use strict";
const assert=require("node:assert/strict");
const A=require("../app/account-model.js");
const N=require("../app/nested-fixture.js");
const P=require("../app/graph-projection.js");
const G=require("../app/graph-state.js");

const sample={
  artists:[
    {id:"artist:the-prodigy",name:"The Prodigy",genres:["Electronic","Big Beat"]},
    {id:"artist:linkin-park",name:"Linkin Park",genres:["Alternative Rock"]}
  ],
  releases:[
    {id:"release:exp",artistId:"artist:the-prodigy",title:"Experience",year:1992,type:"studio",tracks:["Fire"]},
    {id:"release:jilted",artistId:"artist:the-prodigy",title:"Jilted",year:1994,type:"studio",tracks:["Voodoo People"]},
    {id:"release:hybrid",artistId:"artist:linkin-park",title:"Hybrid Theory",year:2000,type:"studio",tracks:["In the End"]}
  ]
};

const raw=N.buildGraph(A,sample);
const graph=P.createProjectionGraph(raw);

assert.equal(raw.meta.accountCount,2);
assert.equal(raw.nodes.filter(n=>n.kind==="account").length,2);

const prodigyInstances=raw.nodes.filter(n=>n.kind==="artist"&&n.canonicalId==="artist:the-prodigy");
assert(prodigyInstances.length>=2,"same canonical artist must appear in multiple contextual paths");
assert.equal(new Set(prodigyInstances.map(n=>n.id)).size,prodigyInstances.length);

const canonicalFire=N.canonicalTrackId("artist:the-prodigy","Fire");
const fireInstances=raw.nodes.filter(n=>n.kind==="track"&&n.canonicalId===canonicalFire);
assert.equal(fireInstances.length,2,"Fire appears in both known and synthetic account contexts");
assert.notEqual(fireInstances[0].id,fireInstances[1].id);

let state=G.createInitialState();
const account=raw.nodes.find(n=>n.id==="account:youtube_music:faric_ua");
state=G.reducer(state,{type:G.COMMANDS.ENTER_NODE,node:account,defaultFilters:{}});
let world=P.projectWorld(graph,state);

const year1992=world.nodes.find(n=>n.kind==="year"&&n.canonicalId==="year:1992");
assert(year1992);
state=G.reducer(state,{type:G.COMMANDS.ENTER_NODE,node:year1992,defaultFilters:{}});
world=P.projectWorld(graph,state);

const electronic=world.nodes.find(n=>n.kind==="genre"&&n.canonicalId==="genre:electronic");
assert(electronic);
state=G.reducer(state,{type:G.COMMANDS.ENTER_NODE,node:electronic,defaultFilters:{}});
world=P.projectWorld(graph,state);

const prodigy=world.nodes.find(n=>n.kind==="artist"&&n.canonicalId==="artist:the-prodigy");
assert(prodigy);
state=G.reducer(state,{type:G.COMMANDS.ENTER_NODE,node:prodigy,defaultFilters:{}});
world=P.projectWorld(graph,state);

const releases=world.nodes.filter(n=>n.kind==="release");
assert.deepEqual(releases.map(n=>n.canonicalId),["release:exp"],"1992 contextual artist must not leak 1994 release");

state=G.reducer(state,{type:G.COMMANDS.ENTER_NODE,node:releases[0],defaultFilters:{}});
world=P.projectWorld(graph,state);
const track=world.nodes.find(n=>n.kind==="track");
assert(track);
assert.equal(track.details.accountId,"account:youtube_music:faric_ua");
assert.equal(track.details.youtubeVideoId,null);
assert(Array.isArray(track.details.urls));
assert(Array.isArray(track.details.provenance));

console.log("PASS: contextual nested navigation fixture tests");
