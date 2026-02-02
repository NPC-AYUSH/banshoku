import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wrench,
  Leaf,
  ChefHat,
  Sparkles,
  Dumbbell,
  Laptop,
  Package,
  Calendar,
  User,
  Mail,
  Check,
  X,
} from "lucide-react";
import { CATEGORY_LABELS, CONDITION_LABELS, type ItemWithRelations } from "@/types";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  POWER_TOOLS: Wrench,
  HAND_TOOLS: Wrench,
  GARDEN: Leaf,
  KITCHEN: ChefHat,
  CLEANING: Sparkles,
  SPORTS: Dumbbell,
  ELECTRONICS: Laptop,
  OTHER: Package,
};

const conditionColors: Record<string, string> = {
  NEW: "bg-emerald-500",
  EXCELLENT: "bg-green-500",
  GOOD: "bg-blue-500",
  FAIR: "bg-yellow-500",
  WORN: "bg-orange-500",
};

interface ItemDetailProps {
  item: ItemWithRelations;
  isOwner: boolean;
}

export function ItemDetail({ item, isOwner }: ItemDetailProps) {
  const CategoryIcon = categoryIcons[item.category] || Package;

  return (
    <div className="space-y-6">
      {/* Image Section */}
      <div className="relative aspect-square lg:aspect-video rounded-lg overflow-hidden bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CategoryIcon className="h-24 w-24 text-muted-foreground/50" />
          </div>
        )}
        <Badge
          className={`absolute top-4 left-4 ${conditionColors[item.condition]} text-white`}
        >
          {CONDITION_LABELS[item.condition]}
        </Badge>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Not Available
            </Badge>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
        {item.description && (
          <p className="text-muted-foreground text-lg leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Owner Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={item.owner.imageUrl ?? undefined} />
              <AvatarFallback className="text-lg">
                {item.owner.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{item.owner.name ?? "Anonymous"}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {item.owner.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Listed On</p>
              <p className="font-medium">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            {item.available ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Available</p>
                </div>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-red-600">Not Available</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
