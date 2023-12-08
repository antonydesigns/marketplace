"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  async function verifyUserJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyUserJWT",
      });
      if (response.data.error) {
        console.log("user token");
        console.log(response.data);
        setChildren(<></>);
        router.push("/");
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
        router.push("/");
        return;
      }
      setChildren(<>{children}</>);
    } catch (error) {
      console.log("connection error");
    }
  }

  useEffect(() => {
    verifyUserJWT();
    if (!strict) return;
    verifyAccessJWT();
  }, []);

  return <>{childComponents}</>;
}
