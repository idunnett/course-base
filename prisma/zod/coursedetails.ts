import * as z from "zod"
import { Term } from "@prisma/client"
import { CompleteSegment, RelatedSegmentModel, CompleteCourse, RelatedCourseModel, CompleteUserCourse, RelatedUserCourseModel } from "./index"

export const CourseDetailsModel = z.object({
  id: z.string(),
  year: z.number().int(),
  term: z.nativeEnum(Term),
  instructor: z.string(),
  memberCount: z.number().int(),
  createdAt: z.date(),
  courseId: z.string(),
})

export interface CompleteCourseDetails extends z.infer<typeof CourseDetailsModel> {
  segments: CompleteSegment[]
  course: CompleteCourse
  userCourse: CompleteUserCourse[]
}

/**
 * RelatedCourseDetailsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCourseDetailsModel: z.ZodSchema<CompleteCourseDetails> = z.lazy(() => CourseDetailsModel.extend({
  segments: RelatedSegmentModel.array(),
  course: RelatedCourseModel,
  userCourse: RelatedUserCourseModel.array(),
}))
