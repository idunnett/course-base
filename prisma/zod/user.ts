import * as z from "zod"
import { CompleteTask, RelatedTaskModel, CompleteAccount, RelatedAccountModel, CompleteSession, RelatedSessionModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  password: z.string().nullish(),
  image: z.string().nullish(),
  schoolId: z.string(),
  courseIds: z.string().array(),
  darkMode: z.boolean(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  tasks: CompleteTask[]
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  tasks: RelatedTaskModel.array(),
  accounts: RelatedAccountModel.array(),
  sessions: RelatedSessionModel.array(),
}))
