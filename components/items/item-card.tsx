import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorrowButton } from "./borrow-button";
import { Wrench, Leaf, ChefHat, Sparkles, Dumbbell, Laptop, Package } from "lucide-react";
import type { ItemWithOwner, Category, Condition } from "@/types";

const categoryIcons: Record<Category, React.ComponentType<{ className?: string }>> = {
  POWER_TOOLS: Wrench,
  HAND_TOOLS: Wrench,
  GARDEN: Leaf,
  KITCHEN: ChefHat,
  CLEANING: Sparkles,
  SPORTS: Dumbbell,
  ELECTRONICS: Laptop,
  OTHER: Package,
};

const conditionColors: Record<Condition, string> = {
  NEW: "bg-emerald-500",
  EXCELLENT: "bg-green-500",
  GOOD: "bg-blue-500",
  FAIR: "bg-yellow-500",
  WORN: "bg-orange-500",
};

interface ItemCardProps {
  item: ItemWithOwner;
  showBorrowButton?: boolean;
}

export function ItemCard({ item, showBorrowButton = true }: ItemCardProps) {
  const CategoryIcon = categoryIcons[item.category];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <CategoryIcon className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
            <Badge
              className={`absolute top-2 right-2 ${conditionColors[item.condition]} text-white`}
            >
              {item.condition.toLowerCase()}
            </Badge>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/items/${item.id}`}>
          <h3 className="font-semibold text-lg truncate hover:underline">
            {item.name}
          </h3>
        </Link>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.owner.imageUrl ?? undefined} />
            <AvatarFallback>
              {item.owner.name?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {item.owner.name ?? "Anonymous"}
          </span>
        </div>
      </CardContent>

      {showBorrowButton && (
        <CardFooter className="p-4 pt-0">
          <BorrowButton itemId={item.id} />
        </CardFooter>
      )}
    </Card>
  );
}
