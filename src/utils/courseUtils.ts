import type { CreatePartialCourse, FullCourse } from '../types'

export function isCourseType(
  obj: FullCourse | CreatePartialCourse
): obj is FullCourse {
  return !!(obj as FullCourse).id
}
