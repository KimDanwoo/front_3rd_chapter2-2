import { Box } from '../layouts'
import { FC } from 'react'
import { Button, InputField } from '../common'
import { containsEmpty } from '@/origin/hooks/utils'
import { useCouponContext } from '@/origin/context/providers/CouponContext'

export const CouponForm: FC = () => {
  const { newCoupon, handleChangeCoupon, handleAddCoupon } = useCouponContext()
  const { name, code, discountValue, discountType } = newCoupon

  return (
    <Box>
      <InputField type="text" placeholder="쿠폰 이름" name="name" value={name} onChange={handleChangeCoupon} />
      <InputField type="text" placeholder="쿠폰 코드" name="code" value={code} onChange={handleChangeCoupon} />

      <div className="flex gap-2">
        <select
          value={discountType}
          name="discountType"
          onChange={handleChangeCoupon}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>

        <InputField
          type="number"
          placeholder="할인 값"
          name="discountValue"
          value={discountValue}
          onChange={handleChangeCoupon}
        />
      </div>

      <Button
        color="success"
        text="쿠폰 추가"
        className="w-full"
        disabled={containsEmpty(name, code, discountValue)}
        onClick={handleAddCoupon}
      />
    </Box>
  )
}
