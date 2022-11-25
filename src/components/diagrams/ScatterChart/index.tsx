import { Course, Segment, Task } from "@prisma/client";
import { FC, useMemo } from "react";
import Xarrow from "react-xarrows";
import styles from "./ScatterChart.module.css";

interface Props {
  course: Course & { segments: Segment[] };
  tasks: Task[];
}

const ScatterChart: FC<Props> = ({ course, tasks }) => {
  const min = useMemo(() => {
    let min = 100;
    tasks
      .filter((t) => t.courseId === course.id)
      .forEach((task) => {
        if (task.grade < min) min = task.grade;
      });

    if (min === 100) return 0;
    return min;
  }, [tasks]);
  const max = useMemo(() => {
    let max = 0;
    tasks
      .filter((t) => t.courseId === course.id)
      .forEach((task) => {
        if (task.grade > max) max = task.grade;
      });
    if (max === 0) return 100;
    return max;
  }, [tasks]);
  const segments = useMemo(() => {
    let segmentDict: any = {};
    course.segments.forEach((segment) => {
      const { id, ...rest } = segment;
      segmentDict[id] = rest;
    });
    return segmentDict;
  }, [tasks]);
  const scatterTasks = useMemo(() => {
    let scatterTasks = tasks
      .filter((t) => t.courseId === course.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .map((task) => {
        const percentage = ((task.grade - min) * 100) / (max - min);
        return {
          ...task,
          percentage,
        };
      });
    return scatterTasks;
  }, [tasks, min, max]);

  return (
    <div className="flex h-full w-full">
      <div className="flex w-8 flex-col items-end justify-between py-1 pr-1 text-xs text-slate-500">
        <span>{max}%</span>
        <span>{min}%</span>
      </div>
      <div
        id="canvas"
        className="mt-2 flex h-full w-full justify-evenly border-l-2 border-gray-300 py-3 dark:border-gray-400 dark:border-opacity-30"
      >
        {scatterTasks.map((task, index) => (
          <div key={task.id}>
            <div className="relative flex h-full w-full justify-center">
              <div
                className={`group absolute z-10 flex h-3 w-3 scale-0 cursor-pointer items-center justify-center rounded-full hover:z-20 ${styles.inflate}`}
                style={{
                  bottom: `${task.percentage}%`,
                  backgroundColor: course.color,
                  animationDelay: `${index * 15}ms`,
                }}
              >
                <div id={task.id}></div>
                <p className="tooltip bottom-full left-1/2 mb-2 origin-bottom -translate-x-1/2">
                  {task.grade}%{" "}
                  <span
                    className="font-normal text-slate-300"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {segments[task.segmentId]?.name}
                    {segments[task.segmentId]?.quantity > 1 &&
                      (task.title ? `: ${task.title}` : `: ${task.index + 1}`)}
                  </span>
                </p>
              </div>
            </div>
            {index < scatterTasks.length - 1 &&
              (() => {
                const endTask = scatterTasks[index + 1];
                if (endTask)
                  return (
                    <Xarrow
                      start={task.id}
                      end={endTask.id}
                      showHead={false}
                      strokeWidth={3}
                      lineColor={
                        document.documentElement.classList.contains("dark")
                          ? "#9ca3af4d"
                          : "#d1d5db"
                      }
                      curveness={0}
                      passProps={{
                        className: styles["fade-in"],
                      }}
                    />
                  );
              })()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScatterChart;
