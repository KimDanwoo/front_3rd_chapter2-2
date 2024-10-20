import { useCallback, useState } from 'react'
import { Coupon } from '../../types'

export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupon] = useState<Coupon[]>(initialCoupons)

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupon((prevCoupon) => [...prevCoupon, newCoupon])
  }, [])

  return { coupons, addCoupon }
}
