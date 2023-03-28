import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { RiLoader5Line } from 'react-icons/ri'

const PageLoading = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStart = useCallback(
    (url: string) => url !== router.asPath && setLoading(true),
    [router.asPath]
  )

  const handleComplete = useCallback(
    (url: string) => url === router.asPath && setLoading(false),
    [router.asPath]
  )
  useEffect(() => {
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', (url) => handleComplete(url))
    router.events.on('routeChangeError', (url) => handleComplete(url))
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.events, router.asPath, handleStart, handleComplete])

  return loading ? (
    <div className="z-40 -mt-12 flex h-screen w-full items-center justify-center bg-white dark:bg-zinc-800">
      <RiLoader5Line className="animate-spin dark:text-white" />
    </div>
  ) : null
}

export default PageLoading
