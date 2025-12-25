import { memo } from 'react';
import { Product } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onAdd(product)}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-4xl">🥤</span>
        </div>
        <h3 className="mb-2 text-center">{product.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#0B69FF]">{product.price} ج.م</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ربح: {product.profit} ج.م
          </Badge>
        </div>
        <div className="text-xs text-gray-500 text-center">
          التكلفة: {product.cost} ج.م
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
