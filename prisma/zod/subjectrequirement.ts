import * as z from "zod"
import { CompleteDegree, RelatedDegreeModel } from "./index"

export const SubjectRequirementModel = z.object({
  id: z.string(),
  subject: z.string().array(),
  year: z.number().int(),
  credits: z.number(),
  orHigher: z.boolean(),
  degreeId: z.string().nullish(),
})

export interface CompleteSubjectRequirement extends z.infer<typeof SubjectRequirementModel> {
  degree?: CompleteDegree | null
}

/**
 * RelatedSubjectRequirementModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubjectRequirementModel: z.ZodSchema<CompleteSubjectRequirement> = z.lazy(() => SubjectRequirementModel.extend({
  degree: RelatedDegreeModel.nullish(),
}))
