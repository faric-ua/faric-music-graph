(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.GraphProjection=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const LEVELS=Object.freeze([
    "universe",
    "account",
    "year",
    "genre",
    "artist",
    "release",
    "track"
  ]);

  const DEFAULT_IGNORED_FILTER_VALUES=new Set(["all","any","*"]);

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function asId(value){
    return typeof value==="string"&&value?value:null;
  }

  function normalizeNode(input){
    if(!input||typeof input!=="object")throw new Error("GraphProjection: invalid node");
    const id=asId(input.id);
    if(!id)throw new Error("GraphProjection: node id required");
    return {
      ...clone(input),
      id,
      kind:typeof input.kind==="string"&&input.kind?input.kind:"unknown",
      label:typeof input.label==="string"&&input.label?input.label:id,
      facets:input.facets&&typeof input.facets==="object"?clone(input.facets):{}
    };
  }

  function normalizeEdge(input,index){
    if(!input||typeof input!=="object")throw new Error("GraphProjection: invalid edge");
    const source=asId(input.source);
    const target=asId(input.target);
    if(!source||!target)throw new Error("GraphProjection: edge source/target required");
    return {
      ...clone(input),
      id:asId(input.id)||"edge:"+index+":"+source+":"+target,
      source,
      target,
      kind:typeof input.kind==="string"&&input.kind?input.kind:"NAV_CHILD",
      navigation:input.navigation!==false
    };
  }

  function createProjectionGraph(input){
    const src=input||{};
    const nodes=(src.nodes||[]).map(normalizeNode);
    const byId=new Map();
    for(const n of nodes){
      if(byId.has(n.id))throw new Error("GraphProjection: duplicate node "+n.id);
      byId.set(n.id,n);
    }

    const edges=(src.edges||[]).map(normalizeEdge);
    for(const e of edges){
      if(!byId.has(e.source)||!byId.has(e.target)){
        throw new Error("GraphProjection: dangling edge "+e.id);
      }
    }

    const children=new Map();
    const parents=new Map();
    for(const e of edges){
      if(!e.navigation)continue;
      if(!children.has(e.source))children.set(e.source,[]);
      if(!parents.has(e.target))parents.set(e.target,[]);
      children.get(e.source).push(e);
      parents.get(e.target).push(e);
    }

    return Object.freeze({nodes,edges,byId,children,parents});
  }

  function nextKind(kind){
    const i=LEVELS.indexOf(kind);
    if(i<0||i===LEVELS.length-1)return null;
    return LEVELS[i+1];
  }

  function isIgnoredFilter(value){
    if(value==null||value==="")return true;
    if(typeof value==="string"&&DEFAULT_IGNORED_FILTER_VALUES.has(value.toLowerCase()))return true;
    if(Array.isArray(value)&&value.length===0)return true;
    return false;
  }

  function normalizeComparable(value){
    return typeof value==="string"?value.toLocaleLowerCase():value;
  }

  function matchesScalar(actual,expected){
    if(Array.isArray(actual)){
      return actual.some(v=>matchesScalar(v,expected));
    }
    if(Array.isArray(expected)){
      return expected.some(v=>matchesScalar(actual,v));
    }
    return normalizeComparable(actual)===normalizeComparable(expected);
  }

  function matchesRange(actual,expected){
    if(actual==null||typeof actual!=="number")return false;
    const min=expected&&typeof expected.min==="number"?expected.min:null;
    const max=expected&&typeof expected.max==="number"?expected.max:null;
    if(min!=null&&actual<min)return false;
    if(max!=null&&actual>max)return false;
    return true;
  }

  function searchableText(node){
    return [
      node.id,
      node.label,
      node.searchText,
      ...(Array.isArray(node.searchTerms)?node.searchTerms:[])
    ].filter(Boolean).join(" ").toLocaleLowerCase();
  }

  function matchesFilters(node,filters){
    const f=filters||{};
    for(const [key,expected] of Object.entries(f)){
      if(isIgnoredFilter(expected))continue;

      if(key==="search"||key==="query"||key==="_query"){
        const q=String(expected).trim().toLocaleLowerCase();
        if(q&&!searchableText(node).includes(q))return false;
        continue;
      }

      const hasFacet=Object.prototype.hasOwnProperty.call(node.facets,key);
      const hasField=Object.prototype.hasOwnProperty.call(node,key);
      if(!hasFacet&&!hasField)continue;

      const actual=hasFacet?node.facets[key]:node[key];

      if(expected&&typeof expected==="object"&&!Array.isArray(expected)&&("min" in expected||"max" in expected)){
        if(!matchesRange(actual,expected))return false;
        continue;
      }

      if(!matchesScalar(actual,expected))return false;
    }
    return true;
  }

  function sortNodes(nodes){
    return [...nodes].sort((a,b)=>{
      const ak=typeof a.sortKey==="number"?a.sortKey:null;
      const bk=typeof b.sortKey==="number"?b.sortKey:null;
      if(ak!=null&&bk!=null&&ak!==bk)return ak-bk;
      if(ak!=null&&bk==null)return -1;
      if(ak==null&&bk!=null)return 1;
      return a.label.localeCompare(b.label,undefined,{numeric:true,sensitivity:"base"});
    });
  }

  function directChildren(graph,parentId,expectedKind,filters){
    const edges=graph.children.get(parentId)||[];
    const out=[];
    for(const e of edges){
      const n=graph.byId.get(e.target);
      if(!n)continue;
      if(expectedKind&&n.kind!==expectedKind)continue;
      if(!matchesFilters(n,filters))continue;
      out.push(n);
    }
    return sortNodes(out);
  }

  function visibleDescendants(graph,node,state,depth,seen,outputNodes,outputEdges){
    if(seen.has(node.id))return;
    seen.add(node.id);

    const collapsed=new Set(state.collapsedNodeIds||[]);
    const expanded=new Set(state.expandedNodeIds||[]);
    if(collapsed.has(node.id)||!expanded.has(node.id))return;

    const childKind=nextKind(node.kind);
    const kids=directChildren(graph,node.id,childKind,state.appliedFilters||{});
    for(const child of kids){
      if(!outputNodes.has(child.id)){
        outputNodes.set(child.id,{node:child,depth:depth+1,role:"descendant"});
      }
      const edge=(graph.children.get(node.id)||[]).find(e=>e.target===child.id&&e.navigation);
      if(edge)outputEdges.set(edge.id,edge);
      visibleDescendants(graph,child,state,depth+1,seen,outputNodes,outputEdges);
    }
  }

  function countReachable(graph,nodeId,filters,seen){
    const visited=seen||new Set();
    if(visited.has(nodeId))return 0;
    visited.add(nodeId);
    const node=graph.byId.get(nodeId);
    if(!node)return 0;
    const kind=nextKind(node.kind);
    const children=directChildren(graph,nodeId,kind,filters||{});
    let total=0;
    for(const child of children){
      if(visited.has(child.id))continue;
      total+=1;
      total+=countReachable(graph,child.id,filters,visited);
    }
    return total;
  }

  function collectBulkExpandNodeIds(graph,nodeId,filters){
    const visited=new Set();
    const expandable=new Set();

    function visit(parentId){
      if(visited.has(parentId))return;
      visited.add(parentId);

      const parent=graph.byId.get(parentId);
      if(!parent)return;

      const children=directChildren(
        graph,
        parentId,
        nextKind(parent.kind),
        filters||{}
      );

      for(const child of children){
        const childKind=nextKind(child.kind);
        const grandChildren=childKind
          ?directChildren(graph,child.id,childKind,filters||{})
          :[];
        if(grandChildren.length>0){
          expandable.add(child.id);
        }
        visit(child.id);
      }
    }

    visit(nodeId);
    return [...expandable];
  }

  function projectionNode(entry,state,graph){
    const n=entry.node;
    const childKind=nextKind(n.kind);
    const direct=childKind?directChildren(graph,n.id,childKind,state.appliedFilters||{}):[];
    return {
      ...clone(n),
      projection:{
        role:entry.role,
        depth:entry.depth,
        selected:Boolean(state.selectedNode&&state.selectedNode.id===n.id),
        expanded:(state.expandedNodeIds||[]).includes(n.id),
        collapsed:(state.collapsedNodeIds||[]).includes(n.id),
        enterable:Boolean(childKind)&&direct.length>0,
        expandable:direct.length>0,
        directChildCount:direct.length,
        reachableDescendantCount:countReachable(graph,n.id,state.appliedFilters||{})
      }
    };
  }

  function projectWorld(graphInput,stateInput,options){
    const graph=graphInput&&graphInput.byId?graphInput:createProjectionGraph(graphInput);
    const state=stateInput||{};
    const opts=options||{};
    const scopeId=state.currentScope&&state.currentScope.id?state.currentScope.id:"universe";
    const scope=graph.byId.get(scopeId);
    if(!scope)throw new Error("GraphProjection: current scope missing "+scopeId);

    const expected=nextKind(scope.kind);
    const filters=state.appliedFilters||{};
    const direct=directChildren(graph,scope.id,expected,filters);
    const outputNodes=new Map();
    const outputEdges=new Map();

    outputNodes.set(scope.id,{node:scope,depth:0,role:"scope"});

    for(const child of direct){
      outputNodes.set(child.id,{node:child,depth:1,role:"child"});
      const edge=(graph.children.get(scope.id)||[]).find(e=>e.target===child.id&&e.navigation);
      if(edge)outputEdges.set(edge.id,edge);
    }

    const seen=new Set([scope.id]);
    for(const child of direct){
      visibleDescendants(graph,child,state,1,seen,outputNodes,outputEdges);
    }

    const nodes=[...outputNodes.values()]
      .sort((a,b)=>{
        const depthDelta=a.depth-b.depth;
        if(depthDelta!==0)return depthDelta;
        const sorted=sortNodes([a.node,b.node]);
        if(sorted[0].id===sorted[1].id)return 0;
        return sorted[0].id===a.node.id?-1:1;
      })
      .map(entry=>projectionNode(entry,state,graph));
    const visibleIds=new Set(nodes.map(n=>n.id));
    for(const edge of graph.edges){
      if(edge.navigation)continue;
      if(visibleIds.has(edge.source)&&visibleIds.has(edge.target)){
        outputEdges.set(edge.id,edge);
      }
    }
    const edges=[...outputEdges.values()].filter(e=>visibleIds.has(e.source)&&visibleIds.has(e.target));

    const breadcrumb=(state.drillPath||[]).map((n,depth)=>({
      id:n.id,
      kind:n.kind,
      label:n.label,
      depth,
      current:depth===(state.drillPath||[]).length-1
    }));

    const expandableNodeIds=nodes.filter(n=>n.projection.expandable).map(n=>n.id);
    const bulkExpandNodeIds=collectBulkExpandNodeIds(graph,scope.id,filters);
    const bulkExpandSet=new Set(bulkExpandNodeIds);
    const selected=state.selectedNode&&graph.byId.get(state.selectedNode.id);

    return {
      scope:clone(scope),
      scopeKind:scope.kind,
      nextKind:expected,
      terminal:expected==null,
      nodes,
      edges:clone(edges),
      breadcrumb,
      filters:clone(filters),
      selectedNode:selected?clone(selected):null,
      expandableNodeIds,
      bulkExpandNodeIds,
      actions:{
        canBack:(state.drillPath||[]).length>1,
        canHome:scope.kind!=="universe",
        canEnter:Boolean(selected)&&nextKind(selected.kind)!=null,
        canExpandSelected:Boolean(selected)&&expandableNodeIds.includes(selected.id),
        canCollapseSelected:Boolean(selected)&&(state.expandedNodeIds||[]).includes(selected.id),
        canExpandAll:bulkExpandNodeIds.some(id=>!(state.expandedNodeIds||[]).includes(id)),
        canCollapseAll:(state.expandedNodeIds||[]).some(id=>bulkExpandSet.has(id)),
        canFit:nodes.length>0
      },
      metrics:{
        directChildCount:direct.length,
        visibleNodeCount:nodes.length,
        visibleEdgeCount:edges.length,
        predictedFullyExpandedNodeCount:1+countReachable(graph,scope.id,filters)
      },
      meta:{
        projectionVersion:1,
        rendererHint:opts.rendererHint||state.rendererMode||"sphere"
      }
    };
  }

  return Object.freeze({
    LEVELS,
    createProjectionGraph,
    nextKind,
    matchesFilters,
    countReachable,
    collectBulkExpandNodeIds,
    projectWorld
  });
});
