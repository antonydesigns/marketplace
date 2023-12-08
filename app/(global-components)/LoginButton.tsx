"use client";

import React, { useLayoutEffect, useState } from "react";
import { useAuthStore } from "../(global-state-store)/useAuthStore";

export default function LoginButton() {
  const { loggedIn } = useAuthStore();

  return (
    <>
      {!loggedIn && "Log In"}
      {loggedIn && "Lock Account"}
    </>
  );
}
