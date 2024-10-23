import { FC } from 'react'
import { Card } from '../layouts'
import { Product } from '@/types'
import { Button, InputField } from '../common'

type ProductFormProps = {
  isVisible: boolean
  product: Omit<Product, 'id'>
  onChangeProduct: (product: Omit<Product, 'id'>) => void
  onClickAddProduct: () => void
}
export const ProductForm: FC<ProductFormProps> = ({ isVisible, product, onChangeProduct, onClickAddProduct }) => {
  return (
    isVisible && (
      <Card title="새 상품 추가">
        <div className="mb-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            상품명
          </label>

          <InputField
            id="productName"
            type="text"
            value={product.name}
            onChange={(e) => onChangeProduct({ ...product, name: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
            가격
          </label>

          <InputField
            id="productPrice"
            type="number"
            value={product.price}
            onChange={(e) => onChangeProduct({ ...product, price: parseInt(e.target.value) })}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
            재고
          </label>

          <InputField
            id="productStock"
            type="number"
            value={product.stock}
            onChange={(e) => onChangeProduct({ ...product, stock: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>
        <Button text="추가" className="w-full" onClick={onClickAddProduct} />
      </Card>
    )
  )
}
