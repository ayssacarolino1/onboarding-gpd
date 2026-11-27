export type BlockerInfo = { id: number; title: string; status: string };

// Devolve os bloqueadores que impedem a tarefa de sair de "A fazer".
export function pendingBlockers(
  currentStatus: string,
  targetStatus: string,
  blockers: BlockerInfo[],
): BlockerInfo[] {
  if (currentStatus !== "todo" || targetStatus === "todo") return [];
  return blockers.filter((b) => b.status !== "done");
}