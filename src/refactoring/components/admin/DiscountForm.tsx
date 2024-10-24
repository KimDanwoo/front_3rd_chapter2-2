import { useProductContext } from '@/refactoring/context'
import { Button, InputField } from '../common'
import { containsEmpty } from '@/refactoring/hooks/utils'
import { FC } from 'react'
import { Product } from '@/types'

type ProductDetailFormProps = {
  product: Product
  onClickAddDiscount: (productId: string) => void
}

export const DiscountForm: FC<ProductDetailFormProps> = ({ product, onClickAddDiscount }) => {
  const { newDiscount, setNewDiscount } = useProductContext()
  return (
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
  )
}
