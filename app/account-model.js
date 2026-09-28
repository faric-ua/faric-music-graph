(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.AccountModel=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const ACCOUNT_SCHEMA_VERSION=1;
  const SECRET_KEYS=new Set([
    "password",
    "passwd",
    "secret",
    "clientsecret",
    "client_secret",
    "accesstoken",
    "access_token",
    "refreshtoken",
    "refresh_token",
    "apikey",
    "api_key"
  ]);

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function requireString(value,name){
    if(typeof value!=="string"||!value.trim()){
      throw new Error("AccountModel: "+name+" requires non-empty string");
    }
    return value.trim();
  }

  function assertNoSecrets(value,path){
    const at=path||"$";
    if(value==null)return;
    if(Array.isArray(value)){
      value.forEach((item,i)=>assertNoSecrets(item,at+"["+i+"]"));
      return;
    }
    if(typeof value!=="object")return;

    for(const [key,item] of Object.entries(value)){
      const normalized=key.toLowerCase().replace(/[-\s]/g,"_");
      const collapsed=normalized.replace(/_/g,"");
      if(SECRET_KEYS.has(normalized)||SECRET_KEYS.has(collapsed)){
        throw new Error("AccountModel: secret-like key forbidden at "+at+"."+key);
      }
      assertNoSecrets(item,at+"."+key);
    }
  }

  function normalizeAccount(input){
    assertNoSecrets(input);
    const src=input||{};
    const id=requireString(src.id,"id");
    const provider=requireString(src.provider,"provider");
    const displayName=requireString(src.displayName,"displayName");

    return {
      id,
      provider,
      externalAccountId:src.externalAccountId==null?null:String(src.externalAccountId),
      displayName,
      handle:src.handle==null?null:String(src.handle),
      publicUrl:src.publicUrl==null?null:String(src.publicUrl),
      status:src.status==null?"unknown":String(src.status),
      provenance:clone(src.provenance||{}),
      lastInventoryAt:src.lastInventoryAt==null?null:String(src.lastInventoryAt),
      fixtureOnly:Boolean(src.fixtureOnly)
    };
  }

  function normalizeRelationship(input,index){
    const src=input||{};
    return {
      id:typeof src.id==="string"&&src.id?src.id:"account-rel:"+index,
      source:requireString(src.source,"relationship.source"),
      target:requireString(src.target,"relationship.target"),
      kind:typeof src.kind==="string"&&src.kind?src.kind:"RELATED_ACCOUNT",
      fixtureOnly:Boolean(src.fixtureOnly),
      provenance:clone(src.provenance||{})
    };
  }

  function normalizeAccountDocument(input){
    assertNoSecrets(input);
    const src=input||{};
    if(src.schemaVersion!==ACCOUNT_SCHEMA_VERSION){
      throw new Error("AccountModel: unsupported schemaVersion "+src.schemaVersion);
    }
    if(src.authDataIncluded!==false){
      throw new Error("AccountModel: account data must explicitly declare authDataIncluded=false");
    }

    const accounts=(src.accounts||[]).map(normalizeAccount);
    const ids=new Set();
    for(const account of accounts){
      if(ids.has(account.id))throw new Error("AccountModel: duplicate account "+account.id);
      ids.add(account.id);
    }

    const relationships=(src.relationships||[]).map(normalizeRelationship);
    for(const rel of relationships){
      if(!ids.has(rel.source)||!ids.has(rel.target)){
        throw new Error("AccountModel: dangling account relationship "+rel.id);
      }
    }

    return {
      schemaVersion:ACCOUNT_SCHEMA_VERSION,
      status:src.status==null?"UNKNOWN":String(src.status),
      authDataIncluded:false,
      accounts,
      relationships
    };
  }

  function createUniverseGraph(input){
    const doc=normalizeAccountDocument(input);
    const universe={
      id:"universe",
      canonicalId:"universe",
      kind:"universe",
      label:"Universe",
      facets:{}
    };

    const accountNodes=doc.accounts.map(account=>({
      id:account.id,
      canonicalId:account.id,
      kind:"account",
      label:account.displayName,
      facets:{
        provider:account.provider,
        status:account.status,
        fixtureOnly:account.fixtureOnly
      },
      account:clone(account)
    }));

    const navEdges=doc.accounts.map((account,i)=>({
      id:"nav:universe:"+i+":"+account.id,
      source:"universe",
      target:account.id,
      kind:"NAV_CHILD",
      navigation:true
    }));

    const relationEdges=doc.relationships.map(rel=>({
      id:rel.id,
      source:rel.source,
      target:rel.target,
      kind:rel.kind,
      navigation:false,
      fixtureOnly:rel.fixtureOnly,
      provenance:clone(rel.provenance)
    }));

    return {
      nodes:[universe,...accountNodes],
      edges:[...navEdges,...relationEdges]
    };
  }

  return Object.freeze({
    ACCOUNT_SCHEMA_VERSION,
    assertNoSecrets,
    normalizeAccount,
    normalizeAccountDocument,
    createUniverseGraph
  });
});
