import { useState } from 'react'
import { Coupon } from '../../types'

type CouponManagerProps = {
  onCouponAdd: (newCoupon: Coupon) => void
}

export const useCouponManager = ({ onCouponAdd }: CouponManagerProps) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  })

  function handleChangeCoupon<T extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) {
    const { name, value } = e.target
    setNewCoupon((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * @description 새로운 쿠폰을 추가하는 함수
   * @param {function} callback - 쿠폰 추가 후 실행할 콜백 함수
   * @returns {void}
   */
  const handleAddCoupon = () => {
    onCouponAdd(newCoupon)
    setNewCoupon({ name: '', code: '', discountType: 'percentage', discountValue: 0 })
  }

  return {
    newCoupon,
    handleChangeCoupon,
    handleAddCoupon,
  }
}
