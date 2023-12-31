"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import axios from "axios";
import { redirect, usePathname, useRouter } from "next/navigation";

export default function ProtectedComponents({
  children,
  strict = true,
}: {
  children: React.ReactNode;
  strict?: boolean;
}) {
  // Only for logged in users and unlocked accounts
  const [childComponents, setChildren] = useState<React.ReactNode>(<></>);
  const router = useRouter();
  const pathname = usePathname();

  async function verifyUserJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyUserJWT",
      });
      if (response.data.error) {
        console.log("user token");
        console.log(response.data);
        setChildren(<></>);
        if (pathname !== "/") {
          redirect("/");
        }
        return;
      }
      setChildren(<>{children}</>);
    } catch (error) {
      console.log("connection error");
    }
  }

  async function verifyAccessJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyAccessJWT",
      });
      if (response.data.error) {
        console.log("access token");
        console.log(response.data);
        setChildren(<></>);
        if (pathname !== "/") {
          redirect("/");
        }
        return;
      }
      setChildren(<>{children}</>);
    } catch (error) {
      console.log("connection error");
    }
  }

  useLayoutEffect(() => {
    verifyUserJWT();
    if (!strict) return;
    verifyAccessJWT();
  }, []);

  return <>{childComponents}</>;
}
