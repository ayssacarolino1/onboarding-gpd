import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const ROLES = ["EDITOR", "LEITOR"];

const publicFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

export async function listUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: publicFields,
      orderBy: { id: "asc" },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de usuário inválido." });
    }

    const { name, email, role, password } = req.body;
    const data: { name?: string; email?: string; role?: string; passwordHash?: string } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Nome inválido." });
      }
      data.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "E-mail inválido." });
      }
      data.email = email.trim();
    }

    if (role !== undefined) {
      if (!ROLES.includes(role)) {
        return res.status(400).json({ message: "Perfil inválido." });
      }
      data.role = role;
    }

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({ message: "A senha precisa ter pelo menos 8 caracteres." });
      }
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Nenhum campo para atualizar." });
    }

    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (data.email && data.email !== existing.email) {
      const emailInUse = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailInUse) {
        return res.status(409).json({ message: "Este email já está cadastrado." });
      }
    }

    if (existing.role === "EDITOR" && data.role === "LEITOR") {
      const editors = await prisma.user.count({ where: { role: "EDITOR" } });
      if (editors <= 1) {
        return res.status(409).json({ message: "Não é possível rebaixar o último Editor." });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: publicFields,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Número de usuário inválido." });
    }

    if (id === res.locals.user.id) {
      return res.status(400).json({ message: "Você não pode excluir o seu próprio usuário." });
    }

    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    if (existing.role === "EDITOR") {
      const editors = await prisma.user.count({ where: { role: "EDITOR" } });
      if (editors <= 1) {
        return res.status(409).json({ message: "Não é possível excluir o último Editor." });
      }
    }

    await prisma.user.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}