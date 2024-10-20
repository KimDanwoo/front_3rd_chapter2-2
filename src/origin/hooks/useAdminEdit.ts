import { Product } from '@/types'
import { useState } from 'react'

export const useProductEdit = (onProductUpdate: (product: Product) => void) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  const handleProductNameUpdate = (newName: string) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, name: newName })
    }
  }

  const handlePriceUpdate = (newPrice: number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, price: newPrice })
    }
  }

  const handleStockUpdate = (newStock: number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, stock: newStock })
    }
  }

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }

  return {
    editingProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleEditComplete,
  }
}
