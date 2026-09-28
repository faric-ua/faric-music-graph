(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.NodeControls=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  function ids(values){
    return [...new Set((values||[]).filter(v=>typeof v==="string"&&v.length>0))];
  }

  function deriveControlState(state,context){
    const s=state||{};
    const c=context||{};
    const selected=s.selectedNode||null;
    const selectedId=selected&&selected.id?selected.id:null;
    const expanded=new Set(ids(s.expandedNodeIds));
    const expandable=new Set(ids(c.expandableNodeIds));
    const enterable=new Set(ids(c.enterableNodeIds));
    const visible=new Set(ids(c.visibleNodeIds));

    return {
      selectedId,
      selectedLabel:selected&&selected.label?selected.label:null,
      scopeLabel:s.currentScope&&s.currentScope.label?s.currentScope.label:"Universe",
      canExpandAll:[...expandable].some(id=>!expanded.has(id)),
      canCollapseAll:[...expandable].some(id=>expanded.has(id)),
      canExpandSelected:Boolean(selectedId)&&expandable.has(selectedId)&&!expanded.has(selectedId),
      canCollapseSelected:Boolean(selectedId)&&expandable.has(selectedId)&&expanded.has(selectedId),
      canEnter:Boolean(selectedId)&&enterable.has(selectedId),
      canBack:Array.isArray(s.drillPath)&&s.drillPath.length>1,
      canHome:Array.isArray(s.drillPath)&&s.drillPath.length>1,
      canFit:visible.size>0
    };
  }

  function defaultFiltersValue(value){
    if(typeof value==="function")return value();
    return value||{};
  }

  function executeCommand(options,command){
    const o=options||{};
    const G=o.graphState;
    if(!G||!G.COMMANDS||typeof G.reducer!=="function"){
      throw new Error("NodeControls: graphState reducer contract required");
    }

    const state=o.state;
    const context=o.context||{};
    const controls=deriveControlState(state,context);
    const C=G.COMMANDS;

    if(command===C.FIT_VIEW){
      if(controls.canFit&&typeof o.fitView==="function")o.fitView();
      return state;
    }

    let action=null;

    if(command===C.EXPAND_ALL&&controls.canExpandAll){
      action={type:C.EXPAND_ALL,ids:ids(context.expandableNodeIds)};
    }else if(command===C.COLLAPSE_ALL&&controls.canCollapseAll){
      action={type:C.COLLAPSE_ALL,ids:ids(context.expandableNodeIds)};
    }else if(command===C.EXPAND_NODE&&controls.canExpandSelected){
      action={type:C.EXPAND_NODE,id:controls.selectedId};
    }else if(command===C.COLLAPSE_NODE&&controls.canCollapseSelected){
      action={type:C.COLLAPSE_NODE,id:controls.selectedId};
    }else if(command===C.ENTER_NODE&&controls.canEnter){
      action={
        type:C.ENTER_NODE,
        node:state.selectedNode,
        defaultFilters:defaultFiltersValue(o.defaultFilters)
      };
    }else if(command===C.BACK_SCOPE&&controls.canBack){
      action={type:C.BACK_SCOPE};
    }else if(command===C.HOME_SCOPE&&controls.canHome){
      action={type:C.HOME_SCOPE};
    }

    return action?G.reducer(state,action):state;
  }

  return Object.freeze({
    deriveControlState,
    executeCommand
  });
});
