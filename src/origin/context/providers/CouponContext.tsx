import { createContext } from 'react'
import { Coupon } from '@/types'
import { useContextProvider, useCoupon } from '@/origin/hooks'

const ERROR_MESSAGE = 'useCouponContext는 CouponProvider 내부에서만 사용할 수 있습니다.'

interface CouponContextType {
  coupons: Coupon[]
  newCoupon: Coupon
  addCoupon: (newCoupon: Coupon) => void
  handleChangeCoupon: <T extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement>>(e: T) => void
  handleAddCoupon: () => void
}

interface CouponProviderProps {
  children: React.ReactNode
  initialCoupons?: Coupon[]
}

const CouponContext = createContext<CouponContextType | null>(null)

export const CouponProvider = ({ children, initialCoupons = [] }: CouponProviderProps) => {
  const { coupons, newCoupon, addCoupon, handleChangeCoupon, handleAddCoupon } = useCoupon(initialCoupons)

  const contextValue = {
    coupons,
    newCoupon,
    addCoupon,
    handleChangeCoupon,
    handleAddCoupon,
  }

  return <CouponContext.Provider value={contextValue}>{children}</CouponContext.Provider>
}

export const useCouponContext = () => {
  return useContextProvider(CouponContext, ERROR_MESSAGE)
}
