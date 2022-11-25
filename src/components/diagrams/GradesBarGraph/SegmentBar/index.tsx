import { Segment, Task } from "@prisma/client";
import { FC, useState } from "react";
import styles from "./SegmentBar.module.css";

interface Props {
  segment: Segment;
  courseColor: string;
  tasks: Task[];
  heightScaleFactor: number;
}

const SegmentBar: FC<Props> = ({
  segment,
  courseColor,
  tasks,
  heightScaleFactor,
}) => {
  const [tooltipStyles, setTooltipStyles] = useState("right-full origin-right");
  const segmentElementMaxHeight = (1 / segment.quantity) * 100;
  return (
    <div
      className="flex w-full flex-col-reverse justify-start rounded-md bg-gray-400 bg-opacity-20"
      style={{
        // + '40' adds an opacity of 0.25
        // backgroundColor: courseColor + '40',
        height: segment.value * heightScaleFactor + "%",
      }}
    >
      {[...Array(segment.quantity)].map((_, i) => {
        const task = tasks[i];
        if (task?.grade) {
          const segmentHeight = (task.grade / 100) * segmentElementMaxHeight;
          return (
            <div
              className={`relative w-full hover:z-10 ${styles.scaleUp}
                ${task.grade > 0 && "min-h-[0.5rem] p-[1px]"}
              `}
              key={segment.name + i}
              style={{
                height: task.grade > 0 ? `${segmentHeight}%` : 0,
              }}
            >
              <div
                className={`group relative z-0 h-full w-full origin-bottom rounded-md`}
                onMouseEnter={(e) => {
                  if (e.clientX < window.innerWidth / 2) {
                    setTooltipStyles("left-full origin-left");
                  } else setTooltipStyles("right-full origin-right");
                }}
                style={{
                  backgroundColor: courseColor,
                  animationDelay: `${i / segment.quantity / 2}s`,
                }}
              >
                <span
                  className={
                    "tooltip top-1/2 mx-2 -translate-y-1/2 " + tooltipStyles
                  }
                >
                  {task.title
                    ? `${task.title}: ${task.grade}%`
                    : `${task.grade}%`}
                </span>
              </div>
            </div>
          );
        }
        return (
          <div
            key={segment.name + i}
            className="relative w-full p-0.5"
            style={{
              height: `${segmentElementMaxHeight}%`,
              animationDelay: `${i / segment.quantity / 2}s`,
            }}
          >
            <div
              className="group relative h-full w-full rounded-lg bg-gray-400 bg-opacity-30"
              // style={{
              //   // + '4D' adds an opacity of 0.3
              //   backgroundColor: courseColor + '4D',
              // }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default SegmentBar;
