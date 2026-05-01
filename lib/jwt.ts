import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret_key_123";

export function generateAccessToken(user: any) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    ACCESS_TOKEN_SECRET
    // No expiresIn means it won't expire
  );
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
}
