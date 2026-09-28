// Preserved investigation model, not native filesystem certification.
// Run in a separate process: node <this-file> <compiled-output-boundary.js>
import fs from 'node:fs';
import path from 'node:path';
import {syncBuiltinESMExports} from 'node:module';
import {pathToFileURL} from 'node:url';
const {outputBoundary} = await import(pathToFileURL(path.resolve(process.argv[2])));
const entries = new Map(); let ino = 1;
const dir = (name, dev, insensitive = false) => entries.set(name, {dev, ino:ino++, insensitive, directory:true});
const link = (name,target,dev) => entries.set(name,{dev,ino:ino++,target});
const missing = () => {throw Object.assign(new Error('missing model path'),{code:'ENOENT'});};
function lookup(name, follow = true) {
  const parts = path.resolve(name).split('/').filter(Boolean); let current = '/';
  for(let index=0; index<parts.length; index++) {
    const parent = entries.get(current); if(!parent?.directory) return missing();
    const requested = path.join(current,parts[index]);
    const actual = [...entries.keys()].find(key => path.dirname(key)===current &&
      (parent.insensitive ? key.toLowerCase()===requested.toLowerCase() : key===requested));
    if(!actual) return missing();
    const entry = entries.get(actual);
    if(entry.target && (follow || index<parts.length-1)) return lookup(path.join(entry.target,...parts.slice(index+1)),follow);
    current=actual;
  }
  return {name:current,entry:entries.get(current)};
}
function stat(name,follow) {const {entry}=lookup(name,follow); return {...entry,isDirectory:()=>!!entry.directory,isSymbolicLink:()=>!!entry.target};}
fs.statSync = name => stat(name,true);
fs.lstatSync = name => stat(name,false);
fs.realpathSync.native = name => lookup(name).name;
fs.readlinkSync = name => lookup(name,false).entry.target;
fs.readdirSync = name => {const parent=lookup(name).name;return [...entries.keys()].filter(key=>key!==parent && path.dirname(key)===parent).map(key=>path.basename(key));};
syncBuiltinESMExports();
function setup() {entries.clear();ino=1;dir('/',10);dir('/case-model',10);}
setup();dir('/case-model/Upper',10);dir('/case-model/upper',10);
dir('/case-model/mounted',20,true);dir('/case-model/mounted/nested',20,true);dir('/case-model/mounted/nested/out',20,true);
link('/case-model/Upper/link','/case-model/mounted/nested',10);
dir('/case-model/upper/link',10);dir('/case-model/upper/link/out',10);
let results=[];
try {const policy=outputBoundary(['/case-model/Upper/link/out']); results.push({case:'mixed-filesystem lexical sibling',expected:false,actual:policy.excluded('/case-model/upper/link/out/source.ts')});}
catch(error){results.push({case:'mixed-filesystem lexical sibling',error:error.message});}
setup();dir('/case-model/insensitive',10,true);dir('/case-model/insensitive/Probe',10,true);dir('/case-model/sensitive',10);dir('/case-model/sensitive/Probe',10);
try {const policy=outputBoundary(['/case-model/insensitive/Out','/case-model/sensitive/Out']);results.push({case:'per-directory insensitive suffix',expected:true,actual:policy.excluded('/case-model/insensitive/out/source.ts')});results.push({case:'per-directory sensitive sibling',expected:false,actual:policy.excluded('/case-model/sensitive/out/source.ts')});}
catch(error){results.push({case:'per-directory case rules',error:error.message});}
setup();dir('/case-model/mounted',20,true);dir('/case-model/mounted/Nested',20,true);
try {results.push({case:'nonempty device root',expected:1,actual:outputBoundary(['/case-model/mounted']).count});}
catch(error){results.push({case:'nonempty device root',error:error.message});}
const list = fs.readdirSync;
fs.readdirSync = name => [...(String(name)==='/case-model/mounted' ? ['Gone'] : []),...list(name)];
syncBuiltinESMExports();
try {results.push({case:'vanished device-root sibling',expected:1,actual:outputBoundary(['/case-model/mounted']).count});}
catch(error){results.push({case:'vanished device-root sibling',error:error.message});}
fs.readdirSync=list;syncBuiltinESMExports();
setup();dir('/case-model/mounted',20,true);
try {results.push({case:'empty device root',unexpected:outputBoundary(['/case-model/mounted']).count});}
catch(error){results.push({case:'empty device root',expected:'explicit case-handling failure',actual:error.reason});}
console.log(JSON.stringify(results,null,2));
