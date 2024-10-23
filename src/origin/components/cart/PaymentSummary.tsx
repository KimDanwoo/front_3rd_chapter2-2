import { FC } from 'react'
import { formatKrPrice } from '@hooks/utils'
import { useCartContext } from '@/origin/context/providers/CartContext'

export const PaymentSummary: FC = () => {
  const { calculateTotal } = useCartContext()
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  return (
    <div className="space-y-1">
      <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>

      <p className="text-green-600">할인 금액: {formatKrPrice(totalDiscount)}원</p>

      <p className="text-xl font-bold">최종 결제 금액: {formatKrPrice(totalAfterDiscount)}원</p>
    </div>
  )
}
