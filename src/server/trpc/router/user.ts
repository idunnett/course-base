import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        schoolId: true,
        accounts: { select: { provider: true } },
        darkMode: true,
        degreeId: true,
      },
    })
    const school = await ctx.prisma.school.findUnique({
      where: { id: user.schoolId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    })
    const degree = await ctx.prisma.degree.findUnique({
      where: { id: user.degreeId },
      select: { name: true },
    })
    return {
      ...user,
      school,
      degreeName: degree?.name,
    }
  }),
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
          darkMode: true,
          degreeId: true,
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
})
