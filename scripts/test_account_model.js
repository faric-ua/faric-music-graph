"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const A=require("../app/account-model.js");
const P=require("../app/graph-projection.js");
const G=require("../app/graph-state.js");

const ROOT=path.resolve(__dirname,"..");
const doc=JSON.parse(fs.readFileSync(path.join(ROOT,"data/accounts.fixture.json"),"utf8"));
const channel=JSON.parse(fs.readFileSync(path.join(ROOT,"data/channel.json"),"utf8"));

A.assertNoSecrets(doc);
const normalized=A.normalizeAccountDocument(doc);

assert.equal(normalized.authDataIncluded,false);
assert.equal(normalized.accounts.length,2);
assert.equal(new Set(normalized.accounts.map(x=>x.id)).size,2);

const faric=normalized.accounts.find(x=>x.id==="account:youtube_music:faric_ua");
assert(faric);
assert.equal(faric.handle,"@faric_ua");
assert.equal(faric.externalAccountId,null,"unverified external account ID must remain null");
assert.equal(faric.fixtureOnly,false);
assert.equal(channel.accountId,faric.id,"channel target must resolve to the canonical Account record");

const synthetic=normalized.accounts.find(x=>x.id==="account:fixture:secondary");
assert(synthetic);
assert.equal(synthetic.fixtureOnly,true);
assert.equal(synthetic.provider,"fixture");

const universe=A.createUniverseGraph(doc);
assert.equal(universe.nodes.filter(n=>n.kind==="account").length,2);
assert.equal(universe.edges.filter(e=>e.navigation).length,2);
assert.equal(universe.edges.filter(e=>!e.navigation&&e.kind==="RELATED_ACCOUNT").length,1);

const graph=P.createProjectionGraph(universe);
const world=P.projectWorld(graph,G.createInitialState());
assert.deepEqual(
  world.nodes.filter(n=>n.kind==="account").map(n=>n.canonicalId).sort(),
  ["account:fixture:secondary","account:youtube_music:faric_ua"]
);
assert.equal(
  world.edges.filter(e=>e.kind==="RELATED_ACCOUNT").length,
  1,
  "visible non-navigation account relationship must survive Universe projection"
);

assert.throws(
  ()=>A.normalizeAccountDocument({
    schemaVersion:1,
    authDataIncluded:false,
    accounts:[{
      id:"account:bad",
      provider:"fixture",
      displayName:"Bad",
      status:"fixture",
      accessToken:"must-not-exist"
    }],
    relationships:[]
  }),
  /secret-like key forbidden/
);

assert.throws(
  ()=>A.normalizeAccountDocument({
    schemaVersion:1,
    authDataIncluded:true,
    accounts:[],
    relationships:[]
  }),
  /authDataIncluded=false/
);

console.log("PASS: provider-neutral Account model and multi-account fixture tests");
