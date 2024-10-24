import { Button, Card, PageLayout, Section, CouponForm, CouponList, ProductForm } from '@components/index.ts'
import { useProductContext } from '../context/index.ts'
import ProductList from '@/refactoring/components/admin/ProductList'

export const AdminPage = () => {
  const { isNewProductForm, toggleNewProductForm } = useProductContext()

  return (
    <PageLayout title="관리자 페이지">
      <Section title="상품 관리">
        <Button
          color="success"
          text={isNewProductForm ? '취소' : '새 상품 추가'}
          className="mb-2"
          onClick={toggleNewProductForm}
        />
        <ProductForm />
        <ProductList />
      </Section>

      <Section title="쿠폰 관리">
        <Card>
          <CouponForm />
          <CouponList />
        </Card>
      </Section>
    </PageLayout>
  )
}
