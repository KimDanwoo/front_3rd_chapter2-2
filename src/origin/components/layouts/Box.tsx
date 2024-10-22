import { ReactNode } from 'react'

type ListProps = {
  children: ReactNode
}
export const Box = ({ children }: ListProps) => {
  return <div className="space-y-2 mb-4">{children}</div>
}
