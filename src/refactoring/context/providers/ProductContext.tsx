import { createContext, ReactNode } from 'react'
import { Product } from '@/types'
import { useContextProvider, useDiscount, useProduct, ProductHook, DiscountHook } from '@/refactoring/hooks'

const ERROR_MESSAGE = 'useProductContext는 ProductProvider 내부에서만 사용할 수 있습니다.'

interface ProductContextType extends ProductHook, DiscountHook {}

interface ProductProviderProps {
  children: ReactNode
  initialProducts?: Product[]
}
const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children, initialProducts = [] }: ProductProviderProps) => {
  const { ...productProps } = useProduct(initialProducts)

  const { ...discountProps } = useDiscount({
    products: productProps.products,
    updateProduct: productProps.updateProduct,
    editingProduct: productProps.editingProduct,
    setEditingProduct: productProps.setEditingProduct,
  })

  const contextValue = {
    ...productProps,
    ...discountProps,
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  return useContextProvider(ProductContext, ERROR_MESSAGE)
}
