import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-80 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{product.price} Kč</span>
            <button className="btn-primary">
              Koupit
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
