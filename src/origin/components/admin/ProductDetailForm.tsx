import { Product } from '@/types'
import { Button, InputField } from '../common'
import { FC } from 'react'
import { containsEmpty } from '@/origin/hooks/utils'
import { useProductContext } from '@/origin/context'

type ProductDetailFormProps = {
  product: Product
  productForm: Product
  onClickAddDiscount: (productId: string) => void
}

export const ProductDetailForm: FC<ProductDetailFormProps> = ({ product, productForm, onClickAddDiscount }) => {
  const { newDiscount, setNewDiscount, handleEditComplete, handleUpdateProduct, handleRemoveDiscount } =
    useProductContext()

  return (
    <div className="mt-2">
      <div>
        <div className="mb-4">
          <InputField
            label="상품명"
            type="text"
            name="name"
            id={product.id}
            value={productForm.name}
            onChange={handleUpdateProduct}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="가격"
            type="number"
            id={product.id}
            name="price"
            value={productForm.price}
            onChange={handleUpdateProduct}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="재고"
            type="number"
            id={product.id}
            name="stock"
            value={productForm.stock}
            onChange={handleUpdateProduct}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">할인 정보</h4>

          {productForm.discounts.map((discount, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>
                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
              </span>
              <Button color="error" size="sm" text="삭제" onClick={() => handleRemoveDiscount(product.id, index)} />
            </div>
          ))}

          <div className="flex space-x-2">
            <InputField
              type="number"
              placeholder="수량"
              value={newDiscount.quantity}
              onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
              className="w-1/3 p-2 border rounded"
            />
            <InputField
              type="number"
              placeholder="할인율 (%)"
              value={newDiscount.rate * 100}
              onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
              className="w-1/3 p-2 border rounded"
            />

            <Button
              size="sm"
              text="할인 추가"
              className="w-1/3"
              disabled={containsEmpty(newDiscount.quantity, newDiscount.rate)}
              onClick={() => onClickAddDiscount(product.id)}
            />
          </div>
        </div>

        <Button
          color="success"
          size="sm"
          text="수정 완료"
          disabled={!productForm.name || !productForm.price || !productForm.stock}
          className="mt-2"
          onClick={handleEditComplete}
        />
      </div>
    </div>
  )
}
