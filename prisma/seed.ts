import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const school = await prisma.school.upsert({
    where: { id: 'dalhousieUniversity' },
    update: {
      courses: {
        createMany: {
          data: [
            {
              name: 'Intro to CS',
              code: 'CS1003',
              color: '#13B8A6',
              creditHours: 3.5,
              degreeYear: 1,
              instructor: 'Dr. Smith',
              year: 2022,
              term: 'F',
            },
            {
              name: 'Organic Chemistry',
              code: 'CHEM2173',
              color: '#6466F1',
              creditHours: 3.5,
              degreeYear: 2,
              instructor: 'Dr. Watt',
              year: 2022,
              term: 'W',
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
      courses: {
        createMany: {
          data: [
            {
              name: 'Intro to CS',
              code: 'CS1003',
              color: '#13B8A6',
              creditHours: 3.5,
              degreeYear: 1,
              instructor: 'Dr. Smith',
              year: 2022,
              term: 'F',
            },
            {
              name: 'Organic Chemistry',
              code: 'CHEM2173',
              color: '#6466F1',
              creditHours: 3.5,
              degreeYear: 2,
              instructor: 'Dr. Watt',
              year: 2022,
              term: 'W',
            },
          ],
          skipDuplicates: true,
        },
      },
    },
    include: { courses: { select: { id: true } } },
  })

  const courseIds = school.courses.map((c) => c.id)

  const isaac = await prisma.user.upsert({
    where: { email: 'isaacdunnett@gmail.com' },
    update: {
      courseIds,
      schoolId: school.id,
    },
    create: {
      email: 'isaacdunnett@gmail.com',
      name: 'Isaac Dunnett',
      courseIds,
      schoolId: school.id,
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
