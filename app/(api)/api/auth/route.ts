import { AuthLogic } from "@/app/(api)/api/auth/AuthLogic";
import { COOKIE_NAME } from "@/app/(global-utils)/constants";
import { standardHashing } from "@/app/(global-utils)/functions";
import { StringValidation } from "@/app/(global-utils)/input-safety/StringValidation";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "v8";

export async function POST(request: NextRequest) {
  // console.log(standardHashing("123"));

  let { key, password, step, context } = await request.json();

  const validation = new StringValidation();
  const { validate, sanitize } = validation;

  const authLogic = new AuthLogic();
  const {
    createId,
    checkIdExists,
    resetPassword,
    createJWT,
    getSerializedToken,
    getID,
    verifyJWT,
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

  if (step === 4) {
    // Create JWT and store it in the cookie
    // Store the ID into localstorage so user don't have to re-enter the secret key
    validate(key);
    if (validation.error) return validation.errorResponseFor("key");

    createId(key);
    if (authLogic.error) return authLogic.errorResponseFor("createID");

    createJWT();
    if (authLogic.error) return authLogic.errorResponseFor("createJWT");

    const token = getSerializedToken();
    const id = getID();

    return new NextResponse(
      JSON.stringify({
        message: "JWT token generated",
        messCode: 10,
        saveID: id,
      }),
      {
        status: 200,
        headers: { "Set-Cookie": token },
      }
    );
  }

  if (context === "verifyJWT") {
    verifyJWT();
    if (authLogic.error && authLogic.messCode === 9)
      return authLogic.errorResponseFor("JWT secret missing");
    if (authLogic.error && authLogic.messCode === 11)
      return authLogic.errorResponseFor("JWT not exist");
    if (authLogic.error && authLogic.messCode === 13)
      return authLogic.errorResponseFor("JWT tempered");

    return NextResponse.json({
      messcode: authLogic.messCode,
      message: authLogic.message,
    });
  }
}
