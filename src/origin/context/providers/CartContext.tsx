import { createContext, ReactNode } from 'react'
import { Coupon, Product } from '../../../types'
import { useCart } from '../../hooks'

export interface CartContextType {
  cart: ReturnType<typeof useCart>['cart']
  selectedCoupon: Coupon | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyCoupon: (coupon: Coupon) => void
  getRemainingStock: (id: string, stock: number) => number
  calculateTotal: () => {
    totalBeforeDiscount: number
    totalAfterDiscount: number
    totalDiscount: number
  }
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

type CartProviderProps = {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    calculateTotal,
  } = useCart()

  const contextValue = {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    calculateTotal,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}
