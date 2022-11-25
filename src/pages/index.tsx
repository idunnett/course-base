import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { IoIosArrowForward } from 'react-icons/io'
import Dashboard from './dashboard'

const Home: NextPage = () => {
  const session = useSession()

  console.log(session)

  if (session?.status === 'authenticated' && session?.data?.user?.id)
    return <Dashboard />

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight text-slate-400 dark:text-white sm:text-[5rem]">
        Course
        <span className="text-slate-500 dark:text-slate-400">Base</span>
      </h1>
      <Link
        href="/auth/signup"
        className="primary-btn group whitespace-nowrap py-2 px-3 text-xl"
      >
        <span className="flex items-center">
          Get started{' '}
          <IoIosArrowForward className="h-6 w-6 group-hover:animate-bounce-right" />
        </span>
      </Link>
    </div>
  )
}

export default Home
