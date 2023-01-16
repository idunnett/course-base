import type { Course } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  CourseInfoModel,
  CourseModel,
  SegmentModel,
} from '../../../../prisma/zod'
import { router, protectedProcedure } from '../trpc'

export const courseRouter = router({
  myCourseIds: protectedProcedure.query(async ({ ctx }) => {
    return (
      await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          courseIds: true,
        },
      })
    )?.courseIds
  }),
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const courseIds = (
      await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          courseIds: true,
        },
      })
    )?.courseIds
    if (!courseIds) return []
    return await ctx.prisma.course.findMany({
      where: {
        id: { in: courseIds },
      },
      include: {
        info: true,
        segments: true,
      },
    })
  }),
  getMyCourse: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { courseIds } = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { courseIds: true },
      })
      if (!courseIds.includes(input))
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You are not in this course.',
        })
      return await ctx.prisma.course.findUniqueOrThrow({
        where: { id: input },
        include: {
          info: true,
          segments: true,
        },
      })
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
        courseInfo: CourseInfoModel.omit({ id: true, courses: true }),
        course: CourseModel.omit({
          id: true,
          members: true,
          createdAt: true,
          infoId: true,
        }),
        segments: SegmentModel.omit({ id: true, courseId: true }).array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseInfo, course, segments } = input
      const { id: infoId } = await ctx.prisma.courseInfo.create({
        data: courseInfo,
      })
      const courseId = (
        await ctx.prisma.course.create({
          data: { infoId, ...course },
          select: {
            id: true,
          },
        })
      ).id
      segments.forEach(async (segment) => {
        await ctx.prisma.segment.create({
          data: { ...segment, courseId },
        })
      })
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          courseIds: {
            push: courseId,
          },
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
