import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteCourse, RelatedCourseModel, CompleteCourseDetails, RelatedCourseDetailsModel } from "./index"

export const UserCourseModel = z.object({
  userId: z.string(),
  courseId: z.string(),
  detailsId: z.string(),
})

export interface CompleteUserCourse extends z.infer<typeof UserCourseModel> {
  user: CompleteUser
  course: CompleteCourse
  details: CompleteCourseDetails
}

/**
 * RelatedUserCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserCourseModel: z.ZodSchema<CompleteUserCourse> = z.lazy(() => UserCourseModel.extend({
  user: RelatedUserModel,
  course: RelatedCourseModel,
  details: RelatedCourseDetailsModel,
}))
