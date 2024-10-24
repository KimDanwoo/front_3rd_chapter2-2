import { ChangeEvent, useCallback, useState } from 'react'
import { Coupon } from '@/types'

export interface CouponHook {
  coupons: Coupon[]
  newCoupon: Coupon
  changeCoupon: <T extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) => void
  addCoupon: (coupon: Coupon) => void
}

export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupon] = useState<Coupon[]>(initialCoupons)
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  })

  const changeCoupon = useCallback(<T extends ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) => {
    const { name, value } = e.target
    setNewCoupon((prev) => ({ ...prev, [name]: value }))
  }, [])

  const addCoupon = useCallback((coupon: Coupon) => {
    setCoupon((prevCoupon) => [...prevCoupon, coupon])
    setNewCoupon({ name: '', code: '', discountType: 'percentage', discountValue: 0 })
  }, [])

  return { coupons, newCoupon, changeCoupon, addCoupon }
}
