import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { router, protectedProcedure } from '../trpc'

export const schoolRouter = router({
  getMySchool: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.schoolId)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'You are not apart of a school',
      })
    const school = await ctx.prisma.school.findUnique({
      where: {
        id: ctx.session.user.schoolId,
      },
    })
    if (!school)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'School does not exist',
      })
    return school
  }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const school = await ctx.prisma.school.findUnique({
        where: { id: input },
      })
      if (!school)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'School does not exist',
        })
      return school
    }),
  findByIdPreview: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const school = await ctx.prisma.school.findUnique({
        where: { id: input },
        include: {
          _count: {
            select: {
              courseInfos: true,
              degrees: true,
            },
          },
          courseInfos: {
            take: 5,
            include: {
              courses: {
                take: 1,
                orderBy: {
                  members: 'desc',
                },
              },
            },
            orderBy: {
              courses: {
                _count: 'desc',
              },
            },
          },
          degrees: {
            take: 5,
            orderBy: { memberCount: 'desc' },
          },
        },
      })
      if (!school)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'School does not exist',
        })
      return school
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shortName: z.string(),
        color: z.string(),
        secondaryColor: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newSchool = await ctx.prisma.school.create({
        data: input,
      })
      if (ctx.session.user.schoolId) {
        // Decrease member count on user's previous school
        await ctx.prisma.school.update({
          where: { id: ctx.session.user.schoolId },
          data: { memberCount: { decrement: 1 } },
        })
      }
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { schoolId: newSchool.id },
      })
      return newSchool
    }),
  join: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const school = await ctx.prisma.school.findUnique({
        where: { id: input },
      })
      if (!school)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'School does not exist',
        })
      if (ctx.session.user.schoolId) {
        if (ctx.session.user.schoolId === school.id) return school
        // Decrease member count on user's previous school
        await ctx.prisma.school.update({
          where: { id: ctx.session.user.schoolId },
          data: { memberCount: { decrement: 1 } },
        })
      }
      const updatedSchool = await ctx.prisma.school.update({
        where: { id: input },
        data: { memberCount: { increment: 1 } },
      })
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { schoolId: updatedSchool.id },
      })
      return updatedSchool
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
      const items = await ctx.prisma.school.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          name: {
            startsWith: searchVal,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          memberCount: 'desc',
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
})
