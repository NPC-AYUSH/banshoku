import { Suspense } from "react";
import { db } from "@/lib/db";
import { ItemGrid } from "@/components/items/item-grid";
import { CategoryFilter } from "@/components/items/category-filter";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Package } from "lucide-react";
import type { Category } from "@/types";

interface ItemsPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function getAvailableItems(category?: Category) {
  const items = await db.item.findMany({
    where: { 
      available: true,
      ...(category && { category }),
    },
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

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const { category } = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Available Items</h1>
        <p className="text-muted-foreground mt-2">
          Browse tools and items available to borrow from your neighbors
        </p>
      </div>

      <CategoryFilter selectedCategory={category} />

      <Suspense fallback={<LoadingSpinner text="Loading items..." />}>
        <AvailableItemsGrid category={category as Category | undefined} />
      </Suspense>
    </div>
  );
}

async function AvailableItemsGrid({ category }: { category?: Category }) {
  const items = await getAvailableItems(category);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No items available"
        description={
          category
            ? `No items found in the ${category.replace(/_/g, " ").toLowerCase()} category. Try selecting a different category.`
            : "Be the first to list an item for your neighbors to borrow!"
        }
        actionLabel={category ? "View All Items" : "List an Item"}
        actionHref={category ? "/items" : "/items/new"}
      />
    );
  }

  return <ItemGrid items={items} />;
}
