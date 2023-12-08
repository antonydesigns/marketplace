import { NextResponse } from "next/server";

export class StringValidation {
  error = false;
  private message = "";
  private messCode = 0;

  constructor() {
    // to enable method destructuring
    this.check = this.check.bind(this);
    this.errorResponseFor = this.errorResponseFor.bind(this);
    this.sanitize = this.sanitize.bind(this);
  }

  check(input: string) {
    this.checkEmptyString(input);
    if (this.error) {
      return false;
    } else {
      return true;
    }
  }

  checkEmptyString(input: string) {
    if (input === undefined || input === null) {
      this.message = "Input is undefined or null";
      this.error = true;
      this.messCode = 1;
    }

    // Check if the input is a string and not empty after trimming
    if (typeof input === "string" && input.trim() === "") {
      this.message = "Input is an empty string";
      this.error = true;
      this.messCode = 2;
    }
  }

  errorResponseFor(variableName: string) {
    return NextResponse.json({
      variable: variableName,
      error: this.error,
      messCode: this.messCode,
      message: this.message,
    });
  }

  sanitize(input: string) {
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
}
