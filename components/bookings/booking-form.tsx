"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, HandHeart, Loader2, AlertCircle } from "lucide-react";
import { CATEGORY_LABELS } from "@/types";
import type { ItemWithRelations } from "@/types";

interface BookingFormProps {
  item: ItemWithRelations;
}

export function BookingForm({ item }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createBooking({
      itemId: item.id,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      message: formData.message || undefined,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HandHeart className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Request Sent!</h3>
          <p className="text-muted-foreground mb-4">
            Your booking request has been sent to {item.owner.name ?? "the owner"}.
            Redirecting to your bookings...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandHeart className="h-5 w-5" />
          Borrow This Item
        </CardTitle>
        <CardDescription>
          Request to borrow &quot;{item.name}&quot; from {item.owner.name ?? "the owner"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  id="startDate"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  id="endDate"
                  required
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message to Owner (Optional)
            </label>
            <textarea
              id="message"
              placeholder="Hi! I'd like to borrow this item for a weekend project..."
              maxLength={500}
              rows={3}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/500 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.startDate || !formData.endDate}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <HandHeart className="h-4 w-4 mr-2" />
                Request to Borrow
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The owner will be notified and can approve or reject your request.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
