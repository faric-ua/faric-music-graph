(function(root,factory){
  "use strict";
  const data=factory();
  if(typeof module==="object"&&module.exports){module.exports=data;}
  if(root){root.MUSIC_PROTOTYPE_FIXTURES=data;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const accountDocument={
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
        provenance:{
          kind:"user_supplied_public_target",
          verifiedExternalAccountId:false
        }
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
        provenance:{
          kind:"synthetic_test_fixture"
        }
      }
    ],
    relationships:[
      {
        id:"account-rel:faric-secondary",
        source:"account:youtube_music:faric_ua",
        target:"account:fixture:secondary",
        kind:"RELATED_ACCOUNT",
        fixtureOnly:true,
        provenance:{
          kind:"synthetic_test_fixture"
        }
      }
    ]
  };

  const assignments={
    status:"PROTOTYPE_ONLY_NOT_ACCOUNT_INVENTORY",
    prototypeOnly:true,
    releaseIdsByAccount:{
      "account:youtube_music:faric_ua":"ALL_SAMPLE_RELEASES",
      "account:fixture:secondary":[
        "release:prodigy-experience",
        "release:lp-hybrid"
      ]
    }
  };

  return Object.freeze({
    accountDocument,
    assignments
  });
});
