import * as z from "zod"
import { Term } from "@prisma/client"
import { CompleteSegment, RelatedSegmentModel, CompleteCourseInfo, RelatedCourseInfoModel } from "./index"

export const CourseModel = z.object({
  id: z.string(),
  year: z.number().int(),
  term: z.nativeEnum(Term),
  instructor: z.string(),
  members: z.number().int(),
  createdAt: z.date(),
  infoId: z.string(),
})

export interface CompleteCourse extends z.infer<typeof CourseModel> {
  segments: CompleteSegment[]
  info: CompleteCourseInfo
}

/**
 * RelatedCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCourseModel: z.ZodSchema<CompleteCourse> = z.lazy(() => CourseModel.extend({
  segments: RelatedSegmentModel.array(),
  info: RelatedCourseInfoModel,
}))
