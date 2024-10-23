import { useCallback, useState } from 'react'
import { Product, Discount } from '../../types'

interface UseDiscountProps {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
}

export const useDiscount = ({ products, updateProduct, editingProduct, setEditingProduct }: UseDiscountProps) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })

  const handleAddDiscount = useCallback(
    (productId: string) => {
      const updatedProduct = products.find(({ id }) => id === productId)

      if (updatedProduct && editingProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: [...updatedProduct.discounts, newDiscount],
        }
        updateProduct(newProduct)
        setEditingProduct(newProduct)
        setNewDiscount({ quantity: 0, rate: 0 })
      }
    },
    [products, editingProduct, newDiscount, updateProduct, setEditingProduct],
  )

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number) => {
      const updatedProduct = products.find((p) => p.id === productId)
      if (updatedProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: updatedProduct.discounts.filter((_, i) => i !== index),
        }
        updateProduct(newProduct)
        setEditingProduct(newProduct)
      }
    },
    [products, updateProduct, setEditingProduct],
  )

  return {
    newDiscount,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  }
}
