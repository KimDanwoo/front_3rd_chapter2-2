import { Coupon, Product } from '../../types.ts'
import {
  Button,
  Card,
  PageLayout,
  Section,
  CouponForm,
  CouponList,
  ProductForm,
  ProductItem,
  ProductDetailForm,
  ProductDetail,
  Box,
} from '@components/index.ts'
import { useAccordion, useCouponManager, useProductManager } from '../hooks'

interface Props {
  products: Product[]
  coupons: Coupon[]
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
  onCouponAdd: (newCoupon: Coupon) => void
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const { openItems, toggleProducts } = useAccordion()
  const { newCoupon, handleChangeCoupon, handleAddCoupon } = useCouponManager({ onCouponAdd })
  const {
    editingProduct,
    newProduct,
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleStockUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  } = useProductManager({ products, onProductUpdate, onProductAdd })

  return (
    <PageLayout title="관리자 페이지">
      <Section title="상품 관리">
        <Button
          color="success"
          text={isNewProductForm ? '취소' : '새 상품 추가'}
          className="mb-2"
          onClick={toggleNewProductForm}
        />

        {isNewProductForm && (
          <ProductForm
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleAddNewProduct={handleAddNewProduct}
          />
        )}

        <Box>
          {products.map((product, index) => (
            <ProductItem product={product} index={index} toggleProducts={toggleProducts}>
              {openItems.has(product.id) && (
                <div className="mt-2">
                  {editingProduct?.id === product.id ? (
                    <ProductDetailForm
                      product={product}
                      editingProduct={editingProduct}
                      newDiscount={newDiscount}
                      handleUpdateProduct={handleUpdateProduct}
                      handleStockUpdate={handleStockUpdate}
                      setNewDiscount={setNewDiscount}
                      handleRemoveDiscount={handleRemoveDiscount}
                      handleEditComplete={handleEditComplete}
                      handleAddDiscount={handleAddDiscount}
                    />
                  ) : (
                    <ProductDetail product={product} handleEditProduct={handleEditProduct} />
                  )}
                </div>
              )}
            </ProductItem>
          ))}
        </Box>
      </Section>

      <Section title="쿠폰 관리">
        <Card>
          <CouponForm newCoupon={newCoupon} handleChangeCoupon={handleChangeCoupon} handleAddCoupon={handleAddCoupon} />
          <CouponList coupons={coupons} />
        </Card>
      </Section>
    </PageLayout>
  )
}
