"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import { useAuthStore } from "../(global-state-store)/useAuthStore";

export default function AuthCheckpoint() {
  // Sets the global state of LoggedIn
  // Does not protect hidden components

  const { setLoggedIn } = useAuthStore();
  async function verifyJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyJWT",
      });
      if (response.data.error) {
        console.log(response.data);
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
    } catch (error) {
      console.log("connection error");
    }
  }

  useEffect(() => {
    verifyJWT();
  }, []);
  return <></>;
}
