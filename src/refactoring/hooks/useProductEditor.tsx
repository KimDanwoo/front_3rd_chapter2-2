import { Product } from '@/types'
import { ChangeEvent, useCallback, useState } from 'react'

export interface ProductEditorHook {
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
  updateEditProduct: (product: Product) => void
  changeEditProduct: (e: ChangeEvent<HTMLInputElement>) => void
  saveEditProduct: () => void
}

export const useProductEditor = (onUpdate: (product: Product) => void) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const updateEditProduct = useCallback((product: Product) => {
    setEditingProduct({ ...product })
  }, [])

  const changeEditProduct = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id, name, value } = e.target
      if (editingProduct && editingProduct.id === id) {
        const updatedProduct = { ...editingProduct, [name]: value }
        setEditingProduct(updatedProduct)
      }
    },
    [editingProduct],
  )

  const saveEditProduct = useCallback(() => {
    if (editingProduct) {
      onUpdate(editingProduct)
      setEditingProduct(null)
    }
  }, [editingProduct, onUpdate])

  return { editingProduct, setEditingProduct, updateEditProduct, changeEditProduct, saveEditProduct }
}
