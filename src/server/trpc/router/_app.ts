import { router } from '../trpc'
import { authRouter } from './auth'
import { courseRouter } from './course'
import { degreeRouter } from './degree'
import { schoolRouter } from './school'
import { taskRouter } from './task'
import { userRouter } from './user'
import { courseInfoRouter } from './courseInfo'
import { userDegreeCourseRouter } from './userDegreeCourse'
import { gptRouter } from './gpt'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  school: schoolRouter,
  course: courseRouter,
  task: taskRouter,
  degree: degreeRouter,
  courseInfo: courseInfoRouter,
  userDegreeCourse: userDegreeCourseRouter,
  gpt: gptRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
