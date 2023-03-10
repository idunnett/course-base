import { TRPCError } from '@trpc/server'
import _ from 'lodash'
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const degreeRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        schoolId: z.string(),
        credits: z.number(),
        admissionYear: z.number(),
        years: z.number(),
        courseInfoIds: z.array(z.string()),
        partialCourses: z.array(
          z.object({
            code: z.string(),
            name: z.string(),
            credits: z.number(),
            degreeYear: z.number(),
          })
        ),
        subjectRequirements: z.array(
          z.object({
            year: z.number(),
            credits: z.number(),
            orHigher: z.boolean(),
            subject: z.array(z.string()),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { subjectRequirements, partialCourses, courseInfoIds } = input

      const courseInfos = await ctx.prisma.courseInfo.findMany({
        where: {
          id: {
            in: courseInfoIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      })
      if (courseInfos.length !== courseInfoIds.length)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course info not found',
        })

      const school = await ctx.prisma.school.findUnique({
        where: {
          id: input.schoolId,
        },
      })
      if (!school)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'School not found',
        })

      const { id: degreeId } = await ctx.prisma.degree.create({
        data: {
          name: input.name,
          credits: input.credits,
          admissionYear: input.admissionYear,
          years: input.years,
          school: {
            connect: {
              id: input.schoolId,
            },
          },
          partialCourses: {
            createMany: {
              data: partialCourses,
            },
          },
        },
        select: { id: true },
      })

      for (const courseInfoId of courseInfoIds) {
        await ctx.prisma.courseInfo.update({
          where: {
            id: courseInfoId,
          },
          data: {
            degrees: {
              connectOrCreate: {
                where: {
                  degreeId_courseInfoId: {
                    degreeId,
                    courseInfoId,
                  },
                },
                create: {
                  degreeId,
                },
              },
            },
          },
        })
      }

      for (const sr of subjectRequirements) {
        const subjectRequirement = await ctx.prisma.subjectRequirement.create({
          data: {
            year: sr.year,
            credits: sr.credits,
            orHigher: sr.orHigher,
            degreeId,
          },
        })
        for (const subjectName of sr.subject) {
          await ctx.prisma.subject.upsert({
            where: {
              name: subjectName,
            },
            create: {
              name: subjectName,
              requirements: {
                create: {
                  requirementId: subjectRequirement.id,
                },
              },
            },
            update: {
              requirements: {
                connectOrCreate: {
                  where: {
                    subjectName_requirementId: {
                      subjectName,
                      requirementId: subjectRequirement.id,
                    },
                  },
                  create: {
                    requirementId: subjectRequirement.id,
                  },
                },
              },
            },
          })
        }
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          degree: {
            connect: {
              id: degreeId,
            },
          },
        },
      })
      return degreeId
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
          },
          schoolId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          users: {
            _count: 'desc',
          },
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
          school: {
            include: {
              _count: {
                select: {
                  users: true,
                },
              },
            },
          },
        },
      })
      let nextCursor: typeof cursor = undefined
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
          subjectRequirements: {
            include: {
              subject: {
                select: {
                  subjectName: true,
                },
              },
            },
          },
          school: true,
          courseInfos: {
            select: {
              courseInfo: {
                include: {
                  courses: {
                    include: {
                      segments: true,
                      _count: {
                        select: {
                          users: true,
                        },
                      },
                    },
                  },
                  school: true,
                },
              },
            },
          },
          _count: {
            select: {
              users: true,
            },
          },
        },
      })
      const subjectRequirements = degree.subjectRequirements.map((sr) => {
        return {
          ...sr,
          subject: sr.subject.map((s) => s.subjectName),
        }
      })
      return {
        ...degree,
        subjectRequirements,
      }
    }),
})
