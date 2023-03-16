import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  RiFilePaper2Line,
  RiDonutChartFill,
  RiBookletLine,
  RiBuilding2Line,
} from 'react-icons/ri'

const NavHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed top-0 z-50 flex h-12 w-full items-center justify-between bg-white py-2 px-4 shadow-sm dark:bg-zinc-800 dark:shadow-neutral-700">
      <Link href="/">
        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-300">
          <h1 className="flex items-center gap-1 text-lg font-semibold text-slate-500 dark:text-gray-300">
            <RiDonutChartFill />
            <div className="tracking-tight text-slate-400 dark:text-white">
              Grade
              <span className="text-slate-500 dark:text-slate-400">Base</span>
            </div>
          </h1>
          <span className="text-xs italic text-slate-400 dark:text-gray-400">
            ALPHA
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-1 text-sm">
        <Link
          href="/schools"
          className="secondary-btn flex items-center gap-1 font-normal text-slate-500 dark:text-neutral-200 dark:hover:bg-zinc-700"
        >
          <RiBuilding2Line />
          Schools
        </Link>
        <Link
          href="/degrees"
          className="secondary-btn flex items-center gap-1 font-normal text-slate-500 dark:text-neutral-200 dark:hover:bg-zinc-700"
        >
          <RiFilePaper2Line />
          Degrees
        </Link>
        <Link
          href="/courses"
          className="secondary-btn flex items-center gap-1 font-normal text-slate-500 dark:text-neutral-200 dark:hover:bg-zinc-700"
        >
          <RiBookletLine />
          Courses
        </Link>
      </div>
      <div className="flex h-full items-center">{children}</div>
    </div>
  )
}

export default NavHeader
