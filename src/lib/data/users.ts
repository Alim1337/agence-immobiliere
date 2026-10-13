import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  role: Role;
  password: string;
}

export async function createUser(input: CreateUserInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role,
      passwordHash,
      active: true,
    },
  });
}

export async function toggleUserActive(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable");
  return prisma.user.update({
    where: { id: userId },
    data: { active: !user.active },
  });
}

export async function updateUserRole(userId: string, role: Role) {
  return prisma.user.update({ where: { id: userId }, data: { role } });
}
