import { FC } from 'react'
import { getMaxApplicableDiscount } from '@hooks/utils'
import { CartItem } from '@/types'
import { Button } from '@components/common'

type CardItemProps = {
  item: CartItem
  onClickUpdateQuantity: (productId: string, newQuantity: number) => void
  onClickRemoveCart: (productId: string) => void
}

export const CartContent: FC<CardItemProps> = ({ item, onClickUpdateQuantity, onClickRemoveCart }) => {
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
        <Button
          size="sm"
          color="info"
          text="-"
          className="mr-2"
          onClick={() => onClickUpdateQuantity(item.product.id, item.quantity - 1)}
        />
        <Button
          size="sm"
          color="info"
          text="+"
          className="mr-2"
          onClick={() => onClickUpdateQuantity(item.product.id, item.quantity + 1)}
        />
        <Button size="sm" color="error" text="삭제" onClick={() => onClickRemoveCart(item.product.id)} />
      </div>
    </div>
  )
}
