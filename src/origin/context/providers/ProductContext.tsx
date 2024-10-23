import { ChangeEvent, createContext, ReactNode } from 'react'
import { Discount, Product } from '@/types'
import { useContextProvider, useDiscount, useProduct } from '@/origin/hooks'

const ERROR_MESSAGE = 'useProductContext는 ProductProvider 내부에서만 사용할 수 있습니다.'

interface ProductContextType {
  products: Product[]
  editingProduct: Product | null
  isNewProductForm: boolean
  newProduct: Omit<Product, 'id'>
  updateProduct: (updatedProduct: Product) => void
  addProduct: (newProduct: Product) => void
  handleEditProduct: (product: Product) => void
  handleUpdateProduct: (e: ChangeEvent) => void
  handleEditComplete: () => void
  handleAddNewProduct: () => void
  toggleNewProductForm: () => void
  newDiscount: Discount
  setNewProduct: (product: Omit<Product, 'id'>) => void
  setNewDiscount: (discount: Discount) => void
  handleAddDiscount: (productId: string) => void
  handleRemoveDiscount: (productId: string, index: number) => void
}

interface ProductProviderProps {
  children: ReactNode
  initialProducts?: Product[]
}
const ProductContext = createContext<ProductContextType | null>(null)

export const ProductProvider = ({ children, initialProducts = [] }: ProductProviderProps) => {
  const {
    products,
    editingProduct,
    newProduct,
    isNewProductForm,
    updateProduct,
    addProduct,
    setNewProduct,
    setEditingProduct,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddNewProduct,
    handleUpdateProduct,
  } = useProduct(initialProducts)

  const { newDiscount, setNewDiscount, handleAddDiscount, handleRemoveDiscount } = useDiscount({
    products,
    updateProduct,
    editingProduct,
    setEditingProduct,
  })

  const contextValue = {
    products,
    editingProduct,
    newProduct,
    isNewProductForm,
    newDiscount,
    updateProduct,
    addProduct,
    setNewProduct,
    setEditingProduct,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddNewProduct,
    handleUpdateProduct,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  }

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  return useContextProvider(ProductContext, ERROR_MESSAGE)
}
