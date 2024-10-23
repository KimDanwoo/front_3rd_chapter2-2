import { CartContent, ProductContent, Section, Card, PageLayout, CouponSelector, PaymentSummary } from '../components'
import { useProductContext } from '../context/index.ts'
import { useCartContext } from '../context/providers/CartContext.tsx'

export const CartPage = () => {
  const { products } = useProductContext()
  const { cart } = useCartContext()

  return (
    <PageLayout title="장바구니">
      <Section title="상품 목록">
        <div className="space-y-2">
          {products.map((product) => (
            <ProductContent key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="장바구니 내역">
        <div className="space-y-2">
          {cart.map((item) => (
            <CartContent key={item.product.id} item={item} />
          ))}
        </div>

        <Card title="쿠폰 적용">
          <CouponSelector />
        </Card>

        <Card title="주문 요약">
          <PaymentSummary />
        </Card>
      </Section>
    </PageLayout>
  )
}
