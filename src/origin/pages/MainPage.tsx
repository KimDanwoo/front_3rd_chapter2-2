import { AdminPage } from './AdminPage'
import { CartPage } from './CartPage'
import { useCoupon, useProduct } from '../hooks'
import { useAdminContext } from '../hooks'
import { initialCoupons, initialProducts } from '../data'

export const MainPage = () => {
  const { products, updateProduct, addProduct } = useProduct(initialProducts)
  const { coupons, addCoupon } = useCoupon(initialCoupons)
  const { isAdmin } = useAdminContext()

  return (
    <>
      {isAdmin ? (
        <AdminPage
          products={products}
          coupons={coupons}
          onProductUpdate={updateProduct}
          onProductAdd={addProduct}
          onCouponAdd={addCoupon}
        />
      ) : (
        <CartPage products={products} coupons={coupons} />
      )}
    </>
  )
}
