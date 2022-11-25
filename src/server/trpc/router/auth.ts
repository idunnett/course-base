import { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { hash } from 'argon2'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(4).max(12),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, email, password } = input
      const emailExists = await ctx.prisma.user.findFirst({
        where: { email },
      })
      if (emailExists)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'An account with that email already exists',
        })

      const hashedPassword = await hash(password)

      const newUser: User = await ctx.prisma.user.create({
        data: { name: username, email, password: hashedPassword },
      })
      return newUser.email
    }),
})
