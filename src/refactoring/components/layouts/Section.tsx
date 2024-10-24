import { FC, ReactNode } from 'react'

type SectionProps = {
  title: string
  children: ReactNode
}
export const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}
