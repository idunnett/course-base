import * as z from "zod"
import { CompleteSchool, RelatedSchoolModel, CompleteCourse, RelatedCourseModel } from "./index"

export const DegreeModel = z.object({
  id: z.string(),
  name: z.string(),
  schoolId: z.string(),
  creditHours: z.number(),
  admissionYear: z.number().int(),
  memberCount: z.number().int(),
})

export interface CompleteDegree extends z.infer<typeof DegreeModel> {
  school: CompleteSchool
  requiredCourses: CompleteCourse[]
}

/**
 * RelatedDegreeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDegreeModel: z.ZodSchema<CompleteDegree> = z.lazy(() => DegreeModel.extend({
  school: RelatedSchoolModel,
  requiredCourses: RelatedCourseModel.array(),
}))
