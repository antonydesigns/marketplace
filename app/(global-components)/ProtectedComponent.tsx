"use client";
import { useState, useLayoutEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import axios from "axios";
import { useAuthStore } from "../(global-state-store)/useAuthStore";

export default function ProtectedComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const [childComponents, setChildren] = useState<React.ReactNode>(<></>);
  const { setLoggedIn } = useAuthStore();

  async function verifyJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyJWT",
      });
      if (response.data.error) {
        console.log(response.data);

        setLoggedIn(false);
        setChildren(<></>);
        return;
      }
      setLoggedIn(true);
      setChildren(children);
    } catch (error) {
      console.log("connection error");
    }
  }

  useLayoutEffect(() => {
    verifyJWT();
  }, []);

  return <>{childComponents}</>;
}
