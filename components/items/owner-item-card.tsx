"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteItem, toggleItemAvailability } from "@/actions/items";
import {
  Wrench,
  Leaf,
  ChefHat,
  Sparkles,
  Dumbbell,
  Laptop,
  Package,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  Eye,
  Loader2,
} from "lucide-react";
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

interface OwnerItemCardProps {
  item: ItemWithOwner;
}

export function OwnerItemCard({ item }: OwnerItemCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const CategoryIcon = categoryIcons[item.category];

  const handleToggleAvailability = async () => {
    setIsLoading(true);
    const result = await toggleItemAvailability(item.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteItem(item.id);
    if (result.success) {
      router.refresh();
    }
    setIsDeleting(false);
  };

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
            {!item.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Unavailable</Badge>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/items/${item.id}`} className="flex-1">
            <h3 className="font-semibold text-lg truncate hover:underline">
              {item.name}
            </h3>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/items/${item.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/items/${item.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleToggleAvailability}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Power className="h-4 w-4 mr-2" />
                )}
                {item.available ? "Mark Unavailable" : "Mark Available"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-600"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant={item.available ? "default" : "secondary"}>
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
