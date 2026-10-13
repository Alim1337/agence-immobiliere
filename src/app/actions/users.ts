"use server";

import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";
import * as usersData from "@/lib/data/users";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non authentifié");
  if (session.user.role !== "ADMIN") {
    throw new Error("Réservé aux administrateurs.");
  }
  return session.user;
}

export interface CreateUserFormState {
  error?: string;
}

export async function createUserAction(
  _prevState: CreateUserFormState | undefined,
  formData: FormData
): Promise<CreateUserFormState> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as Role;
  const password = formData.get("password") as string;

  if (!name || !email || !role || !password) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  try {
    await usersData.createUser({ name, email, phone, role, password });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur inconnue." };
  }

  revalidatePath("/admin/agents");
  return {};
}

export async function toggleUserActiveAction(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    throw new Error("Vous ne pouvez pas désactiver votre propre compte.");
  }
  await usersData.toggleUserActive(userId);
  revalidatePath("/admin/agents");
}

export async function updateUserRoleAction(userId: string, role: Role) {
  await requireAdmin();
  await usersData.updateUserRole(userId, role);
  revalidatePath("/admin/agents");
}
