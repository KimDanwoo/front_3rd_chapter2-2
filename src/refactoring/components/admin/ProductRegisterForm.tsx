import { FC } from 'react'
import { Card } from '../layouts'
import { Button, InputField } from '../common'
import { useProductContext } from '@/refactoring/context'

export const ProductRegisterForm: FC = () => {
  const { newProduct, isNewProductForm, updateNewProduct, addNewProduct } = useProductContext()

  return (
    isNewProductForm && (
      <Card title="새 상품 추가">
        <div className="mb-2">
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
            상품명
          </label>

          <InputField id="productName" name="name" type="text" value={newProduct.name} onChange={updateNewProduct} />
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
            onChange={updateNewProduct}
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
            onChange={updateNewProduct}
            className="w-full p-2 border rounded"
          />
        </div>
        <Button text="추가" className="w-full" onClick={() => addNewProduct(newProduct)} />
      </Card>
    )
  )
}
