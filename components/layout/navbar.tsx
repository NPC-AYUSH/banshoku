import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Package, Plus, List, BookOpen } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Library of Things</span>
          </Link>
          
          <SignedIn>
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href="/items" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <List className="h-4 w-4" />
                Browse
              </Link>
              <Link 
                href="/my-items" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Package className="h-4 w-4" />
                My Items
              </Link>
              <Link 
                href="/bookings" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <BookOpen className="h-4 w-4" />
                Bookings
              </Link>
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Button asChild size="sm">
              <Link href="/items/new">
                <Plus className="h-4 w-4 mr-1" />
                List Item
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
