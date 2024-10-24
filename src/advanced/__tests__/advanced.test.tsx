import { describe, expect, test } from 'vitest'
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import { CartPage } from '../../refactoring/pages/CartPage'
import { AdminPage } from '../../refactoring/pages/AdminPage'
import { CartItem, Coupon, Discount, Product } from '../../types'
import { useAccordion, useProduct } from '../../refactoring/hooks'
import * as cartUtils from '../../refactoring/hooks/utils'
import { ProductProvider } from '@/refactoring/context'
import { CouponProvider } from '@/refactoring/context/providers/CouponContext'
import { CartProvider } from '@/refactoring/context/providers/CartContext'
import { ChangeEvent } from 'react'

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
]
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
]

const TestAdminPage = () => {
  return (
    <ProductProvider initialProducts={mockProducts}>
      <CouponProvider initialCoupons={mockCoupons}>
        <AdminPage />
      </CouponProvider>
    </ProductProvider>
  )
}

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(
        <ProductProvider initialProducts={mockProducts}>
          <CouponProvider initialCoupons={mockCoupons}>
            <CartProvider>
              <CartPage />
            </CartProvider>
          </CouponProvider>
        </ProductProvider>,
      )
      const product1 = screen.getByTestId('product-p1')
      const product2 = screen.getByTestId('product-p2')
      const product3 = screen.getByTestId('product-p3')
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가')
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가')

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1')
      expect(product1).toHaveTextContent('10,000원')
      expect(product1).toHaveTextContent('재고: 20개')
      expect(product2).toHaveTextContent('상품2')
      expect(product2).toHaveTextContent('20,000원')
      expect(product2).toHaveTextContent('재고: 20개')
      expect(product3).toHaveTextContent('상품3')
      expect(product3).toHaveTextContent('30,000원')
      expect(product3).toHaveTextContent('재고: 20개')

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument()

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(addToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3) // 상품3 추가

      const increaseButtons = screen.getAllByText('+')
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]) // 상품2
        fireEvent.click(increaseButtons[2]) // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument()

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox')
      fireEvent.change(couponSelect, { target: { value: '1' } }) // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument()

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }) // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument()
    })

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />)

      const $product1 = screen.getByTestId('product-1')

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'))

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } })
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } })
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } })

      fireEvent.click(screen.getByText('추가'))

      const $product4 = screen.getByTestId('product-4')

      expect($product4).toHaveTextContent('상품4')
      expect($product4).toHaveTextContent('15000원')
      expect($product4).toHaveTextContent('재고: 30')

      // 2. 상품 선택 및 수정
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('toggle-button'))
      fireEvent.click(within($product1).getByTestId('modify-button'))

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } })
        fireEvent.change(within($product1).getByDisplayValue('10000'), { target: { value: '12000' } })
        fireEvent.change(within($product1).getByDisplayValue('상품1'), { target: { value: '수정된 상품1' } })
      })

      fireEvent.click(within($product1).getByText('수정 완료'))

      expect($product1).toHaveTextContent('수정된 상품1')
      expect($product1).toHaveTextContent('12000원')
      expect($product1).toHaveTextContent('재고: 25')

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1)
      fireEvent.click(within($product1).getByTestId('modify-button'))

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } })
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } })
      })
      fireEvent.click(screen.getByText('할인 추가'))

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument()

      fireEvent.click(screen.getAllByText('삭제')[0])
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument()
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument()

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } })
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } })
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } })
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } })

      fireEvent.click(screen.getByText('쿠폰 추가'))

      const $newCoupon = screen.getByTestId('coupon-3')

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인')
    })
  })

  describe('자유롭게 작성해보세요.', () => {
    describe('cartUtils', () => {
      const createTestProduct = (overrides = {}) => ({
        id: 'test-1',
        name: 'Test Product',
        price: 10000,
        stock: 10,
        discounts: [
          { quantity: 2, rate: 0.1 }, // 2개 이상 10% 할인
          { quantity: 5, rate: 0.2 }, // 5개 이상 20% 할인
        ],
        ...overrides,
      })

      const createTestCartItem = (overrides = {}) => ({
        product: createTestProduct(),
        quantity: 1,
        ...overrides,
      })

      describe('calculateMaxDiscount', () => {
        test('할인이 없는 경우 0을 반환', () => {
          expect(cartUtils.calculateMaxDiscount([], 1)).toBe(0)
        })

        test('수량이 할인 기준에 미달하면 0을 반환', () => {
          const discounts = [{ quantity: 2, rate: 0.1 }]
          expect(cartUtils.calculateMaxDiscount(discounts, 1)).toBe(0)
        })

        test('수량이 할인 기준에 딱 맞으면 할인율을 반환', () => {
          const discounts = [
            { quantity: 5, rate: 0.1 },
            { quantity: 50, rate: 0.5 },
          ]
          expect(cartUtils.calculateMaxDiscount(discounts, 5)).toBe(0.1)
          expect(cartUtils.calculateMaxDiscount(discounts, 50)).toBe(0.5)
        })
      })

      describe('calculateDiscountedPrice', () => {
        test('할인이 없으면 정가를 반환해야 한다.', () => {
          const cartItem = createTestCartItem()
          expect(cartUtils.calculateDiscountedPrice(cartItem, 0)).toBe(10000)
        })

        test('할인된 가격을 계산할 수 있다.', () => {
          const cartItem = createTestCartItem({ quantity: 5 })
          expect(cartUtils.calculateDiscountedPrice(cartItem, 5)).toBe(-200000)
        })
      })

      describe('getMaxApplicableDiscount', () => {
        test('할인이 적용되지 않으면 0을 반환', () => {
          const item: CartItem = { product: createTestProduct(), quantity: 1 }
          expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0)
        })

        test('적용 가능한 가장 높은 할인율을 반환', () => {
          const item: CartItem = { product: createTestProduct(), quantity: 5 }
          expect(cartUtils.getMaxApplicableDiscount(item)).toBe(0.2)
        })
      })

      describe('calculateItemTotal', () => {
        test('할인 없이 총액을 계산', () => {
          const item: CartItem = { product: createTestProduct(), quantity: 5 }
          expect(cartUtils.calculateItemTotal(item)).toBe(40000)
        })

        test('할인이 적용되지 않으면 할인 전 가격을 반환', () => {
          const item: CartItem = { product: createTestProduct(), quantity: 1 }
          expect(cartUtils.calculateItemTotal(item)).toBe(10000)
        })
      })

      describe('calculateTotalBeforeDiscount', () => {
        test('장바구니에 담긴 상품들의 할인 적용 전 총액을 계산', () => {
          const cart: CartItem[] = [
            { product: createTestProduct({ price: 10000 }), quantity: 2 },
            { product: createTestProduct({ price: 20000 }), quantity: 1 },
          ]
          expect(cartUtils.calculateTotalBeforeDiscount(cart)).toBe(40000)
        })

        test('장바구니에 담긴 상품이 없으면 0을 반환', () => {
          expect(cartUtils.calculateTotalBeforeDiscount([])).toBe(0)
        })

        test('할인 적용 전 총액을 계산', () => {
          const cart: CartItem[] = [
            { product: createTestProduct({ price: 10000 }), quantity: 2 },
            { product: createTestProduct({ price: 20000 }), quantity: 1 },
          ]
          expect(cartUtils.calculateTotalBeforeDiscount(cart)).toBe(40000)
        })
      })

      describe('calculateTotalAfterItemDiscounts', () => {
        test('장바구니에 담긴 상품이 없으면 0을 반환', () => {
          expect(cartUtils.calculateTotalAfterItemDiscounts([])).toBe(0)
        })

        test('할인 적용 후 총액을 계산', () => {
          const cart: CartItem[] = [
            { product: createTestProduct({ price: 10000 }), quantity: 2 },
            { product: createTestProduct({ price: 20000 }), quantity: 1 },
          ]
          expect(cartUtils.calculateTotalAfterItemDiscounts(cart)).toBe(38000)
        })
      })

      describe('applyCouponDiscount', () => {
        test('할인 적용 후 금액을 반환', () => {
          const coupon: Coupon = { name: 'Test Coupon', code: 'TEST', discountType: 'amount', discountValue: 5000 }
          expect(cartUtils.applyCouponDiscount(10000, coupon)).toBe(5000)
        })

        test('쿠폰이 없으면 할인 적용 전 금액을 반환', () => {
          expect(cartUtils.applyCouponDiscount(10000, null)).toBe(10000)
        })
      })

      describe('calculateTotalDiscount', () => {
        test('총 할인 금액을 계산', () => {
          expect(cartUtils.calculateTotalDiscount(10000, 5000)).toBe(5000)
        })
      })

      describe('roundAmount', () => {
        test('소수점 이하를 반올림하여 정수로 변환', () => {
          expect(cartUtils.roundAmount(100.5)).toBe(101)
          expect(cartUtils.roundAmount(100.4)).toBe(100)
        })
      })

      describe('calculateCartTotal', () => {
        test('총액 정보를 반환', () => {
          const cart: CartItem[] = [
            { product: createTestProduct({ price: 10000 }), quantity: 2 },
            { product: createTestProduct({ price: 20000 }), quantity: 1 },
          ]
          const coupon: Coupon = { name: 'Test Coupon', code: 'TEST', discountType: 'amount', discountValue: 5000 }

          const result = cartUtils.calculateCartTotal(cart, coupon)
          expect(result.totalBeforeDiscount).toBe(40000)
          expect(result.totalAfterDiscount).toBe(33000)
          expect(result.totalDiscount).toBe(7000)
        })
      })

      describe('getMaxDiscount', () => {
        test('최대 할인율을 반환', () => {
          const discounts: Discount[] = [
            { quantity: 2, rate: 0.1 },
            { quantity: 5, rate: 0.2 },
          ]
          expect(cartUtils.getMaxDiscount(discounts)).toBe(0.2)
        })
      })

      describe('discountFormat', () => {
        test('할인 형식으로 %를 반환', () => {
          const coupon: Coupon = { name: '10% 할인', code: '10%', discountType: 'percentage', discountValue: 10 }
          expect(cartUtils.discountFormat(coupon)).toBe('%')
        })

        test('할인 형식을 원을 반환', () => {
          const coupon: Coupon = { name: '5000원 할인', code: '5000', discountType: 'amount', discountValue: 5000 }
          expect(cartUtils.discountFormat(coupon)).toBe('원')
        })
      })

      describe('formatKrPrice', () => {
        test('숫자나 문자 형식에 콤마 추가후 문자로 반횐', () => {
          expect(cartUtils.formatKrPrice(10000)).toBe('10,000')
        })
      })
    })

    describe('hooks', () => {
      describe('useAccordion', () => {
        test('초기 상태는 빈 Set이어야 한다', () => {
          const { result } = renderHook(() => useAccordion())
          expect(result.current.openItems.size).toBe(0)
        })

        test('토글 기능 테스트', () => {
          const { result } = renderHook(() => useAccordion())

          act(() => {
            result.current.toggleProducts('item1')
          })
          expect(result.current.openItems.has('item1')).toBe(true)
          expect(result.current.openItems.size).toBe(1)

          act(() => {
            result.current.toggleProducts('item1')
          })
          expect(result.current.openItems.has('item1')).toBe(false)
          expect(result.current.openItems.size).toBe(0)
        })

        test('여러 아이템 상태 관리', () => {
          const { result } = renderHook(() => useAccordion())

          act(() => {
            result.current.toggleProducts('item1')
            result.current.toggleProducts('item2')
          })
          expect(result.current.openItems.size).toBe(2)
          expect(result.current.openItems.has('item1')).toBe(true)
          expect(result.current.openItems.has('item2')).toBe(true)

          act(() => {
            result.current.toggleProducts('item1')
          })
          expect(result.current.openItems.size).toBe(1)
          expect(result.current.openItems.has('item1')).toBe(false)
          expect(result.current.openItems.has('item2')).toBe(true)
        })

        test('Set 불변성 보장', () => {
          const { result } = renderHook(() => useAccordion())
          const initialSet = result.current.openItems

          act(() => {
            result.current.toggleProducts('item1')
          })

          expect(result.current.openItems).not.toBe(initialSet)
        })
      })

      describe('useProduct', () => {
        const initialProducts: Product[] = [
          { id: '1', name: 'Product A', price: 1000, stock: 10, discounts: [] },
          { id: '2', name: 'Product B', price: 2000, stock: 5, discounts: [] },
        ]

        test('초기 상태는 전달된 products로 설정돼야 한다', () => {
          const { result } = renderHook(() => useProduct(initialProducts))
          expect(result.current.products).toEqual(initialProducts)
        })

        test('제품 수정 기능 테스트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const updatedProduct = { id: '1', name: 'Updated Product A', price: 1500, stock: 8, discounts: [] }

          act(() => {
            result.current.updateProduct(updatedProduct)
          })

          expect(result.current.products[0]).toEqual(updatedProduct)
        })

        test('새로운 제품 추가 기능 테스트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const newProduct: Product = { id: '3', name: 'Product C', price: 3000, stock: 20, discounts: [] }

          act(() => {
            result.current.addProduct(newProduct)
          })

          expect(result.current.products.length).toBe(3)
          expect(result.current.products[2]).toEqual(newProduct)
        })

        test('제품 편집 시작 기능 테스트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          act(() => {
            result.current.handleEditProduct(initialProducts[0])
          })

          expect(result.current.editingProduct).toEqual(initialProducts[0])
        })

        test('편집 완료 시 제품 업데이트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const editedProduct = { ...initialProducts[0], name: 'Product A' }

          act(() => {
            result.current.handleEditProduct(initialProducts[0])
            result.current.setEditingProduct(editedProduct)
            result.current.handleEditComplete()
          })

          expect(result.current.products[0].name).toBe('Product A')
          expect(result.current.editingProduct).toBe(editedProduct)
        })

        test('새 제품 폼 열고 닫기 테스트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          act(() => {
            result.current.toggleNewProductForm()
          })

          expect(result.current.isNewProductForm).toBe(true)

          act(() => {
            result.current.toggleNewProductForm()
          })

          expect(result.current.isNewProductForm).toBe(false)
        })

        test('새 제품 추가 후 초기화되는지 테스트', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          act(() => {
            result.current.handleChangeNewProduct({
              target: { name: 'name', value: 'New Product' },
            } as ChangeEvent<HTMLInputElement>)
            result.current.handleAddNewProduct({ name: 'New Product', price: 500, stock: 5, discounts: [] })
          })

          expect(result.current.products.length).toBe(3)
          expect(result.current.newProduct).toEqual({
            name: '',
            price: 0,
            stock: 0,
            discounts: [],
          })
        })
      })
    })
  })
})
