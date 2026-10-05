export function cn(...values) {
  return values
    .flatMap((value) => {
      if (!value) return []
      if (typeof value === 'string' || typeof value === 'number') return [value]
      if (Array.isArray(value)) return [cn(...value)]
      if (typeof value === 'object') {
        return Object.entries(value)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([name]) => name)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
}
