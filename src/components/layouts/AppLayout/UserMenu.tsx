import { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { FaUserGraduate } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

const UserMenu = () => {
  const session = useSession()
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (menuButtonRef.current?.contains(e.target as HTMLElement)) return
    setOpen(false)
  }

  return (
    <div className="relative h-full" ref={menuButtonRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-full w-full items-center justify-center gap-1 text-slate-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-400"
      >
        {session.data?.user?.image ? (
          <Image
            src={session.data.user.image}
            alt={session.data.user.image}
            width={30}
            height={30}
            className="rounded-full"
          />
        ) : (
          <FaUserGraduate className="h-5 w-5 text-inherit" />
        )}
        <HiChevronDown
          className={
            'h-4 w-4 min-w-max text-inherit transition-transform duration-100 ease-linear ' +
            (open ? 'rotate-180' : 'rotate-0')
          }
        />
      </button>
      <div
        className={
          'absolute top-full right-0 z-50 mt-1.5 flex w-40 origin-top flex-col items-start overflow-hidden rounded-lg border border-gray-50 bg-white shadow-lg transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
          (open ? 'scale-100' : 'scale-0')
        }
      >
        <Link
          href={`/users/${session.data?.user?.id}`}
          onClick={() => setOpen(false)}
          className="link text-slate-500 dark:text-neutral-200"
        >
          Profile
        </Link>
        <button
          onClick={() => {
            localStorage.clear()
            signOut()
          }}
          className="link text-slate-500 dark:text-neutral-200"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default UserMenu
