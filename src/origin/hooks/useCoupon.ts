import { useCallback, useState } from 'react'
import { Coupon } from '../../types'

export const useCoupon = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupon] = useState<Coupon[]>(initialCoupons)
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  })

  const addCoupon = useCallback((newCoupon: Coupon) => {
    setCoupon((prevCoupon) => [...prevCoupon, newCoupon])
  }, [])

  const handleChangeCoupon = useCallback(<T extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) => {
    const { name, value } = e.target
    setNewCoupon((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleAddCoupon = useCallback(() => {
    if (!newCoupon.name || !newCoupon.code || !newCoupon.discountValue) return

    addCoupon(newCoupon)
    setNewCoupon({ name: '', code: '', discountType: 'percentage', discountValue: 0 })
  }, [newCoupon])

  return { coupons, newCoupon, handleChangeCoupon, handleAddCoupon, addCoupon }
}
