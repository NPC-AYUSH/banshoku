import { Suspense } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ItemDetail } from "@/components/items/item-detail";
import { BookingForm } from "@/components/bookings/booking-form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ borrow?: string }>;
}

async function getItemWithDetails(itemId: string) {
  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      owner: {
        select: {
          id: true,
          clerkId: true,
          name: true,
          imageUrl: true,
          email: true,
        },
      },
      bookings: {
        where: {
          status: { in: ["PENDING", "APPROVED"] },
        },
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { startDate: "asc" },
      },
    },
  });

  return item;
}

export default async function ItemDetailPage({ params, searchParams }: ItemPageProps) {
  const { id } = await params;
  const { borrow } = await searchParams;
  const showBookingForm = borrow === "true";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/items">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner text="Loading item details..." />}>
        <ItemContent itemId={id} showBookingForm={showBookingForm} />
      </Suspense>
    </div>
  );
}

async function ItemContent({
  itemId,
  showBookingForm,
}: {
  itemId: string;
  showBookingForm: boolean;
}) {
  const { userId } = await auth();
  const item = await getItemWithDetails(itemId);

  if (!item) {
    notFound();
  }

  const isOwner = userId ? item.owner.clerkId === userId : false;
  const isAvailable = item.available;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column - Item Details */}
      <ItemDetail item={item} isOwner={isOwner} />

      {/* Right Column - Booking or Owner Actions */}
      <div className="space-y-6">
        {isOwner ? (
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Owner Actions</h3>
            <p className="text-muted-foreground mb-4">
              This is your item. You can manage it from My Items page.
            </p>
            <Link href="/my-items">
              <Button className="w-full">Manage Your Items</Button>
            </Link>
          </div>
        ) : isAvailable ? (
          <BookingForm item={item} />
        ) : (
          <div className="bg-muted rounded-lg p-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Item Not Available</h3>
            <p className="text-sm text-muted-foreground">
              This item is currently unavailable for borrowing.
            </p>
          </div>
        )}

        {/* Current Bookings (Visible to Owner) */}
        {isOwner && item.bookings.length > 0 && (
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Current Bookings</h3>
            <div className="space-y-3">
              {item.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-background rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {booking.borrower.name ?? "Anonymous"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} -{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
