import { Box } from '../layouts'
import { FC } from 'react'
import { Button, InputField } from '../common'
import { containsEmpty } from '@/refactoring/hooks/utils'
import { useCouponContext } from '@/refactoring/context/providers/CouponContext'

export const CouponForm: FC = () => {
  const { newCoupon, changeCoupon, addCoupon } = useCouponContext()
  const { name, code, discountValue, discountType } = newCoupon

  return (
    <Box>
      <InputField type="text" placeholder="쿠폰 이름" name="name" value={name} onChange={changeCoupon} />
      <InputField type="text" placeholder="쿠폰 코드" name="code" value={code} onChange={changeCoupon} />

      <div className="flex gap-2">
        <select value={discountType} name="discountType" onChange={changeCoupon} className="w-full p-2 border rounded">
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>

        <InputField
          type="number"
          placeholder="할인 값"
          name="discountValue"
          value={discountValue}
          onChange={changeCoupon}
        />
      </div>

      <Button
        color="success"
        text="쿠폰 추가"
        className="w-full"
        disabled={containsEmpty(name, code, discountValue)}
        onClick={() => addCoupon(newCoupon)}
      />
    </Box>
  )
}
