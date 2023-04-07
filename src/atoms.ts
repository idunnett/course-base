import type { School } from '@prisma/client'
import { Term } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { FullCourse } from './types'

function getCurrentTerm() {
  const date = new Date()
  const month = date.getMonth()
  if (month < 4) return Term.W
  else if (month < 9) return Term.S
  else return Term.F
}

export const userSchoolAtom = atom<
  (School & { _count: { users: number } }) | null
>(null)

export const darkModeAtom = atomWithStorage<boolean>('darkMode', false)

export const toRouteAtom = atom('/')

export const alertAtom = atom<{
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
} | null>(null)

export const myCoursesAtom = atom<Omit<FullCourse, 'location'>[] | null>(null)

export const activeTermAtom = atom<{
  term: Term
  year: number
}>({ term: getCurrentTerm(), year: new Date().getFullYear() })
