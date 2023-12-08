import jsSHA from "jssha";

export function standardHashing(text: string): string | undefined {
  const salt = process.env.NEXT_PUBLIC_SALT;
  if (salt) {
    const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" }).update(
      text + salt
    );
    return shaObj.getHash("HEX");
  } else {
    console.log("No salt provided");
    return;
  }
}
