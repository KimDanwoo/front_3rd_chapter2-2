import { FC } from 'react'
import { Box } from '../layouts'
import { useCouponContext } from '@/refactoring/context/providers/CouponContext'

export const CouponList: FC = () => {
  const { coupons } = useCouponContext()

  return (
    <Box>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>

      {coupons.map((coupon, index) => (
        <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
          {coupon.name} ({coupon.code}):
          {coupon.discountType === 'amount' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
        </div>
      ))}
    </Box>
  )
}
