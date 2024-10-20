import { Context, useContext } from 'react'
import { AdminContext } from '../context'

export const useContextProvider = <T>(contextType: Context<T | undefined>, message: string) => {
  const context = useContext(contextType)
  if (!context) throw new Error(message)
  return context
}

const ADMIN_ERROR_MESSAGE = 'useAdminContext는 AdminProvider 내부에서만 사용할 수 있습니다.'

export const useAdminContext = () => {
  return useContextProvider(AdminContext, ADMIN_ERROR_MESSAGE)
}
