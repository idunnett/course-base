import type {
  Degree,
  PartialCourse,
  School,
  SubjectRequirement,
} from '@prisma/client'
import { subjects } from '../constants'

type FullDegree = Degree & {
  requiredCourses: FullCourse[]
  partialCourses: PartialCourse[]
  subjectRequirements: SubjectRequirement[]
  school: School
}

type CreateDegreeFormData = {
  name: string
  degreeYears: string
  credits: string
  admissionYear: string
  school: School | null
  requiredCourses: Array<FullCourse | PartialCourse>
  subjectRequirements: Array<PartialSubjectRequirement>
}

type CreateSubjectRequirement = {
  subject: string[]
  year: string
  credits: string
  orHigher: boolean = false
}

type Subject = typeof subjects[keyof typeof subjects]
