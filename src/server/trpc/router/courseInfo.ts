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
})
