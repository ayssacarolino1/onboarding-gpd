export type Block = { blockerId: number; blockedId: number };

// Retorna true se "blockerId bloqueia blockedId" criaria um ciclo.
export function wouldCreateCycle(
  blocks: Block[],
  blockerId: number,
  blockedId: number,
): boolean {
  if (blockerId === blockedId) return true;

  const next = new Map<number, number[]>();
  for (const b of blocks) {
    next.set(b.blockerId, [...(next.get(b.blockerId) ?? []), b.blockedId]);
  }

  const visited = new Set<number>();
  const stack = [blockedId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === blockerId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    stack.push(...(next.get(current) ?? []));
  }

  return false;
}