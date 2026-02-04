import { useEffect, useState } from "react"

export function useCompactMode() {
  const [isCompact, setIsCompact] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("compact-mode")
    if (stored === "true") {
      setIsCompact(true)
      document.documentElement.setAttribute("data-compact", "true")
    }
  }, [])

  const toggleCompactMode = (checked: boolean) => {
    setIsCompact(checked)
    if (checked) {
      localStorage.setItem("compact-mode", "true")
      document.documentElement.setAttribute("data-compact", "true")
    } else {
      localStorage.setItem("compact-mode", "false")
      document.documentElement.removeAttribute("data-compact")
    }
  }

  return { isCompact, toggleCompactMode }
}
