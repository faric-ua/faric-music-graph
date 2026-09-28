(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.GraphState=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const STATE_VERSION=1;
  const COMMANDS=Object.freeze({
    SELECT_NODE:"SELECT_NODE",
    EXPAND_NODE:"EXPAND_NODE",
    COLLAPSE_NODE:"COLLAPSE_NODE",
    EXPAND_ALL:"EXPAND_ALL",
    COLLAPSE_ALL:"COLLAPSE_ALL",
    ENTER_NODE:"ENTER_NODE",
    BACK_SCOPE:"BACK_SCOPE",
    HOME_SCOPE:"HOME_SCOPE",
    JUMP_TO_DEPTH:"JUMP_TO_DEPTH",
    SET_DRAFT_FILTER:"SET_DRAFT_FILTER",
    RESET_DRAFT_FILTERS:"RESET_DRAFT_FILTERS",
    APPLY_FILTERS:"APPLY_FILTERS",
    SET_FILTER_PANEL_OPEN:"SET_FILTER_PANEL_OPEN",
    SET_CAMERA:"SET_CAMERA",
    SET_RENDERER_MODE:"SET_RENDERER_MODE",
    OPEN_INSPECTOR:"OPEN_INSPECTOR",
    CLOSE_INSPECTOR:"CLOSE_INSPECTOR"
  });

  function deepClone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function uniqueStrings(values){
    return [...new Set((values||[]).filter(v=>typeof v==="string"&&v.length>0))];
  }

  function normalizeNode(node,fallback){
    const src=node||fallback;
    if(!src||typeof src.id!=="string"||!src.id){
      throw new Error("GraphState: node requires non-empty string id");
    }
    return {
      id:src.id,
      kind:typeof src.kind==="string"&&src.kind?src.kind:"unknown",
      label:typeof src.label==="string"&&src.label?src.label:src.id
    };
  }

  function universeNode(){
    return {id:"universe",kind:"universe",label:"Universe"};
  }

  function defaultCamera(){
    return {zoom:1,yaw:0,pitch:0,target:null};
  }

  function defaultInspector(){
    return {open:false,nodeId:null,mode:null};
  }

  function createInitialState(options){
    const opts=options||{};
    const root=normalizeNode(opts.root||universeNode());
    const filters=deepClone(opts.defaultFilters||{});
    return {
      version:STATE_VERSION,
      drillPath:[root],
      currentScope:root,
      selectedNode:null,
      expandedNodeIds:[],
      collapsedNodeIds:[],
      draftFilters:deepClone(filters),
      appliedFilters:deepClone(filters),
      filterPanelOpen:false,
      rendererMode:opts.rendererMode||"sphere",
      camera:deepClone(opts.camera||defaultCamera()),
      inspector:deepClone(opts.inspector||defaultInspector()),
      history:[]
    };
  }

  function normalizeState(input){
    if(!input||typeof input!=="object"){
      throw new Error("GraphState: invalid state");
    }
    const path=Array.isArray(input.drillPath)&&input.drillPath.length
      ?input.drillPath.map(n=>normalizeNode(n))
      :[universeNode()];
    const scope=normalizeNode(input.currentScope||path[path.length-1],path[path.length-1]);
    return {
      version:STATE_VERSION,
      drillPath:path,
      currentScope:scope,
      selectedNode:input.selectedNode?normalizeNode(input.selectedNode):null,
      expandedNodeIds:uniqueStrings(input.expandedNodeIds),
      collapsedNodeIds:uniqueStrings(input.collapsedNodeIds),
      draftFilters:deepClone(input.draftFilters||{}),
      appliedFilters:deepClone(input.appliedFilters||{}),
      filterPanelOpen:Boolean(input.filterPanelOpen),
      rendererMode:typeof input.rendererMode==="string"&&input.rendererMode?input.rendererMode:"sphere",
      camera:deepClone(input.camera||defaultCamera()),
      inspector:{
        open:Boolean(input.inspector&&input.inspector.open),
        nodeId:input.inspector&&typeof input.inspector.nodeId==="string"?input.inspector.nodeId:null,
        mode:input.inspector&&typeof input.inspector.mode==="string"?input.inspector.mode:null
      },
      history:Array.isArray(input.history)?input.history.map(normalizeSnapshot):[]
    };
  }

  function normalizeSnapshot(snapshot){
    const s=snapshot||{};
    return {
      currentScope:normalizeNode(s.currentScope||universeNode()),
      selectedNode:s.selectedNode?normalizeNode(s.selectedNode):null,
      expandedNodeIds:uniqueStrings(s.expandedNodeIds),
      collapsedNodeIds:uniqueStrings(s.collapsedNodeIds),
      draftFilters:deepClone(s.draftFilters||{}),
      appliedFilters:deepClone(s.appliedFilters||{}),
      filterPanelOpen:Boolean(s.filterPanelOpen),
      camera:deepClone(s.camera||defaultCamera()),
      inspector:deepClone(s.inspector||defaultInspector())
    };
  }

  function snapshotCurrent(state){
    return normalizeSnapshot({
      currentScope:state.currentScope,
      selectedNode:state.selectedNode,
      expandedNodeIds:state.expandedNodeIds,
      collapsedNodeIds:state.collapsedNodeIds,
      draftFilters:state.draftFilters,
      appliedFilters:state.appliedFilters,
      filterPanelOpen:state.filterPanelOpen,
      camera:state.camera,
      inspector:state.inspector
    });
  }

  function restoreSnapshot(state,snapshot,history,drillPath){
    const s=normalizeSnapshot(snapshot);
    return normalizeState({
      ...state,
      ...s,
      history,
      drillPath
    });
  }

  function replaceMembership(state,id,expanded){
    const open=new Set(state.expandedNodeIds);
    const closed=new Set(state.collapsedNodeIds);
    if(expanded){
      open.add(id);
      closed.delete(id);
    }else{
      closed.add(id);
      open.delete(id);
    }
    return {
      ...state,
      expandedNodeIds:[...open],
      collapsedNodeIds:[...closed]
    };
  }

  function reducer(inputState,action){
    const state=normalizeState(inputState);
    const a=action||{};

    switch(a.type){
      case COMMANDS.SELECT_NODE:
        return {...state,selectedNode:a.node?normalizeNode(a.node):null};

      case COMMANDS.EXPAND_NODE:
        if(typeof a.id!=="string"||!a.id){return state;}
        return replaceMembership(state,a.id,true);

      case COMMANDS.COLLAPSE_NODE:
        if(typeof a.id!=="string"||!a.id){return state;}
        return replaceMembership(state,a.id,false);

      case COMMANDS.EXPAND_ALL: {
        const ids=uniqueStrings(a.ids);
        const closed=new Set(state.collapsedNodeIds);
        ids.forEach(id=>closed.delete(id));
        return {
          ...state,
          expandedNodeIds:uniqueStrings([...state.expandedNodeIds,...ids]),
          collapsedNodeIds:[...closed]
        };
      }

      case COMMANDS.COLLAPSE_ALL: {
        const ids=uniqueStrings(a.ids);
        if(ids.length===0){
          return {...state,expandedNodeIds:[],collapsedNodeIds:[]};
        }
        const open=new Set(state.expandedNodeIds);
        ids.forEach(id=>open.delete(id));
        return {
          ...state,
          expandedNodeIds:[...open],
          collapsedNodeIds:uniqueStrings([...state.collapsedNodeIds,...ids])
        };
      }

      case COMMANDS.ENTER_NODE: {
        const node=normalizeNode(a.node||state.selectedNode);
        const defaults=deepClone(a.defaultFilters||{});
        return normalizeState({
          ...state,
          drillPath:[...state.drillPath,node],
          currentScope:node,
          selectedNode:null,
          expandedNodeIds:[],
          collapsedNodeIds:[],
          draftFilters:defaults,
          appliedFilters:deepClone(defaults),
          filterPanelOpen:false,
          camera:deepClone(a.camera||defaultCamera()),
          inspector:defaultInspector(),
          history:[...state.history,snapshotCurrent(state)]
        });
      }

      case COMMANDS.BACK_SCOPE: {
        if(state.history.length===0||state.drillPath.length<=1){return state;}
        const previous=state.history[state.history.length-1];
        return restoreSnapshot(
          state,
          previous,
          state.history.slice(0,-1),
          state.drillPath.slice(0,-1)
        );
      }

      case COMMANDS.JUMP_TO_DEPTH: {
        const target=Number(a.depth);
        const current=state.drillPath.length-1;
        if(!Number.isInteger(target)||target<0||target>current){return state;}
        let next=state;
        while(next.drillPath.length-1>target){
          next=reducer(next,{type:COMMANDS.BACK_SCOPE});
        }
        return next;
      }

      case COMMANDS.HOME_SCOPE: {
        if(state.drillPath.length<=1){
          return {
            ...state,
            selectedNode:null,
            inspector:defaultInspector()
          };
        }
        let next=reducer(state,{type:COMMANDS.JUMP_TO_DEPTH,depth:0});
        next={...next,selectedNode:null,inspector:defaultInspector()};
        return next;
      }

      case COMMANDS.SET_DRAFT_FILTER: {
        if(typeof a.key!=="string"||!a.key){return state;}
        return {
          ...state,
          draftFilters:{...state.draftFilters,[a.key]:deepClone(a.value)}
        };
      }

      case COMMANDS.RESET_DRAFT_FILTERS:
        return {...state,draftFilters:deepClone(a.defaults||{})};

      case COMMANDS.APPLY_FILTERS:
        return {...state,appliedFilters:deepClone(state.draftFilters)};

      case COMMANDS.SET_FILTER_PANEL_OPEN:
        return {...state,filterPanelOpen:Boolean(a.open)};

      case COMMANDS.SET_CAMERA:
        return {...state,camera:{...state.camera,...deepClone(a.camera||{})}};

      case COMMANDS.SET_RENDERER_MODE:
        return typeof a.mode==="string"&&a.mode?{...state,rendererMode:a.mode}:state;

      case COMMANDS.OPEN_INSPECTOR:
        return {
          ...state,
          inspector:{
            open:true,
            nodeId:typeof a.nodeId==="string"?a.nodeId:(state.selectedNode?state.selectedNode.id:null),
            mode:typeof a.mode==="string"?a.mode:"details"
          }
        };

      case COMMANDS.CLOSE_INSPECTOR:
        return {...state,inspector:defaultInspector()};

      default:
        return state;
    }
  }

  function serializeState(state){
    return JSON.stringify(normalizeState(state));
  }

  function restoreState(serialized){
    const parsed=typeof serialized==="string"?JSON.parse(serialized):serialized;
    if(parsed&&parsed.version!=null&&parsed.version!==STATE_VERSION){
      throw new Error("GraphState: unsupported state version "+parsed.version);
    }
    return normalizeState(parsed);
  }

  function filtersPending(state){
    const s=normalizeState(state);
    return JSON.stringify(s.draftFilters)!==JSON.stringify(s.appliedFilters);
  }

  return Object.freeze({
    STATE_VERSION,
    COMMANDS,
    universeNode,
    createInitialState,
    normalizeState,
    reducer,
    serializeState,
    restoreState,
    filtersPending
  });
});
