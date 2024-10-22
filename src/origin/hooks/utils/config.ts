type EmptyCheckValue = string | number | boolean | null | undefined | object | any[]

export const isAllEmpty = (...values: EmptyCheckValue[]): boolean => {
  return values.every((value) => isEmpty(value))
}

export const isEmpty = (value: EmptyCheckValue): boolean => {
  if (value == null) return true

  if (typeof value === 'boolean') return false

  if (typeof value === 'number') return Number.isNaN(value)

  if (typeof value === 'string') return value.trim() === ''

  if (Array.isArray(value)) return value.length === 0

  if (typeof value === 'object') return Object.keys(value).length === 0

  return false
}
