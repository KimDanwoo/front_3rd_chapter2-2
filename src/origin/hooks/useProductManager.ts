import { ChangeEvent, useCallback, useState } from 'react'
import { Product } from '../../types'

interface UseProductManagerProps {
  products: Product[]
  updateProduct: (updatedProduct: Product) => void
  addProduct: (newProduct: Product) => void
}

export const useProductManager = ({ products, updateProduct, addProduct }: UseProductManagerProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNewProductForm, setIsNewProductForm] = useState(false)

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  const handleUpdateProduct = useCallback(
    (e: ChangeEvent) => {
      const { id, name, value } = e.target as HTMLInputElement
      if (editingProduct && editingProduct.id === id) {
        const updatedProduct = { ...editingProduct, [name]: value }
        setEditingProduct(updatedProduct)
      }
    },
    [editingProduct],
  )

  const handleEditComplete = useCallback(() => {
    if (editingProduct) {
      updateProduct(editingProduct)
      setEditingProduct(null)
    }
  }, [editingProduct])

  const handleAddNewProduct = useCallback(() => {
    const productWithId = { ...newProduct, id: Date.now().toString() }

    addProduct(productWithId)
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    })
    setIsNewProductForm(false)
  }, [newProduct])

  const toggleNewProductForm = useCallback(() => {
    setIsNewProductForm((prev) => !prev)
  }, [])

  return {
    editingProduct,
    newProduct,
    isNewProductForm,
    setNewProduct,
    setEditingProduct,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddNewProduct,
    handleUpdateProduct,
  }
}
