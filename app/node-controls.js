(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.NodeControls=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  function edgePair(edge){
    if(Array.isArray(edge))return {source:edge[0],target:edge[1]};
    return {source:edge&&edge.source,target:edge&&edge.target};
  }

  function graphIndex(nodes,edges){
    const ids=new Set((nodes||[]).map(n=>n.id));
    const children=new Map();
    for(const raw of edges||[]){
      const edge=edgePair(raw);
      if(!ids.has(edge.source)||!ids.has(edge.target))continue;
      if(!children.has(edge.source))children.set(edge.source,[]);
      children.get(edge.source).push(edge.target);
    }
    return {ids,children};
  }

  function expandableNodeIds(nodes,edges){
    const index=graphIndex(nodes,edges);
    return [...index.children.entries()]
      .filter(([,children])=>children.length>0)
      .map(([id])=>id);
  }

  function deriveControlState(session,nodes,edges){
    const state=session||{};
    const index=graphIndex(nodes,edges);
    const expanded=new Set(state.expandedNodeIds||[]);
    const scopeId=state.currentScope&&state.currentScope.id?state.currentScope.id:"universe";
    const selectedId=state.selectedNode&&state.selectedNode.id?state.selectedNode.id:null;
    const expandable=new Set(expandableNodeIds(nodes,edges));
    const selectedExpandable=Boolean(selectedId&&expandable.has(selectedId));
    const selectedHasChildren=Boolean(selectedId&&(index.children.get(selectedId)||[]).length);

    return {
      expandableNodeIds:[...expandable],
      canExpandAll:[...expandable].some(id=>id!==scopeId&&!expanded.has(id)),
      canCollapseAll:[...expanded].some(id=>expandable.has(id)&&id!==scopeId),
      canExpandSelected:selectedExpandable&&!expanded.has(selectedId),
      canCollapseSelected:selectedExpandable&&expanded.has(selectedId),
      canEnter:Boolean(selectedId)&&selectedId!==scopeId&&selectedHasChildren,
      canBack:Array.isArray(state.drillPath)&&state.drillPath.length>1,
      canHome:scopeId!=="universe",
      canFit:Array.isArray(nodes)&&nodes.length>0,
      scopeId,
      selectedId
    };
  }

  return Object.freeze({
    graphIndex,
    expandableNodeIds,
    deriveControlState
  });
});
