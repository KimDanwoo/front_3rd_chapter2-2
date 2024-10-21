import { Coupon, Product } from '../../types.ts'
import { Card, PageLayout, Section } from '../components/index.ts'
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
        <button
          onClick={toggleNewProductForm}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        >
          {isNewProductForm ? '취소' : '새 상품 추가'}
        </button>

        {isNewProductForm && (
          <Card title="새 상품 추가">
            <div className="mb-2">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                상품명
              </label>
              <input
                id="productName"
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
                가격
              </label>
              <input
                id="productPrice"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
                재고
              </label>
              <input
                id="productStock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAddNewProduct}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              추가
            </button>
          </Card>
        )}

        <div className="space-y-2">
          {products.map((product, index) => (
            <div key={product.id} data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
              <button
                data-testid="toggle-button"
                onClick={() => toggleProducts(product.id)}
                className="w-full text-left font-semibold"
              >
                {product.name} - {product.price}원 (재고: {product.stock})
              </button>
              {openItems.has(product.id) && (
                <div className="mt-2">
                  {editingProduct && editingProduct.id === product.id ? (
                    <div>
                      <div className="mb-4">
                        <label className="block mb-1">상품명: </label>
                        <input
                          type="text"
                          name="name"
                          id={product.id}
                          value={editingProduct.name}
                          onChange={handleUpdateProduct}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">가격: </label>
                        <input
                          type="number"
                          id={product.id}
                          name="price"
                          value={editingProduct.price}
                          onChange={handleUpdateProduct}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">재고: </label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      {/* 할인 정보 수정 부분 */}
                      <div>
                        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                        {editingProduct.discounts.map((discount, index) => (
                          <div key={index} className="flex justify-between items-center mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                            </span>
                            <button
                              onClick={() => handleRemoveDiscount(product.id, index)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="수량"
                            value={newDiscount.quantity}
                            onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
                            className="w-1/3 p-2 border rounded"
                          />
                          <input
                            type="number"
                            placeholder="할인율 (%)"
                            value={newDiscount.rate * 100}
                            onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
                            className="w-1/3 p-2 border rounded"
                          />
                          <button
                            onClick={() => handleAddDiscount(product.id)}
                            className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                          >
                            할인 추가
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={handleEditComplete}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                      >
                        수정 완료
                      </button>
                    </div>
                  ) : (
                    <div>
                      {product.discounts.map((discount, index) => (
                        <div key={index} className="mb-2">
                          <span>
                            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                          </span>
                        </div>
                      ))}
                      <button
                        data-testid="modify-button"
                        onClick={() => handleEditProduct(product)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                      >
                        수정
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="쿠폰 관리">
        <Card>
          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="쿠폰 이름"
              name="name"
              value={newCoupon.name}
              onChange={handleChangeCoupon}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="쿠폰 코드"
              name="code"
              value={newCoupon.code}
              onChange={handleChangeCoupon}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <select
                value={newCoupon.discountType}
                name="discountType"
                onChange={handleChangeCoupon}
                className="w-full p-2 border rounded"
              >
                <option value="amount">금액(원)</option>
                <option value="percentage">할인율(%)</option>
              </select>
              <input
                type="number"
                placeholder="할인 값"
                name="discountValue"
                value={newCoupon.discountValue}
                onChange={handleChangeCoupon}
                className="w-full p-2 border rounded"
              />
            </div>
            <button onClick={handleAddCoupon} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
              쿠폰 추가
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
            <div className="space-y-2">
              {coupons.map((coupon, index) => (
                <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
                  {coupon.name} ({coupon.code}):
                  {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>
    </PageLayout>
  )
}
