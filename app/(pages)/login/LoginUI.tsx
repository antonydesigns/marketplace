"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/app/(global-state-store)/useAuthStore";
import axios from "axios";
import InputInvitationCode from "./InputInvitationCode";

export default function LoginUI() {
  const { key, submit, setSubmit } = useAuthStore();

  useEffect(() => {
    if (submit !== "invitationCode") return;
    (async () => {
      try {
        const response = await axios.post("/api/auth", {
          step: 1,
          key: key,
        });
        console.log(response);
        // Reset submit state
        setSubmit("");
      } catch (error) {
        console.log(error);
      }
    })();
  }, [submit]);

  return (
    <div>
      <InputInvitationCode
        stateModifiers={["key", "setKey"]}
        label="Invitation code"
        submitCode="invitationCode"
      />
    </div>
  );
}
