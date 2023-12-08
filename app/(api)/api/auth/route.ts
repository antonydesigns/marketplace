import { standardHashing } from "@/app/(global-utils)/StandardHashing";
import { StringValidation } from "@/app/(global-utils)/StringValidation";
import { COOKIE_NAME } from "@/app/(global-utils)/constants";
import { db } from "@/app/(global-utils)/firebaseConfig";
import { serialize } from "cookie";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let { key, step } = await request.json();
  const validation = new StringValidation();

  validation.check(key);

  if (!validation.hasError()) {
    // no validation error
    key = validation.sanitized();
    return NextResponse.json({
      message: key,
    });
  } else {
    // validation error
    return NextResponse.json({
      error: validation._error,
      messCode: validation._messCode,
      message: validation._message,
    });
  }
}

export class AuthLogic {
  private key: string = "";
  private password: string = "";
  private username: string = "";
  private id: string = "";
  private hashedPass: string = "";
  private serializedToken: string = "";
  response: { error: boolean; message: string; payload: any } = {
    error: false,
    message: "",
    payload: undefined,
  };

  async claimAccount(key: string) {
    this.key = key;
    this.createId();
    await this.checkIdExists();
  }

  createId(key?: string) {
    if (typeof key !== "undefined") this.key = key;
    if (this.key === "") return;
    let result = standardHashing(this.key);
    if (typeof result === "undefined") {
      this.response.message = "Error no salt provided";
      this.response.error = true;
      return;
    } else {
      this.id = result;
    }
  }

  async checkIdExists() {
    // Use the user ID (key) and check against DB
    const userRef = doc(db, "users", this.id);
    try {
      const user = await getDoc(userRef);
      if (user.exists()) {
        this.response.message = "Welcome back, " + user.data()?.username;
      } else {
        this.response.message = "Key is wrong";
        this.response.error = true;
      }
    } catch (err) {
      this.response.message = "Error checking existing ID";
      this.response.error = true;
    }
  }

  async resetPassword(password: string) {
    this.password = password;
    this.createHashedPassword();
    // Overwriting the password in the DB
    const userRef = doc(db, "users", this.id);
    const data = {
      hash: this.hashedPass,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      this.response.message = "Password reset.";
    } catch (error) {
      this.response.error = true;
      this.response.message = "Error updating database.";
    }
  }

  async resetUsername(username: string) {
    this.username = username;
    // Overwriting the username in the DB
    const userRef = doc(db, "users", this.id);
    const data = {
      username: this.username,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      const user = await getDoc(userRef);
      this.response.message = "We'll now call you " + user.data()?.username;
    } catch (error) {
      this.response.error = true;
      this.response.message = "Error updating database.";
    }
  }

  createJWT() {
    if (typeof this.id === "undefined") {
      return NextResponse.json({
        message: "Failed to generate user ID",
        error: true,
      });
    }

    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || undefined;
    if (typeof jwtSecret !== "undefined") {
      const token = sign(
        {
          id: this.id,
        },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );

      const serializedToken = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      this.serializedToken = serializedToken;
    } else {
      return NextResponse.json({
        message: "JWT secret is not set",
        error: true,
      });
    }
  }

  getSerializedToken() {
    if (this.serializedToken === "") {
      return undefined;
    } else {
      return this.serializedToken;
    }
  }

  createHashedPassword() {
    let result = standardHashing(this.password);
    if (typeof result === "undefined") {
      this.response.message = "Error no salt provided";
      this.response.error = true;
      return;
    } else {
      this.hashedPass = result;
    }
  }
}
