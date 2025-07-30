import { verifyToken } from "../utils/jwt";

export function authenticate(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) return { status: 401, user: null };

  const user = verifyToken(token);
  if (!user) return { status: 403, user: null };

  return { status: 200, user };
}
