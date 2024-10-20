import { CartItem, Coupon } from '../../../types'

export const calculateItemTotal = (item: CartItem): number => {
  const { price } = item.product
  const { quantity } = item

  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount
  }, 0)

  const totalAfterDiscount = price * quantity * (1 - discount)

  return Math.round(totalAfterDiscount)
}

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product
  const { quantity } = item

  return discounts.reduce((maxDiscount, discount) => {
    if (quantity >= discount.quantity && discount.rate > maxDiscount) {
      return discount.rate
    }
    return maxDiscount
  }, 0)
}

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach((item) => {
    const { price } = item.product
    const { quantity } = item
    totalBeforeDiscount += price * quantity

    const discount = item.product.discounts.reduce((maxDiscount, d) => {
      return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount
    }, 0)

    totalAfterDiscount += price * quantity * (1 - discount)
  })

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  }
}

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity))
        return { ...item, quantity: updatedQuantity }
      }
      return item
    })
    .filter(({ quantity }) => quantity)
}

export const getMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}

export const getRemainingStock = (cart: CartItem[], id: string, stock: number) => {
  const cartItem = cart.find((item) => item.product.id === id)
  return stock - (cartItem?.quantity || 0)
}
