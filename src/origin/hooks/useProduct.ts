import { ChangeEvent, useCallback, useState } from 'react'
import { Product } from '../../types'

export const useProduct = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNewProductForm, setIsNewProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }, [])

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }, [])

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
    products,
    editingProduct,
    newProduct,
    isNewProductForm,
    updateProduct,
    addProduct,
    setNewProduct,
    setEditingProduct,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddNewProduct,
    handleUpdateProduct,
  }
}
