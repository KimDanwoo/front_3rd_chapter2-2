import { useContextProvider } from '@/refactoring/hooks'
import { createContext, FC, PropsWithChildren, useState } from 'react'

const ERROR_MESSAGE = 'useAdminContext는 AdminProvider 내부에서만 사용할 수 있습니다.'

type AdminContextType = {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

export const AdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)

  const contextValue = {
    isAdmin,
    setIsAdmin,
  }

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>
}

export const useAdminContext = () => {
  return useContextProvider(AdminContext, ERROR_MESSAGE)
}
