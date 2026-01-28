"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { 
  createBookingSchema, 
  updateBookingStatusSchema, 
  type CreateBookingInput, 
  type UpdateBookingStatusInput 
} from "@/lib/validations/booking";

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createBooking(
  input: CreateBookingInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedFields = createBookingSchema.safeParse(input);
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: validatedFields.error.issues[0]?.message ?? "Invalid input" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if item exists and is available
    const item = await db.item.findUnique({
      where: { id: validatedFields.data.itemId },
    });

    if (!item) {
      return { success: false, error: "Item not found" };
    }

    if (!item.available) {
      return { success: false, error: "Item is not available for booking" };
    }

    // Prevent users from booking their own items
    if (item.ownerId === user.id) {
      return { success: false, error: "You cannot book your own item" };
    }

    // Check for overlapping bookings
    const overlappingBooking = await db.booking.findFirst({
      where: {
        itemId: validatedFields.data.itemId,
        status: { in: ["PENDING", "APPROVED"] },
        OR: [
          {
            startDate: { lte: validatedFields.data.endDate },
            endDate: { gte: validatedFields.data.startDate },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return { success: false, error: "Item is already booked for this period" };
    }

    const booking = await db.booking.create({
      data: {
        itemId: validatedFields.data.itemId,
        borrowerId: user.id,
        startDate: validatedFields.data.startDate,
        endDate: validatedFields.data.endDate,
        message: validatedFields.data.message,
      },
    });

    revalidatePath("/bookings");
    revalidatePath(`/items/${validatedFields.data.itemId}`);

    return { success: true, data: { id: booking.id } };
  } catch (error) {
    console.error("[CREATE_BOOKING]", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function updateBookingStatus(
  input: UpdateBookingStatusInput
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedFields = updateBookingStatusSchema.safeParse(input);
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: validatedFields.error.issues[0]?.message ?? "Invalid input" 
      };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const booking = await db.booking.findUnique({
      where: { id: validatedFields.data.bookingId },
      include: { item: true },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // Only item owner can approve/reject, both parties can mark as returned/cancelled
    const isOwner = booking.item.ownerId === user.id;
    const isBorrower = booking.borrowerId === user.id;

    if (validatedFields.data.status === "APPROVED" || validatedFields.data.status === "REJECTED") {
      if (!isOwner) {
        return { success: false, error: "Only the item owner can approve or reject bookings" };
      }
    }

    if (validatedFields.data.status === "CANCELLED") {
      if (!isBorrower) {
        return { success: false, error: "Only the borrower can cancel a booking" };
      }
    }

    if (validatedFields.data.status === "RETURNED") {
      if (!isOwner && !isBorrower) {
        return { success: false, error: "Unauthorized" };
      }
    }

    const updatedBooking = await db.booking.update({
      where: { id: validatedFields.data.bookingId },
      data: { status: validatedFields.data.status },
    });

    revalidatePath("/bookings");
    revalidatePath(`/items/${booking.itemId}`);

    return { success: true, data: { id: updatedBooking.id, status: updatedBooking.status } };
  } catch (error) {
    console.error("[UPDATE_BOOKING_STATUS]", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function cancelBooking(
  bookingId: string
): Promise<ActionResult<{ id: string; status: string }>> {
  return updateBookingStatus({ bookingId, status: "CANCELLED" });
}
