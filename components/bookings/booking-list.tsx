"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { updateBookingStatus, cancelBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Check,
  X,
  RotateCcw,
  Ban,
  MessageSquare,
  Loader2,
  ExternalLink,
  User,
} from "lucide-react";
import {
  BOOKING_STATUS_LABELS,
  CATEGORY_LABELS,
  type BookingWithRelations,
  type BookingForOwner,
  type BookingStatus,
} from "@/types";
import type { UpdateBookingStatusInput } from "@/lib/validations/booking";

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
  RETURNED: "bg-blue-100 text-blue-800 border-blue-300",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-300",
};

interface BookingListProps {
  bookings: BookingWithRelations[] | BookingForOwner[];
  view: "borrower" | "owner";
}

export function BookingList({ bookings, view }: BookingListProps) {
  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} view={view} />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  view,
}: {
  booking: BookingWithRelations | BookingForOwner;
  view: "borrower" | "owner";
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: UpdateBookingStatusInput["status"]) => {
    setIsLoading(true);
    const result = await updateBookingStatus({
      bookingId: booking.id,
      status,
    });
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    const result = await cancelBooking(booking.id);
    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const isPending = booking.status === "PENDING";
  const isApproved = booking.status === "APPROVED";
  const canCancel = isPending || isApproved;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Item Image */}
          <Link
            href={`/items/${booking.item.id}`}
            className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
          >
            {booking.item.imageUrl ? (
              <Image
                src={booking.item.imageUrl}
                alt={booking.item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  No Image
                </span>
              </div>
            )}
          </Link>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  href={`/items/${booking.item.id}`}
                  className="font-semibold text-lg hover:underline"
                >
                  {booking.item.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {CATEGORY_LABELS[booking.item.category]}
                </p>
              </div>
              <Badge variant="outline" className={statusColors[booking.status]}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {view === "borrower" ? (
                  // When viewing as borrower, show item owner
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  // When viewing as owner, show borrower
                  <>
                    <AvatarImage
                      src={(booking as BookingForOwner).borrower.imageUrl ?? undefined}
                    />
                    <AvatarFallback>
                      {(booking as BookingForOwner).borrower.name?.charAt(0) ??
                        "U"}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <span className="text-sm">
                {view === "borrower" ? (
                  "Requested to borrow"
                ) : (
                  <>
                    <span className="font-medium">
                      {(booking as BookingForOwner).borrower.name ?? "Anonymous"}
                    </span>{" "}
                    wants to borrow
                  </>
                )}
              </span>
            </div>

            {/* Message */}
            {booking.message && (
              <div className="bg-muted rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-xs">Message</span>
                </div>
                <p>{booking.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Link href={`/items/${booking.item.id}`}>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Item
                </Button>
              </Link>

              {view === "owner" && isPending && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate("APPROVED")}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusUpdate("REJECTED")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-1" />
                    )}
                    Reject
                  </Button>
                </>
              )}

              {view === "owner" && isApproved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("RETURNED")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4 mr-1" />
                  )}
                  Mark Returned
                </Button>
              )}

              {view === "borrower" && canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4 mr-1" />
                  )}
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
