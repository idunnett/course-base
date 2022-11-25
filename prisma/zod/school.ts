import * as z from "zod"
import * as imports from "../null"
import { CompleteDegree, RelatedDegreeModel, CompleteCourse, RelatedCourseModel } from "./index"

export const SchoolModel = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  color: z.string(),
  secondaryColor: z.string(),
  memberCount: z.number().int(),
})

export interface CompleteSchool extends z.infer<typeof SchoolModel> {
  degrees: CompleteDegree[]
  courses: CompleteCourse[]
}

/**
 * RelatedSchoolModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSchoolModel: z.ZodSchema<CompleteSchool> = z.lazy(() => SchoolModel.extend({
  degrees: RelatedDegreeModel.array(),
  courses: RelatedCourseModel.array(),
}))
