import * as z from "zod"
import * as imports from "../null"
import { CompleteCourse, RelatedCourseModel } from "./index"

export const SegmentModel = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number().int(),
  quantity: z.number().int(),
  courseId: z.string(),
})

export interface CompleteSegment extends z.infer<typeof SegmentModel> {
  course: CompleteCourse
}

/**
 * RelatedSegmentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSegmentModel: z.ZodSchema<CompleteSegment> = z.lazy(() => SegmentModel.extend({
  course: RelatedCourseModel,
}))
