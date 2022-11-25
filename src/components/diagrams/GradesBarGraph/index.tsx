import { FC, useEffect, useState } from "react";
import { Course, Segment, Task } from "@prisma/client";
import SegmentBar from "./SegmentBar";
import { getCourseSegmentTasks } from "../../../utils/diagramUtils";

// determines how much to scale the height of each bar in the chart
// so that the largest segment takes up the full height
function getBarHeightScaleFactor(segments: Segment[]) {
  let largestSegmentValue = 0;
  segments.forEach((segment) => {
    if (segment.value > largestSegmentValue)
      largestSegmentValue = segment.value;
  });
  // example: largest = 50% -> 100/50 = 2 (scale for height of each bar)
  return 100 / largestSegmentValue;
}

interface Props {
  course: Course & { segments: Segment[] };
  tasks: Task[];
}

const GradesBarGraph: FC<Props> = ({ course, tasks }) => {
  const [barHeightScaleFactor, setBarHeightScaleFactor] = useState(0);

  useEffect(() => {
    setBarHeightScaleFactor(getBarHeightScaleFactor(course.segments));
  }, []);

  return (
    <div className="relative flex h-full w-full items-end gap-[2px]">
      {course.segments.map((segment) => {
        const segmentTasks = getCourseSegmentTasks(course, segment, tasks);
        segmentTasks.sort((a, b) => a.index - b.index);

        return (
          <div
            key={segment.name}
            className={
              "relative flex h-full min-w-0 flex-1 flex-col justify-end transition-all duration-200 ease-linear"
            }
          >
            <span className="text w-full text-center text-xs text-slate-500 dark:text-gray-300">
              {segment.value}%
            </span>
            <SegmentBar
              segment={segment}
              courseColor={course.color}
              tasks={segmentTasks}
              heightScaleFactor={barHeightScaleFactor}
            />
            <span className="w-full overflow-hidden truncate whitespace-nowrap text-center text-xs text-slate-500 dark:text-gray-300">
              {segment.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default GradesBarGraph;
