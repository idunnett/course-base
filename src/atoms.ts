import type { School } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userSchoolAtom = atom<
  (School & { _count: { users: number } }) | null
>(null)

export const darkModeAtom = atomWithStorage<boolean>('darkMode', false)

export const toRouteAtom = atom('/')
