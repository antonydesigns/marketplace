"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import axios from "axios";
import { useAuthStore } from "../(global-state-store)/useAuthStore";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ProtectedComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const [childComponents, setChildren] = useState<React.ReactNode>(<></>);
  const { setLoggedIn } = useAuthStore();
  const router = useRouter();

  async function verifyJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyUserJWT",
      });
      if (response.data.error) {
        console.log(response.data);
        setLoggedIn(false);
        setChildren(<></>);
        router.push("/");
        return;
      }
      setLoggedIn(true);
      setChildren(children);
    } catch (error) {
      console.log("connection error");
    }
  }

  useEffect(() => {
    verifyJWT();
  }, []);

  return <>{childComponents}</>;
}
