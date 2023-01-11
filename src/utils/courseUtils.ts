import type { PartialCourse } from '@prisma/client'
import type { FullCourse } from '../types'

export function isCourseType(
  obj: FullCourse | PartialCourse
): obj is FullCourse {
  return !!(obj as FullCourse).id
}
