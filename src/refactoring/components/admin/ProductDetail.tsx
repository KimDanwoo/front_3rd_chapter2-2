import { FC } from 'react'
import { Button } from '../common'
import { Product } from '@/types'
import { useProductContext } from '@/refactoring/context'

type ProductDetailProps = {
  product: Product
}
export const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  const { updateEditProduct } = useProductContext()
  return (
    <div>
      {product.discounts.map(({ quantity, rate }, index) => (
        <div key={index} className="mb-2">
          <span>
            {quantity}개 이상 구매 시 {rate * 100}% 할인
          </span>
        </div>
      ))}

      <Button data-testid="modify-button" size="sm" text="수정" onClick={() => updateEditProduct(product)} />
    </div>
  )
}
