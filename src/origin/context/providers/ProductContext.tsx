import { createContext, ReactNode } from 'react'
import { Product } from '@/types'
import { useContextProvider, useProduct } from '@/origin/hooks'

const ERROR_MESSAGE = 'useProductContext는 ProductProvider 내부에서만 사용할 수 있습니다.'

interface ProductContextType {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  addProduct: (newProduct: Product) => void
}

interface ProductProviderProps {
  children: ReactNode
  initialProducts?: Product[]
}
const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children, initialProducts = [] }: ProductProviderProps) => {
  const { products, updateProduct, addProduct } = useProduct(initialProducts)

  const contextValue = {
    products,
    updateProduct,
    addProduct,
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  return useContextProvider(ProductContext, ERROR_MESSAGE)
}
