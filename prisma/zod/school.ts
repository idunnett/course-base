import * as z from "zod"
import { CompleteDegree, RelatedDegreeModel, CompleteCourseInfo, RelatedCourseInfoModel } from "./index"

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
  courseInfos: CompleteCourseInfo[]
}

/**
 * RelatedSchoolModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSchoolModel: z.ZodSchema<CompleteSchool> = z.lazy(() => SchoolModel.extend({
  degrees: RelatedDegreeModel.array(),
  courseInfos: RelatedCourseInfoModel.array(),
}))
