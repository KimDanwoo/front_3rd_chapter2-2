import { Coupon, Product } from '../../types.ts'
import { useCart } from '../hooks'
import { CartContent, ProductContent, Section, Card, PageLayout, CouponSelector, PaymentSummary } from '../components'

interface Props {
  products: Product[]
  coupons: Coupon[]
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    calculateTotal,
  } = useCart()
  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal()

  return (
    <PageLayout title="장바구니">
      <Section title="상품 목록">
        <div className="space-y-2">
          {products.map((product) => (
            <ProductContent
              key={product.id}
              product={product}
              getRemainingStock={getRemainingStock}
              onClickAddToCart={addToCart}
            />
          ))}
        </div>
      </Section>

      <Section title="장바구니 내역">
        <div className="space-y-2">
          {cart.map((item) => (
            <CartContent
              key={item.product.id}
              item={item}
              onClickUpdateQuantity={updateQuantity}
              onClickRemoveCart={removeFromCart}
            />
          ))}
        </div>

        <Card title="쿠폰 적용">
          <CouponSelector coupons={coupons} selectedCoupon={selectedCoupon} onChangeApplyCoupon={applyCoupon} />
        </Card>

        <Card title="주문 요약">
          <PaymentSummary
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
            totalDiscount={totalDiscount}
          />
        </Card>
      </Section>
    </PageLayout>
  )
}
