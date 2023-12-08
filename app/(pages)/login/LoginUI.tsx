"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(global-state-store)/useAuthStore";
import axios from "axios";
import InputInvitationCode from "./InputInvitationCode";

export default function LoginUI() {
  const { key, submit, setSubmit } = useAuthStore();

  useEffect(() => {
    if (submit !== "invitationCode") return;
    (async () => {
      let response;
      try {
        response = await axios.post("/api/auth", {
          step: 1,
          key: key,
        });
        console.log(response.data);

        // Reset submit state
        setSubmit("");
      } catch (error) {
        console.log("connection error");
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
