import ProtectedComponents from "@/app/(global-components)/ProtectedComponent";
import React from "react";

export default function Secret() {
  return (
    <ProtectedComponents>
      <div>Secret</div>
    </ProtectedComponents>
  );
}
