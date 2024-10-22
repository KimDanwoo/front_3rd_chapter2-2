import { Discount, Product } from '@/types'
import { Button } from '../common'
import { FC } from 'react'

type ProductDetailFormProps = {
  product: Product
  editingProduct: Product
  newDiscount: Discount
  handleUpdateProduct: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleStockUpdate: (productId: string, newStock: number) => void
  setNewDiscount: (discount: Discount) => void
  handleRemoveDiscount: (productId: string, index: number) => void
  handleAddDiscount: (productId: string) => void
  handleEditComplete: () => void
}

export const ProductDetailForm: FC<ProductDetailFormProps> = ({
  product,
  editingProduct,
  newDiscount,
  handleUpdateProduct,
  handleStockUpdate,
  setNewDiscount,
  handleRemoveDiscount,
  handleAddDiscount,
  handleEditComplete,
}) => {
  return (
    <div className="mt-2">
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
              <Button color="error" size="sm" text="삭제" onClick={() => handleRemoveDiscount(product.id, index)} />
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

            <Button size="sm" text="할인 추가" className="w-1/3" onClick={() => handleAddDiscount(product.id)} />
          </div>
        </div>

        <Button color="success" size="sm" text="수정 완료" onClick={handleEditComplete} />
      </div>
    </div>
  )
}
