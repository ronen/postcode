/** Record applicable numeric properties; callers choose how to interpret the labels. */
export function classify(value: number): string[] {
  const labels: string[] = [];
  if (value > 0) labels.push('positive');
  if (value % 2 === 0) labels.push('even');
  if (value >= 10) labels.push('large');
  return labels;
}
