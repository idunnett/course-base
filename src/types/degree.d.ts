import type {
  CourseInfo,
  Degree,
  PartialCourse,
  School,
  SubjectRequirement,
} from '@prisma/client'
import type { subjects } from '../constants'
import type { CourseInfoWithSchool, CreatePartialCourse } from './course'

type FullDegree = Degree & {
  _count: {
    users: number
  }
  school: School
  courseInfos: {
    courseInfo: CourseInfo & {
      school: School
      courses: (Course & {
        segments: Segment[]
      })[]
    }
  }[]
  partialCourses: PartialCourse[]
  subjectRequirements: FullSubjectRequirement[]
}

type CreateDegreeFormData = {
  name: string
  degreeYears: string
  credits: string
  admissionYear: string
  school: School | null
  courseInfos: Array<CourseInfoWithSchool | CreatePartialCourse>
  subjectRequirements: CreateSubjectRequirement[]
}

type FullSubjectRequirement = SubjectRequirement & {
  subject: string[]
}

type CreateSubjectRequirement = {
  subject: string[]
  year: string
  credits: string
  orHigher: boolean = false
}

type Subject = (typeof subjects)[keyof typeof subjects]
