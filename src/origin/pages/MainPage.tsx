import { AdminPage } from './AdminPage'
import { CartPage } from './CartPage'
import { ProductProvider, useAdminContext } from '@context/index'
import { initialCoupons, initialProducts } from '../data'
import { CouponProvider } from '../context/providers/CouponContext'
import { CartProvider } from '../context/providers/CartContext'

export const MainPage = () => {
  const { isAdmin } = useAdminContext()

  return (
    <ProductProvider initialProducts={initialProducts}>
      <CouponProvider initialCoupons={initialCoupons}>
        {isAdmin ? (
          <AdminPage />
        ) : (
          <CartProvider>
            <CartPage />
          </CartProvider>
        )}
      </CouponProvider>
    </ProductProvider>
  )
}
