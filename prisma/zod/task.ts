import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const TaskModel = z.object({
  id: z.string(),
  title: z.string().nullish(),
  grade: z.number(),
  index: z.number().int(),
  segmentId: z.string(),
  courseId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
})

export interface CompleteTask extends z.infer<typeof TaskModel> {
  user: CompleteUser
}

/**
 * RelatedTaskModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTaskModel: z.ZodSchema<CompleteTask> = z.lazy(() => TaskModel.extend({
  user: RelatedUserModel,
}))
