import { AuthLogic } from "@/app/(api)/api/auth/AuthLogic";
import { standardHashing } from "@/app/(global-utils)/functions";
import { StringValidation } from "@/app/(global-utils)/input-safety/StringValidation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // console.log(standardHashing("123"));

  let { key, password, username, step } = await request.json();

  const validation = new StringValidation();
  const { validate, sanitize } = validation;

  const authLogic = new AuthLogic();
  const {
    createId,
    checkIdExists,
    resetPassword,
    resetUsername,
    createJWT,
    getSerializedToken,
  } = authLogic;

  if (step === 1) {
    // Check validaity of invite code
    validate(key);
    if (validation.error) return validation.errorResponseFor("key");

    createId(key);
    if (authLogic.error) return authLogic.errorResponseFor("createID");

    await checkIdExists();
    if (authLogic.error && authLogic.messCode === 2)
      return authLogic.errorResponseFor("invalid key");
    if (authLogic.error && authLogic.messCode === 3)
      return authLogic.errorResponseFor("network error");

    return NextResponse.json({
      messcode: authLogic.messCode,
      message: authLogic.message,
    });
  }

  if (step === 2) {
    // Reset the password
    validate(password);
    if (validation.error) return validation.errorResponseFor("password");
    validate(key);
    if (validation.error) return validation.errorResponseFor("key");

    createId(key);
    if (authLogic.error) return authLogic.errorResponseFor("createID");

    await resetPassword(password);
    if (authLogic.error) return authLogic.errorResponseFor("password");

    return NextResponse.json({
      messcode: authLogic.messCode,
      message: authLogic.message,
    });
  }

  if (step === 3) {
    // Reset the username
    validate(username);
    if (validation.error) return validation.errorResponseFor("username");
    username = sanitize(username);
    validate(key);
    if (validation.error) return validation.errorResponseFor("key");

    createId(key);
    if (authLogic.error) return authLogic.errorResponseFor("createID");

    await resetUsername(username);
    if (authLogic.error) return authLogic.errorResponseFor("username");

    return NextResponse.json({
      messcode: authLogic.messCode,
      message: authLogic.message,
    });
  }

  if (step === 4) {
    // Create JWT and store it in the cookie
    validate(key);
    if (validation.error) return validation.errorResponseFor("key");

    createId(key);
    if (authLogic.error) return authLogic.errorResponseFor("createID");

    createJWT();
    if (authLogic.error) return authLogic.errorResponseFor("createJWT");

    return NextResponse.json({
      messcode: authLogic.messCode,
      message: authLogic.message,
    });
  }
}
