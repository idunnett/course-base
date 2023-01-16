import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const courseInfoRouter = router({
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.courseInfo.findUniqueOrThrow({
        where: { id: input },
        include: {
          courses: {
            include: {
              segments: true,
            },
          },
          school: true,
        },
      })
    }),
  variations: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { courses } = await ctx.prisma.courseInfo.findUniqueOrThrow({
        where: { id: input },
        select: {
          courses: {
            include: {
              segments: true,
            },
          },
        },
      })
      return courses
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
      const courseInfos = await ctx.prisma.courseInfo.findMany({
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
          courses: {
            _count: 'desc',
          },
        },
        include: {
          school: true,
        },
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (courseInfos.length > limit) {
        const nextItem = courseInfos.pop()
        nextCursor = nextItem!.id
      }
      const items = courseInfos.map((courseInfo) => ({
        ...courseInfo,
        courses: [],
      }))
      return {
        items,
        nextCursor,
      }
    }),
})
