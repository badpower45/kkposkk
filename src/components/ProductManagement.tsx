import { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import AddProductDialog from './owner/AddProductDialog';
import { Package, Eye, Plus } from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const viewRecipe = (product: Product) => {
    setSelectedProduct(product);
    setShowRecipe(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="mb-2">إدارة المنتجات</h1>
          <p className="text-sm text-gray-600">عرض وإدارة المنتجات والوصفات</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)} className="bg-[#007BFF] hover:bg-[#007BFF]/90">
          <Plus className="ml-2 h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المنتجات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم المنتج</TableHead>
                <TableHead className="text-right">رمز المنتج</TableHead>
                <TableHead className="text-right">الباركود</TableHead>
                <TableHead className="text-right">التكلفة</TableHead>
                <TableHead className="text-right">سعر البيع</TableHead>
                <TableHead className="text-right">الربح</TableHead>
                <TableHead className="text-right">نسبة الربح</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.barcode || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {product.cost} ج.م
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {product.price} ج.م
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {product.profit} ج.م
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {((product.profit / product.price) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewRecipe(product)}
                    >
                      <Eye className="ml-1 h-4 w-4" />
                      الوصفة
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recipe Dialog */}
      <Dialog open={showRecipe} onOpenChange={setShowRecipe}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              وصفة: {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>تفاصيل المكونات والتكاليف للمنتج</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">التكلفة الإجمالية</div>
                  <div className="text-red-600">{selectedProduct.cost} ج.م</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">سعر البيع</div>
                  <div className="text-blue-600">{selectedProduct.price} ج.م</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">الربح</div>
                  <div className="text-green-600">{selectedProduct.profit} ج.م</div>
                </div>
              </div>

              <div>
                <h3 className="mb-3">المكونات</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المادة</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">الوحدة</TableHead>
                      <TableHead className="text-right">تكلفة الوحدة</TableHead>
                      <TableHead className="text-right">التكلفة الإجمالية</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.recipe.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.materialName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.unitCost.toFixed(2)} ج.م</TableCell>
                        <TableCell>{item.totalCost.toFixed(2)} ج.م</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={loadProducts}
      />
    </div>
  );
}
