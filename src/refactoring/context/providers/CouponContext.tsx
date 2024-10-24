import { createContext } from 'react'
import { Coupon } from '@/types'
import { CouponHook, useContextProvider, useCoupon } from '@/refactoring/hooks'

const ERROR_MESSAGE = 'useCouponContext는 CouponProvider 내부에서만 사용할 수 있습니다.'

interface CouponProviderProps {
  children: React.ReactNode
  initialCoupons?: Coupon[]
}

const CouponContext = createContext<CouponHook | null>(null)

export const CouponProvider = ({ children, initialCoupons = [] }: CouponProviderProps) => {
  const { ...props } = useCoupon(initialCoupons)

  const contextValue = props

  return <CouponContext.Provider value={contextValue}>{children}</CouponContext.Provider>
}

export const useCouponContext = () => {
  return useContextProvider(CouponContext, ERROR_MESSAGE)
}
