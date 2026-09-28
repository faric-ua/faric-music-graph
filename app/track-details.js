(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.TrackDetails=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const PROTOTYPE_ASSIGNMENT_STATUS="PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY";

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function canonicalId(node){
    return node&&typeof node.canonicalId==="string"&&node.canonicalId
      ?node.canonicalId
      :node&&node.id;
  }

  function graphIndex(graphInput){
    const graph=graphInput||{};
    const nodes=Array.isArray(graph.nodes)?graph.nodes:[];
    const byId=graph.byId instanceof Map
      ?graph.byId
      :new Map(nodes.map(node=>[node.id,node]));
    return {nodes,byId};
  }

  function uniqueBy(items,keyFn){
    const out=[];
    const seen=new Set();
    for(const item of items||[]){
      const key=keyFn(item);
      if(key==null||seen.has(key))continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  }

  function pathNodes(index,node){
    return (node&&Array.isArray(node.contextPath)?node.contextPath:[])
      .map(id=>index.byId.get(id))
      .filter(Boolean);
  }

  function ancestor(index,node,kind){
    return pathNodes(index,node).find(item=>item.kind===kind)||null;
  }

  function ancestors(index,node,kind){
    return pathNodes(index,node).filter(item=>item.kind===kind);
  }

  function accountSummary(node,assignmentStatus){
    if(!node)return null;
    const account=node.account||{};
    const provenance=account.provenance||{};
    return {
      canonicalId:canonicalId(node),
      label:node.label||account.displayName||canonicalId(node),
      provider:account.provider||null,
      handle:account.handle||null,
      publicUrl:account.publicUrl||null,
      externalAccountId:account.externalAccountId==null?null:String(account.externalAccountId),
      accountStatus:account.status||null,
      fixtureOnly:Boolean(account.fixtureOnly),
      externalIdentityVerified:
        typeof provenance.verifiedExternalAccountId==="boolean"
          ?provenance.verifiedExternalAccountId
          :null,
      catalogAssignmentStatus:
        assignmentStatus||
        (node.meta&&node.meta.assignmentStatus)||
        "unknown",
      liveCatalogInventoryClaim:false
    };
  }

  function releaseSummary(node){
    if(!node)return null;
    const release=node.release||{};
    const year=release.year==null
      ?(node.facets&&node.facets.year!=null?node.facets.year:null)
      :release.year;
    return {
      canonicalId:canonicalId(node),
      title:node.label||release.title||canonicalId(node),
      year:year==null?null:Number(year),
      type:release.type||(node.facets&&node.facets.releaseType)||null
    };
  }

  function artistSummary(node){
    if(!node)return null;
    const artist=node.artist||{};
    return {
      canonicalId:canonicalId(node),
      name:node.label||artist.name||canonicalId(node)
    };
  }

  function simpleSummary(node){
    if(!node)return null;
    return {
      canonicalId:canonicalId(node),
      label:node.label||canonicalId(node),
      value:node.kind==="year"
        ?(node.facets&&node.facets.year!=null?Number(node.facets.year):null)
        :node.label||null
    };
  }

  function collectAncestorKind(index,occurrences,kind,summary){
    const items=[];
    for(const occurrence of occurrences){
      for(const item of ancestors(index,occurrence,kind)){
        const value=summary(item);
        if(value)items.push(value);
      }
    }
    return uniqueBy(items,item=>item.canonicalId);
  }

  function assignmentStatuses(index,occurrences,override){
    const values=[];
    if(typeof override==="string"&&override)values.push(override);
    for(const occurrence of occurrences){
      const account=ancestor(index,occurrence,"account");
      const status=account&&account.meta&&account.meta.assignmentStatus;
      if(typeof status==="string"&&status)values.push(status);
    }
    return [...new Set(values)];
  }

  function warning(code,message){
    return {code,message};
  }

  function buildTrackDetails(graphInput,trackRef,options){
    const index=graphIndex(graphInput);
    const opts=options||{};
    const selected=typeof trackRef==="string"
      ?index.byId.get(trackRef)
      :trackRef&&trackRef.id
        ?index.byId.get(trackRef.id)||trackRef
        :null;

    if(!selected||selected.kind!=="track"){
      throw new Error("TrackDetails: track projection node required");
    }

    const trackId=canonicalId(selected);
    const occurrences=index.nodes.filter(node=>
      node.kind==="track"&&canonicalId(node)===trackId
    );
    const statuses=assignmentStatuses(index,occurrences,opts.assignmentStatus);
    const assignmentStatus=statuses[0]||"unknown";

    const accounts=collectAncestorKind(
      index,
      occurrences,
      "account",
      node=>accountSummary(node,assignmentStatus)
    );
    const artists=collectAncestorKind(index,occurrences,"artist",artistSummary);
    const releases=collectAncestorKind(index,occurrences,"release",releaseSummary);
    const years=collectAncestorKind(index,occurrences,"year",simpleSummary);
    const genres=collectAncestorKind(index,occurrences,"genre",simpleSummary);

    const currentAccount=ancestor(index,selected,"account");
    const currentYear=ancestor(index,selected,"year");
    const currentGenre=ancestor(index,selected,"genre");
    const currentArtist=ancestor(index,selected,"artist");
    const currentRelease=ancestor(index,selected,"release");
    const track=selected.track||{};

    const warnings=[];
    if(statuses.includes(PROTOTYPE_ASSIGNMENT_STATUS)){
      warnings.push(warning(
        "PROTOTYPE_ONLY_ACCOUNT_ASSIGNMENT",
        "Прив’язка каталогу до акаунта є лише прототипною і не є перевіреним live inventory."
      ));
    }
    if(accounts.some(account=>
      account.accountStatus==="pending_inventory"||
      account.liveCatalogInventoryClaim===false
    )){
      warnings.push(warning(
        "LIVE_ACCOUNT_INVENTORY_UNVERIFIED",
        "Наявність треку в реальному YouTube / YouTube Music акаунті ще не перевірена."
      ));
    }
    if(accounts.some(account=>account.fixtureOnly)){
      warnings.push(warning(
        "FIXTURE_ACCOUNT_CONTEXT_PRESENT",
        "Частина контекстів належить синтетичному тестовому акаунту."
      ));
    }
    warnings.push(warning(
      "TRACK_VERSION_DATA_UNAVAILABLE",
      "TrackVersion і зв’язки original/remix/live/remaster ще не завантажені в цей прототип."
    ));
    warnings.push(warning(
      "EXTERNAL_MEDIA_IDENTITY_UNKNOWN",
      "Точні YouTube / YouTube Music media ID та URL для цього треку невідомі."
    ));

    return {
      kind:"track-terminal-details",
      terminal:true,
      identity:{
        title:track.title||selected.label||trackId,
        canonicalId:trackId,
        projectionId:selected.id,
        position:Number.isFinite(Number(track.position))?Number(track.position):null
      },
      currentContext:{
        account:accountSummary(currentAccount,assignmentStatus),
        year:simpleSummary(currentYear),
        genre:simpleSummary(currentGenre),
        artist:artistSummary(currentArtist),
        release:releaseSummary(currentRelease)
      },
      appearances:{
        projectionCount:occurrences.length,
        accounts,
        artists,
        releases,
        years,
        genres
      },
      version:{
        state:"unmodeled",
        trackVersionIds:[],
        relationships:[],
        verification:"unknown"
      },
      playlists:{
        state:"unknown",
        items:[]
      },
      externalMedia:{
        youtube:{
          videoId:null,
          url:null,
          verification:"unknown"
        },
        youtubeMusic:{
          itemId:null,
          url:null,
          verification:"unknown"
        }
      },
      availability:{
        state:"unknown",
        durationSeconds:null
      },
      provenance:{
        prototypeOnly:occurrences.some(node=>Boolean(node.meta&&node.meta.prototypeOnly)),
        assignmentStatus,
        assignmentStatuses:statuses,
        liveAccountInventoryVerified:false,
        canonicalIdentityState:"prototype_derived"
      },
      review:{
        status:"not_evaluated",
        duplicates:[],
        mismatches:[]
      },
      warnings,
      debug:{
        contextPath:clone(selected.contextPath||[]),
        facets:clone(selected.facets||{})
      }
    };
  }

  return Object.freeze({
    PROTOTYPE_ASSIGNMENT_STATUS,
    buildTrackDetails
  });
});
