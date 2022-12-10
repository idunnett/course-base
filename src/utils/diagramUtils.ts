import type { Course, Segment, Task } from '@prisma/client'

export const getCourseSegmentTasks = (
  course: Course,
  segment: Segment,
  tasks: Task[]
) => {
  return tasks.filter(
    (t) =>
      t.courseId === course.id && t.segmentId === segment.id && t.grade != null
  )
}

export const removeExcessTasks = (tasks: Task[], segmentQuantity: number) => {
  // if there exists more tasks than the segment asks for (segment.quantity)
  // then remove the tasks with the lowest grades until there is the right amount of tasks
  for (let i = 0; i < tasks.length - segmentQuantity; i++) {
    let lowestGradeIndex = 0
    for (let j = 1; j < tasks.length; j++) {
      const task = tasks[j]
      const lowestTask = tasks[lowestGradeIndex]
      if (task && lowestTask && task.grade < lowestTask.grade) {
        lowestGradeIndex = j
      }
    }
    tasks.splice(lowestGradeIndex, 1)
  }
}

export const getTotalCurrentGrade = (
  course: Course & { segments: Segment[] },
  tasks: Task[]
) => {
  let grade = 0
  for (const segment of course.segments) {
    const segmentTasks = getCourseSegmentTasks(course, segment, tasks)
    removeExcessTasks(segmentTasks, segment.quantity)
    let segmentGrade = 0
    segmentTasks.forEach((segmentTask) => {
      segmentGrade += segmentTask.grade
    })
    segmentGrade = segment.value * (segmentGrade / segment.quantity / 100)
    segmentGrade = Math.round(segmentGrade * 100) / 100
    grade += segmentGrade
  }
  return Math.round(grade * 100) / 100
}
