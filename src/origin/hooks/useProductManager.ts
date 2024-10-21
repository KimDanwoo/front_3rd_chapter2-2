import { ChangeEvent, useState } from 'react'
import { Product, Discount } from '../../types'

interface UseProductManagerProps {
  products: Product[]
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
}

export const useProductManager = ({ products, onProductUpdate, onProductAdd }: UseProductManagerProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 })
  const [isNewProductForm, setIsNewProductForm] = useState(false)

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
  }

  // 새로운 핸들러 함수 추가
  const handleUpdateProduct = (e: ChangeEvent) => {
    const { id, name, value } = e.target as HTMLInputElement
    if (editingProduct && editingProduct.id === id) {
      const updatedProduct = { ...editingProduct, [name]: value }
      setEditingProduct(updatedProduct)
    }
  }

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId)
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
    }
  }

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId)
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
      setNewDiscount({ quantity: 0, rate: 0 })
    }
  }

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId)
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      }
      onProductUpdate(newProduct)
      setEditingProduct(newProduct)
    }
  }

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() }
    onProductAdd(productWithId)
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    })
    setIsNewProductForm(false)
  }

  const toggleNewProductForm = () => {
    setIsNewProductForm(!isNewProductForm)
  }

  return {
    editingProduct,
    newProduct,
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleStockUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  }
}
