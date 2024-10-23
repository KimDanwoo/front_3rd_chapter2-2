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
import { useAccordion, useProductManager } from '../hooks'
import { useProductContext } from '../context/index.ts'

export const AdminPage = () => {
  const { products, updateProduct, addProduct } = useProductContext()
  const { openItems, toggleProducts } = useAccordion()

  const {
    editingProduct,
    newProduct,
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  } = useProductManager({ products, updateProduct, addProduct })

  return (
    <PageLayout title="관리자 페이지">
      <Section title="상품 관리">
        <Button
          color="success"
          text={isNewProductForm ? '취소' : '새 상품 추가'}
          className="mb-2"
          onClick={toggleNewProductForm}
        />

        <ProductForm
          isVisible={isNewProductForm}
          product={newProduct}
          onChangeProduct={setNewProduct}
          onClickAddProduct={handleAddNewProduct}
        />

        <Box className="mt-2">
          {products.map((product, index) => (
            <ProductItem key={index} product={product} index={index} toggleProducts={toggleProducts}>
              {openItems.has(product.id) && (
                <div className="mt-2">
                  {editingProduct?.id === product.id ? (
                    <ProductDetailForm
                      product={product}
                      productForm={editingProduct}
                      discount={newDiscount}
                      onChangeProduct={handleUpdateProduct}
                      onChangeDiscount={setNewDiscount}
                      onClickRemoveDiscount={handleRemoveDiscount}
                      onClickEditComplete={handleEditComplete}
                      onClickAddDiscount={handleAddDiscount}
                    />
                  ) : (
                    <ProductDetail product={product} onClickEditProduct={handleEditProduct} />
                  )}
                </div>
              )}
            </ProductItem>
          ))}
        </Box>
      </Section>

      <Section title="쿠폰 관리">
        <Card>
          <CouponForm />
          <CouponList />
        </Card>
      </Section>
    </PageLayout>
  )
}
