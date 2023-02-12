import type { CourseInfo, PartialCourse } from '@prisma/client'
import type {
  CourseInfoWithSchool,
  CreatePartialCourse,
  FullCourse,
  FullCourseInfo,
} from '../types'

export function isFullCourseType(
  obj: FullCourse | CourseInfoWithSchool
): obj is FullCourse {
  return !!(obj as FullCourse).info
}

export function isCourseInfoType(
  obj: PartialCourse | CreatePartialCourse | CourseInfo
): obj is CourseInfo {
  return !!(obj as CourseInfo).color
}

export function isFullCourseInfoType(
  obj: CourseInfo | FullCourseInfo
): obj is FullCourseInfo {
  return !!(obj as FullCourseInfo).courses
}
