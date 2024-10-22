import { FC } from 'react'
import { Coupon } from '@/types'
import { convertToNumber, discountFormat } from '@hooks/utils'

type CouponSelectorProps = {
  applyCoupon: (coupon: any) => void
  coupons: Coupon[]
  selectedCoupon: Coupon | null
}
export const CouponSelector: FC<CouponSelectorProps> = ({ applyCoupon, selectedCoupon, coupons }) => {
  return (
    <>
      <select
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} - {`${convertToNumber(coupon.discountValue)}${discountFormat(coupon)}`}
          </option>
        ))}
      </select>

      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(`${convertToNumber(selectedCoupon.discountValue)}$
          {discountFormat(selectedCoupon)}` 할인)
        </p>
      )}
    </>
  )
}
