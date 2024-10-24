import { describe, expect, test, vi } from 'vitest'
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react'
import { CartPage } from '../../refactoring/pages/CartPage'
import { AdminPage } from '../../refactoring/pages/AdminPage'
import { CartItem, Coupon, Discount, Product } from '../../types'
import {
  useAccordion,
  useCart,
  useCoupon,
  useDiscount,
  useNewProduct,
  useProduct,
  useProductEditor,
} from '../../refactoring/hooks'
import * as utils from '../../refactoring/hooks/utils'
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
      const handleAddToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가')
      const handleAddToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가')
      const handleAddToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가')

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
      fireEvent.click(handleAddToCartButtonsAtProduct1) // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument()

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(handleAddToCartButtonsAtProduct1)
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개')
      fireEvent.click(handleAddToCartButtonsAtProduct1)
      expect(product1).toHaveTextContent('재고: 0개')

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument()
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument()
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument()

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(handleAddToCartButtonsAtProduct2) // 상품2 추가
      fireEvent.click(handleAddToCartButtonsAtProduct3) // 상품3 추가

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
    describe('utils', () => {
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
            expect(utils.calculateMaxDiscount([], 1)).toBe(0)
          })

          test('수량이 할인 기준에 미달하면 0을 반환', () => {
            const discounts = [{ quantity: 2, rate: 0.1 }]
            expect(utils.calculateMaxDiscount(discounts, 1)).toBe(0)
          })

          test('수량이 할인 기준에 딱 맞으면 할인율을 반환', () => {
            const discounts = [
              { quantity: 5, rate: 0.1 },
              { quantity: 50, rate: 0.5 },
            ]
            expect(utils.calculateMaxDiscount(discounts, 5)).toBe(0.1)
            expect(utils.calculateMaxDiscount(discounts, 50)).toBe(0.5)
          })
        })

        describe('calculateDiscountedPrice', () => {
          test('할인이 없으면 정가를 반환해야 한다.', () => {
            const cartItem = createTestCartItem()
            expect(utils.calculateDiscountedPrice(cartItem, 0)).toBe(10000)
          })

          test('할인된 가격을 계산할 수 있다.', () => {
            const cartItem = createTestCartItem({ quantity: 5 })
            expect(utils.calculateDiscountedPrice(cartItem, 5)).toBe(-200000)
          })
        })

        describe('getMaxApplicableDiscount', () => {
          test('할인이 적용되지 않으면 0을 반환', () => {
            const item: CartItem = { product: createTestProduct(), quantity: 1 }
            expect(utils.getMaxApplicableDiscount(item)).toBe(0)
          })

          test('적용 가능한 가장 높은 할인율을 반환', () => {
            const item: CartItem = { product: createTestProduct(), quantity: 5 }
            expect(utils.getMaxApplicableDiscount(item)).toBe(0.2)
          })
        })

        describe('calculateItemTotal', () => {
          test('할인 없이 총액을 계산', () => {
            const item: CartItem = { product: createTestProduct(), quantity: 5 }
            expect(utils.calculateItemTotal(item)).toBe(40000)
          })

          test('할인이 적용되지 않으면 할인 전 가격을 반환', () => {
            const item: CartItem = { product: createTestProduct(), quantity: 1 }
            expect(utils.calculateItemTotal(item)).toBe(10000)
          })
        })

        describe('calculateTotalBeforeDiscount', () => {
          test('장바구니에 담긴 상품들의 할인 적용 전 총액을 계산', () => {
            const cart: CartItem[] = [
              { product: createTestProduct({ price: 10000 }), quantity: 2 },
              { product: createTestProduct({ price: 20000 }), quantity: 1 },
            ]
            expect(utils.calculateTotalBeforeDiscount(cart)).toBe(40000)
          })

          test('장바구니에 담긴 상품이 없으면 0을 반환', () => {
            expect(utils.calculateTotalBeforeDiscount([])).toBe(0)
          })

          test('할인 적용 전 총액을 계산', () => {
            const cart: CartItem[] = [
              { product: createTestProduct({ price: 10000 }), quantity: 2 },
              { product: createTestProduct({ price: 20000 }), quantity: 1 },
            ]
            expect(utils.calculateTotalBeforeDiscount(cart)).toBe(40000)
          })
        })

        describe('calculateTotalAfterItemDiscounts', () => {
          test('장바구니에 담긴 상품이 없으면 0을 반환', () => {
            expect(utils.calculateTotalAfterItemDiscounts([])).toBe(0)
          })

          test('할인 적용 후 총액을 계산', () => {
            const cart: CartItem[] = [
              { product: createTestProduct({ price: 10000 }), quantity: 2 },
              { product: createTestProduct({ price: 20000 }), quantity: 1 },
            ]
            expect(utils.calculateTotalAfterItemDiscounts(cart)).toBe(38000)
          })
        })

        describe('applyCouponDiscount', () => {
          test('할인 적용 후 금액을 반환', () => {
            const coupon: Coupon = { name: 'Test Coupon', code: 'TEST', discountType: 'amount', discountValue: 5000 }
            expect(utils.applyCouponDiscount(10000, coupon)).toBe(5000)
          })

          test('쿠폰이 없으면 할인 적용 전 금액을 반환', () => {
            expect(utils.applyCouponDiscount(10000, null)).toBe(10000)
          })
        })

        describe('calculateTotalDiscount', () => {
          test('총 할인 금액을 계산', () => {
            expect(utils.calculateTotalDiscount(10000, 5000)).toBe(5000)
          })
        })

        describe('roundAmount', () => {
          test('소수점 이하를 반올림하여 정수로 변환', () => {
            expect(utils.roundAmount(100.5)).toBe(101)
            expect(utils.roundAmount(100.4)).toBe(100)
          })
        })

        describe('calculateCartTotal', () => {
          test('총액 정보를 반환', () => {
            const cart: CartItem[] = [
              { product: createTestProduct({ price: 10000 }), quantity: 2 },
              { product: createTestProduct({ price: 20000 }), quantity: 1 },
            ]
            const coupon: Coupon = { name: 'Test Coupon', code: 'TEST', discountType: 'amount', discountValue: 5000 }

            const result = utils.calculateCartTotal(cart, coupon)
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
            expect(utils.getMaxDiscount(discounts)).toBe(0.2)
          })
        })

        describe('discountFormat', () => {
          test('할인 형식으로 %를 반환', () => {
            const coupon: Coupon = { name: '10% 할인', code: '10%', discountType: 'percentage', discountValue: 10 }
            expect(utils.discountFormat(coupon)).toBe('%')
          })

          test('할인 형식을 원을 반환', () => {
            const coupon: Coupon = { name: '5000원 할인', code: '5000', discountType: 'amount', discountValue: 5000 }
            expect(utils.discountFormat(coupon)).toBe('원')
          })
        })

        describe('formatKrPrice', () => {
          test('숫자나 문자 형식에 콤마 추가후 문자로 반횐', () => {
            expect(utils.formatKrPrice(10000)).toBe('10,000')
          })
        })
      })

      describe('formatUtils', () => {
        describe('discountFormat', () => {
          test('discountType이 percentage일때 %반환', () => {
            const coupon: Coupon = { name: '10% 할인', code: '10%', discountType: 'percentage', discountValue: 10 }
            expect(utils.discountFormat(coupon)).toBe('%')
          })

          test('discountType이 amount일때 원 반환', () => {
            const coupon: Coupon = { name: '5000원 할인', code: '5000', discountType: 'amount', discountValue: 5000 }
            expect(utils.discountFormat(coupon)).toBe('원')
          })
        })

        describe('formatKrPrice', () => {
          test('금액을 문자열로 변환', () => {
            expect(utils.formatKrPrice(10000)).toBe('10,000')
          })
        })

        describe('roundAmount', () => {
          test('소수점 이하를 반올림하여 정수로 변환', () => {
            expect(utils.roundAmount(100.5)).toBe(101)
            expect(utils.roundAmount(100.4)).toBe(100)
          })
        })
      })

      describe('validationUtil', () => {
        describe('isEmpty', () => {
          test('빈 문자열이면 true 반환', () => {
            expect(utils.isEmpty('')).toBe(true)
          })

          test('빈 문자열이 아니면 false 반환', () => {
            expect(utils.isEmpty('test')).toBe(false)
          })

          test('null이면 true 반환', () => {
            expect(utils.isEmpty(null)).toBe(true)
          })

          test('undefined이면 true 반환', () => {
            expect(utils.isEmpty(undefined)).toBe(true)
          })

          test('빈 배열이면 true 반환', () => {
            expect(utils.isEmpty([])).toBe(true)
          })
        })

        describe('containsEmpty', () => {
          test('하나라도 비어있으면 true 반환', () => {
            expect(utils.containsEmpty('', 'test')).toBe(true)
          })

          test('모두 채워져 있으면 false 반환', () => {
            expect(utils.containsEmpty('test', 'test')).toBe(false)
          })
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
          { id: '1', name: '상품1', price: 1000, stock: 20, discounts: [] },
          { id: '2', name: '상품2', price: 2000, stock: 20, discounts: [] },
        ]

        test('초기 상품 목록을 정상적으로 반환', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          expect(result.current.products).toEqual(initialProducts)
        })

        test('새로운 상품을 추가할 수 있다.', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const newProduct: Product = {
            id: '3',
            name: '상품3',
            price: 3000,
            stock: 20,
            discounts: [],
          }

          act(() => {
            result.current.addProduct(newProduct)
          })

          expect(result.current.products).toHaveLength(3)
          expect(result.current.products).toContainEqual(newProduct)
        })

        test('기존 상품을 업데이트할 수 있다.', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const updatedProduct: Product = {
            id: '1',
            name: '수정된 상품1',
            price: 1500,
            stock: 25,
            discounts: [],
          }

          act(() => {
            result.current.updateProduct(updatedProduct)
          })

          expect(result.current.products.find((p) => p.id === '1')).toEqual(updatedProduct)
          expect(result.current.products).toHaveLength(2)
        })

        test('존재하지 않는 id로 업데이트를 시도하면 상품 목록이 변경되지 않는다.', () => {
          const { result } = renderHook(() => useProduct(initialProducts))

          const nonExistentProduct: Product = {
            id: '999',
            name: '존재하지 않는 상품',
            price: 9999,
            stock: 0,
            discounts: [],
          }

          act(() => {
            result.current.updateProduct(nonExistentProduct)
          })

          expect(result.current.products).toEqual(initialProducts)
        })
      })

      describe('useProductEditor', () => {
        const sampleProduct: Product = {
          id: '1',
          name: '상품1',
          price: 1000,
          stock: 20,
          discounts: [],
        }

        const mockOnUpdate = vi.fn()

        test('상품 편집을 시작할 수 있다.', () => {
          const { result } = renderHook(() => useProductEditor(mockOnUpdate))

          act(() => {
            result.current.updateEditProduct(sampleProduct)
          })

          expect(result.current.editingProduct).toEqual(sampleProduct)
        })

        test('상품 정보를 수정할 수 있다.', () => {
          const { result } = renderHook(() => useProductEditor(mockOnUpdate))

          act(() => {
            result.current.updateEditProduct(sampleProduct)
          })

          const mockEvent = {
            target: {
              id: '1',
              name: 'name',
              value: '수정된 상품1',
            },
          } as any

          act(() => {
            result.current.changeEditProduct(mockEvent)
          })

          expect(result.current.editingProduct?.name).toBe('수정된 상품1')
        })

        test('수정 완료 시 콜백이 호출되고 초기화된다.', () => {
          const { result } = renderHook(() => useProductEditor(mockOnUpdate))

          act(() => {
            result.current.updateEditProduct(sampleProduct)
          })

          act(() => {
            result.current.saveEditProduct()
          })

          expect(mockOnUpdate).toHaveBeenCalled()
          expect(result.current.editingProduct).toBeNull()
        })
      })

      describe('useNewProduct', () => {
        const mockOnAdd = vi.fn()
        const newProductSample = {
          name: '새 상품',
          price: 1000,
          stock: 10,
          discounts: [],
        }

        test('새 상품 폼을 토글할 수 있다.', () => {
          const { result } = renderHook(() => useNewProduct(mockOnAdd))

          act(() => {
            result.current.toggleNewProductForm()
          })

          expect(result.current.isNewProductForm).toBe(true)
        })

        test('새 상품 정보를 변경할 수 있다.', () => {
          const { result } = renderHook(() => useNewProduct(mockOnAdd))

          const mockEvent = {
            target: {
              name: 'name',
              value: '새 상품',
            },
          } as any

          act(() => {
            result.current.updateNewProduct(mockEvent)
          })

          expect(result.current.newProduct.name).toBe('새 상품')
        })

        test('새 상품을 추가하면 초기화되고 콜백이 호출된다.', () => {
          const { result } = renderHook(() => useNewProduct(mockOnAdd))

          act(() => {
            result.current.addNewProduct(newProductSample)
          })

          expect(mockOnAdd).toHaveBeenCalledWith(
            expect.objectContaining({
              ...newProductSample,
              id: expect.any(String),
            }),
          )
          expect(result.current.isNewProductForm).toBe(false)
          expect(result.current.newProduct).toEqual({
            name: '',
            price: 0,
            stock: 0,
            discounts: [],
          })
        })
      })

      describe('useCart', () => {
        const mockProduct: Product = {
          id: '1',
          name: 'Test Product',
          price: 1000,
          stock: 10,
          discounts: [],
        }

        const mockProduct2: Product = {
          id: '2',
          name: 'Test Product 2',
          price: 2000,
          stock: 5,
          discounts: [],
        }

        const mockCoupon: Coupon = {
          name: '10% 할인 쿠폰',
          code: 'TEST10',
          discountType: 'amount',
          discountValue: 1000,
        }

        test('초기 상태는 빈 장바구니여야 한다', () => {
          const { result } = renderHook(() => useCart())

          expect(result.current.cart).toEqual([])
          expect(result.current.selectedCoupon).toBeNull()
        })

        test('장바구니에 상품 추가 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
          })

          expect(result.current.cart).toHaveLength(1)
          expect(result.current.cart[0]).toEqual({
            product: mockProduct,
            quantity: 1,
          })
        })

        test('장바구니에서 상품 제거 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
            result.current.addToCart(mockProduct2)
          })

          expect(result.current.cart).toHaveLength(2)

          act(() => {
            result.current.removeCart(mockProduct.id)
          })

          expect(result.current.cart).toHaveLength(1)
          expect(result.current.cart[0].product.id).toBe(mockProduct2.id)
        })

        test('장바구니 상품 수량 업데이트 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
          })

          act(() => {
            result.current.updateCartQuantity(mockProduct.id, 3)
          })

          expect(result.current.cart[0].quantity).toBe(3)
        })

        test('재고 이상으로 수량을 늘릴 수 없다', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
          })

          act(() => {
            result.current.updateCartQuantity(mockProduct.id, mockProduct.stock + 1)
          })

          expect(result.current.cart[0].quantity).toBe(mockProduct.stock)
        })

        test('쿠폰 적용 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
            result.current.applyCoupon(mockCoupon)
          })

          expect(result.current.selectedCoupon).toEqual(mockCoupon)
        })

        test('총액 계산 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
            result.current.applyCoupon(mockCoupon)
          })

          const total = result.current.calculateTotal()

          expect(total.totalBeforeDiscount).toBe(1000)
          expect(total.totalDiscount).toBe(1000)
          expect(total.totalAfterDiscount).toBe(0)
        })

        test('남은 재고 계산 테스트', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
            result.current.updateCartQuantity(mockProduct.id, 3)
          })

          expect(result.current.getRemainingStock(mockProduct.id, mockProduct.stock)).toBe(7)
        })

        test('같은 상품을 추가하면 수량이 증가해야 한다', () => {
          const { result } = renderHook(() => useCart())

          act(() => {
            result.current.addToCart(mockProduct)
            result.current.addToCart(mockProduct)
          })

          expect(result.current.cart).toHaveLength(1)
          expect(result.current.cart[0].quantity).toBe(2)
        })

        test('재고가 0이면 장바구니에 추가할 수 없다', () => {
          const { result } = renderHook(() => useCart())
          const outOfStockProduct: Product = { ...mockProduct, stock: 0 }

          act(() => {
            result.current.addToCart(outOfStockProduct)
          })

          expect(result.current.cart).toHaveLength(0)
        })
      })

      describe('useCoupon', () => {
        const initialCoupons: Coupon[] = [
          {
            name: '1',
            code: 'SUMMER10',
            discountType: 'percentage',
            discountValue: 10,
          },
        ]

        test('초기 상태는 전달된 쿠폰 목록으로 설정돼야 한다', () => {
          const { result } = renderHook(() => useCoupon(initialCoupons))
          expect(result.current.coupons).toEqual(initialCoupons)
          expect(result.current.newCoupon).toEqual({
            name: '',
            code: '',
            discountType: 'percentage',
            discountValue: 0,
          })
        })

        test('쿠폰 입력 필드 변경 테스트', () => {
          const { result } = renderHook(() => useCoupon(initialCoupons))

          act(() => {
            result.current.changeCoupon({
              target: { name: 'name', value: 'New Coupon' },
            } as React.ChangeEvent<HTMLInputElement>)
          })

          expect(result.current.newCoupon.name).toBe('New Coupon')
        })

        test('새로운 쿠폰 추가 테스트', () => {
          const { result } = renderHook(() => useCoupon(initialCoupons))

          const newCoupon: Coupon = {
            id: '2',
            name: 'New Coupon',
            code: 'NEW20',
            discountType: 'percentage',
            discountValue: 20,
          }

          act(() => {
            result.current.addCoupon(newCoupon)
          })

          // 쿠폰이 추가되었는지 확인
          expect(result.current.coupons).toHaveLength(2)
          expect(result.current.coupons[1]).toEqual(newCoupon)

          // 입력 필드가 초기화되었는지 확인
          expect(result.current.newCoupon).toEqual({
            name: '',
            code: '',
            discountType: 'percentage',
            discountValue: 0,
          })
        })
      })

      describe('useDiscount', () => {
        const mockProduct: Product = {
          id: '1',
          name: 'Test Product',
          price: 1000,
          stock: 10,
          discounts: [{ quantity: 2, rate: 10 }],
        }

        const mockProducts = [mockProduct]

        const defaultProps = {
          products: mockProducts,
          updateProduct: vi.fn(),
          editingProduct: mockProduct,
          setEditingProduct: vi.fn(),
        }

        test('초기 상태 테스트', () => {
          const { result } = renderHook(() => useDiscount(defaultProps))

          expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 })
        })

        test('새로운 할인 추가 테스트', () => {
          const { result } = renderHook(() => useDiscount(defaultProps))
          const newDiscount = { quantity: 3, rate: 20 }

          act(() => {
            result.current.setNewDiscount(newDiscount)
          })

          expect(result.current.newDiscount).toEqual(newDiscount)

          act(() => {
            result.current.addToDiscount(mockProduct.id)
          })

          expect(defaultProps.updateProduct).toHaveBeenCalledWith({
            ...mockProduct,
            discounts: [
              { quantity: 2, rate: 10 },
              { quantity: 3, rate: 20 },
            ],
          })

          expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 })
        })

        test('할인 제거 테스트', () => {
          const { result } = renderHook(() => useDiscount(defaultProps))

          act(() => {
            result.current.removeDiscount(mockProduct.id, 0)
          })

          // updateProduct가 할인이 제거된 상품으로 호출되었는지 확인
          expect(defaultProps.updateProduct).toHaveBeenCalledWith({
            ...mockProduct,
            discounts: [],
          })
        })
      })
    })
  })
})
