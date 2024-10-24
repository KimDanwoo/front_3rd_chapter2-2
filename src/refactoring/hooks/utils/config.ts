type EmptyCheckValue = string | number | boolean | null | undefined | object | any[]

/**
 * @description 값 중 하나라도 비어있는지 확인
 * @param {EmptyCheckValue[]} values - 비어있는지 확인할 값들
 * @returns {boolean} - 값 중 하나라도 비어있으면 true, 아니면 false
 */
export const containsEmpty = (...values: EmptyCheckValue[]): boolean => {
  return values.some((value) => isEmpty(value))
}

/**
 * @description 값이 비어있는지 확인
 * @param {EmptyCheckValue} value - 비어있는지 확인할 값
 * @returns {boolean} - 값이 비어있으면 true, 아니면 false
 */
export const isEmpty = (value: EmptyCheckValue): boolean => {
  if (value == null) return true

  if (typeof value === 'boolean') return false

  if (typeof value === 'number') return Number.isNaN(value) || value === 0

  if (typeof value === 'string') return value.trim() === ''

  if (Array.isArray(value)) return value.length === 0

  if (typeof value === 'object') return Object.keys(value).length === 0

  return false
}
