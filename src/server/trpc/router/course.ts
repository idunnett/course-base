import { Term } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const courseRouter = router({
  myCourseIds: protectedProcedure.query(async ({ ctx }) => {
    const usersOnCourses = await ctx.prisma.usersOnCourses.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        courseId: true,
      },
    })
    return usersOnCourses.map(({ courseId }) => courseId)
  }),
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const usersOnCourses = await ctx.prisma.usersOnCourses.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        course: {
          include: {
            info: {
              include: {
                school: true,
              },
            },
            segments: true,
            _count: {
              select: {
                users: true,
              },
            },
          },
        },
      },
    })
    const courses = usersOnCourses.map(({ course }) => course)
    return courses
  }),
  getMyCourse: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { course } = await ctx.prisma.usersOnCourses.findUniqueOrThrow({
        where: {
          userId_courseId: { userId: ctx.session.user.id, courseId: input },
        },
        select: {
          course: {
            include: {
              info: true,
              segments: true,
            },
          },
        },
      })
      return course
    }),
  join: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userOnCourse = await ctx.prisma.usersOnCourses.findUnique({
        where: {
          userId_courseId: { userId: ctx.session.user.id, courseId: input },
        },
      })
      if (userOnCourse)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You are already in this course',
        })
      return await ctx.prisma.course.update({
        where: { id: input },
        data: {
          users: {
            connect: {
              userId_courseId: { userId: ctx.session.user.id, courseId: input },
            },
          },
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        color: z.string(),
        degreeYear: z.number().int(),
        credits: z.number().min(1),
        schoolId: z.string(),
        course: z
          .object({
            segments: z
              .array(
                z
                  .object({
                    name: z.string(),
                    value: z.number().int(),
                    quantity: z.number().int(),
                  })
                  .required()
              )
              .min(1),
            year: z.number().int(),
            term: z.nativeEnum(Term),
            instructor: z.string(),
            location: z.object({
              lat: z.number().nullable(),
              lng: z.number().nullable(),
              address: z.string().nullable(),
            }),
          })
          .required(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { course: fullCourse, ...courseInfo } = input
      const { segments, location, ...course } = fullCourse
      const { id: infoId } = await ctx.prisma.courseInfo.create({
        data: courseInfo,
      })
      const { id: courseId } = await ctx.prisma.course.create({
        data: { infoId, ...course },
        select: {
          id: true,
        },
      })
      segments.forEach(async (segment) => {
        await ctx.prisma.segment.create({
          data: { ...segment, courseId },
        })
      })
      const { lat, lng, address } = location
      if (lat && lng && address) {
        await ctx.prisma.course.update({
          where: { id: courseId },
          data: {
            location: {
              create: {
                lat,
                lng,
                address,
              },
            },
          },
        })
      }
      await ctx.prisma.usersOnCourses.create({
        data: {
          userId: ctx.session.user.id,
          courseId,
        },
      })
      return courseId
    }),
  createVariation: protectedProcedure
    .input(
      z
        .object({
          infoId: z.string(),
          segments: z
            .array(
              z
                .object({
                  name: z.string(),
                  value: z.number().int(),
                  quantity: z.number().int(),
                })
                .required()
            )
            .min(1),
          year: z.number().int(),
          term: z.nativeEnum(Term),
          instructor: z.string(),
          location: z.object({
            lat: z.number().nullable(),
            lng: z.number().nullable(),
            address: z.string().nullable(),
          }),
        })
        .required()
    )
    .mutation(async ({ input, ctx }) => {
      const { segments, infoId, location, ...course } = input
      const courseInfo = await ctx.prisma.courseInfo.findUnique({
        where: { id: infoId },
      })
      if (!courseInfo)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Course info not found',
        })
      const { id: courseId } = await ctx.prisma.course.create({
        data: {
          info: {
            connect: {
              id: infoId,
            },
          },
          ...course,
        },
        select: {
          id: true,
        },
      })
      segments.forEach(async (segment) => {
        await ctx.prisma.segment.create({
          data: { ...segment, courseId },
        })
      })
      const { lat, lng, address } = location
      if (lat && lng && address) {
        await ctx.prisma.course.update({
          where: { id: courseId },
          data: {
            location: {
              create: {
                lat,
                lng,
                address,
              },
            },
          },
        })
      }
      await ctx.prisma.usersOnCourses.create({
        data: {
          userId: ctx.session.user.id,
          courseId,
        },
      })
      return courseId
    }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.course.findUniqueOrThrow({
        where: { id: input },
        include: {
          segments: true,
          info: {
            include: { school: true },
          },
        },
      })
    }),
  details: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.course.findUniqueOrThrow({
        where: { id: input },
        select: {
          segments: true,
          location: true,
        },
      })
    }),
})
