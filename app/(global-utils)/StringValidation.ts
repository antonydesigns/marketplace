export class StringValidation {
  private input = "";
  private error = false;
  private message = "";
  private messCode = 0;

  hasError() {
    return this.error;
  }

  get _messCode() {
    return this.messCode;
  }

  get _error() {
    return this.error;
  }

  get _message() {
    return this.message;
  }

  check(input: string) {
    this.input = input;
    this.checkEmptyString();
  }

  checkEmptyString() {
    let input = this.input;
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

  sanitized() {
    let input = this.input;
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
