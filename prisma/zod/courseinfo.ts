import * as z from "zod"
import { CompleteSchool, RelatedSchoolModel, CompleteCourse, RelatedCourseModel } from "./index"

export const CourseInfoModel = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  color: z.string(),
  degreeYear: z.number().int(),
  credits: z.number(),
  schoolId: z.string(),
})

export interface CompleteCourseInfo extends z.infer<typeof CourseInfoModel> {
  school: CompleteSchool
  courses: CompleteCourse[]
}

/**
 * RelatedCourseInfoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCourseInfoModel: z.ZodSchema<CompleteCourseInfo> = z.lazy(() => CourseInfoModel.extend({
  school: RelatedSchoolModel,
  courses: RelatedCourseModel.array(),
}))
