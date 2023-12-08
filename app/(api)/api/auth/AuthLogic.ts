import { standardHashing } from "@/app/(global-utils)/functions";
import { COOKIE_NAME } from "@/app/(global-utils)/constants";
import { db } from "@/app/(global-utils)/database/firebaseConfig";
import { serialize } from "cookie";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export class AuthLogic {
  private key = "";
  private password = "";
  private id = "";
  private hashedPass = "";
  private serializedToken = "";
  message = "";
  messCode = 0;
  error = false;

  constructor() {
    this.createId = this.createId.bind(this);
    this.checkIdExists = this.checkIdExists.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.resetUsername = this.resetUsername.bind(this);
    this.createJWT = this.createJWT.bind(this);
    this.getSerializedToken = this.getSerializedToken.bind(this);
  }

  createId(key: string) {
    this.key = key;
    let result = standardHashing(this.key);
    if (typeof result === "undefined") {
      this.message = "Error no salt provided";
      this.error = true;
      this.messCode = 1;
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
        this.message = "Welcome back, " + user.data()?.username;
        this.messCode = 4;
      } else {
        this.message = "Key is invalid";
        this.error = true;
        this.messCode = 2;
      }
    } catch (err) {
      this.message = "Network error while checking existing ID";
      this.error = true;
      this.messCode = 3;
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
      this.message = "Password reset";
      this.messCode = 5;
    } catch (error) {
      this.error = true;
      this.message = "Error updating database";
      this.messCode = 6;
    }
  }

  async resetUsername(username: string) {
    // Overwriting the username in the DB
    const userRef = doc(db, "users", this.id);
    const data = {
      username: username,
    };
    try {
      await setDoc(userRef, data, { merge: true });
      const user = await getDoc(userRef);
      this.message = user.data()?.username;
      this.messCode = 8;
    } catch (error) {
      this.error = true;
      this.message = "Error updating database.";
      this.messCode = 7;
    }
  }

  createJWT(minuteSpan: number = 60) {
    const maxAge = minuteSpan;
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || undefined;

    if (typeof jwtSecret === "undefined") {
      this.error = true;
      this.message = "JWT secret is unavailable";
      this.messCode = 9;
      return;
    }

    const token = sign(
      {
        id: this.id,
      },
      jwtSecret,
      {
        expiresIn: maxAge,
      }
    );

    const serializedToken = serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAge,
      path: "/",
    });

    this.serializedToken = serializedToken;
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
      this.message = "Error no salt provided";
      this.error = true;
      return;
    } else {
      this.hashedPass = result;
    }
  }

  errorResponseFor(context: string) {
    return NextResponse.json({
      context: context,
      error: this.error,
      messCode: this.messCode,
      message: this.message,
    });
  }
}
