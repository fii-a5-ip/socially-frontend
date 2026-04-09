import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem('app-lang') || 'RO')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('app-lang', lang)
  }, [lang])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
