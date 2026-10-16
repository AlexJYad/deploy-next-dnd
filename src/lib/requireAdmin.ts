import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

export async function requireAdmin() {
   const user = await getSession();
   if (!user) redirect("/auth");
   if (user.role !== "admin") redirect("/main/profile");
   return user;
}
