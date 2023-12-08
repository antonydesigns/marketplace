import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";

export default function Navbar() {
  return (
    <>
      <div className="flex gap-3">
        <Link href="/" className="underline">
          Home
        </Link>
        <Link href="/login" className="underline">
          <LoginButton />
        </Link>
      </div>
    </>
  );
}
