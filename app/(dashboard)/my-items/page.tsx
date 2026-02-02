import { Suspense } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OwnerItemCard } from "@/components/items/owner-item-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import type { ItemWithOwner } from "@/types";

async function getMyItems(clerkId: string): Promise<ItemWithOwner[]> {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      items: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user?.items || [];
}

export default async function MyItemsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
          <p className="text-muted-foreground mt-2">
            Manage items you&apos;ve listed for borrowing
          </p>
        </div>
        <Link href="/items/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List New Item
          </Button>
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner text="Loading your items..." />}>
        <MyItemsList clerkId={userId} />
      </Suspense>
    </div>
  );
}

async function MyItemsList({ clerkId }: { clerkId: string }) {
  const items = await getMyItems(clerkId);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No items listed yet"
        description="You haven't listed any items for borrowing. Start sharing your tools with neighbors!"
        actionLabel="List Your First Item"
        actionHref="/items/new"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <OwnerItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
