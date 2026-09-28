(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports){module.exports=api;}
  if(root){root.FilterModel=api;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";

  const DEFAULT_FILTERS=Object.freeze({
    search:"",
    artist:"all",
    year:Object.freeze({min:null,max:null}),
    genre:"all",
    releaseType:"all"
  });

  function clone(value){
    return value==null?value:JSON.parse(JSON.stringify(value));
  }

  function optionalYear(value){
    if(value==null||value==="")return null;
    const n=Number(value);
    return Number.isFinite(n)?Math.trunc(n):null;
  }

  function normalizeChoice(value){
    return typeof value==="string"&&value.trim()?value.trim():"all";
  }

  function normalizeFilters(input){
    const src=input||{};
    let min=optionalYear(src.year&&src.year.min);
    let max=optionalYear(src.year&&src.year.max);
    if(min!=null&&max!=null&&min>max){
      const tmp=min;
      min=max;
      max=tmp;
    }
    return {
      search:typeof src.search==="string"?src.search.trim():"",
      artist:normalizeChoice(src.artist),
      year:{min,max},
      genre:normalizeChoice(src.genre),
      releaseType:normalizeChoice(src.releaseType)
    };
  }

  function defaultFilters(){
    return clone(DEFAULT_FILTERS);
  }

  function isAll(value){
    return value==null||value===""||String(value).toLowerCase()==="all";
  }

  function activeFilterCount(input){
    const f=normalizeFilters(input);
    let count=0;
    if(f.search)count+=1;
    if(!isAll(f.artist))count+=1;
    if(f.year.min!=null||f.year.max!=null)count+=1;
    if(!isAll(f.genre))count+=1;
    if(!isAll(f.releaseType))count+=1;
    return count;
  }

  function includesText(value,query){
    return String(value||"").toLocaleLowerCase().includes(query);
  }

  function releaseMatches(dataset,release,input){
    const data=dataset||{};
    const f=normalizeFilters(input);
    const artist=(data.artists||[]).find(a=>a.id===release.artistId)||null;

    if(!isAll(f.artist)&&release.artistId!==f.artist)return false;

    if(!isAll(f.genre)){
      const genres=artist&&Array.isArray(artist.genres)?artist.genres:[];
      if(!genres.some(g=>String(g).toLocaleLowerCase()===f.genre.toLocaleLowerCase()))return false;
    }

    if(!isAll(f.releaseType)&&String(release.type||"").toLocaleLowerCase()!==f.releaseType.toLocaleLowerCase()){
      return false;
    }

    if(f.year.min!=null||f.year.max!=null){
      if(typeof release.year!=="number")return false;
      if(f.year.min!=null&&release.year<f.year.min)return false;
      if(f.year.max!=null&&release.year>f.year.max)return false;
    }

    if(f.search){
      const q=f.search.toLocaleLowerCase();
      const haystack=[
        release.title,
        release.year,
        release.type,
        artist&&artist.name,
        ...(artist&&Array.isArray(artist.genres)?artist.genres:[]),
        ...(Array.isArray(release.tracks)?release.tracks:[])
      ];
      if(!haystack.some(value=>includesText(value,q)))return false;
    }

    return true;
  }

  function filterReleases(dataset,input){
    const releases=dataset&&Array.isArray(dataset.releases)?dataset.releases:[];
    const f=normalizeFilters(input);
    return releases.filter(release=>releaseMatches(dataset,release,f));
  }

  return Object.freeze({
    DEFAULT_FILTERS,
    defaultFilters,
    normalizeFilters,
    activeFilterCount,
    releaseMatches,
    filterReleases
  });
});
