import { describe, it, expect } from "vitest";
import { wouldCreateCycle } from "./cycles.js";

describe("wouldCreateCycle", () => {
  it("recusa uma tarefa bloqueando a si mesma", () => {
    expect(wouldCreateCycle([], 1, 1)).toBe(true);
  });

  it("aceita bloqueio entre tarefas sem relação", () => {
    expect(wouldCreateCycle([], 1, 2)).toBe(false);
  });

  it("recusa ciclo direto (#1 bloqueia #2, então #2 não pode bloquear #1)", () => {
    const blocks = [{ blockerId: 1, blockedId: 2 }];
    expect(wouldCreateCycle(blocks, 2, 1)).toBe(true);
  });

  it("recusa ciclo indireto (#1 → #2 → #3, então #3 não pode bloquear #1)", () => {
    const blocks = [
      { blockerId: 1, blockedId: 2 },
      { blockerId: 2, blockedId: 3 },
    ];
    expect(wouldCreateCycle(blocks, 3, 1)).toBe(true);
  });

  it("aceita bloqueio que não fecha ciclo (#1 já leva à #3 por outro caminho)", () => {
    const blocks = [
      { blockerId: 1, blockedId: 2 },
      { blockerId: 2, blockedId: 3 },
    ];
    expect(wouldCreateCycle(blocks, 1, 3)).toBe(false);
  });
});