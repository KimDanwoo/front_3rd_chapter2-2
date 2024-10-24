import { Product } from '@/types'
import { ChangeEvent, useCallback, useState } from 'react'

export interface NewProductHook {
  newProduct: Omit<Product, 'id'>
  isNewProductForm: boolean
  updateNewProduct: (e: ChangeEvent<HTMLInputElement>) => void
  addNewProduct: (product: Omit<Product, 'id'>) => void
  toggleNewProductForm: () => void
}

export const useNewProduct = (onAdd: (product: Product) => void) => {
  const [isNewProductForm, setIsNewProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })

  const updateNewProduct = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }, [])

  const addNewProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      const productWithId = { ...product, id: Date.now().toString() }
      onAdd(productWithId)
      setNewProduct({
        name: '',
        price: 0,
        stock: 0,
        discounts: [],
      })
      setIsNewProductForm(false)
    },
    [onAdd],
  )

  const toggleNewProductForm = useCallback(() => {
    setIsNewProductForm((prev) => !prev)
  }, [])

  return {
    newProduct,
    isNewProductForm,
    updateNewProduct,
    addNewProduct,
    toggleNewProductForm,
  }
}
