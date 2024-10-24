import { createContext, ReactNode } from 'react'
import { DiscountHook, useContextProvider, useDiscount, UseDiscountProps } from '@/refactoring/hooks'

const ERROR_MESSAGE = 'useDiscount는 DiscountProvider 내부에서만 사용할 수 있습니다.'

const DiscountContext = createContext<DiscountHook | null>(null)

export const DiscountProvider = ({
  children,
  products,
  updateProduct,
  editingProduct,
  setEditingProduct,
}: UseDiscountProps & { children: ReactNode }) => {
  const { ...props } = useDiscount({
    products,
    updateProduct,
    editingProduct,
    setEditingProduct,
  })

  const contextValue = props

  return <DiscountContext.Provider value={contextValue}>{children}</DiscountContext.Provider>
}

export const useDiscountContext = () => {
  return useContextProvider(DiscountContext, ERROR_MESSAGE)
}
