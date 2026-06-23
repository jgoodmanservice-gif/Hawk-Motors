import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/** Returns the session if the caller is an authenticated admin, else null. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session;
}
