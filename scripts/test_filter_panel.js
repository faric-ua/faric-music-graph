"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");
const F=require("../app/filter-model.js");

const data={
  artists:[
    {id:"artist:a",name:"Alpha",genres:["Electronic","Big Beat"]},
    {id:"artist:b",name:"Beta",genres:["Rock"]}
  ],
  releases:[
    {id:"release:a1",artistId:"artist:a",title:"First",year:1994,type:"studio",tracks:["Fire"]},
    {id:"release:a2",artistId:"artist:a",title:"Rare Mixes",year:null,type:"exclusive",tracks:["Poison Remix"]},
    {id:"release:b1",artistId:"artist:b",title:"Second",year:2003,type:"studio",tracks:["Numb"]}
  ]
};

const defaults=F.defaultFilters();
assert.deepEqual(defaults,{
  search:"",
  artist:"all",
  year:{min:null,max:null},
  genre:"all",
  releaseType:"all"
});
assert.equal(F.activeFilterCount(defaults),0);
assert.equal(F.filterReleases(data,defaults).length,3);

assert.deepEqual(
  F.filterReleases(data,{...defaults,genre:"Big Beat"}).map(x=>x.id),
  ["release:a1","release:a2"]
);
assert.deepEqual(
  F.filterReleases(data,{...defaults,year:{min:1990,max:1999}}).map(x=>x.id),
  ["release:a1"]
);
assert.deepEqual(
  F.filterReleases(data,{...defaults,releaseType:"exclusive"}).map(x=>x.id),
  ["release:a2"]
);
assert.deepEqual(
  F.filterReleases(data,{...defaults,search:"numb"}).map(x=>x.id),
  ["release:b1"]
);
assert.deepEqual(
  F.normalizeFilters({...defaults,year:{min:2005,max:1990}}).year,
  {min:1990,max:2005},
  "year range must normalize to min <= max"
);
assert.equal(
  F.activeFilterCount({
    search:"mix",
    artist:"artist:a",
    year:{min:1990,max:2000},
    genre:"Electronic",
    releaseType:"studio"
  }),
  5
);

let state=G.createInitialState({defaultFilters:defaults});
state=G.reducer(state,{
  type:G.COMMANDS.SET_DRAFT_FILTER,
  key:"genre",
  value:"Electronic"
});
assert.equal(state.appliedFilters.genre,"all","draft edit must not affect applied filters");
assert.equal(G.filtersPending(state),true);
state=G.reducer(state,{type:G.COMMANDS.APPLY_FILTERS});
assert.equal(state.appliedFilters.genre,"Electronic");
assert.equal(G.filtersPending(state),false);

state=G.reducer(state,{
  type:G.COMMANDS.SET_DRAFT_FILTER,
  key:"search",
  value:"pending"
});
state=G.reducer(state,{
  type:G.COMMANDS.RESET_DRAFT_FILTERS,
  defaults
});
assert.deepEqual(state.draftFilters,defaults);
assert.equal(state.appliedFilters.genre,"Electronic","Reset changes draft only");
assert.equal(G.filtersPending(state),true,"Reset may create a pending change until Apply");

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"app/app.css"),"utf8");

assert(html.includes('class="filter-panel-body"'));
assert(html.includes('class="filter-panel-footer"'));
assert(html.indexOf('class="filter-panel-body"')<html.indexOf('class="filter-panel-footer"'));
assert(html.includes('id="resetFilters"'));
assert(html.includes('id="applyFilters"'));
assert(css.includes(".filter-panel-body{min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1fr)"));
assert(css.includes(".filter-panel-footer{display:grid;"));
assert(css.includes("@media(max-width:760px) and (orientation:portrait)"));
assert(css.includes("width:clamp(320px,46vw,560px)"));

console.log("PASS: adaptive filter panel model/state/layout contract tests");
