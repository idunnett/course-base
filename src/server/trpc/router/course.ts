import { Course, Term } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const courseRouter = router({
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const usersOnCourses = await ctx.prisma.usersOnCourses.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        course: {
          include: {
            info: true,
            segments: true,
          },
        },
      },
    })
    const courses = usersOnCourses.map(({ course }) => course)
    return courses
  }),
  getMyCourse: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { course } = await ctx.prisma.usersOnCourses.findUniqueOrThrow({
        where: {
          userId_courseId: { userId: ctx.session.user.id, courseId: input },
        },
        select: {
          course: {
            include: {
              info: true,
              segments: true,
            },
          },
        },
      })
      return course
    }),
  join: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const courseIds =
        (
          await ctx.prisma.user.findUnique({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              courseIds: true,
            },
          })
        )?.courseIds ?? []
      if (courseIds.includes(input))
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You are already in this course',
        })
      const course: Course = await ctx.prisma.course.update({
        where: { id: input },
        data: {
          members: {
            increment: 1,
          },
        },
      })
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          courseIds: {
            push: input,
          },
        },
      })
      return course
    }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        color: z.string(),
        degreeYear: z.number().int(),
        credits: z.number().min(1),
        schoolId: z.string(),
        course: z
          .object({
            segments: z
              .array(
                z
                  .object({
                    name: z.string(),
                    value: z.number().int(),
                    quantity: z.number().int(),
                  })
                  .required()
              )
              .min(1),
            year: z.number().int(),
            term: z.nativeEnum(Term),
            instructor: z.string(),
          })
          .required(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { course: fullCourse, ...courseInfo } = input
      const { segments, ...course } = fullCourse
      const { id: infoId } = await ctx.prisma.courseInfo.create({
        data: courseInfo,
      })
      const { id: courseId } = await ctx.prisma.course.create({
        data: { infoId, ...course },
        select: {
          id: true,
        },
      })
      segments.forEach(async (segment) => {
        await ctx.prisma.segment.create({
          data: { ...segment, courseId },
        })
      })
      await ctx.prisma.usersOnCourses.create({
        data: {
          userId: ctx.session.user.id,
          courseId,
        },
      })
      return courseId
    }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.course.findUniqueOrThrow({
        where: { id: input },
        include: {
          segments: true,
          info: {
            include: { school: true },
          },
        },
      })
    }),
})
