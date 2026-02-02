import CenterDiv from "@/components/center-div";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CenterDiv>{children}</CenterDiv>;
}
