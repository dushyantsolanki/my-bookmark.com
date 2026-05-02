import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_key_123";

export function generateAccessToken(user: any) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    ACCESS_TOKEN_SECRET
    // No expiry time
  );
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}

export async function verifyTokenEdge(token: string) {
  try {
    const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}
