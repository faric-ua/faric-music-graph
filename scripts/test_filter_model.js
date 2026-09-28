"use strict";
const assert=require("node:assert/strict");
const F=require("../app/filter-model.js");
const P=require("../app/graph-projection.js");

assert.deepEqual(
  F.definitionsForScope("universe").map(x=>x.key),
  ["search","provider","status"]
);
assert.deepEqual(F.defaultsForScope("account"),{search:"",year:"all"});
assert.equal(F.activeFilterCount({search:"",year:"all",genre:"Big Beat"}),1);
assert.equal(F.activeFilterCount({search:"prodigy",year:1994}),2);
assert.equal(F.equalFilters({a:1},{a:1}),true);
assert.equal(F.equalFilters({a:1},{a:2}),false);

const graph=P.createProjectionGraph({
  nodes:[
    {id:"universe",kind:"universe",label:"Universe"},
    {id:"a",kind:"account",label:"A",facets:{provider:"youtube_music",status:"active"}},
    {id:"b",kind:"account",label:"B",facets:{provider:"fixture",status:"fixture_only"}}
  ],
  edges:[
    {source:"universe",target:"a",navigation:true},
    {source:"universe",target:"b",navigation:true}
  ]
});
const options=F.optionsForScope(graph,"universe","universe");
assert.deepEqual(options.provider.map(x=>x.value),["fixture","youtube_music"]);
assert.deepEqual(options.status.map(x=>x.value),["active","fixture_only"]);

console.log("PASS: contextual filter registry/model tests");
