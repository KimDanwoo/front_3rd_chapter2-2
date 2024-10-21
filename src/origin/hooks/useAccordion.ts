import { useState } from 'react'

export const useAccordion = () => {
  const [openItems, setOpenItem] = useState<Set<string>>(new Set())

  const updateSet = (set: Set<string>, id: string) => {
    const newSet = new Set(set)
    newSet.has(id) ? newSet.delete(id) : newSet.add(id)
    return newSet
  }

  const toggleProducts = (id: string) => {
    setOpenItem((prev) => updateSet(prev, id))
  }

  return { openItems, toggleProducts }
}
