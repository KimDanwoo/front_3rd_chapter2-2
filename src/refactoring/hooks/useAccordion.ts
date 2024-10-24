import { useCallback, useState } from 'react'

export type AccordionHook = {
  openItems: Set<string>
  toggleProducts: (id: string) => void
}

export const useAccordion = () => {
  const [openItems, setOpenItem] = useState<Set<string>>(new Set())

  const updateSet = useCallback((set: Set<string>, id: string) => {
    const newSet = new Set(set)
    newSet.has(id) ? newSet.delete(id) : newSet.add(id)
    return newSet
  }, [])

  const toggleProducts = useCallback((id: string) => {
    setOpenItem((prev) => updateSet(prev, id))
  }, [])

  return { openItems, toggleProducts }
}