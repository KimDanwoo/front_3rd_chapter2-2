import { useCallback, useState } from 'react'
import { CartItem, Coupon, Product } from '../../types'
import { updateCartItemQuantity, calculateCartTotal } from './utils'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  const findItemInCart = useCallback((cart: CartItem[], productId: string) => {
    return cart.find(({ product }) => product.id === productId)
  }, [])

  const getRemainingStock = useCallback(
    (id: string, stock: number) => {
      const cartItem = findItemInCart(cart, id)
      return stock - (cartItem?.quantity || 0)
    },
    [cart],
  )

  const updateCartItem = useCallback((cart: CartItem[], productId: string) => {
    return cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) } : item,
    )
  }, [])

  const addToCart = useCallback((product: Product) => {
    const { id, stock } = product

    if (!getRemainingStock(id, stock)) return

    setCart((prevCart) => {
      const existingItem = findItemInCart(prevCart, id)
      return existingItem ? updateCartItem(prevCart, id) : [...prevCart, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter(({ product }) => product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      return updateCartItemQuantity(prevCart, productId, newQuantity)
    })
  }, [])

  const calculateTotal = useCallback(() => {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateCartTotal(cart, selectedCoupon)
    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
      totalDiscount: Math.round(totalDiscount),
    }
  }, [cart, selectedCoupon])

  const applyCoupon = useCallback((coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }, [])

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
