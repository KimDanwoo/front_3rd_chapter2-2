import { FC } from 'react'
import { Coupon } from '@/types'
import { formatKrPrice, discountFormat } from '@hooks/utils'

type CouponSelectorProps = {
  coupons: Coupon[]
  selectedCoupon: Coupon | null
  onChangeApplyCoupon: (coupon: any) => void
}
export const CouponSelector: FC<CouponSelectorProps> = ({ onChangeApplyCoupon, selectedCoupon, coupons }) => {
  return (
    <>
      <select
        onChange={(e) => onChangeApplyCoupon(coupons[parseInt(e.target.value)])}
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
