import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { EditItemForm } from "@/components/items/edit-item-form";

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/");
  }

  // Get the current user from database
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/");
  }

  // Get the item
  const item = await db.item.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  // Verify ownership
  if (item.ownerId !== user.id) {
    redirect("/my-items");
  }

  return <EditItemForm item={item} />;
}
