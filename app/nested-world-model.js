(function(root,factory){
  "use strict";
  const AccountModel=typeof module==="object"&&module.exports
    ?require("./account-model.js")
    :root.AccountModel;
  const api=factory(AccountModel);
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.NestedWorldModel=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(AccountModel){
  "use strict";

  if(!AccountModel){
    throw new Error("NestedWorldModel: AccountModel is required");
  }

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function slug(value){
    return String(value==null?"unknown":value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g,"")
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"")||"unknown";
  }

  function contextualId(parts){
    return "nav:"+parts.map(part=>String(part)).join("|");
  }

  function edgeId(source,target){
    return "nav-edge:"+source+"->"+target;
  }

  function trackCanonicalId(release,index,title){
    return "track:"+slug(release.id.replace(/^release:/,""))+":"+
      String(index+1).padStart(2,"0")+":"+slug(title);
  }

  function assertPrototypeAssignments(assignments,accounts,music){
    const src=assignments||{};
    if(src.prototypeOnly!==true||src.status!=="PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY"){
      throw new Error("NestedWorldModel: prototype assignments must be explicitly non-inventory");
    }

    const accountIds=new Set(accounts.map(a=>a.id));
    const releaseIds=new Set((music.releases||[]).map(r=>r.id));
    const mapping=src.releaseIdsByAccount||{};

    for(const [accountId,value] of Object.entries(mapping)){
      if(!accountIds.has(accountId)){
        throw new Error("NestedWorldModel: assignment references unknown account "+accountId);
      }
      if(value==="ALL_SAMPLE_RELEASES")continue;
      if(!Array.isArray(value)){
        throw new Error("NestedWorldModel: assignment for "+accountId+" must be array or ALL_SAMPLE_RELEASES");
      }
      for(const releaseId of value){
        if(!releaseIds.has(releaseId)){
          throw new Error("NestedWorldModel: assignment references unknown release "+releaseId);
        }
      }
    }
  }

  function assignedReleaseIds(assignments,accountId,allReleaseIds){
    const value=(assignments.releaseIdsByAccount||{})[accountId];
    if(value==="ALL_SAMPLE_RELEASES")return [...allReleaseIds];
    return Array.isArray(value)?[...new Set(value)]:[];
  }

  function createBuilder(){
    const nodes=new Map();
    const edges=new Map();

    function addNode(node){
      if(nodes.has(node.id)){
        const existing=nodes.get(node.id);
        const mergedTerms=[
          ...(existing.searchTerms||[]),
          ...(node.searchTerms||[])
        ];
        existing.searchTerms=[...new Set(mergedTerms.filter(Boolean).map(String))];
        return existing;
      }
      const normalized={
        ...clone(node),
        searchTerms:[...new Set((node.searchTerms||[]).filter(Boolean).map(String))]
      };
      nodes.set(normalized.id,normalized);
      return normalized;
    }

    function addEdge(source,target,extra){
      const key=edgeId(source,target);
      if(edges.has(key))return edges.get(key);
      const edge={
        id:key,
        source,
        target,
        kind:"NAV_CHILD",
        navigation:true,
        ...(extra||{})
      };
      edges.set(key,edge);
      return edge;
    }

    return {nodes,edges,addNode,addEdge};
  }

  function enrichAncestorSearch(builder){
    const navEdges=[...builder.edges.values()].filter(e=>e.navigation!==false);
    const children=new Map();
    for(const edge of navEdges){
      if(!children.has(edge.source))children.set(edge.source,[]);
      children.get(edge.source).push(edge.target);
    }

    const memo=new Map();
    function termsFor(id,visiting){
      if(memo.has(id))return memo.get(id);
      const seen=visiting||new Set();
      if(seen.has(id))return [];
      seen.add(id);

      const node=builder.nodes.get(id);
      const terms=new Set([
        node&&node.label,
        node&&node.searchText,
        ...((node&&node.searchTerms)||[])
      ].filter(Boolean).map(String));

      for(const childId of children.get(id)||[]){
        for(const term of termsFor(childId,new Set(seen))){
          terms.add(term);
        }
      }
      const out=[...terms];
      memo.set(id,out);
      return out;
    }

    for(const node of builder.nodes.values()){
      node.searchTerms=termsFor(node.id,new Set());
    }
  }

  function buildNestedGraph(accountDocument,musicInput,assignmentInput){
    const accountDoc=AccountModel.normalizeAccountDocument(accountDocument);
    const music=clone(musicInput||{});
    const artists=Array.isArray(music.artists)?music.artists:[];
    const releases=Array.isArray(music.releases)?music.releases:[];
    const artistById=new Map(artists.map(a=>[a.id,a]));
    const releaseById=new Map(releases.map(r=>[r.id,r]));

    assertPrototypeAssignments(
      assignmentInput,
      accountDoc.accounts,
      {releases}
    );

    const assignments=clone(assignmentInput);
    const allReleaseIds=releases.map(r=>r.id);
    const b=createBuilder();

    b.addNode({
      id:"universe",
      canonicalId:"universe",
      kind:"universe",
      label:"Universe",
      contextPath:["universe"],
      facets:{},
      meta:{
        prototypeOnly:true,
        assignmentStatus:assignments.status
      }
    });

    for(const account of accountDoc.accounts){
      b.addNode({
        id:account.id,
        canonicalId:account.id,
        kind:"account",
        label:account.displayName,
        contextPath:["universe",account.id],
        facets:{
          provider:account.provider,
          status:account.status,
          fixtureOnly:account.fixtureOnly
        },
        searchTerms:[account.handle,account.provider],
        account:clone(account),
        meta:{
          prototypeOnly:true,
          assignmentStatus:assignments.status
        }
      });
      b.addEdge("universe",account.id);

      const releaseIds=assignedReleaseIds(assignments,account.id,allReleaseIds);
      for(const releaseId of releaseIds){
        const release=releaseById.get(releaseId);
        if(!release)continue;
        const artist=artistById.get(release.artistId);
        if(!artist)throw new Error("NestedWorldModel: missing artist "+release.artistId);

        const yearKey=release.year==null?"unknown":String(release.year);
        const yearLabel=release.year==null?"Unknown year":String(release.year);
        const yearId=contextualId([account.id,"year:"+yearKey]);

        b.addNode({
          id:yearId,
          canonicalId:"year:"+yearKey,
          kind:"year",
          label:yearLabel,
          sortKey:release.year==null?Number.MAX_SAFE_INTEGER:release.year,
          contextPath:["universe",account.id,yearId],
          facets:{year:release.year},
          searchTerms:[artist.name,release.title,...(release.tracks||[])],
          meta:{prototypeOnly:true}
        });
        b.addEdge(account.id,yearId);

        const genres=Array.isArray(artist.genres)&&artist.genres.length
          ?artist.genres
          :["Unknown genre"];

        for(const genre of genres){
          const genreId=contextualId([account.id,"year:"+yearKey,"genre:"+slug(genre)]);
          b.addNode({
            id:genreId,
            canonicalId:"genre:"+slug(genre),
            kind:"genre",
            label:genre,
            contextPath:["universe",account.id,yearId,genreId],
            facets:{year:release.year,genre},
            searchTerms:[artist.name,release.title,...(release.tracks||[])],
            meta:{prototypeOnly:true}
          });
          b.addEdge(yearId,genreId);

          const artistId=contextualId([
            account.id,
            "year:"+yearKey,
            "genre:"+slug(genre),
            "artist:"+artist.id
          ]);
          b.addNode({
            id:artistId,
            canonicalId:artist.id,
            kind:"artist",
            label:artist.name,
            contextPath:["universe",account.id,yearId,genreId,artistId],
            facets:{
              year:release.year,
              genre,
              artist:artist.id
            },
            searchTerms:[...(artist.genres||[]),release.title,...(release.tracks||[])],
            artist:clone(artist),
            meta:{prototypeOnly:true}
          });
          b.addEdge(genreId,artistId);

          const contextualReleaseId=contextualId([
            account.id,
            "year:"+yearKey,
            "genre:"+slug(genre),
            "artist:"+artist.id,
            "release:"+release.id
          ]);
          b.addNode({
            id:contextualReleaseId,
            canonicalId:release.id,
            kind:"release",
            label:release.title,
            contextPath:["universe",account.id,yearId,genreId,artistId,contextualReleaseId],
            facets:{
              year:release.year,
              genre,
              artist:artist.id,
              releaseType:release.type||"unknown"
            },
            searchTerms:[artist.name,genre,release.type,...(release.tracks||[])],
            release:clone(release),
            meta:{prototypeOnly:true}
          });
          b.addEdge(artistId,contextualReleaseId);

          (release.tracks||[]).forEach((title,index)=>{
            const canonicalTrackId=trackCanonicalId(release,index,title);
            const trackId=contextualId([
              account.id,
              "year:"+yearKey,
              "genre:"+slug(genre),
              "artist:"+artist.id,
              "release:"+release.id,
              "track:"+(index+1)
            ]);
            b.addNode({
              id:trackId,
              canonicalId:canonicalTrackId,
              kind:"track",
              label:title,
              sortKey:index+1,
              contextPath:[
                "universe",
                account.id,
                yearId,
                genreId,
                artistId,
                contextualReleaseId,
                trackId
              ],
              facets:{
                year:release.year,
                genre,
                artist:artist.id,
                releaseType:release.type||"unknown"
              },
              searchTerms:[artist.name,release.title,genre,release.type],
              track:{
                canonicalTrackId,
                title,
                position:index+1,
                releaseId:release.id,
                artistId:artist.id
              },
              meta:{prototypeOnly:true}
            });
            b.addEdge(contextualReleaseId,trackId);
          });
        }
      }
    }

    for(const rel of accountDoc.relationships){
      b.edges.set(rel.id,{
        id:rel.id,
        source:rel.source,
        target:rel.target,
        kind:rel.kind,
        navigation:false,
        fixtureOnly:rel.fixtureOnly,
        provenance:clone(rel.provenance)
      });
    }

    enrichAncestorSearch(b);

    return {
      nodes:[...b.nodes.values()],
      edges:[...b.edges.values()],
      meta:{
        prototypeOnly:true,
        assignmentStatus:assignments.status,
        accountCount:accountDoc.accounts.length,
        sampleReleaseCount:releases.length
      }
    };
  }

  return Object.freeze({
    slug,
    contextualId,
    trackCanonicalId,
    buildNestedGraph
  });
});
