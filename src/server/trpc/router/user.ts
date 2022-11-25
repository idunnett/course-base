import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const userRouter = router({
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUniqueOrThrow({
        where: { id: input },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          schoolId: true,
          accounts: { select: { provider: true } },
          courseIds: true,
          darkMode: true,
        },
      })
    }),
  setDarkMode: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          darkMode: input,
        },
      })
    }),
  myCourseIds: protectedProcedure.query(async ({ ctx }) => {
    const { courseIds } = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: { courseIds: true },
    })
    return courseIds
  }),
})
