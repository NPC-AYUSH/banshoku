import { ItemCard } from "./item-card";
import type { ItemWithOwner } from "@/types";

interface ItemGridProps {
  items: ItemWithOwner[];
  showBorrowButton?: boolean;
}

export function ItemGrid({ items, showBorrowButton = true }: ItemGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} showBorrowButton={showBorrowButton} />
      ))}
    </div>
  );
}
