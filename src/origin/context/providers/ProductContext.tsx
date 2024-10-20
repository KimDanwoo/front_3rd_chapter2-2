import { createContext, ReactNode } from 'react'
import { Product } from '../../../types'
import { useProduct } from '../../hooks'

export interface ProductContextType {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  addProduct: (newProduct: Product) => void
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined)

type ProductProviderProps = {
  children: ReactNode
  initialProducts: Product[]
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children, initialProducts }) => {
  const { products, updateProduct, addProduct } = useProduct(initialProducts)

  const contextValue = {
    products,
    updateProduct,
    addProduct,
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}
