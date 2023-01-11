import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const school = await prisma.school.upsert({
    where: { id: 'dalhousieUniversity' },
    update: {
      courseInfos: {
        createMany: {
          data: [
            {
              name: 'Intro to CS',
              code: 'CS1003',
              color: '#13B8A6',
              credits: 1,
              degreeYear: 1,
            },
            {
              name: 'Organic Chemistry',
              code: 'CHEM2173',
              color: '#6466F1',
              credits: 1,
              degreeYear: 2,
            },
          ],
          skipDuplicates: true,
        },
      },
    },
    create: {
      color: '#FED500',
      secondaryColor: '#242424',
      name: 'Dalhousie University',
      shortName: 'DAL',
      id: 'dalhousieUniversity',
      courseInfos: {
        createMany: {
          data: [
            {
              name: 'Intro to CS',
              code: 'CS1003',
              color: '#13B8A6',
              credits: 3.5,
              degreeYear: 1,
            },
            {
              name: 'Organic Chemistry',
              code: 'CHEM2173',
              color: '#6466F1',
              credits: 3.5,
              degreeYear: 2,
            },
          ],
          skipDuplicates: true,
        },
      },
    },
    include: { courseInfos: { select: { id: true } } },
  })

  const infoIds = school.courseInfos.map((c) => c.id)

  let courseIds = []

  for (const infoId of infoIds) {
    const { id: courseId } = await prisma.course.upsert({
      where: {
        id: infoId + 'details',
      },
      create: {
        id: infoId + 'details',
        infoId,
        instructor: 'Dr. Isaac Dunnett',
        year: 2020,
      },
      update: {
        id: infoId + 'details',
        infoId,
        instructor: 'Dr. Isaac Dunnett',
        year: 2020,
      },
    })
    courseIds.push(courseId)
    await prisma.segment.createMany({
      data: [
        {
          id: courseId + 'segment1',
          courseId,
          name: 'Quizzes',
          quantity: 4,
          value: 30,
        },
        {
          id: courseId + 'segment2',
          courseId,
          name: 'Exam',
          quantity: 1,
          value: 40,
        },
        {
          id: courseId + 'segment3',
          courseId,
          name: 'Midterms',
          quantity: 5,
          value: 30,
        },
      ],
      skipDuplicates: true,
    })
  }

  const { id: newDegreeId } = await prisma.degree.upsert({
    where: { id: 'bcsDegree' },
    update: {
      id: 'bcsDegree',
      admissionYear: 2020,
      credits: 10,
      name: 'Bachelor of Computer Science',
      requiredCourseIds: courseIds,
      schoolId: school.id,
      years: 4,
    },
    create: {
      id: 'bcsDegree',
      admissionYear: 2020,
      credits: 10,
      name: 'Bachelor of Computer Science',
      requiredCourseIds: courseIds,
      schoolId: school.id,
      years: 4,
    },
    select: { id: true },
  })

  await prisma.subjectRequirement.createMany({
    data: [
      {
        id: 'subjectRequirement',
        credits: 1,
        orHigher: true,
        subject: ['Dentistry', 'Dental Hygiene'],
        year: 2,
        degreeId: newDegreeId,
      },
    ],
    skipDuplicates: true,
  })

  await prisma.partialCourse.createMany({
    data: [
      {
        id: 'partialCourse1',
        degreeId: newDegreeId,
        code: 'MATH 3333',
        credits: 1,
        degreeYear: 3,
        name: 'Calc 3',
      },
      {
        id: 'partialCourse2',
        degreeId: newDegreeId,
        code: 'ECON 4444',
        credits: 1,
        degreeYear: 4,
        name: 'Economics 4',
      },
    ],
    skipDuplicates: true,
  })

  const isaac = await prisma.user.upsert({
    where: { email: 'isaacdunnett@gmail.com' },
    update: {
      courseIds,
      schoolId: school.id,
      degreeId: newDegreeId,
    },
    create: {
      email: 'isaacdunnett@gmail.com',
      name: 'Isaac Dunnett',
      image:
        'https://lh3.googleusercontent.com/a/AEdFTp60T49QM25_Q1aTbYAliIRT3QxcsxE18u6aTSQbwQ=s96-c',
      courseIds,
      schoolId: school.id,
      degreeId: newDegreeId,
    },
  })
  console.log({ isaac, school })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
