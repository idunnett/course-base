import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { trpc } from '../utils/trpc'
import Layout from '../components/layouts'
import '../styles/globals.css'
import Head from 'next/head'

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
        <main className="min-h-screen w-full bg-gray-100 dark:bg-zinc-800">
          <Component {...pageProps} />
        </main>
      </Layout>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
