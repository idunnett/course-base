import type { AppType } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { trpc } from '../utils/trpc'
import Layout from '../components/layouts'
import '../styles/globals.css'

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
    <div className="relative flex h-screen w-screen items-center justify-center">
      <FaSpinner className="animate-spin" />
    </div>
  ) : null
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Head>
          <title>GradeBase</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <PageLoading />
        <main className="min-h-screen w-full bg-gray-100 dark:bg-zinc-800">
          <Component {...pageProps} />
        </main>
      </Layout>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
