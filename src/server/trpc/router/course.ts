import { Course } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { CourseModel, SegmentModel } from '../../../../prisma/zod'
import { router, protectedProcedure } from '../trpc'

export const courseRouter = router({
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
          memberCount: {
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
  search: protectedProcedure
    .input(
      z.object({
        searchVal: z.string().optional(),
        limit: z.number().min(1).max(100).default(6),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, searchVal, cursor } = input
      const items = await ctx.prisma.course.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          OR: [
            {
              name: {
                startsWith: searchVal,
                mode: 'insensitive',
              },
            },
            {
              code: {
                startsWith: searchVal,
                mode: 'insensitive',
              },
            },
          ],
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          memberCount: 'desc',
        },
        include: {
          segments: true,
          school: true,
        },
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }
      return {
        items,
        nextCursor,
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        course: CourseModel.omit({ id: true, memberCount: true }),
        segments: SegmentModel.omit({ id: true, courseId: true }).array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { course, segments } = input
      const courseId = (
        await ctx.prisma.course.create({
          data: course,
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
        include: { segments: true, school: true },
      })
    }),
})
