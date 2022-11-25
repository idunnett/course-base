import * as z from "zod"
import * as imports from "../null"
import { Term } from "@prisma/client"
import { CompleteSegment, RelatedSegmentModel, CompleteDegree, RelatedDegreeModel, CompleteSchool, RelatedSchoolModel } from "./index"

export const CourseModel = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  year: z.number().int(),
  degreeYear: z.number().int(),
  term: z.nativeEnum(Term),
  instructor: z.string(),
  memberCount: z.number().int(),
  creditHours: z.number(),
  code: z.string(),
  schoolId: z.string(),
  degreeId: z.string().nullish(),
})

export interface CompleteCourse extends z.infer<typeof CourseModel> {
  segments: CompleteSegment[]
  degree?: CompleteDegree | null
  school: CompleteSchool
}

/**
 * RelatedCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCourseModel: z.ZodSchema<CompleteCourse> = z.lazy(() => CourseModel.extend({
  segments: RelatedSegmentModel.array(),
  degree: RelatedDegreeModel.nullish(),
  school: RelatedSchoolModel,
}))
