import * as z from "zod"
import { CompleteDegree, RelatedDegreeModel } from "./index"

export const PartialCourseModel = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  credits: z.number(),
  degreeYear: z.number().int(),
  degreeId: z.string().nullish(),
})

export interface CompletePartialCourse extends z.infer<typeof PartialCourseModel> {
  degree?: CompleteDegree | null
}

/**
 * RelatedPartialCourseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPartialCourseModel: z.ZodSchema<CompletePartialCourse> = z.lazy(() => PartialCourseModel.extend({
  degree: RelatedDegreeModel.nullish(),
}))
