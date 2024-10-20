import { Discount, Product } from '@/types'
import { useState } from 'react'

export const useDiscountManagement = (onProductUpdate: (product: Product) => void) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })

  const handleAddDiscount = (product: Product) => {
    const updatedProduct = {
      ...product,
      discounts: [...product.discounts, newDiscount],
    }
    onProductUpdate(updatedProduct)
    setNewDiscount({ quantity: 0, rate: 0 })
  }

  const handleRemoveDiscount = (product: Product, index: number) => {
    const updatedProduct = {
      ...product,
      discounts: product.discounts.filter((_, i) => i !== index),
    }
    onProductUpdate(updatedProduct)
  }

  return {
    newDiscount,
    setNewDiscount,
    handleAddDiscount,
    handleRemoveDiscount,
  }
}
