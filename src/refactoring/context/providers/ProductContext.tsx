import { createContext, ReactNode } from 'react'
import { Product } from '@/types'
import {
  useContextProvider,
  useDiscount,
  useProduct,
  ProductHook,
  DiscountHook,
  NewProductHook,
  ProductEditorHook,
  useProductEditor,
  useNewProduct,
} from '@/refactoring/hooks'

const ERROR_MESSAGE = 'useProductContext는 ProductProvider 내부에서만 사용할 수 있습니다.'

interface ProductContextType extends ProductHook, NewProductHook, ProductEditorHook, DiscountHook {}

interface ProductProviderProps {
  children: ReactNode
  initialProducts?: Product[]
}
const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children, initialProducts = [] }: ProductProviderProps) => {
  const product = useProduct(initialProducts)
  const productEditor = useProductEditor(product.updateProduct)
  const newProduct = useNewProduct(product.addProduct)
  const discount = useDiscount({
    products: product.products,
    updateProduct: product.updateProduct,
    editingProduct: productEditor.editingProduct,
    setEditingProduct: productEditor.setEditingProduct,
  })

  const contextValue = {
    ...product,
    ...productEditor,
    ...newProduct,
    ...discount,
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  return useContextProvider(ProductContext, ERROR_MESSAGE)
}
