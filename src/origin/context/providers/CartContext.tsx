import { useCart, useContextProvider } from '@/origin/hooks'
import { CartItem, Coupon, Product } from '@/types'
import { createContext, ReactNode } from 'react'

const ERROR_MESSAGE = 'useCartContext는 CartProvider 내부에서만 사용할 수 있습니다.'

interface CartContextType {
  cart: CartItem[]
  selectedCoupon: Coupon | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyCoupon: (coupon: Coupon) => void
  calculateTotal: () => {
    totalBeforeDiscount: number
    totalAfterDiscount: number
    totalDiscount: number
  }
  getRemainingStock: (id: string, stock: number) => number
}

interface CartProviderProps {
  children: ReactNode
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: CartProviderProps) => {
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
  } = useCart()

  const contextValue = {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  return useContextProvider(CartContext, ERROR_MESSAGE)
}
