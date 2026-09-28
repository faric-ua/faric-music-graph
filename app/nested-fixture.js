(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.NestedFixture=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const ACCOUNT_FIXTURE=Object.freeze({
    schemaVersion:1,
    status:"TEST_ONLY_MULTI_ACCOUNT_NAVIGATION_FIXTURE",
    authDataIncluded:false,
    accounts:[
      {
        id:"account:youtube_music:faric_ua",
        provider:"youtube_music",
        externalAccountId:null,
        displayName:"FARIC UA",
        handle:"@faric_ua",
        publicUrl:"https://music.youtube.com/@faric_ua",
        status:"pending_inventory",
        lastInventoryAt:null,
        fixtureOnly:false,
        provenance:{kind:"user_supplied_public_target",verifiedExternalAccountId:false}
      },
      {
        id:"account:fixture:secondary",
        provider:"fixture",
        externalAccountId:"fixture-secondary",
        displayName:"Secondary Test Account",
        handle:"@fixture_secondary",
        publicUrl:null,
        status:"fixture_only",
        lastInventoryAt:null,
        fixtureOnly:true,
        provenance:{kind:"synthetic_test_fixture"}
      }
    ],
    relationships:[
      {
        id:"account-rel:faric-secondary",
        source:"account:youtube_music:faric_ua",
        target:"account:fixture:secondary",
        kind:"RELATED_ACCOUNT",
        fixtureOnly:true,
        provenance:{kind:"synthetic_test_fixture"}
      }
    ]
  });

  function slug(value){
    return String(value)
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"")
      .slice(0,72)||"unknown";
  }

  function canonicalTrackId(artistId,title){
    return "track:"+slug(artistId.replace(/^artist:/,""))+":"+slug(title);
  }

  function buildGraph(accountModel,sampleData){
    if(!accountModel||typeof accountModel.createUniverseGraph!=="function"){
      throw new Error("NestedFixture: AccountModel required");
    }
    if(!sampleData||!Array.isArray(sampleData.artists)||!Array.isArray(sampleData.releases)){
      throw new Error("NestedFixture: sample data required");
    }

    const base=accountModel.createUniverseGraph(ACCOUNT_FIXTURE);
    const nodes=[...base.nodes];
    const edges=[...base.edges];
    const nodeIds=new Set(nodes.map(n=>n.id));
    const edgeIds=new Set(edges.map(e=>e.id));
    const artists=new Map(sampleData.artists.map(a=>[a.id,a]));

    const assignments=new Map([
      ["account:youtube_music:faric_ua",sampleData.releases.map(r=>r.id)],
      ["account:fixture:secondary",sampleData.releases
        .filter(r=>r.id==="release:prodigy-experience"||r.id==="release:lp-hybrid")
        .map(r=>r.id)]
    ]);
    const releases=new Map(sampleData.releases.map(r=>[r.id,r]));

    function addNode(node){
      if(nodeIds.has(node.id))return;
      nodeIds.add(node.id);
      nodes.push(node);
    }

    function addEdge(edge){
      if(edgeIds.has(edge.id))return;
      edgeIds.add(edge.id);
      edges.push(edge);
    }

    function navId(parts){
      return "nav:"+parts.map(slug).join(":");
    }

    for(const account of ACCOUNT_FIXTURE.accounts){
      const releaseIds=assignments.get(account.id)||[];
      for(const releaseId of releaseIds){
        const release=releases.get(releaseId);
        if(!release)continue;
        const artist=artists.get(release.artistId);
        if(!artist)continue;

        const yearValue=release.year==null?"Unknown":release.year;
        const yearCanonical="year:"+String(yearValue).toLowerCase();
        const yearId=navId([account.id,"year",yearValue]);
        const genre=Array.isArray(artist.genres)&&artist.genres.length?artist.genres[0]:"Unknown";
        const genreCanonical="genre:"+slug(genre);
        const genreId=navId([account.id,"year",yearValue,"genre",genre]);
        const artistId=navId([account.id,"year",yearValue,"genre",genre,"artist",artist.id]);
        const releaseNodeId=navId([account.id,"year",yearValue,"genre",genre,"artist",artist.id,"release",release.id]);

        const yearPath=[account.id,yearId];
        const genrePath=[...yearPath,genreId];
        const artistPath=[...genrePath,artistId];
        const releasePath=[...artistPath,releaseNodeId];

        addNode({
          id:yearId,
          canonicalId:yearCanonical,
          kind:"year",
          label:String(yearValue),
          sortKey:release.year==null?9999:release.year,
          contextPath:yearPath,
          facets:{year:release.year==null?"unknown":release.year}
        });
        addEdge({
          id:"edge:"+slug(account.id)+":"+slug(yearId),
          source:account.id,target:yearId,kind:"NAV_CHILD",navigation:true
        });

        addNode({
          id:genreId,
          canonicalId:genreCanonical,
          kind:"genre",
          label:genre,
          contextPath:genrePath,
          facets:{genre}
        });
        addEdge({
          id:"edge:"+slug(yearId)+":"+slug(genreId),
          source:yearId,target:genreId,kind:"NAV_CHILD",navigation:true
        });

        addNode({
          id:artistId,
          canonicalId:artist.id,
          kind:"artist",
          label:artist.name,
          contextPath:artistPath,
          facets:{artist:artist.name}
        });
        addEdge({
          id:"edge:"+slug(genreId)+":"+slug(artistId),
          source:genreId,target:artistId,kind:"NAV_CHILD",navigation:true
        });

        addNode({
          id:releaseNodeId,
          canonicalId:release.id,
          kind:"release",
          label:release.title,
          contextPath:releasePath,
          facets:{
            releaseType:release.type||"unknown",
            year:release.year==null?"unknown":release.year
          },
          details:{
            canonicalId:release.id,
            title:release.title,
            artist:artist.name,
            year:release.year,
            genre,
            type:release.type||null,
            accountId:account.id
          }
        });
        addEdge({
          id:"edge:"+slug(artistId)+":"+slug(releaseNodeId),
          source:artistId,target:releaseNodeId,kind:"NAV_CHILD",navigation:true
        });

        release.tracks.forEach((title,index)=>{
          const canonicalId=canonicalTrackId(artist.id,title);
          const trackId=navId([
            account.id,"year",yearValue,"genre",genre,"artist",artist.id,
            "release",release.id,"track",index,title
          ]);
          const trackPath=[...releasePath,trackId];
          addNode({
            id:trackId,
            canonicalId,
            kind:"track",
            label:title,
            sortKey:index,
            contextPath:trackPath,
            facets:{
              availability:"unknown",
              versionType:"unknown"
            },
            details:{
              canonicalId,
              title,
              artistId:artist.id,
              artist:artist.name,
              releaseId:release.id,
              release:release.title,
              year:release.year,
              genre,
              releaseType:release.type||null,
              accountId:account.id,
              accountName:account.displayName,
              playlists:[],
              youtubeVideoId:null,
              youtubePlaylistIds:[],
              urls:[],
              durationSeconds:null,
              availability:"unknown",
              versionType:"unknown",
              relationships:[],
              provenance:[
                {kind:"prototype_fixture",source:"app/sample-data.js"},
                {kind:account.fixtureOnly?"synthetic_account_fixture":"known_public_account_target"}
              ]
            }
          });
          addEdge({
            id:"edge:"+slug(releaseNodeId)+":track:"+index,
            source:releaseNodeId,target:trackId,kind:"NAV_CHILD",navigation:true
          });
        });
      }
    }

    return {nodes,edges,meta:{fixture:true,accountCount:ACCOUNT_FIXTURE.accounts.length}};
  }

  return Object.freeze({
    ACCOUNT_FIXTURE,
    slug,
    canonicalTrackId,
    buildGraph
  });
});
