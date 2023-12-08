"use client";
import axios from "axios";
import React, { useEffect } from "react";
import { API_PATH } from "../(global-utils)/constants";
import { useAuthStore } from "../(global-state-store)/useAuthStore";

export default function AuthCheckpoint() {
  // Sets the global state of LoggedIn
  // Does not protect hidden components
  const { setLoggedIn, setUnlocked, loggedIn, unlocked } = useAuthStore();

  async function verifyUserJWT() {
    try {
      const response = await axios.post(API_PATH, {
        context: "verifyUserJWT",
      });
      if (response.data.error) {
        console.log("user token");
        console.log(response.data);
        setLoggedIn(false);
        return;
      }
      setLoggedIn(true);
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
        setUnlocked(false);
        return;
      }
      setUnlocked(true);
    } catch (error) {
      console.log("connection error");
    }
  }

  useEffect(() => {
    verifyUserJWT();
    verifyAccessJWT();
    console.log(loggedIn, unlocked);
  }, []);
  return <></>;
}
