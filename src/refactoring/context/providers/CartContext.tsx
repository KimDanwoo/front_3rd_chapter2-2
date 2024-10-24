import { CartHook, useCart, useContextProvider } from '@/refactoring/hooks'
import { createContext, ReactNode } from 'react'

const ERROR_MESSAGE = 'useCartContext는 CartProvider 내부에서만 사용할 수 있습니다.'

interface CartProviderProps {
  children: ReactNode
}

const CartContext = createContext<CartHook | null>(null)

export const CartProvider = ({ children }: CartProviderProps) => {
  const { ...props } = useCart()

  const contextValue = props

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  return useContextProvider(CartContext, ERROR_MESSAGE)
}
