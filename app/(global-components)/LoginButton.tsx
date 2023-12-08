"use client";

import React, { useLayoutEffect, useState } from "react";
import { useAuthStore } from "../(global-state-store)/useAuthStore";
import Link from "next/link";
import axios from "axios";
import { API_PATH } from "../(global-utils)/constants";

export default function LoginButton() {
  const { loggedIn, unlocked, setUnlocked, password } = useAuthStore();

  async function handleLock() {
    const id = localStorage.getItem("id");

    try {
      const response = await axios.post(API_PATH, {
        context: "lock account",
        id: id,
      });
      if (response.data.error) {
        console.log(response.data);
        return;
      }
      console.log(response.data);
      setUnlocked(false);
    } catch (error) {
      console.log("connection error");
    }
  }

  return (
    <>
      <Link href="/login" className="underline">
        {!loggedIn && "Log In"}
      </Link>
      <Link href="/lock" className="underline" onClick={handleLock}>
        {loggedIn && unlocked && "Lock Account"}
      </Link>
      <Link href="/lock" className="underline">
        {loggedIn && !unlocked && "Unlock Account"}
      </Link>
    </>
  );
}
