import { CartItem, Coupon, Discount } from '../../../types'

/**
 * @description 상품의 최대 할인율을 계산
 * @param {Discount[]} discounts 할인 정보 목록
 * @param {number} quantity 상품 수량
 * @returns {number} 최대 할인율
 */
export function calculateMaxDiscount(discounts: Discount[], quantity: number): number {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount
  }, 0)
}

/**
 * @description 상품의 할인된 가격을 계산
 * @param {CartItem} cart 장바구니 상품 정보
 * @param {number} discount 할인율
 * @returns {number} 할인된 가격
 */
export function calculateDiscountedPrice(cart: CartItem, discount: number) {
  return cart.product.price * cart.quantity * (1 - discount)
}

/**
 * @description 장바구니의 할인 전 총액 계산
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @returns {number} 할인 전 총액
 */
export function getMaxApplicableDiscount(cart: CartItem) {
  return calculateMaxDiscount(cart.product.discounts, cart.quantity)
}

/**
 * @description 상품의 최대 할인율을 계산
 * @param {CartItem} cart 장바구니 상품 정보
 * @returns {number} 최대 할인율
 */
export function calculateItemTotal(cart: CartItem): number {
  const discount = getMaxApplicableDiscount(cart)
  const totalAfterDiscount = calculateDiscountedPrice(cart, discount)
  return Math.round(totalAfterDiscount)
}

/**
 * @description 장바구니의 상품 할인 적용 전 총액 계산
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @returns {number} 할인 적용 전 총액
 */
export function calculateTotalBeforeDiscount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

/**
 * @description 장바구니의 상품 할인 적용 후 총액 계산
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @returns {number} 할인 적용 후 총액
 */
export function calculateTotalAfterItemDiscounts(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const discount = getMaxApplicableDiscount(item)
    return total + calculateDiscountedPrice(item, discount)
  }, 0)
}

/**
 * @description 쿠폰 할인 적용
 * @param {number} amount 할인 적용 전 금액
 * @param {Coupon | null} coupon 쿠폰 정보
 * @returns {number} 할인 적용 후 금액
 */
export function applyCouponDiscount(amount: number, coupon: Coupon | null): number {
  if (!coupon) return amount

  if (coupon.discountType === 'amount') {
    return Math.max(0, amount - coupon.discountValue)
  }

  const percentageDiscount = coupon.discountValue / 100
  return amount * (1 - percentageDiscount)
}

/**
 * @description 총 할인 금액 계산
 * @param {number} totalBeforeDiscount 할인 적용 전 총액
 * @param {number} totalAfterDiscount 할인 적용 후 총액
 * @returns {number} 총 할인 금액
 */
export function calculateTotalDiscount(totalBeforeDiscount: number, totalAfterDiscount: number): number {
  return totalBeforeDiscount - totalAfterDiscount
}

/**
 * @description 소수점 이하를 반올림하여 정수로 변환
 * @param {number} amount 변환할 금액
 */
export function roundAmount(amount: number): number {
  return Math.round(amount)
}

/**
 * @description 장바구니의 총액 계산
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @param {Coupon | null} selectedCoupon 쿠폰 정보
 * @returns {object} 총액 정보
 */
export function calculateCartTotal(cart: CartItem[], selectedCoupon: Coupon | null) {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart)
  const totalAfterDiscount = calculateTotalAfterItemDiscounts(cart)
  const finalAfterDiscount = applyCouponDiscount(roundAmount(totalAfterDiscount), selectedCoupon)
  const totalDiscount = calculateTotalDiscount(totalBeforeDiscount, finalAfterDiscount)

  return {
    totalBeforeDiscount: roundAmount(totalBeforeDiscount),
    totalAfterDiscount: roundAmount(finalAfterDiscount),
    totalDiscount: roundAmount(totalDiscount),
  }
}

/**
 * @description 장바구니 상품 수량 업데이트
 * @param {CartItem} item 장바구니 상품 정보
 * @param {string} productId 상품 ID
 * @param {number} newQuantity 새로운 수량
 * @returns {CartItem} 업데이트된 장바구니 상품 정보
 */
export function updateQuantity(item: CartItem, productId: string, newQuantity: number): CartItem {
  if (item.product.id === productId) {
    const maxQuantity = item.product.stock
    const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity))
    return { ...item, quantity: updatedQuantity }
  }
  return item
}

/**
 * @description 장바구니 상품 수량 업데이트
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @param {string} productId 상품 ID
 * @param {number} newQuantity 새로운 수량
 * @returns {CartItem[]} 업데이트된 장바구니 상품 목록
 */
export function updateCartItemQuantity(cart: CartItem[], productId: string, newQuantity: number): CartItem[] {
  return cart.map((item) => updateQuantity(item, productId, newQuantity)).filter(({ quantity }) => quantity)
}

/**
 * @description 최대 할인율 계산
 * @param {Discount[]} discounts 할인 정보 목록
 * @returns {number} 최대 할인율
 */
export function getMaxDiscount(discounts: Discount[]) {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}

/**
 * @description 장바구니 상품의 재고 수량 계산
 * @param {CartItem[]} cart 장바구니 상품 목록
 * @param {string} id 상품 ID
 * @param {number} stock 상품 재고 수량
 * @returns {number} 재고 수량
 */
export function getRemainingStock(cart: CartItem[], id: string, stock: number) {
  const cartItem = cart.find((item) => item.product.id === id)
  return stock - (cartItem?.quantity || 0)
}

/**
 * @description 쿠폰 할인 금액 포맷 변환
 * @param {Coupon} coupon 쿠폰 정보
 * @returns {string} 할인 금액 포맷
 */
export function discountFormat(coupon: Coupon) {
  return coupon.discountType === 'amount' ? '원' : '%'
}

/**
 * @description 금액을 숫자로 변환
 * @param {number} amount 금액
 * @returns {string} 변환된 금액
 */
export function formatKrPrice(amount: number): string {
  return amount.toLocaleString()
}
