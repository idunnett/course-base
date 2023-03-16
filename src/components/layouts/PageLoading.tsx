import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { RiLoader5Line } from 'react-icons/ri'

const PageLoading = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true)
    const handleComplete = (url: string) =>
      url === router.asPath && setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return loading ? (
    <div className="absolute z-40 flex h-full w-full items-center justify-center bg-white dark:bg-zinc-800">
      <RiLoader5Line className="animate-spin dark:text-white" />
    </div>
  ) : null
}

export default PageLoading
