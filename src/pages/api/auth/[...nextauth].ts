import NextAuth, { type NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { env } from '../../../env/server.mjs'
import { prisma } from '../../../server/db/client'
import { z } from 'zod'
import { verify } from 'argon2'

export const authOptions: NextAuthOptions = {
  debug: true,
  // Include user.id on session
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { schoolId: true },
        })
        console.log(user)
        if (user) session.user.schoolId = user.schoolId || ''
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const signInSchema = z.object({
          email: z.string().email(),
          password: z.string().min(4).max(12),
        })
        const creds = await signInSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: {
            email: creds.email,
          },
        })
        if (!user || !user.password) return null

        const isValidPassword = await verify(user.password, creds.password)
        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
