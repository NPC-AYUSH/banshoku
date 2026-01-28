import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Users, Leaf, Wallet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">Library of Things</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Button asChild>
              <Link href="/items">
                Browse Items
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Get Started</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Share Tools with
          <span className="text-primary block">Your Neighbors</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Why buy a tool you&apos;ll use once? Borrow from your neighbors, save money, 
          and build community. List your unused tools and help others.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignedIn>
            <Button asChild size="lg">
              <Link href="/items">
                Browse Available Items
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/items/new">List Your First Item</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Community?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-card border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save Money</h3>
            <p className="text-muted-foreground">
              Why buy expensive tools you&apos;ll rarely use? Borrow from neighbors who already have them.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-card border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Build Community</h3>
            <p className="text-muted-foreground">
              Meet your neighbors, share knowledge, and strengthen the bonds in your local area.
            </p>
          </div>
          <div className="text-center p-8 rounded-2xl bg-card border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Reduce Waste</h3>
            <p className="text-muted-foreground">
              Share resources instead of buying new. Better for your wallet, better for the planet.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Sharing?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of neighbors already saving money and building community through sharing.
          </p>
          <SignedIn>
            <Button asChild size="lg" variant="secondary">
              <Link href="/items/new">
                List Your First Item
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" variant="secondary">
                Join for Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Library of Things. All rights reserved.</p>
      </footer>
    </div>
  );
}
