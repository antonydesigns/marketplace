import { NextResponse } from "next/server";

export class StringValidation {
  error = false;
  message = "";
  messCode = 0;

  constructor() {
    // to enable method destructuring
    this.validate = this.validate.bind(this);
    this.errorResponseFor = this.errorResponseFor.bind(this);
    this.sanitize = this.sanitize.bind(this);
  }

  validate(input: string) {
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

  errorResponseFor(context: string) {
    return NextResponse.json({
      context: context,
      error: this.error,
      messCode: this.messCode,
      message: this.message,
    });
  }
}
