import type { AppType } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import Layout from '../components/layouts'
import '../styles/globals.css'

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
        <main className="relative h-auto w-full bg-white dark:bg-zinc-800">
          <Component {...pageProps} />
        </main>
      </Layout>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
