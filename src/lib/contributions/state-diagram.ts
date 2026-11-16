import type { StateModel } from './state-model.js';

/** A directed state-transition diagram: its picture and the legend that carries the full meaning. */
export interface StateDiagram {
  readonly diagramType: 'state-transition';
  readonly method: string;
  readonly svg: string;
  /** Plain-text form of the same supplied information, for interfaces that cannot show a picture. */
  readonly text: string;
  /** Full labels behind the picture's mnemonics. The picture alone is an overview. */
  readonly legend: readonly { readonly mnemonic: string; readonly from: string; readonly to: string; readonly trigger: string | null; readonly guard: string | null; readonly effect: string | null }[];
  /** Qualification that must accompany the picture: entry, coverage, applicability and unsupported semantics. */
  readonly notes: readonly string[];
}
export const stateDiagramMethod = 'postcode/state-transition-diagram@1';

/** Why a state model cannot be drawn, or null. Missing content is a different condition from a rendering failure. */
export function stateDiagramIncompatibility(model: StateModel): string | null {
  return model.states.length ? null : 'The state model establishes no states.';
}

const escape = (value: string): string => value.replace(/[&<>"']/g, character => `&#${character.charCodeAt(0)};`)
  // Control characters in agent-authored labels are shown, never interpreted.
  .replace(/[\u0000-\u001f\u007f]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
const visible = (value: string): string => value.replace(/[\u0000-\u001f\u007f]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
const short = (value: string, limit: number): string => value.length <= limit ? value : `${value.slice(0, limit - 1)}…`;

/**
 * Arrange the supplied state model as a picture. The renderer adds no state, transition,
 * causation or completeness claim: every node and edge is one supplied state or transition,
 * unknown information is shown as unknown, and anything the picture abbreviates is in the legend.
 */
export function renderStateDiagram(model: StateModel, bearerLabel: string): StateDiagram {
  const reason = stateDiagramIncompatibility(model);
  if (reason) throw new Error(`Incompatible state model: ${reason}`);
  const count = model.states.length, radius = Math.max(150, 50 * count), width = 2 * radius + 360, centre = { x: width / 2, y: radius + 150 };
  const box = { width: 150, height: 44 };
  const position = new Map(model.states.map((state, index) => {
    const angle = count === 1 ? -Math.PI / 2 : -Math.PI / 2 + (2 * Math.PI * index) / count;
    return [state.key, { x: centre.x + radius * Math.cos(angle), y: centre.y + radius * Math.sin(angle) }];
  }));
  const height = Math.max(...[...position.values()].map(at => at.y)) + box.height / 2 + 70;
  const label = new Map(model.states.map(state => [state.key, state.label]));
  const legend = model.transitions.map((transition, index) => ({ mnemonic: `T${index + 1}`, from: label.get(transition.from)!, to: label.get(transition.to)!,
    trigger: transition.trigger, guard: transition.guard, effect: transition.effect }));
  const pairs = new Map<string, number>();
  const edges = model.transitions.map((transition, index) => {
    const a = position.get(transition.from)!, b = position.get(transition.to)!, mnemonic = legend[index]!.mnemonic;
    const caption = escape(`${mnemonic}${transition.trigger ? ` ${short(transition.trigger, 28)}` : ' (trigger not established)'}`);
    if (transition.from === transition.to) {
      const top = a.y - box.height / 2;
      return `<path class="edge" d="M ${a.x - 30} ${top} C ${a.x - 60} ${top - 60}, ${a.x + 60} ${top - 60}, ${a.x + 30} ${top}" marker-end="url(#arrow)"/><text class="edge-label" x="${a.x}" y="${top - 52}">${caption}</text>`;
    }
    // Parallel and opposite transitions between the same pair of states bend apart instead of overlapping.
    const pair = [transition.from, transition.to].sort().join('\u0000'), nth = pairs.get(pair) ?? 0;
    pairs.set(pair, nth + 1);
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy) || 1, direction = transition.from < transition.to ? 1 : -1;
    const offset = (64 + 44 * Math.floor(nth / 2)) * (nth % 2 === 0 ? 1 : -1) * direction;
    const control = { x: (a.x + b.x) / 2 - (dy / length) * offset, y: (a.y + b.y) / 2 + (dx / length) * offset };
    // Stop at the target box edge so the arrowhead is visible.
    const tx = b.x - control.x, ty = b.y - control.y, scale = Math.min(Math.abs((box.width / 2 + 4) / (tx || 1e-9)), Math.abs((box.height / 2 + 4) / (ty || 1e-9)));
    const end = { x: b.x - tx * scale, y: b.y - ty * scale };
    // The caption sits beside the curve, on the side it bends toward, staggered along it so that
    // captions of transitions between the same states do not coincide.
    const t = [0.5, 0.34, 0.66][nth % 3]!, u = 1 - t;
    const on = { x: u * u * a.x + 2 * u * t * control.x + t * t * end.x, y: u * u * a.y + 2 * u * t * control.y + t * t * end.y };
    const side = { x: -(dy / length) * Math.sign(offset), y: (dx / length) * Math.sign(offset) };
    const anchor = side.x > 0.3 ? 'start' : side.x < -0.3 ? 'end' : 'middle';
    return `<path class="edge" d="M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}" marker-end="url(#arrow)"/><text class="edge-label" style="text-anchor:${anchor}" x="${(on.x + side.x * 10).toFixed(1)}" y="${(on.y + side.y * 14 + 4).toFixed(1)}">${caption}</text>`;
  });
  const nodes = model.states.map(state => {
    const at = position.get(state.key)!;
    return `<rect class="state" x="${(at.x - box.width / 2).toFixed(1)}" y="${(at.y - box.height / 2).toFixed(1)}" width="${box.width}" height="${box.height}" rx="12"/><text class="state-label" x="${at.x.toFixed(1)}" y="${(at.y + 5).toFixed(1)}">${escape(short(state.label, 20))}</text>`;
  });
  const entry = model.initial.kind === 'state' ? (() => {
    const at = position.get(model.initial.state)!, from = { x: at.x - box.width / 2 - 46, y: at.y - box.height / 2 - 26 };
    return `<circle class="entry" cx="${from.x.toFixed(1)}" cy="${from.y.toFixed(1)}" r="7"/><path class="edge" d="M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${(at.x - box.width / 2 - 4).toFixed(1)} ${(at.y - box.height / 2 + 6).toFixed(1)}" marker-end="url(#arrow)"/>`;
  })() : '';
  const notes = [
    model.initial.kind === 'state' ? `Entry: ${label.get(model.initial.state)}${model.initial.condition ? `, ${model.initial.condition}` : ''}.`
      : model.initial.kind === 'unknown' ? 'Entry: not established by this account. No entry marker is drawn.' : 'Entry: this account establishes that there is no distinguished entry state.',
    `States shown: ${model.coverage.states === 'all' ? 'the account claims these are all the states' : model.coverage.states === 'some' ? 'some states only; others may exist' : 'whether other states exist is not established'}.`,
    `Transitions shown: ${model.coverage.transitions === 'all' ? 'the account claims these are all the transitions' : model.coverage.transitions === 'some' ? 'some transitions only; others may exist' : 'whether other transitions exist is not established'}.`,
    ...(model.applicability ? [`Applies to: ${model.applicability}`] : []),
    ...model.unsupported.map(item => `Not representable in this diagram: ${item}`),
    'The diagram arranges the supplied account. It adds no state, transition or completeness claim, and the absence of an arrow is not a claim that no transition exists unless stated above.',
  ].map(visible);
  const svg = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(`State-transition diagram of ${bearerLabel}`)}">`,
    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>',
    '<style>.state{fill:#f6f8fa;stroke:#24292f;stroke-width:1.5}.state-label{font:14px sans-serif;text-anchor:middle}.edge{fill:none;stroke:#24292f;stroke-width:1.3}.edge-label{font:11px sans-serif;text-anchor:middle;paint-order:stroke;stroke:#fff;stroke-width:4}.entry{fill:#24292f}.title{font:600 15px sans-serif;text-anchor:middle}</style>',
    `<text class="title" x="${centre.x}" y="30">${escape(short(`States of ${bearerLabel}`, 80))}</text>`, ...edges, entry, ...nodes, '</svg>'].join('');
  const describe = (item: StateDiagram['legend'][number]) => [`${item.mnemonic}  ${item.from} → ${item.to}`,
    `      trigger: ${item.trigger ?? 'not established'}`, ...(item.guard ? [`      guard: ${item.guard}`] : []), ...(item.effect ? [`      effect: ${item.effect}`] : [])];
  const text = [`States of ${bearerLabel}`, ...model.states.map(state => `  [${state.label}]${state.description ? `  ${state.description}` : ''}`),
    model.transitions.length ? 'Transitions' : 'No transitions are listed.', ...legend.flatMap(describe), ...notes].map(visible).join('\n');
  return { diagramType: 'state-transition', method: stateDiagramMethod, svg, text, legend, notes };
}
