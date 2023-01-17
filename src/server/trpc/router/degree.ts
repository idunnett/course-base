import { z } from 'zod'
import {
  DegreeModel,
  PartialCourseModel,
  SubjectRequirementModel,
} from '../../../../prisma/zod'
import { router, protectedProcedure } from '../trpc'

export const degreeRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        degree: DegreeModel.omit({ id: true, memberCount: true }),
        subjectRequirements: SubjectRequirementModel.omit({ id: true }).array(),
        partialCourses: PartialCourseModel.omit({ id: true }).array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { degree, subjectRequirements, partialCourses } = input

      const { id: newDegreeId } = await ctx.prisma.degree.create({
        data: degree,
        select: { id: true },
      })

      subjectRequirements.forEach((s) => (s.degreeId = newDegreeId))
      await ctx.prisma.subjectRequirement.createMany({
        data: subjectRequirements,
      })

      partialCourses.forEach((pc) => (pc.degreeId = newDegreeId))
      await ctx.prisma.partialCourse.createMany({
        data: partialCourses,
      })

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          degreeId: newDegreeId,
        },
      })
      return newDegreeId
    }),
  search: protectedProcedure
    .input(
      z.object({
        searchVal: z.string().optional(),
        schoolId: z.string().optional(),
        limit: z.number().min(1).max(100).default(8),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, searchVal, cursor, schoolId } = input
      const items = await ctx.prisma.degree.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          name: {
            startsWith: searchVal,
            mode: 'insensitive',
          },
          schoolId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          memberCount: 'desc',
        },
        include: {
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
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const degree = await ctx.prisma.degree.findUniqueOrThrow({
        where: { id: input },
        include: {
          partialCourses: true,
          subjectRequirements: true,
          school: true,
        },
      })
      const requiredCourses = await ctx.prisma.courseInfo.findMany({
        where: {
          id: {
            in: degree.requiredCourseIds,
          },
        },
        include: {
          courses: {
            include: {
              segments: true,
            },
          },
          school: true,
        },
      })
      const { requiredCourseIds, schoolId, ...degreeWithoutIds } = degree
      return {
        ...degreeWithoutIds,
        requiredCourses,
      }
    }),
})
