"use strict";

const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const P=require("../app/graph-projection.js");
const W=require("../app/nested-world-model.js");
const T=require("../app/track-details.js");
const D=require("../app/sample-data.js");
const X=require("../app/prototype-fixtures.js");

const graph=P.createProjectionGraph(
  W.buildNestedGraph(
    X.accountDocument,
    D,
    X.assignments
  )
);

function findTrack(title,accountId){
  return graph.nodes.find(node=>
    node.kind==="track"&&
    node.label===title&&
    Array.isArray(node.contextPath)&&
    node.contextPath.includes(accountId)
  );
}

const faric="account:youtube_music:faric_ua";
const fixture="account:fixture:secondary";

const numb=findTrack("Numb",faric);
assert(numb,"Numb track must exist in FARIC UA prototype path");

const details=T.buildTrackDetails(graph,numb.id,{
  assignmentStatus:X.assignments.status
});

assert.equal(details.kind,"track-terminal-details");
assert.equal(details.terminal,true);
assert.equal(details.identity.title,"Numb");
assert.equal(details.identity.canonicalId,numb.canonicalId);
assert.equal(details.currentContext.account.canonicalId,faric);
assert.equal(details.currentContext.year.value,2003);
assert.equal(details.currentContext.artist.name,"Linkin Park");
assert.equal(details.currentContext.release.title,"Meteora");
assert.equal(details.appearances.releases.length,1,"contextual genre copies must dedupe one canonical release");
assert.equal(details.appearances.artists.length,1);
assert.deepEqual(
  details.appearances.genres.map(item=>item.label).sort(),
  ["Alternative Rock","Electronic Rock","Nu Metal"].sort()
);
assert.deepEqual(
  details.appearances.accounts.map(item=>item.canonicalId),
  [faric],
  "Numb must not be falsely assigned to the secondary fixture"
);

assert.equal(details.version.state,"unmodeled");
assert.deepEqual(details.version.trackVersionIds,[]);
assert.deepEqual(details.version.relationships,[]);
assert.equal(details.externalMedia.youtube.videoId,null);
assert.equal(details.externalMedia.youtube.url,null);
assert.equal(details.externalMedia.youtubeMusic.itemId,null);
assert.equal(details.externalMedia.youtubeMusic.url,null);
assert.equal(details.availability.state,"unknown");
assert.equal(details.availability.durationSeconds,null);
assert.equal(details.playlists.state,"unknown");
assert.equal(details.provenance.assignmentStatus,"PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY");
assert.equal(details.provenance.liveAccountInventoryVerified,false);
assert.equal(details.review.status,"not_evaluated");

const warningCodes=new Set(details.warnings.map(item=>item.code));
assert(warningCodes.has("PROTOTYPE_ONLY_ACCOUNT_ASSIGNMENT"));
assert(warningCodes.has("LIVE_ACCOUNT_INVENTORY_UNVERIFIED"));
assert(warningCodes.has("TRACK_VERSION_DATA_UNAVAILABLE"));
assert(warningCodes.has("EXTERNAL_MEDIA_IDENTITY_UNKNOWN"));

const numbSibling=graph.nodes.find(node=>
  node.kind==="track"&&
  node.canonicalId===numb.canonicalId&&
  node.id!==numb.id
);
assert(numbSibling,"same canonical Numb must appear in another genre context");
const siblingDetails=T.buildTrackDetails(graph,numbSibling.id,{
  assignmentStatus:X.assignments.status
});
assert.equal(siblingDetails.identity.canonicalId,details.identity.canonicalId);
assert.equal(siblingDetails.appearances.releases.length,1);

const fire=findTrack("Fire",faric);
assert(fire);
const fireDetails=T.buildTrackDetails(graph,fire.id,{
  assignmentStatus:X.assignments.status
});
assert.deepEqual(
  fireDetails.appearances.accounts.map(item=>item.canonicalId).sort(),
  [faric,fixture].sort(),
  "Fire prototype appearances should aggregate both assigned account contexts without claiming live inventory"
);
assert(fireDetails.warnings.some(item=>item.code==="FIXTURE_ACCOUNT_CONTEXT_PRESENT"));
assert.equal(
  fireDetails.appearances.accounts.every(item=>item.liveCatalogInventoryClaim===false),
  true
);

assert.throws(
  ()=>T.buildTrackDetails(graph,"universe"),
  /track projection node required/
);

const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"app/index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"app/app.css"),"utf8");
const app=fs.readFileSync(path.join(root,"app/app.js"),"utf8");

assert(html.includes('src="track-details.js"'),"track detail model must load before app");
assert(css.includes(".track-detail{"),"structured Track detail surface styles must exist");
assert(css.includes(".track-detail-warning"),"warning treatment must exist");
assert(app.includes("T.buildTrackDetails"),"app must build structured track details");
assert(app.includes("G.COMMANDS.OPEN_INSPECTOR"),"opening inspector must be represented in GraphSessionState");
assert(app.includes("G.COMMANDS.CLOSE_INSPECTOR"),"closing inspector must be represented in GraphSessionState");
assert(app.includes('"track-terminal"'),"Track inspector mode must be explicit");
assert(app.includes('"Де ви зараз"'),"Track surface must lead with user-facing context");
assert(app.includes('"Технічні дані"'),"technical metadata must remain available on demand");
assert(css.includes(".track-detail-technical{"),"technical metadata must use a collapsible visual surface");
assert(app.includes('"Посилання та media ID ще не завантажені."'),"unknown external media must be explained in user-facing language");

console.log("PASS: structured Track terminal detail contract tests");
