import { useCallback, useState } from 'react'
import { Product } from '../../types'

export const useProduct = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const updateProduct = useCallback(
    (updatedProduct: Product) => {
      setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    },
    [setProducts],
  )

  const addProduct = useCallback(
    (newProduct: Product) => {
      setProducts((prevProducts) => [...prevProducts, newProduct])
    },
    [setProducts],
  )

  return {
    products,
    updateProduct,
    addProduct,
  }
}
