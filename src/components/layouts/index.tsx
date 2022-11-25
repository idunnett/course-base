import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import AppLayout from "./AppLayout";
import BasicLayout from "./BasicLayout";

const Layout = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  if (session.status === "authenticated")
    return <AppLayout>{children}</AppLayout>;

  return <BasicLayout>{children}</BasicLayout>;
};

export default Layout;
