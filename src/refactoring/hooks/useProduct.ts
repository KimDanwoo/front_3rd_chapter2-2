import { Product } from '@/types'
import { useCallback, useState } from 'react'

export interface ProductHook {
  products: Product[]
  updateProduct: (product: Product) => void
  addProduct: (product: Product) => void
}

export const useProduct = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }, [])

  const addProduct = useCallback((newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }, [])

  return {
    products,
    updateProduct,
    addProduct,
  }
}
