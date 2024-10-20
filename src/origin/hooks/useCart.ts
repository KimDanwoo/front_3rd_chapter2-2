import { useCallback, useState } from 'react'
import { CartItem, Coupon, Product } from '../../types'
import { updateCartItemQuantity, calculateCartTotal } from './utils'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(product.id,product.stock)
    if (!remainingStock) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      const updatedCart = updateCartItemQuantity(prevCart, productId, newQuantity)
      return updatedCart
    })
  }, [])

  const calculateTotal = () => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateCartTotal(cart, selectedCoupon)
    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    }
  }

  const getRemainingStock = (id: string, stock: number) => {
    const cartItem = cart.find((item) => item.product.id === id)
    return stock - (cartItem?.quantity || 0)
  }

  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
  }
}
