import { Term } from '@prisma/client'

export default function getTermName(term: Term) {
  switch (term) {
    case 'F':
      return 'Fall'
    case 'W':
      return 'Winter'
    case 'S':
      return 'Summer'
    default:
      return ''
  }
}

export function getTerm(term: string): Term {
  switch (term) {
    case 'F':
      return Term.F
    case 'W':
      return Term.W
    case 'S':
      return Term.S
    default:
      return Term.F
  }
}
