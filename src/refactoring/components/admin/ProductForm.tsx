import { FC } from 'react'
import { Card } from '../layouts'
import { Button, InputField } from '../common'
import { useProductContext } from '@/refactoring/context'

export const ProductForm: FC = () => {
  const { newProduct, isNewProductForm, handleChangeNewProduct, handleAddNewProduct } = useProductContext()

  return (
    isNewProductForm && (
      <Card title="새 상품 추가">
        <div className="mb-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            상품명
          </label>

          <InputField
            id="productName"
            name="name"
            type="text"
            value={newProduct.name}
            onChange={handleChangeNewProduct}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
            가격
          </label>

          <InputField
            id="productPrice"
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChangeNewProduct}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
            재고
          </label>

          <InputField
            id="productStock"
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleChangeNewProduct}
            className="w-full p-2 border rounded"
          />
        </div>
        <Button text="추가" className="w-full" onClick={() => handleAddNewProduct(newProduct)} />
      </Card>
    )
  )
}
