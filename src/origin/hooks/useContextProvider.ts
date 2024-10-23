import { Context, useContext } from 'react'

export const useContextProvider = <T>(contextType: Context<T | null>, message: string) => {
  const context = useContext(contextType)
  if (!context) throw new Error(message)
  return context
}
