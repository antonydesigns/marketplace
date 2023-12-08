"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/(global-state-store)/useAuthStore";
import axios from "axios";
import InputInvitationCode from "./InputInvitationCode";

export default function LoginUI() {
  const {
    key,
    password,
    setPassword,
    username,
    setUsername,
    submit,
    setSubmit,
  } = useAuthStore();
  const apiPath = "/api/auth";

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
    } catch (error) {
      console.log("connection error");
    }
  }

  async function resetUsername() {
    if (submit !== "resetUsername") return;
    try {
      const response = await axios.post(apiPath, {
        step: 3,
        key: key,
        username: username,
      });
      console.log(response.data);

      // Reset submit state
      setSubmit("");
      setUsername("");
      preparingAccount();
    } catch (error) {
      console.log("connection error");
    }
  }

  async function preparingAccount() {
    try {
      const response = await axios.post(apiPath, {
        step: 4,
        key: key,
      });
    } catch (error) {
      console.log("connection error");
    }
  }

  useEffect(() => {
    submitInviteCode();
    resetPassword();
    resetUsername();
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
      <br />
      <InputInvitationCode
        stateModifiers={["username", "setUsername"]}
        label="Change username (optional)"
        submitCode="resetUsername"
      />
      <button onClick={preparingAccount}>Skip</button>
      <br />
      hello
    </div>
  );
}
