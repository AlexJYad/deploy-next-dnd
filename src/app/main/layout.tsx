import Header from "@/components/Header/Header";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function MainLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await getSession();

   if (!session) {
      redirect("/login");
   }

   return (
      <>
         <Header user={session} />
         <div className="flex flex-col flex-1 items-center justify-center w-full h-full">
            <main className="flex flex-1 h-full w-full max-w-4xl flex-col items-center justify-between bg-white/80 dark:bg-black/80 sm:items-start shadow-lg shadow-gray-600 dark:shadow-gray-900 py-8 px-20">
               {children}
            </main>
         </div>
      </>
   );
}
