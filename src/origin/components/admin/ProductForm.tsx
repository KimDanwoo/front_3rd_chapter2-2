import { FC, useMemo } from 'react'
import { Card } from '../layouts'
import { Product } from '@/types'
import { Button } from '../common'
import { isAllEmpty } from '@/origin/hooks/utils'

type ProductFormProps = {
  isVisible: boolean
  product: Omit<Product, 'id'>
  onChangeProduct: (product: Omit<Product, 'id'>) => void
  onClickAddProduct: () => void
}
export const ProductForm: FC<ProductFormProps> = ({ isVisible, product, onChangeProduct, onClickAddProduct }) => {
  const buttonColor = useMemo(() => {
    const isDisabled = isAllEmpty(product.name, product.price, product.stock)
    return isDisabled ? 'disabled' : 'primary'
  }, [product])

  return (
    isVisible && (
      <Card title="새 상품 추가">
        <div className="mb-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            상품명
          </label>

          <input
            id="productName"
            type="text"
            value={product.name}
            onChange={(e) => onChangeProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
            가격
          </label>

          <input
            id="productPrice"
            type="number"
            value={product.price}
            onChange={(e) => onChangeProduct({ ...product, price: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
            재고
          </label>

          <input
            id="productStock"
            type="number"
            value={product.stock}
            onChange={(e) => onChangeProduct({ ...product, stock: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <Button color={buttonColor} text="추가" onClick={onClickAddProduct} />
      </Card>
    )
  )
}
