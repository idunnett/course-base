import * as z from "zod"
import { CompleteSchool, RelatedSchoolModel, CompletePartialCourse, RelatedPartialCourseModel, CompleteSubjectRequirement, RelatedSubjectRequirementModel } from "./index"

export const DegreeModel = z.object({
  id: z.string(),
  name: z.string(),
  schoolId: z.string(),
  credits: z.number(),
  admissionYear: z.number().int(),
  years: z.number().int(),
  memberCount: z.number().int(),
  requiredCourseIds: z.string().array(),
})

export interface CompleteDegree extends z.infer<typeof DegreeModel> {
  school: CompleteSchool
  partialCourses: CompletePartialCourse[]
  subjectRequirements: CompleteSubjectRequirement[]
}

/**
 * RelatedDegreeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDegreeModel: z.ZodSchema<CompleteDegree> = z.lazy(() => DegreeModel.extend({
  school: RelatedSchoolModel,
  partialCourses: RelatedPartialCourseModel.array(),
  subjectRequirements: RelatedSubjectRequirementModel.array(),
}))
