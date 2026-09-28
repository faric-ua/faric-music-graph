"use strict";
const assert=require("node:assert/strict");
const G=require("../app/graph-state.js");

function node(id,kind,label){
  return {id,kind:kind||"unknown",label:label||id};
}

function dispatch(state,type,extra){
  return G.reducer(state,{type,...(extra||{})});
}

let s=G.createInitialState({defaultFilters:{status:"all"}});
assert.equal(s.currentScope.id,"universe");
assert.equal(s.drillPath.length,1);
assert.deepEqual(s.appliedFilters,{status:"all"});

s=dispatch(s,G.COMMANDS.SELECT_NODE,{node:node("account:a","account","A")});
assert.equal(s.selectedNode.id,"account:a");
assert.equal(s.currentScope.id,"universe","select must not drill");

s=dispatch(s,G.COMMANDS.EXPAND_NODE,{id:"account:a"});
assert.deepEqual(s.expandedNodeIds,["account:a"]);
s=dispatch(s,G.COMMANDS.COLLAPSE_NODE,{id:"account:a"});
assert.deepEqual(s.expandedNodeIds,[]);
assert.deepEqual(s.collapsedNodeIds,["account:a"]);

s=dispatch(s,G.COMMANDS.SET_DRAFT_FILTER,{key:"year",value:1997});
assert.equal(s.draftFilters.year,1997);
assert.equal(s.appliedFilters.year,undefined,"draft filter must not auto-apply");
assert.equal(G.filtersPending(s),true);
s=dispatch(s,G.COMMANDS.APPLY_FILTERS);
assert.equal(s.appliedFilters.year,1997);
assert.equal(G.filtersPending(s),false);

s=dispatch(s,G.COMMANDS.SET_CAMERA,{camera:{zoom:1.8,yaw:.3}});
s=dispatch(s,G.COMMANDS.SET_FILTER_PANEL_OPEN,{open:true});
const rootBeforeEnter=G.restoreState(G.serializeState(s));

s=dispatch(s,G.COMMANDS.ENTER_NODE,{
  node:node("account:a","account","A"),
  defaultFilters:{availability:"all"}
});
assert.equal(s.currentScope.id,"account:a");
assert.deepEqual(s.drillPath.map(x=>x.id),["universe","account:a"]);
assert.equal(s.selectedNode,null);
assert.deepEqual(s.appliedFilters,{availability:"all"});
assert.equal(s.filterPanelOpen,false);
assert.equal(s.history.length,1);

s=dispatch(s,G.COMMANDS.SELECT_NODE,{node:node("year:1997","year","1997")});
s=dispatch(s,G.COMMANDS.SET_DRAFT_FILTER,{key:"genre",value:"Big Beat"});
s=dispatch(s,G.COMMANDS.APPLY_FILTERS);
s=dispatch(s,G.COMMANDS.ENTER_NODE,{
  node:node("year:1997","year","1997"),
  defaultFilters:{}
});
assert.equal(s.drillPath.length,3);

s=dispatch(s,G.COMMANDS.BACK_SCOPE);
assert.equal(s.currentScope.id,"account:a");
assert.equal(s.selectedNode.id,"year:1997","back restores previous selection");
assert.equal(s.appliedFilters.genre,"Big Beat","back restores previous applied filters");

s=dispatch(s,G.COMMANDS.BACK_SCOPE);
assert.equal(s.currentScope.id,"universe");
assert.deepEqual(s.appliedFilters,rootBeforeEnter.appliedFilters);
assert.deepEqual(s.camera,rootBeforeEnter.camera);
assert.equal(s.filterPanelOpen,true);

s=dispatch(s,G.COMMANDS.ENTER_NODE,{node:node("account:a","account","A"),defaultFilters:{}});
s=dispatch(s,G.COMMANDS.ENTER_NODE,{node:node("year:1997","year","1997"),defaultFilters:{}});
s=dispatch(s,G.COMMANDS.ENTER_NODE,{node:node("genre:big-beat","genre","Big Beat"),defaultFilters:{}});
assert.equal(s.drillPath.length,4);
s=dispatch(s,G.COMMANDS.JUMP_TO_DEPTH,{depth:1});
assert.deepEqual(s.drillPath.map(x=>x.id),["universe","account:a"]);
assert.equal(s.currentScope.id,"account:a");

s=dispatch(s,G.COMMANDS.HOME_SCOPE);
assert.equal(s.currentScope.id,"universe");
assert.equal(s.drillPath.length,1);
assert.equal(s.selectedNode,null);

s=dispatch(s,G.COMMANDS.EXPAND_ALL,{ids:["a","b","a"]});
assert.deepEqual(s.expandedNodeIds.sort(),["a","b"]);
s=dispatch(s,G.COMMANDS.COLLAPSE_ALL,{ids:["a"]});
assert.deepEqual(s.expandedNodeIds,["b"]);
assert.deepEqual(s.collapsedNodeIds,["a"]);

s=dispatch(s,G.COMMANDS.RESET_DRAFT_FILTERS,{defaults:{year:"all"}});
assert.deepEqual(s.draftFilters,{year:"all"});
assert.notDeepEqual(s.draftFilters,s.appliedFilters,"reset draft does not apply");

const roundTrip=G.restoreState(G.serializeState(s));
assert.deepEqual(roundTrip,s,"serialized state must round-trip");

assert.throws(
  ()=>G.restoreState(JSON.stringify({...roundTrip,version:999})),
  /unsupported state version/
);

console.log("PASS: GraphSessionState reducer/state-machine tests");
