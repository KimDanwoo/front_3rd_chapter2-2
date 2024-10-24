import { ReactNode } from 'react'

type ListProps = {
  children: ReactNode
  className?: string
}
export const Box = ({ children, className }: ListProps) => {
  return <div className={`space-y-2 mb-4 ${className ?? ''}`}>{children}</div>
}
