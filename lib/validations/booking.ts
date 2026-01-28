import { z } from "zod";

export const createBookingSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  startDate: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.coerce.date(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  status: z.enum(["APPROVED", "REJECTED", "RETURNED", "CANCELLED"]),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
