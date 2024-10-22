import { FC } from 'react'
import { Card } from '../layouts'
import { Product } from '@/types'
import { Button } from '../common'

type ProductFormProps = {
  newProduct: Omit<Product, 'id'>
  setNewProduct: (product: Omit<Product, 'id'>) => void
  handleAddNewProduct: () => void
}
export const ProductForm: FC<ProductFormProps> = ({ newProduct, setNewProduct, handleAddNewProduct }) => {
  return (
    <Card title="새 상품 추가">
      <div className="mb-2">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          상품명
        </label>

        <input
          id="productName"
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
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
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button text="추가" onClick={handleAddNewProduct} />
    </Card>
  )
}
