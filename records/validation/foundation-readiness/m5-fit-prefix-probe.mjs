// Bounded independent prefix enumeration; run from the repository root after building.
// node records/validation/foundation-readiness/m5-fit-prefix-probe.mjs BUILD [REPORT]
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { buildIdentity } from '../../../scripts/comparison-fixtures.mjs';
const build = path.resolve(process.argv[2] ?? '_build');
const { layoutText, fitText } = await import(pathToFileURL(path.join(build, 'src/lib/terminal-layout.js')));
const results = [];
{
const alphabet=['a',' ','\n','\t'];
let cases=0,nonmonotonic=0,mismatches=0; const examples=[];
for(let size=0;size<=6;size++) for(let number=0;number<alphabet.length**size;number++) {
 let n=number,text='';for(let i=0;i<size;i++){text+=alphabet[n%alphabet.length];n=Math.floor(n/alphabet.length);}
 for(const width of [1,2,3,6,7]) {
  const layouts=Array.from({length:text.length+1},(_,i)=>layoutText(text.slice(0,i),'',width));
  for(const maximum of [1,2,3]) {
   const fits=layouts.map(x=>x.lines.length<=maximum&&x.omittedCharacters===0);
   if(fits.some((x,i)=>i>0&&x&&!fits[i-1])) {nonmonotonic++;if(examples.length<10)examples.push({text,width,maximum,fits});}
   const last=fits.lastIndexOf(true);const expected=text.slice(0,Math.max(0,last)).trimEnd();
   const actual=fitText(text,'',maximum,'',width);cases++;
   if(actual!==expected){mismatches++;if(examples.length<10)examples.push({text,width,maximum,expected,actual});}
  }
 }
}
results.push({kind: 'exhaustive-ascii-controls', cases, nonmonotonic, mismatches, examples});
}

{
const segmenter=new Intl.Segmenter('und',{granularity:'grapheme'});
function boundaries(text){
 const escapes=[...text.matchAll(/\\u[\da-f]{4}/gi)].map(x=>[x.index,x.index+6]);
 return [0,...[...segmenter.segment(text)].map(x=>x.index+x.segment.length)].filter(i=>!escapes.some(([start,end])=>start<i&&i<end));
}
const alphabet=['a',' ','\n','\t','\r','古','e\u0301','👩‍👩‍👧‍👦','\\u0009','\x1b','🙂','\u0301','\ufe0e','\u200d'];
let seed=192837,cases=0,mismatches=0,nonmonotonic=0;const examples=[];
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
for(let trial=0;trial<6000;trial++) {
 let text='';for(let i=0,n=random()%24;i<n;i++)text+=alphabet[random()%alphabet.length];
 const prefix=['','@tag ','@\\u0009 ','  '][random()%4],indent=['','  ','↪ '][random()%3];
 const width=1+random()%18,maximum=1+random()%5;
 const ends=boundaries(text), fits=ends.map(end=>{const x=layoutText(prefix+text.slice(0,end),indent,width);return x.lines.length<=maximum&&x.omittedCharacters===0;});
 if(fits.some((x,i)=>i>0&&x&&!fits[i-1])){nonmonotonic++;if(examples.length<12)examples.push({text,prefix,indent,width,maximum,ends,fits});}
 const expected=text.slice(0,ends[Math.max(0,fits.lastIndexOf(true))]).trimEnd();
 const actual=fitText(text,prefix,maximum,indent,width);cases++;
 if(actual!==expected){mismatches++;if(examples.length<12)examples.push({text,prefix,indent,width,maximum,expected,actual});}
}
results.push({kind: 'deterministic-unicode', cases, nonmonotonic, mismatches, examples});
}
const report = { build: buildIdentity(build), results };
const serialized = JSON.stringify(report, null, 2) + '\n';
if (process.argv[3]) writeFileSync(process.argv[3], serialized);
console.log(serialized);
if (results.some(result => result.nonmonotonic || result.mismatches)) process.exitCode = 1;
