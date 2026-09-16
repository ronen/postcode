import { value } from './target.js';
import './target.js';
import type { Shape } from './target.js';
import { type Shape as OtherShape } from './target.js';
import { type Shape as MixedShape, value as otherValue } from './target.js';
export * from './forward.js';
export * as namespace from './target.js';
export type * from './target.js';
export { type Shape } from './target.js';
export {} from './target.js';
import target = require('./target.js');
import type typeTarget = require('./target.js');
type Imported = import('./target.js').Shape;
type Queried = typeof import('./target.js');
import('./target.js');
import(`./target.js`);
const chosen = './target.js';
import(chosen);
import('./' + 'target.js');
import('./missing.js');
require('./target.js');
require('./require-only.js');
require('./missing.js');
require(chosen);
if (false) require('./target.js');
function parameter(require: (name: string) => unknown) { require('./target.js'); }
function hoisted() { require('./target.js'); function require(name: string) { return name; } }
{ require('./target.js'); const require = (name: string) => name; }
const alias = require;
alias('./target.js');
const loader = { require };
loader.require('./target.js');
require.resolve('./target.js');
require();
require('./target.js', './forward.js');
