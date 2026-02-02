import { Suspense } from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookingList } from "@/components/bookings/booking-list";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BookingWithRelations, BookingForOwner } from "@/types";

async function getMyBookings(clerkId: string): Promise<{
  asBorrower: BookingWithRelations[];
  asOwner: BookingForOwner[];
}> {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      bookings: {
        include: {
          item: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              category: true,
            },
          },
          borrower: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      items: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          category: true,
          bookings: {
            include: {
              borrower: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  email: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!user) {
    return { asBorrower: [], asOwner: [] };
  }

  // Get all bookings where user is the owner
  const ownerBookings: BookingForOwner[] = user.items.flatMap((item) =>
    item.bookings.map((booking) => ({
      ...booking,
      item: {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        category: item.category,
      },
    }))
  );

  return {
    asBorrower: user.bookings,
    asOwner: ownerBookings,
  };
}

export default async function BookingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

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

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Track your borrowing requests and manage requests for your items
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner text="Loading bookings..." />}>
        <BookingsContent clerkId={userId} />
      </Suspense>
    </div>
  );
}

async function BookingsContent({ clerkId }: { clerkId: string }) {
  const { asBorrower, asOwner } = await getMyBookings(clerkId);

  const hasBorrowings = asBorrower.length > 0;
  const hasLendings = asOwner.length > 0;

  if (!hasBorrowings && !hasLendings) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No bookings yet"
        description="You haven't made any borrowing requests or received any requests for your items."
        actionLabel="Browse Items"
        actionHref="/items"
      />
    );
  }

  return (
    <Tabs defaultValue={hasBorrowings ? "borrowing" : "lending"} className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="borrowing" disabled={!hasBorrowings}>
          <BookOpen className="h-4 w-4 mr-2" />
          Borrowing ({asBorrower.length})
        </TabsTrigger>
        <TabsTrigger value="lending" disabled={!hasLendings}>
          <Package className="h-4 w-4 mr-2" />
          Lending ({asOwner.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="borrowing" className="space-y-4">
        {hasBorrowings ? (
          <BookingList bookings={asBorrower} view="borrower" />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No borrowing requests"
            description="You haven't requested to borrow any items yet."
            actionLabel="Browse Items"
            actionHref="/items"
          />
        )}
      </TabsContent>

      <TabsContent value="lending" className="space-y-4">
        {hasLendings ? (
          <BookingList bookings={asOwner} view="owner" />
        ) : (
          <EmptyState
            icon={Package}
            title="No lending requests"
            description="No one has requested to borrow your items yet."
            actionLabel="List an Item"
            actionHref="/items/new"
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
