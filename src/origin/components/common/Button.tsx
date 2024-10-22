import { FC, memo, useMemo, useCallback } from 'react'

type ButtonProps = {
  id?: string
  className?: string
  text: string
  onClick: () => void
  disabled?: boolean
  color?: 'primary' | 'error' | 'info' | 'success' | 'disabled'
  size?: 'sm' | 'md' | 'lg'
}

const colorMap = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  success: 'bg-green-500 text-white hover:bg-green-600',
  info: 'bg-gray-300 text-black hover:bg-gray-400',
  error: 'bg-red-500 text-white hover:bg-red-600',
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
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
      () => `rounded disabled:bg-gray-400 ${className} ${colorClass} ${sizeClass}`.trim(),
      [className, colorClass, sizeClass],
    )

    const handleClick = useCallback(() => {
      onClick()
    }, [onClick])

    return (
      <button className={classNameProps} onClick={handleClick} {...props}>
        {text}
      </button>
    )
  },
)
