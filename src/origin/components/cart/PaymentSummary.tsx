import { FC } from 'react'
import { convertToNumber } from '@hooks/utils'

type PaymentSummaryProps = {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({ totalBeforeDiscount, totalAfterDiscount, totalDiscount }) => {
  return (
    <div className="space-y-1">
      <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>

      <p className="text-green-600">할인 금액: {convertToNumber(totalDiscount)}원</p>

      <p className="text-xl font-bold">최종 결제 금액: {convertToNumber(totalAfterDiscount)}원</p>
    </div>
  )
}
