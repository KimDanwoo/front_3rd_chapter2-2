import { FC } from 'react'
import { Button } from '../common'
import { Product } from '@/types'

type ProductDetailProps = {
  product: Product
  onClickEditProduct: (product: Product) => void
}
export const ProductDetail: FC<ProductDetailProps> = ({ product, onClickEditProduct }) => {
  return (
    <div>
      {product.discounts.map((discount, index) => (
        <div key={index} className="mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
        </div>
      ))}

      <Button data-testid="modify-button" size="sm" text="수정" onClick={() => onClickEditProduct(product)} />
    </div>
  )
}
