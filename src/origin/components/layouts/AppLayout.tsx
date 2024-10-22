import { FC, PropsWithChildren } from 'react'
import { AppHeader } from '.'
import { AdminProvider } from '@/origin/context'

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        <AppHeader />
        <main className="container mx-auto mt-6">{children}</main>
      </div>
    </AdminProvider>
  )
}
