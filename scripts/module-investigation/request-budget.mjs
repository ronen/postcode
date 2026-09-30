/** Development-only request accounting. Hold one exclusive lease for a whole run.
 * Reserve before dispatch; a crash retains both reservations and the lock. */
import { openSync, closeSync, writeFileSync, readFileSync, renameSync, unlinkSync, fsyncSync } from 'node:fs';
export function requestBudget(file) {
  const lock = `${file}.lock`, lease = openSync(lock, 'wx', 0o600);
  let state, ceiling;
  try {
    state = JSON.parse(readFileSync(file, 'utf8'));
    ceiling = state.ceiling ?? state.authorized;
    if (('ceiling' in state && 'authorized' in state) || !Number.isSafeInteger(ceiling) || ceiling < 0 || !Array.isArray(state.requests) || state.requests.length > ceiling) throw new Error('Invalid request budget');
  } catch (error) { closeSync(lease); unlinkSync(lock); throw error; }
  const save = () => {
    const temp = `${file}.${process.pid}.tmp`, fd = openSync(temp, 'wx', 0o600);
    try { writeFileSync(fd, JSON.stringify(state, null, 2) + '\n'); fsyncSync(fd); } finally { closeSync(fd); }
    renameSync(temp, file);
  };
  let closed = false;
  return {
    reserve(run) {
      if (closed) throw new Error('Budget closed');
      if (state.runs && !state.runs.includes(run)) throw new Error('Run outside fixed schedule');
      if (state.requests.length >= ceiling) return null;
      const ordinal = state.requests.length + 1;
      state.requests.push({ ordinal, run, status: 'reserved-before-dispatch', usage: null, startedAt: new Date().toISOString() }); save(); return ordinal;
    },
    record(ordinal, fields) {
      if (closed || !state.requests[ordinal - 1]) throw new Error('Unknown reservation');
      Object.assign(state.requests[ordinal - 1], fields); save();
    },
    close() { if (!closed) { closed = true; closeSync(lease); unlinkSync(lock); } },
  };
}
