import type { ReactNode } from 'react'
import Link from 'next/link'

const NavHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed top-0 z-50 flex h-12 w-full items-center justify-between bg-white py-2 px-4 shadow-sm dark:bg-zinc-800 dark:shadow-neutral-700">
      <Link href="/">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-slate-500 dark:text-gray-300">
            CourseBase
          </h1>
          <span className="text-xs italic text-slate-400 dark:text-gray-400">
            ALPHA
          </span>
        </div>
      </Link>
      <div className="flex h-full items-center">{children}</div>
    </div>
  )
}

export default NavHeader
