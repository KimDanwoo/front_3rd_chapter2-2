import { ChangeEvent, useCallback, useState } from 'react'
import { Product } from '@/types'

export interface ProductHook {
  products: Product[]
  editingProduct: Product | null
  newProduct: Omit<Product, 'id'>
  isNewProductForm: boolean
  updateProduct: (updatedProduct: Product) => void
  addProduct: (newProduct: Product) => void
  setEditingProduct: (product: Product | null) => void
  toggleNewProductForm: () => void
  handleEditProduct: (product: Product) => void
  handleEditComplete: () => void
  handleAddNewProduct: (product: Omit<Product, 'id'>) => void
  handleUpdateProduct: (e: ChangeEvent) => void
  handleChangeNewProduct: (e: ChangeEvent<HTMLInputElement>) => void
}

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

  const handleChangeNewProduct = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleAddNewProduct = useCallback((product: Omit<Product, 'id'>) => {
    const productWithId = { ...product, id: Date.now().toString() }

    addProduct(productWithId)
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    })
    setIsNewProductForm(false)
  }, [])

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
    handleChangeNewProduct,
    setEditingProduct,
    toggleNewProductForm,
    handleEditProduct,
    handleEditComplete,
    handleAddNewProduct,
    handleUpdateProduct,
  }
}
