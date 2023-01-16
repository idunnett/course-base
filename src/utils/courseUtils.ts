import type { CourseInfo, PartialCourse } from '@prisma/client'
import type { FullCourse } from '../types'

export function isFullCourseType(
  obj: FullCourse | PartialCourse | CourseInfo
): obj is FullCourse {
  return !!(obj as FullCourse).info
}
