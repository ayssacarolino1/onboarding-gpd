import { describe, it, expect } from "vitest";
import { pendingBlockers } from "./blocking.js";

const concluida = { id: 1, title: "Tarefa concluída", status: "done" };
const andando = { id: 2, title: "Tarefa em andamento", status: "doing" };
const aFazer = { id: 3, title: "Tarefa a fazer", status: "todo" };

describe("pendingBlockers", () => {
  it("deixa mover uma tarefa sem bloqueadores", () => {
    expect(pendingBlockers("todo", "doing", [])).toEqual([]);
  });

  it("barra a saída de A fazer se o bloqueador está em A fazer", () => {
    expect(pendingBlockers("todo", "doing", [aFazer])).toEqual([aFazer]);
  });

  it("barra a saída de A fazer se o bloqueador está em andamento", () => {
    expect(pendingBlockers("todo", "doing", [andando])).toEqual([andando]);
  });

  it("libera quando todos os bloqueadores estão concluídos", () => {
    expect(pendingBlockers("todo", "doing", [concluida])).toEqual([]);
  });

  it("continua barrando se só um dos bloqueadores foi concluído", () => {
    expect(pendingBlockers("todo", "doing", [concluida, andando])).toEqual([andando]);
  });

  it("não barra quem já saiu de A fazer", () => {
    expect(pendingBlockers("doing", "done", [andando])).toEqual([]);
  });

  it("não barra a permanência em A fazer", () => {
    expect(pendingBlockers("todo", "todo", [andando])).toEqual([]);
  });
});