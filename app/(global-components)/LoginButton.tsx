"use client";

import React, { useLayoutEffect, useState } from "react";
import { useAuthStore } from "../(global-state-store)/useAuthStore";
import Link from "next/link";

export default function LoginButton() {
  const { loggedIn, unlocked, setUnlocked } = useAuthStore();

  return (
    <>
      <Link href="/login" className="underline">
        {!loggedIn && "Log In"}
      </Link>
      <Link
        href="/lock"
        className="underline"
        onClick={() => setUnlocked(false)}
      >
        {loggedIn && unlocked && "Lock Account"}
      </Link>
      <Link
        href="/lock"
        className="underline"
        onClick={() => setUnlocked(true)}
      >
        {loggedIn && !unlocked && "Unlock Account"}
      </Link>
    </>
  );
}
