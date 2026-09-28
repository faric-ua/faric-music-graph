(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.NavigationUi=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  function normalizePath(state){
    const path=state&&Array.isArray(state.drillPath)?state.drillPath:[];
    return path
      .filter(node=>node&&typeof node.id==="string"&&node.id)
      .map((node,depth)=>({
        id:node.id,
        kind:typeof node.kind==="string"&&node.kind?node.kind:"unknown",
        label:typeof node.label==="string"&&node.label?node.label:node.id,
        depth,
        current:depth===path.length-1
      }));
  }

  function breadcrumbItems(state){
    return normalizePath(state).map(item=>({
      ...item,
      clickable:!item.current
    }));
  }

  function deriveNavigationState(state,canEnter){
    const path=normalizePath(state);
    const scope=path.length?path[path.length-1]:null;
    return {
      breadcrumb:path,
      canBack:path.length>1,
      canHome:Boolean(scope&&scope.id!=="universe"),
      canEnter:Boolean(canEnter),
      currentScope:scope
    };
  }

  return Object.freeze({
    normalizePath,
    breadcrumbItems,
    deriveNavigationState
  });
});
