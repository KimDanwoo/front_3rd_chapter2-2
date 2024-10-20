import { FC, ReactNode } from 'react'

type CardProps = {
  title: string
  children: ReactNode
}

export const Card: FC<CardProps> = ({ title, children }) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  )
}
