import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";
import Greeting from "./AuthCheckPoint";
import AuthCheckpoint from "./AuthCheckPoint";

export default function Navbar() {
  return (
    <>
      <AuthCheckpoint />
      <div className="flex gap-3">
        <Link href="/" className="underline">
          Home
        </Link>
        <LoginButton />
        {/* <Greeting /> */}
      </div>
    </>
  );
}
