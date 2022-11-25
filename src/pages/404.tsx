import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'

const NotFound = () => {
  const session = useSession()
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 text-slate-500 dark:text-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="text-xl">Whoops! There is nothing on this page...</p>
      </div>
      <Link
        href="/"
        className="primary-btn group whitespace-nowrap py-2 px-3 text-xl"
      >
        <span className="flex items-center">
          <IoIosArrowBack className="h-6 w-6 group-hover:animate-bounce-left" />
          Return to {session ? 'dashboard' : 'homepage'}
        </span>
      </Link>
    </div>
  )
}

export default NotFound
