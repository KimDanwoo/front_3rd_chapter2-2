import { Product } from '@/types'
import { Button, InputField } from '../common'
import { FC } from 'react'
import { containsEmpty } from '@/refactoring/hooks/utils'
import { useProductContext } from '@/refactoring/context'
import { DiscountForm } from './DiscountForm'

type ProductDetailFormProps = {
  product: Product
  productForm: Product
  onClickAddDiscount: (productId: string) => void
}

export const ProductDetailForm: FC<ProductDetailFormProps> = ({ product, productForm, onClickAddDiscount }) => {
  const { newDiscount, setNewDiscount, saveEditProduct, changeEditProduct, removeDiscount } = useProductContext()

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
            onChange={changeEditProduct}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="가격"
            type="number"
            id={product.id}
            name="price"
            value={productForm.price}
            onChange={changeEditProduct}
          />
        </div>

        <div className="mb-4">
          <InputField
            label="재고"
            type="number"
            id={product.id}
            name="stock"
            value={productForm.stock}
            onChange={changeEditProduct}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-2">할인 정보</h4>

          {productForm.discounts.map((discount, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>
                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
              </span>
              <Button color="error" size="sm" text="삭제" onClick={() => removeDiscount(product.id, index)} />
            </div>
          ))}

          <DiscountForm product={product} onClickAddDiscount={onClickAddDiscount} />
        </div>

        <Button
          color="success"
          size="sm"
          text="수정 완료"
          disabled={!productForm.name || !productForm.price || !productForm.stock}
          className="mt-2"
          onClick={saveEditProduct}
        />
      </div>
    </div>
  )
}
