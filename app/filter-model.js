(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.FilterModel=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const SEARCH={key:"search",label:"Пошук",type:"search",placeholder:"Назва, ID або текст"};
  const REGISTRY=Object.freeze({
    universe:[
      SEARCH,
      {key:"provider",label:"Провайдер",type:"select",facet:"provider"},
      {key:"status",label:"Статус акаунта",type:"select",facet:"status"}
    ],
    account:[
      SEARCH,
      {key:"year",label:"Рік",type:"select",facet:"year",numeric:true}
    ],
    year:[
      SEARCH,
      {key:"genre",label:"Жанр",type:"select",facet:"genre"}
    ],
    genre:[
      SEARCH,
      {key:"artist",label:"Виконавець",type:"select",facet:"artist"}
    ],
    artist:[
      SEARCH,
      {key:"releaseType",label:"Тип релізу",type:"select",facet:"releaseType"},
      {key:"year",label:"Рік релізу",type:"select",facet:"year",numeric:true}
    ],
    release:[
      SEARCH,
      {key:"availability",label:"Доступність",type:"select",facet:"availability"},
      {key:"versionType",label:"Версія",type:"select",facet:"versionType"}
    ],
    track:[]
  });

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function definitionsForScope(kind){
    return clone(REGISTRY[kind]||[SEARCH]);
  }

  function defaultsForScope(kind){
    const out={};
    for(const def of definitionsForScope(kind)){
      out[def.key]=def.type==="search"?"":"all";
    }
    return out;
  }

  function activeFilterCount(filters){
    let count=0;
    for(const value of Object.values(filters||{})){
      if(value==null||value==="")continue;
      if(typeof value==="string"&&["all","any","*"].includes(value.toLowerCase()))continue;
      if(Array.isArray(value)&&value.length===0)continue;
      count+=1;
    }
    return count;
  }

  function equalFilters(a,b){
    return JSON.stringify(a||{})===JSON.stringify(b||{});
  }

  function directChildNodes(graph,scopeId){
    if(!graph||!graph.children||!graph.byId)return [];
    const edges=graph.children.get(scopeId)||[];
    return edges
      .filter(e=>e.navigation)
      .map(e=>graph.byId.get(e.target))
      .filter(Boolean);
  }

  function optionsForDefinition(graph,scopeId,definition){
    const def=definition||{};
    if(def.type!=="select")return [];
    const values=[];
    for(const node of directChildNodes(graph,scopeId)){
      const key=def.facet||def.key;
      const value=node.facets&&Object.prototype.hasOwnProperty.call(node.facets,key)
        ?node.facets[key]
        :node[key];
      if(value==null)continue;
      const list=Array.isArray(value)?value:[value];
      for(const item of list){
        if(!values.some(v=>String(v)===String(item)))values.push(item);
      }
    }
    values.sort((a,b)=>{
      if(typeof a==="number"&&typeof b==="number")return a-b;
      return String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:"base"});
    });
    return values.map(value=>({value,label:String(value)}));
  }

  function optionsForScope(graph,scopeId,kind){
    const out={};
    for(const def of definitionsForScope(kind)){
      if(def.type==="select")out[def.key]=optionsForDefinition(graph,scopeId,def);
    }
    return out;
  }

  return Object.freeze({
    REGISTRY,
    definitionsForScope,
    defaultsForScope,
    activeFilterCount,
    equalFilters,
    directChildNodes,
    optionsForDefinition,
    optionsForScope
  });
});
