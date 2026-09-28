(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.SessionPersistence=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const STORAGE_KEY="faric.musicGraph.semanticSession.v1";

  function initialState(G,defaults,rendererMode){
    return G.createInitialState({
      defaultFilters:defaults||{},
      rendererMode:rendererMode||"map"
    });
  }

  function graphNode(graph,id){
    if(!id)return null;
    if(graph&&graph.byId instanceof Map)return graph.byId.get(id)||null;
    const nodes=graph&&Array.isArray(graph.nodes)?graph.nodes:[];
    return nodes.find(node=>node.id===id)||null;
  }

  function nodeRef(graph,node){
    if(!node||typeof node.id!=="string")return null;
    const canonical=graphNode(graph,node.id);
    if(!canonical)return null;
    return {
      id:canonical.id,
      kind:canonical.kind,
      label:canonical.label
    };
  }

  function navigationEdgeExists(graph,source,target){
    if(graph&&graph.children instanceof Map){
      return (graph.children.get(source)||[]).some(edge=>
        edge&&edge.navigation!==false&&edge.target===target
      );
    }
    const edges=graph&&Array.isArray(graph.edges)?graph.edges:[];
    return edges.some(edge=>
      edge&&
      edge.navigation!==false&&
      edge.source===source&&
      edge.target===target
    );
  }

  function validPath(graph,path){
    if(!Array.isArray(path)||path.length===0)return false;
    if(path[0].id!=="universe")return false;
    for(let i=0;i<path.length;i+=1){
      if(!graphNode(graph,path[i].id))return false;
      if(i>0&&!navigationEdgeExists(graph,path[i-1].id,path[i].id)){
        return false;
      }
    }
    return true;
  }

  function safeInspector(graph,inspector){
    const src=inspector||{};
    if(!src.open){
      return {open:false,nodeId:null,mode:null};
    }
    if(typeof src.nodeId!=="string"||!graphNode(graph,src.nodeId)){
      return {open:false,nodeId:null,mode:null};
    }
    return {
      open:true,
      nodeId:src.nodeId,
      mode:typeof src.mode==="string"&&src.mode?src.mode:"details"
    };
  }

  function sanitizeSnapshot(graph,snapshot){
    const scope=nodeRef(graph,snapshot&&snapshot.currentScope);
    if(!scope)return null;
    const selected=snapshot&&snapshot.selectedNode
      ?nodeRef(graph,snapshot.selectedNode)
      :null;
    if(snapshot&&snapshot.selectedNode&&!selected)return null;
    return {
      ...snapshot,
      currentScope:scope,
      selectedNode:selected,
      inspector:safeInspector(graph,snapshot&&snapshot.inspector)
    };
  }

  function sanitizeRestoredState(G,graph,state,defaults,rendererMode){
    if(!validPath(graph,state.drillPath))return null;

    const last=state.drillPath[state.drillPath.length-1];
    if(!state.currentScope||state.currentScope.id!==last.id)return null;
    if(!Array.isArray(state.history)||state.history.length!==state.drillPath.length-1){
      return null;
    }

    const path=state.drillPath.map(node=>nodeRef(graph,node));
    if(path.some(node=>!node))return null;

    const history=[];
    for(let i=0;i<state.history.length;i+=1){
      const snapshot=sanitizeSnapshot(graph,state.history[i]);
      if(!snapshot||snapshot.currentScope.id!==path[i].id)return null;
      history.push(snapshot);
    }

    const selected=state.selectedNode?nodeRef(graph,state.selectedNode):null;
    if(state.selectedNode&&!selected)return null;

    const mode=state.rendererMode==="sphere"||state.rendererMode==="map"
      ?state.rendererMode
      :(rendererMode||"map");

    return G.restoreState({
      ...state,
      drillPath:path,
      currentScope:path[path.length-1],
      selectedNode:selected,
      inspector:safeInspector(graph,state.inspector),
      rendererMode:mode,
      history
    });
  }

  function readRaw(storage){
    if(!storage||typeof storage.getItem!=="function")return null;
    try{
      return storage.getItem(STORAGE_KEY);
    }catch(_){
      return null;
    }
  }

  function discard(storage){
    if(!storage||typeof storage.removeItem!=="function")return;
    try{storage.removeItem(STORAGE_KEY);}catch(_){}
  }

  function restoreSession(options){
    const o=options||{};
    const G=o.graphState;
    if(!G||typeof G.createInitialState!=="function"||typeof G.restoreState!=="function"){
      throw new Error("SessionPersistence: GraphState contract required");
    }

    const fresh=()=>initialState(G,o.defaultFilters,o.rendererMode);
    const raw=readRaw(o.storage);
    if(!raw){
      return {state:fresh(),restored:false,reason:"missing"};
    }

    try{
      const restored=G.restoreState(raw);
      const sanitized=sanitizeRestoredState(
        G,
        o.graph,
        restored,
        o.defaultFilters,
        o.rendererMode
      );
      if(!sanitized){
        discard(o.storage);
        return {state:fresh(),restored:false,reason:"invalid_graph_path"};
      }
      return {state:sanitized,restored:true,reason:"ok"};
    }catch(_){
      discard(o.storage);
      return {state:fresh(),restored:false,reason:"invalid_serialized_state"};
    }
  }

  function saveSession(storage,G,state){
    if(!storage||typeof storage.setItem!=="function")return false;
    if(!G||typeof G.serializeState!=="function"){
      throw new Error("SessionPersistence: GraphState serializer required");
    }
    try{
      storage.setItem(STORAGE_KEY,G.serializeState(state));
      return true;
    }catch(_){
      return false;
    }
  }

  function clearSession(storage){
    discard(storage);
  }

  return Object.freeze({
    STORAGE_KEY,
    restoreSession,
    saveSession,
    clearSession
  });
});
