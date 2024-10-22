import { Coupon } from '@/types'
import { Box } from '../layouts'
import { FC } from 'react'
import { Button } from '../common'

type CouponFormProps = {
  newCoupon: Coupon
  onChangeCoupon: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onClickAddCoupon: () => void
}

export const CouponForm: FC<CouponFormProps> = ({ newCoupon, onChangeCoupon, onClickAddCoupon }) => {
  const isDisabledSubmit = !newCoupon.name || !newCoupon.code || !newCoupon.discountValue

  return (
    <Box>
      <input
        type="text"
        placeholder="쿠폰 이름"
        name="name"
        value={newCoupon.name}
        onChange={onChangeCoupon}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="쿠폰 코드"
        name="code"
        value={newCoupon.code}
        onChange={onChangeCoupon}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          name="discountType"
          onChange={onChangeCoupon}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>

        <input
          type="number"
          placeholder="할인 값"
          name="discountValue"
          value={newCoupon.discountValue}
          onChange={onChangeCoupon}
          className="w-full p-2 border rounded"
        />
      </div>

      <Button
        color={isDisabledSubmit ? 'disabled' : 'success'}
        text="쿠폰 추가"
        className="w-full"
        onClick={onClickAddCoupon}
      />
    </Box>
  )
}
