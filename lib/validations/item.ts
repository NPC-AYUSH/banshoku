import { z } from "zod";

export const createItemSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z.enum([
    "POWER_TOOLS",
    "HAND_TOOLS",
    "GARDEN",
    "KITCHEN",
    "CLEANING",
    "SPORTS",
    "ELECTRONICS",
    "OTHER",
  ]),
  condition: z.enum(["NEW", "EXCELLENT", "GOOD", "FAIR", "WORN"]),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial();

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
