"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, type Category } from "@/types";
import {
  Wrench,
  Leaf,
  ChefHat,
  Sparkles,
  Dumbbell,
  Laptop,
  Package,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories: { value: Category; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "POWER_TOOLS", icon: Wrench },
  { value: "HAND_TOOLS", icon: Wrench },
  { value: "GARDEN", icon: Leaf },
  { value: "KITCHEN", icon: ChefHat },
  { value: "CLEANING", icon: Sparkles },
  { value: "SPORTS", icon: Dumbbell },
  { value: "ELECTRONICS", icon: Laptop },
  { value: "OTHER", icon: Package },
];

interface CategoryFilterProps {
  selectedCategory?: string;
}

export function CategoryFilter({ selectedCategory }: CategoryFilterProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
        {selectedCategory && (
          <button
            onClick={() => router.push("/items")}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear filter
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(({ value, icon: Icon }) => {
          const isSelected = selectedCategory === value;
          return (
            <Link
              key={value}
              href={isSelected ? "/items" : `/items?category=${value}`}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="h-4 w-4" />
              {CATEGORY_LABELS[value]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
