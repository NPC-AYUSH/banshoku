import { Suspense } from "react";
import { db } from "@/lib/db";
import { ItemGrid } from "@/components/items/item-grid";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Package } from "lucide-react";

async function getAvailableItems() {
  const items = await db.item.findMany({
    where: { available: true },
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
  });

  return items;
}

export default async function ItemsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Available Items</h1>
        <p className="text-muted-foreground mt-2">
          Browse tools and items available to borrow from your neighbors
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner text="Loading items..." />}>
        <AvailableItemsGrid />
      </Suspense>
    </div>
  );
}

async function AvailableItemsGrid() {
  const items = await getAvailableItems();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No items available"
        description="Be the first to list an item for your neighbors to borrow!"
        actionLabel="List an Item"
        actionHref="/items/new"
      />
    );
  }

  return <ItemGrid items={items} />;
}
