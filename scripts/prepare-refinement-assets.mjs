import sharp from "sharp";
import {copyFile,mkdir,writeFile,readFile} from "node:fs/promises";
import path from "node:path";
import {createHash} from "node:crypto";
const args=process.argv.slice(2);
const avatar=args[args.indexOf("--avatar")+1],icons=args[args.indexOf("--icons")+1];
if(!args.includes("--avatar")||!args.includes("--icons"))throw Error("Use --avatar <supplied portrait> --icons <supplied PNG directory>");
await mkdir("public/images/backpack-icons",{recursive:true});
await copyFile(avatar,"public/images/about-avatar-v3.png");
const report={avatar:{sha256:createHash("sha256").update(await readFile(avatar)).digest("hex")},icons:[]};
for(const name of ["football","basketball","running","uiux_design","product_design","ai_development"]){
 const input=path.join(icons,name+".png");
 const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let minX=info.width,minY=info.height,maxX=0,maxY=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const i=(y*info.width+x)*4;
  if(data[i+3]>32){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
  // Remove near-invisible background speckles, preserving artwork and its soft shadow.
  if(data[i+3]<12)data[i+3]=0;
 }
 const left=Math.max(0,minX-16),top=Math.max(0,minY-16);
 const width=Math.min(info.width,maxX+17)-left,height=Math.min(info.height,maxY+17)-top;
 await sharp(data,{raw:info}).extract({left,top,width,height}).png().toFile("public/images/backpack-icons/"+name+".png");
 report.icons.push({name,width,height,aspect:width/height,sourceSha256:createHash("sha256").update(await readFile(input)).digest("hex"),crop:{left,top,width,height}});
}
await writeFile("public/images/backpack-icons/manifest.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
