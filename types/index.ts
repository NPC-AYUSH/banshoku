// Category enum
export type Category =
  | "POWER_TOOLS"
  | "HAND_TOOLS"
  | "GARDEN"
  | "KITCHEN"
  | "CLEANING"
  | "SPORTS"
  | "ELECTRONICS"
  | "OTHER";

// Condition enum
export type Condition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "WORN";

// Booking status enum
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED" | "CANCELLED";

// User type
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Item type
export interface Item {
  id: string;
  name: string;
  description: string | null;
  category: Category;
  imageUrl: string | null;
  available: boolean;
  condition: Condition;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

// Booking type
export interface Booking {
  id: string;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  itemId: string;
  borrowerId: string;
}

// Item with owner relation
export type ItemWithOwner = Item & {
  owner: Pick<User, "id" | "name" | "imageUrl">;
};

// Item with full relations
export type ItemWithRelations = Item & {
  owner: Pick<User, "id" | "name" | "imageUrl" | "email">;
  bookings: BookingWithBorrower[];
};

// Booking with borrower relation
export type BookingWithBorrower = Booking & {
  borrower: Pick<User, "id" | "name" | "imageUrl">;
};

// Booking with item and borrower relations
export type BookingWithRelations = Booking & {
  item: Pick<Item, "id" | "name" | "imageUrl" | "category">;
  borrower: Pick<User, "id" | "name" | "imageUrl">;
};

// Booking for item owner view (includes borrower info)
export type BookingForOwner = Booking & {
  item: Pick<Item, "id" | "name" | "imageUrl">;
  borrower: Pick<User, "id" | "name" | "imageUrl" | "email">;
};

// Category display config
export const CATEGORY_LABELS: Record<Category, string> = {
  POWER_TOOLS: "Power Tools",
  HAND_TOOLS: "Hand Tools",
  GARDEN: "Garden",
  KITCHEN: "Kitchen",
  CLEANING: "Cleaning",
  SPORTS: "Sports",
  ELECTRONICS: "Electronics",
  OTHER: "Other",
};

// Condition display config
export const CONDITION_LABELS: Record<Condition, string> = {
  NEW: "New",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  WORN: "Worn",
};

// Booking status display config
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};
