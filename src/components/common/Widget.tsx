import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: object;
}

const Widget: FC<Props> = ({ children, className, style }) => {
  return (
    <div
      className={`rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-700 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Widget;
