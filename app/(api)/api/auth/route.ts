import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { key, step } = await request.json();

  return NextResponse.json({ message: key });
}

export function stringValidation(input: string) {
  const [error, response] = checkEmptyString(input);

  if (error) {
    return response;
  } else {
    return sanitizedString(input);
  }
}

export function checkEmptyString(input: string) {
  let response;
  let error;
  // Check if the input is undefined or null
  if (input === undefined || input === null) {
    response = "Input is undefined or null";
    error = true;
  }

  // Check if the input is a string and not empty after trimming
  if (typeof input === "string" && input.trim() === "") {
    response = "Input is an empty string";
    error = true;
  }

  return [response, error];
}

export function sanitizedString(input: string) {
  // Sanitize HTML tags
  input = input.replace(/<[^>]*>/g, "");

  // Sanitize script tags
  input = input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  // Prevent SQL injection by escaping single quotes
  input = input.replace(/'/g, "''");

  return input;
}
