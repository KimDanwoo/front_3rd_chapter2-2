import { FC } from 'react'
import { formatKrPrice, getMaxApplicableDiscount } from '@/refactoring/hooks/utils'
import { CartItem } from '@/types'
import { Button } from '@/refactoring/components/common'
import { useCartContext } from '@/refactoring/context/providers/CartContext'

type CardItemProps = {
  item: CartItem
}

export const CartContent: FC<CardItemProps> = ({ item }) => {
  const { removeCart, updateCartQuantity } = useCartContext()
  const appliedDiscount = getMaxApplicableDiscount(item)

  return (
    <div key={item.product.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />

        <span className="text-sm text-gray-600">
          {formatKrPrice(item.product.price)}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
          )}
        </span>
      </div>

      <div>
        <Button
          size="sm"
          color="info"
          text="-"
          className="mr-2"
          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
        />
        <Button
          size="sm"
          color="info"
          text="+"
          className="mr-2"
          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
        />
        <Button size="sm" color="error" text="삭제" onClick={() => removeCart(item.product.id)} />
      </div>
    </div>
  )
}
