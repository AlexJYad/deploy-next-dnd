import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";
import "./about.css";

export default async function HomePage() {
   const user = await getSession();

   if (!user) {
      redirect("/login");
   }

   return (
      <div className="news-container flex flex-col flex-1 self-center w-m-xl">
         <h4>Обновление: Beta 0.2.0</h4>
         <p>
            <em>Дата обновления:</em> <strong>16 октября 2026 года</strong>
         </p>
         <ul>
            <li>
               add spells
               <ul>
                  <li>add spell cards</li>
                  <li>add spells list</li>
                  <li>add spell creation form for the DM</li>
                  <li>add runic script</li>
               </ul>
            </li>
            <li>add hamburger menu for mobile devices</li>
            <li>add team switching</li>
            <li>
               Main page
               <ul>
                  <li>add description for guests</li>
                  <li>add dice roller</li>
                  <li>add links</li>
               </ul>
            </li>
         </ul>
         <hr />
         <h4>Обновление: Beta 0.1.2</h4>
         <p>
            <em>Дата обновления:</em> <strong>22 июля 2026 года</strong>
         </p>
         <ul>
            <li>add lore pages</li>
            <li>move gods data to database</li>
            <li>move god images to cloud storage</li>
            <li>add fallback placeholder for missing images</li>
         </ul>
         <hr />
         <h4>Обновление: Beta 0.1.1</h4>
         <p>
            <em>Дата обновления:</em> <strong>18 июля 2026 года</strong>
         </p>
         <ul>
            <li>add header with dropdown navigation</li>
            <li>implement authentication</li>
            <li>connect Supabase database</li>
            <li>port dynamic background component from old project</li>
            <li>start spell deriver feature</li>
            <li>add initial error/loading pages</li>
         </ul>
      </div>
   );
}
