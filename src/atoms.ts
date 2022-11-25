import type { School } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const schoolAtom = atomWithStorage<School | null>('school', null)
export const schoolIdAtom = atom((get) => get(schoolAtom)?.id)

export const darkModeAtom = atomWithStorage<boolean>('darkMode', false)
