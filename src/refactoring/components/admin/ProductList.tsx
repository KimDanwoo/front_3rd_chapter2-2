import { Box } from '../layouts'
import { useAccordion } from '@/refactoring/hooks'
import { useProductContext } from '@/refactoring/context'
import { ProductItem } from './ProductItem'
import { ProductDetailForm } from './ProductDetailForm'
import { ProductDetail } from './ProductDetail'

export default function ProductList() {
  const { products, editingProduct, handleAddDiscount } = useProductContext()
  const { openItems, toggleProducts } = useAccordion()
  return (
    <Box className="mt-2">
      {products.map((product, index) => (
        <ProductItem key={index} product={product} index={index} toggleProducts={toggleProducts}>
          {openItems.has(product.id) && (
            <div className="mt-2">
              {editingProduct?.id === product.id ? (
                <ProductDetailForm
                  product={product}
                  productForm={editingProduct}
                  onClickAddDiscount={handleAddDiscount}
                />
              ) : (
                <ProductDetail product={product} />
              )}
            </div>
          )}
        </ProductItem>
      ))}
    </Box>
  )
}
