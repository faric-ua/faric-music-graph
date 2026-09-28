(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.ExpandAllGuard=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  function count(value,name){
    const number=Number(value);
    if(!Number.isFinite(number)||number<0){
      throw new Error("ExpandAllGuard: "+name+" must be a non-negative number");
    }
    return Math.floor(number);
  }

  function normalizeLimit(value){
    if(value==null)return null;
    const limit=Number(value);
    if(!Number.isFinite(limit)||limit<1){
      throw new Error("ExpandAllGuard: testedImmediateNodeLimit must be null or >= 1");
    }
    return Math.floor(limit);
  }

  function assess(options){
    const o=options||{};
    const visible=count(o.visibleNodeCount||0,"visibleNodeCount");
    const predicted=count(
      o.predictedFullyExpandedNodeCount||0,
      "predictedFullyExpandedNodeCount"
    );
    const limit=normalizeLimit(o.testedImmediateNodeLimit);
    const additional=Math.max(0,predicted-visible);

    if(additional===0){
      return {
        action:"noop",
        reason:"ALREADY_FULLY_EXPANDED",
        visibleNodeCount:visible,
        predictedFullyExpandedNodeCount:predicted,
        additionalNodeCount:0,
        testedImmediateNodeLimit:limit
      };
    }

    if(limit!=null&&predicted<=limit){
      return {
        action:"apply",
        reason:"WITHIN_TESTED_DEVICE_BUDGET",
        visibleNodeCount:visible,
        predictedFullyExpandedNodeCount:predicted,
        additionalNodeCount:additional,
        testedImmediateNodeLimit:limit
      };
    }

    return {
      action:"confirm",
      reason:limit==null
        ?"UNMEASURED_DEVICE_BUDGET"
        :"PREDICTED_SIZE_EXCEEDS_TESTED_LIMIT",
      visibleNodeCount:visible,
      predictedFullyExpandedNodeCount:predicted,
      additionalNodeCount:additional,
      testedImmediateNodeLimit:limit
    };
  }

  function applyDecision(G,state,ids,assessment,confirmed){
    const plan=assessment||{action:"noop"};
    if(plan.action==="noop")return state;
    if(plan.action==="confirm"&&confirmed!==true)return state;
    if(plan.action!=="apply"&&plan.action!=="confirm"){
      throw new Error("ExpandAllGuard: unsupported action "+plan.action);
    }
    if(!Array.isArray(ids)||ids.length===0)return state;
    if(!G||!G.COMMANDS||typeof G.reducer!=="function"){
      throw new Error("ExpandAllGuard: GraphState reducer contract required");
    }
    return G.reducer(state,{
      type:G.COMMANDS.EXPAND_ALL,
      ids
    });
  }

  return Object.freeze({
    assess,
    applyDecision
  });
});
