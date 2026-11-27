import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { wouldCreateCycle } from "../lib/cycles.js";
import { pendingBlockers } from "../lib/blocking.js";

const PRIORITIES = ["Alta", "Média", "Baixa"];

export async function listTasks(_req: Request, res: Response) {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function getTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de tarefa inválido." });
    }

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Informe o título da tarefa." });
    }

    if (priority !== undefined && !PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Prioridade inválida." });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        ...(typeof description === "string" ? { description } : {}),
        ...(priority !== undefined ? { priority } : {}),
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function updateTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de tarefa inválido." });
    }

    const { title, description, priority } = req.body;
    const data: { title?: string; description?: string | null; priority?: string } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Título inválido." });
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      data.description = typeof description === "string" ? description : null;
    }

    if (priority !== undefined) {
      if (!PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: "Prioridade inválida." });
      }
      data.priority = priority;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Nenhum campo para atualizar." });
    }

    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    const task = await prisma.task.update({ where: { id }, data });

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de tarefa inválido." });
    }

    const existing = await prisma.task.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    await prisma.task.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function addBlocker(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const blockerId = Number(req.body.blockerId);

    if (!Number.isInteger(id) || !Number.isInteger(blockerId)) {
      return res.status(400).json({ message: "Números de tarefa inválidos." });
    }

    if (id === blockerId) {
      return res.status(400).json({ message: "Uma tarefa não pode bloquear a si mesma." });
    }

    const tasks = await prisma.task.findMany({
      where: { id: { in: [id, blockerId] } },
    });

    if (tasks.length !== 2) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    const already = await prisma.taskBlock.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId: id } },
    });

    if (already) {
      return res.status(409).json({ message: "Este bloqueio já existe." });
    }

    const allBlocks = await prisma.taskBlock.findMany();

    if (wouldCreateCycle(allBlocks, blockerId, id)) {
      return res.status(409).json({ message: "Este bloqueio criaria um ciclo." });
    }

    const block = await prisma.taskBlock.create({
      data: { blockerId, blockedId: id },
    });

    return res.status(201).json(block);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

// editor remover o bloqueio 
export async function removeBlocker(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const blockerId = Number(req.params.blockerId);

    if (!Number.isInteger(id) || !Number.isInteger(blockerId)) {
      return res.status(400).json({ message: "Números de tarefa inválidos." });
    }

    const result = await prisma.taskBlock.deleteMany({
      where: { blockerId, blockedId: id },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Bloqueio não encontrado." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

const STATUSES = ["todo", "doing", "done"];

export async function moveTask(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de tarefa inválido." });
    }

    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }

    const blockers = await prisma.taskBlock.findMany({
      where: { blockedId: id },
      include: { blocker: { select: { id: true, title: true, status: true } } },
    });

    const pending = pendingBlockers(
      task.status,
      status,
      blockers.map((b) => b.blocker),
    );

    if (pending.length > 0) {
      return res.status(409).json({
        message: "Esta tarefa está bloqueada por tarefas ainda não concluídas.",
        blockers: pending,
      });
    }

    const updated = await prisma.task.update({ where: { id }, data: { status } });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}