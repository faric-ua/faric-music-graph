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
const E=require("../app/expand-all-guard.js");

assert.deepEqual(
  E.assess({
    visibleNodeCount:10,
    predictedFullyExpandedNodeCount:10,
    testedImmediateNodeLimit:null
  }),
  {
    action:"noop",
    reason:"ALREADY_FULLY_EXPANDED",
    visibleNodeCount:10,
    predictedFullyExpandedNodeCount:10,
    additionalNodeCount:0,
    testedImmediateNodeLimit:null
  }
);

const unmeasured=E.assess({
  visibleNodeCount:4,
  predictedFullyExpandedNodeCount:80,
  testedImmediateNodeLimit:null
});
assert.equal(unmeasured.action,"confirm");
assert.equal(unmeasured.reason,"UNMEASURED_DEVICE_BUDGET");
assert.equal(unmeasured.additionalNodeCount,76);

const within=E.assess({
  visibleNodeCount:4,
  predictedFullyExpandedNodeCount:80,
  testedImmediateNodeLimit:100
});
assert.equal(within.action,"apply");
assert.equal(within.reason,"WITHIN_TESTED_DEVICE_BUDGET");

const above=E.assess({
  visibleNodeCount:4,
  predictedFullyExpandedNodeCount:120,
  testedImmediateNodeLimit:100
});
assert.equal(above.action,"confirm");
assert.equal(above.reason,"PREDICTED_SIZE_EXCEEDS_TESTED_LIMIT");

assert.throws(
  ()=>E.assess({
    visibleNodeCount:1,
    predictedFullyExpandedNodeCount:2,
    testedImmediateNodeLimit:0
  }),
  /testedImmediateNodeLimit/
);

const graph=P.createProjectionGraph(
  W.buildNestedGraph(
    X.accountDocument,
    D,
    X.assignments
  )
);

let state=G.createInitialState({
  defaultFilters:F.defaultFilters(),
  rendererMode:"map"
});
let world=P.projectWorld(graph,state);
const faric=world.nodes.find(node=>node.label==="FARIC UA");
assert(faric);
state=G.reducer(state,{type:G.COMMANDS.SELECT_NODE,node:faric});
state=G.reducer(state,{
  type:G.COMMANDS.ENTER_NODE,
  node:faric,
  defaultFilters:F.defaultFilters()
});

world=P.projectWorld(graph,state);
assert(world.bulkExpandNodeIds.length>0);
assert(world.metrics.predictedFullyExpandedNodeCount>world.metrics.visibleNodeCount);
assert.equal(world.actions.canExpandAll,true);

const plan=E.assess({
  visibleNodeCount:world.metrics.visibleNodeCount,
  predictedFullyExpandedNodeCount:world.metrics.predictedFullyExpandedNodeCount,
  testedImmediateNodeLimit:null
});
assert.equal(plan.action,"confirm");

const beforeCancel=G.serializeState(state);
const cancelled=E.applyDecision(
  G,
  state,
  world.bulkExpandNodeIds,
  plan,
  false
);
assert.strictEqual(cancelled,state,"Cancel must return the exact unchanged session object");
assert.equal(G.serializeState(cancelled),beforeCancel);

const expanded=E.applyDecision(
  G,
  state,
  world.bulkExpandNodeIds,
  plan,
  true
);
assert.notStrictEqual(expanded,state);
const expandedWorld=P.projectWorld(graph,expanded);
assert.equal(
  expandedWorld.metrics.visibleNodeCount,
  world.metrics.predictedFullyExpandedNodeCount,
  "confirmed bulk expansion must reveal the projection's predicted scoped set"
);
assert.equal(expandedWorld.actions.canExpandAll,false);
assert.equal(expandedWorld.actions.canCollapseAll,true);

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"app/app.css"),"utf8");
const app=fs.readFileSync(path.join(root,"app/app.js"),"utf8");

assert(html.includes('id="expandGuard"'));
assert(html.includes('id="expandGuardCancel"'));
assert(html.includes('id="expandGuardConfirm"'));
assert(html.includes('src="expand-all-guard.js"'));
assert(css.includes(".expand-guard[hidden]"));
assert(app.includes("EXPAND_ALL_TESTED_IMMEDIATE_NODE_LIMIT=null"));
assert(app.includes("E.assess"));
assert(app.includes("E.applyDecision"));
for(const fn of [
  "currentControlCapabilities",
  "renderNavigationState",
  "renderNodeControls"
]){
  assert(
    app.includes("function "+fn+"("),
    "browser entrypoint must define runtime wiring function "+fn
  );
}

console.log("PASS: Expand All performance guard and runtime wiring tests");
