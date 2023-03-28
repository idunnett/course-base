import { TRPCError } from '@trpc/server'
import axios from 'axios'
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

const courseInfoTemplate = {
  code: 'CHEM 101',
  name: 'Organic Chemistry I',
  gradingCriteria: [
    {
      title: 'Assignments',
      value: 100,
      quantity: 4,
    },
  ],
  instructor: 'John Doe',
  credits: 3,
  year: new Date().getFullYear(),
  term: 'Fall',
}

type CourseInfoTemplate = typeof courseInfoTemplate

function isJsonString(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

function isInstanceOfCourseInfoTemplate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is CourseInfoTemplate {
  return (
    'code' in object &&
    'name' in object &&
    'instructor' in object &&
    'gradingCriteria' in object &&
    Array.isArray(object.gradingCriteria) &&
    'title' in object.gradingCriteria[0] &&
    'value' in object.gradingCriteria[0] &&
    'quantity' in object.gradingCriteria[0] &&
    'credits' in object &&
    'year' in object &&
    'term' in object
  )
}

export const gptRouter = router({
  extractCourseInfo: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const prompt = `Extract the course info from the following syllabus in JSON format. Example: ${JSON.stringify(
          courseInfoTemplate
        )}\nSyllabus:\n\n${input}\n\nCourse Info:\n`
        const { data } = await axios.post(
          'https://api.openai.com/v1/completions',
          {
            prompt,
            model: 'text-davinci-003',
            max_tokens: 256,
            temperature: 0.7,
            n: 1,
            stop: '\n',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        )
        const result = data.choices[0].text
        if (!isJsonString(result))
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Invalid response from OpenAI API',
          })

        const courseInfo = JSON.parse(result)
        if (!isInstanceOfCourseInfoTemplate(courseInfo))
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Invalid response format from OpenAI API',
          })
        return courseInfo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response) console.error(error.response.data)
        else console.error(error)
      }
    }),
})
