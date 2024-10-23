import { FC } from 'react'
import { formatKrPrice, discountFormat } from '@hooks/utils'
import { useCouponContext } from '@/origin/context/providers/CouponContext'
import { useCartContext } from '@/origin/context/providers/CartContext'

export const CouponSelector: FC = () => {
  const { coupons } = useCouponContext()
  const { selectedCoupon, applyCoupon } = useCartContext()

  return (
    <>
      <select
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} - {`${formatKrPrice(coupon.discountValue)} ${discountFormat(coupon)}`}
          </option>
        ))}
      </select>

      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}
          {` ${formatKrPrice(selectedCoupon.discountValue)}${discountFormat(selectedCoupon)} 할인`}
        </p>
      )}
    </>
  )
}
