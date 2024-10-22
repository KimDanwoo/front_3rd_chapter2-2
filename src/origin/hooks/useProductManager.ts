import { ChangeEvent, useCallback, useState } from 'react'
import { Product, Discount } from '../../types'
import { isAllEmpty } from './utils'

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
      onProductUpdate(editingProduct)
      setEditingProduct(null)
    }
  }, [editingProduct])

  const handleAddDiscount = useCallback(
    (productId: string) => {
      const updatedProduct = products.find((p) => p.id === productId)
      if (isAllEmpty(newDiscount.quantity, newDiscount.rate)) return

      if (updatedProduct && editingProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: [...updatedProduct.discounts, newDiscount],
        }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
        setNewDiscount({ quantity: 0, rate: 0 })
      }
    },
    [products, editingProduct, newDiscount],
  )

  const handleRemoveDiscount = useCallback(
    (productId: string, index: number) => {
      const updatedProduct = products.find((p) => p.id === productId)
      if (updatedProduct) {
        const newProduct = {
          ...updatedProduct,
          discounts: updatedProduct.discounts.filter((_, i) => i !== index),
        }
        onProductUpdate(newProduct)
        setEditingProduct(newProduct)
      }
    },
    [products],
  )

  const handleAddNewProduct = useCallback(() => {
    const productWithId = { ...newProduct, id: Date.now().toString() }
    const { name, price, stock } = productWithId
    if (isAllEmpty(name, price, stock)) return

    onProductAdd(productWithId)
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
    newDiscount,
    isNewProductForm,
    setNewProduct,
    setNewDiscount,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddDiscount,
    handleAddNewProduct,
    handleUpdateProduct,
    handleRemoveDiscount,
  }
}
