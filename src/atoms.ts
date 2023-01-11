import type { School, User } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userAtom = atomWithStorage<
  | (Omit<User, 'password' | 'courseIds'> & {
      school?: Omit<School, 'name' | 'memberCount'> | null
      degreeName?: string
    })
  | null
>('user', null)

export const darkModeAtom = atomWithStorage<boolean>('darkMode', false)

export const toRouteAtom = atom('/')
