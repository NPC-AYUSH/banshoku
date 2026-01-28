"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HandHeart, Loader2 } from "lucide-react";

interface BorrowButtonProps {
  itemId: string;
}

export function BorrowButton({ itemId }: BorrowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBorrow = async () => {
    setIsLoading(true);
    // Navigate to item details page to complete booking
    router.push(`/items/${itemId}?borrow=true`);
  };

  return (
    <Button
      onClick={handleBorrow}
      disabled={isLoading}
      className="w-full"
      variant="default"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <HandHeart className="h-4 w-4 mr-2" />
      )}
      Borrow
    </Button>
  );
}
