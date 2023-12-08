import React from "react";
import LockAccountUI from "./LockAccountUI";
import ProtectedComponents from "@/app/(global-components)/ProtectedComponent";

export default function LockPage() {
  return (
    <ProtectedComponents>
      <LockAccountUI />
    </ProtectedComponents>
  );
}
