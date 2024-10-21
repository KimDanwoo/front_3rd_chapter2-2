import { useState } from 'react'
import { Product, Discount } from '../../types'

interface UseProductManagerProps {
  products: Product[]
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
}

export const useProductManager = ({ products, onProductUpdate, onProductAdd }: UseProductManagerProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })

  const handleEditProduct = (product: Product) => setEditingProduct({ ...product })

  const handleProductNameUpdate = (newName: string) => {
    if (editingProduct) setEditingProduct({ ...editingProduct, name: newName })
  }

  const handlePriceUpdate = (newPrice: number) => {
    if (editingProduct) setEditingProduct({ ...editingProduct, price: newPrice })
  }

  const handleStockUpdate = (newStock: number) => {
    if (editingProduct) setEditingProduct({ ...editingProduct, stock: newStock })
  }

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }

  const handleAddDiscount = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product && editingProduct) {
      const updatedProduct = {
        ...product,
        discounts: [...product.discounts, newDiscount],
      }
      onProductUpdate(updatedProduct)
      setNewDiscount({ quantity: 0, rate: 0 })
    }
  }

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() }
    onProductAdd(productWithId)
    setNewProduct({ name: '', price: 0, stock: 0, discounts: [] })
  }

  return {
    editingProduct,
    newProduct,
    newDiscount,
    setNewProduct,
    setNewDiscount,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
  }
}
