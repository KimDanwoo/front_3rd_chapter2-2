import { FC, memo, useMemo } from 'react'

type ButtonProps = {
  id?: string
  className?: string
  text: string
  onClick: () => void
  disabled?: boolean
  color?: 'primary' | 'error' | 'info' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  info: 'bg-gray-300 text-black hover:bg-gray-400',
  error: 'bg-red-500 text-white hover:bg-red-600',
} as const

const sizeMap = {
  sm: 'px-2 py-1',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
} as const

export const Button: FC<ButtonProps> = memo(
  ({ color = 'primary', size = 'md', text, className = '', onClick, ...props }) => {
    const colorClass = colorMap[color]
    const sizeClass = sizeMap[size]

    const classNameProps = useMemo(
      () =>
        `${className} ${colorClass} ${sizeClass} rounded disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`.trim(),
      [className, colorClass, sizeClass],
    )

    return (
      <button className={classNameProps} onClick={onClick} {...props}>
        {text}
      </button>
    )
  },
)

// 컴포넌트 디버깅을 위한 displayName 설정
Button.displayName = 'Button'
