"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { createItemSchema, updateItemSchema, type CreateItemInput, type UpdateItemInput } from "@/lib/validations/item";

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createItem(
  input: CreateItemInput
): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate input with Zod
    const validatedFields = createItemSchema.safeParse(input);
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: validatedFields.error.issues[0]?.message ?? "Invalid input" 
      };
    }

    // 3. Find user in database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // 4. Create item in database
    const item = await db.item.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        category: validatedFields.data.category,
        condition: validatedFields.data.condition,
        imageUrl: validatedFields.data.imageUrl || null,
        ownerId: user.id,
      },
    });

    // 5. Revalidate cache
    revalidatePath("/items");
    revalidatePath("/my-items");

    return { success: true, data: { id: item.id } };
  } catch (error) {
    console.error("[CREATE_ITEM]", error);
    return { success: false, error: "Failed to create item" };
  }
}

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedFields = updateItemSchema.safeParse(input);
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: validatedFields.error.issues[0]?.message ?? "Invalid input" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify ownership
    const existingItem = await db.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return { success: false, error: "Item not found" };
    }

    if (existingItem.ownerId !== user.id) {
      return { success: false, error: "You can only edit your own items" };
    }

    const item = await db.item.update({
      where: { id: itemId },
      data: {
        ...validatedFields.data,
        imageUrl: validatedFields.data.imageUrl || null,
      },
    });

    revalidatePath("/items");
    revalidatePath("/my-items");
    revalidatePath(`/items/${itemId}`);

    return { success: true, data: { id: item.id } };
  } catch (error) {
    console.error("[UPDATE_ITEM]", error);
    return { success: false, error: "Failed to update item" };
  }
}

export async function deleteItem(
  itemId: string
): Promise<ActionResult<null>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingItem = await db.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return { success: false, error: "Item not found" };
    }

    if (existingItem.ownerId !== user.id) {
      return { success: false, error: "You can only delete your own items" };
    }

    await db.item.delete({
      where: { id: itemId },
    });

    revalidatePath("/items");
    revalidatePath("/my-items");

    return { success: true, data: null };
  } catch (error) {
    console.error("[DELETE_ITEM]", error);
    return { success: false, error: "Failed to delete item" };
  }
}

export async function toggleItemAvailability(
  itemId: string
): Promise<ActionResult<{ available: boolean }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const existingItem = await db.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return { success: false, error: "Item not found" };
    }

    if (existingItem.ownerId !== user.id) {
      return { success: false, error: "You can only modify your own items" };
    }

    const item = await db.item.update({
      where: { id: itemId },
      data: {
        available: !existingItem.available,
      },
    });

    revalidatePath("/items");
    revalidatePath("/my-items");
    revalidatePath(`/items/${itemId}`);

    return { success: true, data: { available: item.available } };
  } catch (error) {
    console.error("[TOGGLE_ITEM_AVAILABILITY]", error);
    return { success: false, error: "Failed to update item availability" };
  }
}
