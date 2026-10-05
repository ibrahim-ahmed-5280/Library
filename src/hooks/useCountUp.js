import { useEffect, useState } from 'react'

export function useCountUp(targetValue, isActive, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) {
      return
    }

    let start = 0
    let rafId
    const increment = Math.max(1, Math.round(targetValue / (duration / 16)))

    const tick = () => {
      start += increment
      if (start >= targetValue) {
        setCount(targetValue)
        return
      }
      setCount(start)
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [isActive, targetValue, duration])

  return count
}
