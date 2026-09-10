'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LoadingScreen from '@/components/sections/LoadingScreen'

export const LoadingContext = createContext(null)

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoadingState] = useState(true)
  const [loading, setLoadingState] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const width = window.innerWidth

    if (width <= 1024) {
      setIsLoadingState(false)
      window.scrollTo(0, 0)
      import('@/lib/initialFX').then((module) => {
        if (module.initialFX) {
          setTimeout(() => module.initialFX(), 100)
        }
      })
      setReady(true)
      return
    }

    setReady(true)
    let percent = 0
    const id = setInterval(() => {
      percent = Math.min(92, percent + Math.max(1, Math.round(Math.random() * 4)))
      setLoadingState(percent)
      if (percent >= 92) clearInterval(id)
    }, 80)

    const safety = setTimeout(() => {
      clearInterval(id)
      setLoadingState(100)
    }, 8000)

    return () => {
      clearInterval(id)
      clearTimeout(safety)
    }
  }, [])

  const setIsLoading = useCallback((next) => {
    if (next === false) window.scrollTo(0, 0)
    setIsLoadingState(next)
  }, [])

  const setLoading = useCallback((percent) => {
    setLoadingState((prev) => Math.max(prev, percent))
  }, [])

  const finishLoading = useCallback(() => {
    setLoadingState(100)
  }, [])

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      setLoading,
      finishLoading,
    }),
    [isLoading, setIsLoading, setLoading, finishLoading],
  )

  return (
    <LoadingContext.Provider value={value}>
      {ready && isLoading && <LoadingScreen percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
