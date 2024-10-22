import { FC } from 'react'
import { getMaxApplicableDiscount } from '@hooks/utils'
import { CartItem } from '@/types'
import { Button } from '@components/common'

type CardItemProps = {
  item: CartItem
  updateQuantity: (productId: string, newQuantity: number) => void
  removeFromCart: (productId: string) => void
}

export const CartContent: FC<CardItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  const appliedDiscount = getMaxApplicableDiscount(item)
  return (
    <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />

        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
          )}
        </span>
      </div>

      <div>
        <Button size="sm" color="info" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} text="-" />
        <Button size="sm" color="info" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} text="+" />
        <Button size="sm" color="error" onClick={() => removeFromCart(item.product.id)} text="삭제" />
      </div>
    </div>
  )
}
