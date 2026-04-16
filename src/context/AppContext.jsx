import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem('app-lang') || 'RO')

  // 1. ADAUGĂ STAREA DE LOGIN AICI:
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  // 2. FUNCTIILE DE LOGIN SI LOGOUT
  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  // .. codul curent cu useEffect pentru teme ramane la fel ..
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('app-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('app-lang', lang)
  }, [lang])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    // 3. EXPORTA isLOGGEDIN, LOGIN SI LOGOUT IN PROVIDER AICI:
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, isLoggedIn, login, logout }}>
      {children}
    </AppContext.Provider>
  )
}

// ... restul fisierului ramane exact la fel
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
