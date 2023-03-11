import { z } from 'zod'
import { getTotalCurrentGrade } from '../../../utils/diagramUtils'
import getTermName, { getTerm } from '../../../utils/termUtils'
import { router, protectedProcedure } from '../trpc'

export const userDegreeCourseRouter = router({
  getMy: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const userDegreeCourses = await ctx.prisma.userDegreeCourses.findMany({
      where: {
        userId: ctx.session.user.id,
        degreeId: input,
      },
      include: {
        course: {
          include: {
            segments: true,
          },
        },
      },
    })

    const resArray = []

    for (const userDegreeCourse of userDegreeCourses) {
      const res = {
        courseInfoId: userDegreeCourse.courseInfoId,
        courseId: userDegreeCourse.courseId,
        completed: userDegreeCourse.completed,
        term: getTermName(userDegreeCourse.term),
        grade: userDegreeCourse.grade,
      }
      if (userDegreeCourse.course) {
        const tasks = await ctx.prisma.task.findMany({
          where: {
            userId: ctx.session.user.id,
            courseId: userDegreeCourse.course.id,
          },
        })
        res.grade = getTotalCurrentGrade(userDegreeCourse.course, tasks)
        res.term =
          getTermName(userDegreeCourse.course.term) +
          ' ' +
          userDegreeCourse.course.year
      }
      resArray.push(res)
    }

    return resArray
  }),
  update: protectedProcedure
    .input(
      z.object({
        degreeId: z.string(),
        courseInfoId: z.string(),
        term: z.string().optional(),
        grade: z.number().min(0).max(100).nullable().optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { degreeId, courseInfoId, term, grade, completed } = input
      return await ctx.prisma.userDegreeCourses.upsert({
        where: {
          userId_courseInfoId_degreeId: {
            degreeId,
            courseInfoId,
            userId: ctx.session.user.id,
          },
        },
        create: {
          degreeId,
          courseInfoId,
          userId: ctx.session.user.id,
          term: term ? getTerm(term) : undefined,
          grade: grade ?? undefined,
          completed: completed ?? undefined,
        },
        update: {
          term: term ? getTerm(term) : undefined,
          grade: grade,
          completed: completed ?? undefined,
        },
      })
    }),
  linkCourse: protectedProcedure
    .input(
      z.object({
        degreeId: z.string(),
        courseInfoId: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { degreeId, courseInfoId, courseId } = input

      await ctx.prisma.degree.findUniqueOrThrow({
        where: {
          id: degreeId,
        },
      })
      await ctx.prisma.courseInfo.findUniqueOrThrow({
        where: {
          id: courseInfoId,
        },
      })
      await ctx.prisma.course.findUniqueOrThrow({
        where: {
          id: courseId,
        },
      })
      const userDegreeCourses = await ctx.prisma.userDegreeCourses.findUnique({
        where: {
          userId_courseInfoId_degreeId: {
            userId: ctx.session.user.id,
            degreeId,
            courseInfoId,
          },
        },
      })
      if (userDegreeCourses) {
        if (userDegreeCourses.courseId === courseId) return userDegreeCourses
        else
          return await ctx.prisma.userDegreeCourses.update({
            where: {
              userId_courseInfoId_degreeId: {
                userId: ctx.session.user.id,
                degreeId,
                courseInfoId,
              },
            },
            data: {
              courseId,
              grade: null,
              term: null,
            },
          })
      } else
        return await ctx.prisma.userDegreeCourses.create({
          data: {
            userId: ctx.session.user.id,
            degreeId,
            courseInfoId,
            courseId,
          },
        })
    }),
})
