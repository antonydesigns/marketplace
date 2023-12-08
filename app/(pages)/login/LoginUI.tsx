"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(global-state-store)/useAuthStore";
import axios from "axios";
import InputInvitationCode from "./InputInvitationCode";
import { useRouter } from "next/navigation";

export default function LoginUI() {
  const {
    key,
    setKey,
    password,
    setPassword,
    submit,
    setSubmit,
    loggedIn,
    setLoggedIn,
    unlocked,
    setUnlocked,
  } = useAuthStore();
  const apiPath = "/api/auth";
  const router = useRouter();

  async function submitInviteCode() {
    if (submit !== "invitationCode") return;
    try {
      const response = await axios.post(apiPath, {
        step: 1,
        key: key,
      });
      console.log(response.data);

      // Reset submit state
      setSubmit("");
    } catch (error) {
      console.log("connection error");
    }
  }

  async function resetPassword() {
    if (submit !== "resetPassword") return;
    try {
      const response = await axios.post(apiPath, {
        step: 2,
        key: key,
        password: password,
      });
      console.log(response.data);

      // Reset submit state
      setSubmit("");
      setPassword("");

      // Go to next process
      prepareUserToken();
    } catch (error) {
      console.log("connection error");
    }
  }

  // STEP 3 WAS REMOVED (Reset the username)
  // That can be done outside the Auth workflow

  async function prepareUserToken() {
    try {
      const response = await axios.post(apiPath, {
        step: 4,
        key: key,
      });
      console.log(response.data);
      localStorage.setItem("id", response.data.saveID);
      prepareAccessToken();
    } catch (error) {
      console.log("connection error");
    }
  }

  async function prepareAccessToken() {
    try {
      const response = await axios.post(apiPath, {
        step: 5,
        key: key,
      });
      console.log(response.data);
      setLoggedIn(true);
      setUnlocked(true);
      setKey("");
      router.push("/");
      return;
    } catch (error) {
      setLoggedIn(false);
      setUnlocked(false);
      console.log("connection error");
    }
  }

  useEffect(() => {
    submitInviteCode();
    resetPassword();
  }, [submit]);

  return (
    <div>
      <InputInvitationCode
        stateModifiers={["key", "setKey"]}
        label="Invitation code"
        submitCode="invitationCode"
      />
      <br />
      <InputInvitationCode
        stateModifiers={["password", "setPassword"]}
        label="Reset password"
        submitCode="resetPassword"
        inputType="password"
      />
    </div>
  );
}
