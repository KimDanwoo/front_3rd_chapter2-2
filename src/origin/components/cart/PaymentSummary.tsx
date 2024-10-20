import { FC } from 'react'

type PaymentSummaryProps = {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  totalDiscount: number
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({ totalBeforeDiscount, totalAfterDiscount, totalDiscount }) => {
  return (
    <div className="space-y-1">
      <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
      <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
      <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
    </div>
  )
}