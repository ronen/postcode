/** Refuse configuration drift before acquiring credentials or sending requests. */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import ts from 'typescript';
import { investigationInstructions } from '../../_build/src/lib/investigation/execute.js';
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
export function verifyConfiguration(spec) {
  const manifest = JSON.parse(readFileSync(spec.manifest, 'utf8'));
  const subject = manifest.subjects.find(item => item.id === spec.subject);
  if (!subject || spec.pass !== manifest.pass || path.basename(spec.project) !== subject.configuration
      || ts.version !== manifest.analyzerTypeScript || process.versions.node !== manifest.node) throw new Error('Assessment configuration mismatch');
  const root = path.dirname(path.resolve(spec.project));
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const changed = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: root, encoding: 'utf8' }).trim();
  if (revision !== subject.commit || changed) throw new Error('Pinned source changed');
  for (const [file, expected] of Object.entries(subject.fileSHA256)) if (hash(path.join(root, file)) !== expected) throw new Error(`Assessment input changed: ${file}`);
  for (const [file, expected] of Object.entries(manifest.contextCodeSHA256)) if (hash(file) !== expected) throw new Error(`Context implementation changed: ${file}`);
  for (const [file, expected] of Object.entries(manifest.assessmentFileSHA256)) if (hash(file) !== expected) throw new Error(`Frozen assessment material changed: ${file}`);
  if (subject.baseConfigPackage && hash(path.join(root, 'node_modules/@cycraft/tsconfig/tsconfig.json')) !== subject.baseConfigPackage.sha256) throw new Error('Inherited configuration changed');
  if (investigationInstructions('functionality') !== JSON.parse(readFileSync(path.join(path.dirname(spec.manifest), 'instructions.json'), 'utf8')).functionality) throw new Error('Built instructions differ from frozen pass');
}
