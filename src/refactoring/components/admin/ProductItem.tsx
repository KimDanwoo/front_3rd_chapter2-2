import { Product } from '@/types'
import { Box } from '../layouts'
import { FC, ReactNode } from 'react'
import { formatKrPrice } from '@/refactoring/hooks/utils'

type ProductItemProps = {
  product: Product
  index: number
  toggleProducts: (id: string) => void
  children: ReactNode
}

export const ProductItem: FC<ProductItemProps> = ({ product, index, toggleProducts, children }) => {
  return (
    <Box>
      <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
        <button
          data-testid="toggle-button"
          onClick={() => toggleProducts(product.id)}
          className="w-full text-left font-semibold"
        >
          {product.name} - {formatKrPrice(product.price)}원 (재고: {product.stock})
        </button>

        {children}
      </div>
    </Box>
  )
}
