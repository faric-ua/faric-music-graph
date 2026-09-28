(function(root,factory){
  "use strict";
  const data=factory();
  if(typeof module==="object"&&module.exports){module.exports=data;}
  if(root){root.MUSIC_SAMPLE=data;}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  return {
  artists:[
    {id:"artist:the-prodigy",name:"The Prodigy",genres:["Electronic","Big Beat","Breakbeat","Rave"]},
    {id:"artist:linkin-park",name:"Linkin Park",genres:["Alternative Rock","Nu Metal","Electronic Rock"]}
  ],
  releases:[
    {id:"release:prodigy-experience",artistId:"artist:the-prodigy",title:"Experience",year:1992,type:"studio",tracks:["Fire","Out of Space","Everybody in the Place"]},
    {id:"release:prodigy-jilted",artistId:"artist:the-prodigy",title:"Music for the Jilted Generation",year:1994,type:"studio",tracks:["Voodoo People","Poison","No Good (Start the Dance)"]},
    {id:"release:prodigy-exclusive",artistId:"artist:the-prodigy",title:"Exclusive Missing Remixes & Edits",year:null,type:"exclusive",tracks:["Voodoo People (Mr.Machine Remix - FIFTH DROP Edit)"]},
    {id:"release:lp-hybrid",artistId:"artist:linkin-park",title:"Hybrid Theory",year:2000,type:"studio",tracks:["Papercut","One Step Closer","In the End"]},
    {id:"release:lp-meteora",artistId:"artist:linkin-park",title:"Meteora",year:2003,type:"studio",tracks:["Somewhere I Belong","Faint","Numb"]},
    {id:"release:lp-from-zero",artistId:"artist:linkin-park",title:"From Zero",year:2024,type:"studio",tracks:["The Emptiness Machine","Heavy Is the Crown","Two Faced"]},
    {id:"release:lp-exclusive",artistId:"artist:linkin-park",title:"Exclusive Missing Remixes & Edits",year:null,type:"exclusive",tracks:["Numb (UEFA Remix)"]}
  ]
};
});
