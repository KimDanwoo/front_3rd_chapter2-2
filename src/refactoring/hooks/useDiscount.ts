import { useCallback, useState } from 'react'
import { Product, Discount } from '@/types'

export interface UseDiscountProps {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
}

export interface DiscountHook {
  newDiscount: Discount
  setNewDiscount: (discount: Discount) => void
  handleAddDiscount: (productId: string) => void
  handleRemoveDiscount: (productId: string, index: number) => void
}

export const useDiscount = ({ products, updateProduct, editingProduct, setEditingProduct }: UseDiscountProps) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })

  const findProduct = useCallback((products: Product[], productId: string) => {
    return products.find(({ id }) => id === productId)
  }, [])

  const getNewProduct = useCallback((product: Product, discounts: Discount[]) => {
    return {
      ...product,
      discounts,
    }
  }, [])

  const updateDiscounts = useCallback((product: Product, discounts: Discount[]) => {
    const newProduct = getNewProduct(product, discounts)
    updateProduct(newProduct)
    setEditingProduct(newProduct)
  }, [])

  const handleAddDiscount = useCallback(
    (productId: string) => {
      const updatedProduct = findProduct(products, productId)

      if (updatedProduct && editingProduct) {
        const discounts = [...updatedProduct.discounts, newDiscount]
        updateDiscounts(updatedProduct, discounts)
        setNewDiscount({ quantity: 0, rate: 0 })
      }
    },
    [products, editingProduct, newDiscount, updateProduct, setEditingProduct],
  )

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number) => {
      const updatedProduct = findProduct(products, productId)

      if (updatedProduct) {
        const discounts = updatedProduct.discounts.filter((_, i) => i !== index)
        updateDiscounts(updatedProduct, discounts)
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
