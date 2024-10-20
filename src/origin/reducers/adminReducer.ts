import { Product, Discount } from '../../types'

type AdminPageState = {
  openProductIds: Set<string>
  editingProduct: Product | null
  newDiscount: Discount
  showNewProductForm: boolean
}

type AdminPageAction =
  | { type: 'TOGGLE_PRODUCT'; productId: string }
  | { type: 'SET_EDITING_PRODUCT'; product: Product | null }
  | { type: 'SET_NEW_DISCOUNT'; discount: Discount }
  | { type: 'TOGGLE_NEW_PRODUCT_FORM' }

export const adminPageReducer = (state: AdminPageState, action: AdminPageAction): AdminPageState => {
  switch (action.type) {
    case 'TOGGLE_PRODUCT':
      const newSet = new Set(state.openProductIds)
      if (newSet.has(action.productId)) {
        newSet.delete(action.productId)
      } else {
        newSet.add(action.productId)
      }
      return { ...state, openProductIds: newSet }
    case 'SET_EDITING_PRODUCT':
      return { ...state, editingProduct: action.product }
    case 'SET_NEW_DISCOUNT':
      return { ...state, newDiscount: action.discount }
    case 'TOGGLE_NEW_PRODUCT_FORM':
      return { ...state, showNewProductForm: !state.showNewProductForm }
    default:
      return state
  }
}
