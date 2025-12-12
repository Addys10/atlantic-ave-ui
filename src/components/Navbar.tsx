import Link from 'next/link';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-cloister text-2xl font-bold text-primary tracking-wider">
            ATLANTIC AVE
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/shop" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
              <ShoppingBag size={20} />
              <span>Obchod</span>
            </Link>
            <Link href="/checkout" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              <span>Košík</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
