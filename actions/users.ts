"use server";

import { db } from "@/lib/db";

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

interface CreateUserInput {
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export async function createUser(
  input: CreateUserInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const existingUser = await db.user.findUnique({
      where: { clerkId: input.clerkId },
    });

    if (existingUser) {
      return { success: true, data: { id: existingUser.id } };
    }

    const user = await db.user.create({
      data: {
        clerkId: input.clerkId,
        email: input.email,
        name: input.name,
        imageUrl: input.imageUrl,
      },
    });

    return { success: true, data: { id: user.id } };
  } catch (error) {
    console.error("[CREATE_USER]", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(
  clerkId: string,
  input: Partial<Omit<CreateUserInput, "clerkId">>
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await db.user.update({
      where: { clerkId },
      data: input,
    });

    return { success: true, data: { id: user.id } };
  } catch (error) {
    console.error("[UPDATE_USER]", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(
  clerkId: string
): Promise<ActionResult<null>> {
  try {
    await db.user.delete({
      where: { clerkId },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("[DELETE_USER]", error);
    return { success: false, error: "Failed to delete user" };
  }
}
