import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

export async function requireAdmin() {
   const user = await getSession();
   if (!user) redirect("/login");
   if (user.role !== "admin") redirect("/");
   return user;
}
