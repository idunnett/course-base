import { Term } from '@prisma/client'
import { z } from 'zod'
import { getTotalCurrentGrade } from '../../../utils/diagramUtils'
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
        term: userDegreeCourse.term,
        year: userDegreeCourse.year,
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
        res.term = userDegreeCourse.course.term
        res.year = userDegreeCourse.course.year
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
        term: z.nativeEnum(Term).nullable().optional(),
        year: z.number().min(1900).max(2100).nullable().optional(),
        grade: z.number().min(0).max(100).nullable().optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { degreeId, courseInfoId, term, year, grade, completed } = input
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
          term,
          year,
          grade,
          completed,
        },
        update: {
          term,
          year,
          grade,
          completed,
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
  unlinkCourse: protectedProcedure
    .input(
      z.object({
        degreeId: z.string(),
        courseInfoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { degreeId, courseInfoId } = input
      return await ctx.prisma.userDegreeCourses.delete({
        where: {
          userId_courseInfoId_degreeId: {
            userId: ctx.session.user.id,
            courseInfoId,
            degreeId,
          },
        },
      })
    }),
})
