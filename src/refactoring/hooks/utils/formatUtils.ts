import { Coupon } from '@/types'

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

/**
 * @description 소수점 이하를 반올림하여 정수로 변환
 * @param {number} amount 변환할 금액
 */
export function roundAmount(amount: number): number {
  return Math.round(amount)
}
