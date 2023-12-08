"use client";
import React, { useEffect } from "react";
import MultiFunctionalInput from "../login/MultiFunctionalInput";
import axios from "axios";
import { API_PATH } from "@/app/(global-utils)/constants";
import { useAuthStore } from "@/app/(global-state-store)/useAuthStore";
import { useRouter } from "next/navigation";

export default function LockAccountUI() {
  const id = localStorage.getItem("id");
  const { password, setUnlocked, submit, setSubmit } = useAuthStore();
  const router = useRouter();

  async function handleUnlock() {
    if (submit !== "unlockAccount") return;
    try {
      const response = await axios.post(API_PATH, {
        context: "unlock account",
        id: id,
        password: password,
      });
      if (response.data.error) {
        console.log(response.data);
        return;
      }
      console.log(response.data);
      setUnlocked(true);
      // Reset submit state
      setSubmit("");
      router.push("/");
    } catch (error) {
      console.log("connection error");
      // Reset submit state
      setSubmit("");
    }
  }

  useEffect(() => {
    handleUnlock();
  }, [submit]);

  return (
    <>
      <MultiFunctionalInput
        stateModifiers={["password", "setPassword"]}
        label="Enter password"
        submitCode="unlockAccount"
        inputType="password"
      />
    </>
  );
}
