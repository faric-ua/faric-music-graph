(()=>{
const D=window.MUSIC_SAMPLE,$=s=>document.querySelector(s),c=$("#graph"),x=c.getContext("2d");
const state={artist:"all",mode:"artist",q:"",scale:1,ox:50,oy:70,drag:false,last:[0,0],nodes:[],edges:[],hit:[]};
const colors={root:"#8b6cff",artist:"#25c6f7",year:"#f4ad45",genre:"#39d98a",release:"#f15a9c",track:"#d9deea"};
function resize(){const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;x.setTransform(d,0,0,d,0,0);draw()}
function rebuild(){
 const rel=D.releases.filter(r=>(state.artist==="all"||r.artistId===state.artist)&&(!state.q||(r.title+" "+r.tracks.join(" ")).toLowerCase().includes(state.q)));
 const n=[],e=[];const add=(id,label,kind,l,meta={})=>{if(!n.some(v=>v.id===id))n.push({id,label,kind,l,meta})};const edge=(a,b)=>e.push([a,b]);
 add("root","MUSIC","root",0);
 if(state.mode==="artist"){
  for(const a of D.artists.filter(a=>rel.some(r=>r.artistId===a.id))){const aid="a:"+a.id;add(aid,a.name,"artist",1,a);edge("root",aid);
   for(const r of rel.filter(r=>r.artistId===a.id)){const rid="r:"+r.id;add(rid,r.title,"release",2,r);edge(aid,rid);
    r.tracks.forEach((t,i)=>{const tid=rid+":t:"+i;add(tid,t,"track",3,{title:t,release:r.title,artist:a.name});edge(rid,tid)})}}
 }else{
  for(const r of rel){const y=r.year??"Unknown",yid="y:"+y;add(yid,String(y),"year",1,{year:r.year});edge("root",yid);const a=D.artists.find(a=>a.id===r.artistId);
   const g=a.genres[0],gid=yid+":g:"+g;add(gid,g,"genre",2,{genre:g});edge(yid,gid);const aid=gid+":a:"+a.id;add(aid,a.name,"artist",3,a);edge(gid,aid);
   const rid="r:"+r.id;add(rid,r.title,"release",4,r);edge(aid,rid)}
 }
 const levels={};n.forEach(v=>(levels[v.l]??=[]).push(v));Object.entries(levels).forEach(([l,list])=>list.forEach((v,i)=>{v.px=+l*245;v.py=45+i*70;v.r=v.kind==="root"?23:v.kind==="artist"?18:v.kind==="release"?12:8}));
 state.nodes=n;state.edges=e;$("#stats").innerHTML="<b>"+rel.length+"</b> релізів у view<br><b>"+n.length+"</b> вузлів";draw();
}
function draw(){const r=c.getBoundingClientRect();x.clearRect(0,0,r.width,r.height);x.lineWidth=1;x.strokeStyle="#343a4a";for(const [a,b] of state.edges){const A=state.nodes.find(n=>n.id===a),B=state.nodes.find(n=>n.id===b);if(!A||!B)continue;x.beginPath();x.moveTo(A.px*state.scale+state.ox,A.py*state.scale+state.oy);x.lineTo(B.px*state.scale+state.ox,B.py*state.scale+state.oy);x.stroke()}
 state.hit=[];for(const n of state.nodes){const px=n.px*state.scale+state.ox,py=n.py*state.scale+state.oy,rr=Math.max(5,n.r*state.scale);x.beginPath();x.fillStyle=colors[n.kind];x.arc(px,py,rr,0,Math.PI*2);x.fill();x.fillStyle="#dce2f0";x.font=Math.max(10,12*state.scale)+"px system-ui";x.fillText(n.label,px+rr+7,py+4);state.hit.push({n,px,py,rr:Math.max(14,rr)})}}
function show(n){$("#details").innerHTML="<span class='pill'>"+n.kind+"</span><h2>"+n.label+"</h2><pre>"+JSON.stringify(n.meta,null,2)+"</pre>";$("#inspector").classList.add("open")}
c.addEventListener("wheel",e=>{e.preventDefault();state.scale=Math.max(.35,Math.min(2.5,state.scale*(e.deltaY<0?1.1:.9)));draw()},{passive:false});
c.addEventListener("pointerdown",e=>{state.drag=true;state.last=[e.clientX,e.clientY];c.setPointerCapture(e.pointerId)});
c.addEventListener("pointermove",e=>{if(!state.drag)return;state.ox+=e.clientX-state.last[0];state.oy+=e.clientY-state.last[1];state.last=[e.clientX,e.clientY];draw()});
c.addEventListener("pointerup",e=>{state.drag=false;const h=state.hit.map(h=>({...h,d:Math.hypot(h.px-e.offsetX,h.py-e.offsetY)})).sort((a,b)=>a.d-b.d)[0];if(h&&h.d<h.rr+8)show(h.n)});
$("#close").onclick=()=>$("#inspector").classList.remove("open");$("#reset").onclick=()=>{state.scale=1;state.ox=50;state.oy=70;$("#search").value="";state.q="";rebuild()};
$("#artist").innerHTML='<option value="all">Усі</option>'+D.artists.map(a=>'<option value="'+a.id+'">'+a.name+"</option>").join("");
$("#artist").onchange=e=>{state.artist=e.target.value;rebuild()};$("#mode").onchange=e=>{state.mode=e.target.value;rebuild()};$("#search").oninput=e=>{state.q=e.target.value.trim().toLowerCase();rebuild()};
addEventListener("resize",resize);resize();rebuild();
})();
