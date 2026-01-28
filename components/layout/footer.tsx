import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">Library of Things</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Share tools and items with your neighbors. Build community, save money, reduce waste.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/items?category=POWER_TOOLS" className="hover:text-foreground">Power Tools</Link></li>
              <li><Link href="/items?category=HAND_TOOLS" className="hover:text-foreground">Hand Tools</Link></li>
              <li><Link href="/items?category=GARDEN" className="hover:text-foreground">Garden</Link></li>
              <li><Link href="/items?category=KITCHEN" className="hover:text-foreground">Kitchen</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
              <li><Link href="/guidelines" className="hover:text-foreground">Community Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Library of Things. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
