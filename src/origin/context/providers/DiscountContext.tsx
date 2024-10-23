import { createContext, ReactNode } from 'react'
import { Discount } from '@/types'
import { Product } from '@/types'
import { useContextProvider, useDiscount } from '@/origin/hooks'

const ERROR_MESSAGE = 'useDiscount는 DiscountProvider 내부에서만 사용할 수 있습니다.'

interface DiscountContextType {
  newDiscount: Discount
  setNewDiscount: (newDiscount: Discount) => void
  handleAddDiscount: (id: string) => void
  handleRemoveDiscount: (productId: string, index: number) => void
}

interface UseDiscountProps {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
}

const DiscountContext = createContext<DiscountContextType | null>(null)

export const DiscountProvider = ({
  children,
  products,
  updateProduct,
  editingProduct,
  setEditingProduct,
}: UseDiscountProps & { children: ReactNode }) => {
  const { newDiscount, setNewDiscount, handleAddDiscount, handleRemoveDiscount } = useDiscount({
    products,
    updateProduct,
    editingProduct,
    setEditingProduct,
  })

  const contextValue = {
    newDiscount,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  }

  return <DiscountContext.Provider value={contextValue}>{children}</DiscountContext.Provider>
}

export const useDiscountContext = () => {
  return useContextProvider(DiscountContext, ERROR_MESSAGE)
}
