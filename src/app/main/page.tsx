import { getSession } from "@/lib/getSession";
import { getCharacter } from "@/lib/getCharacter";
import { redirect } from "next/navigation";
import LinkCard from "@/components/LinkCard/LinkCard";
import { PUBLIC_LINKS, PLAYER_LINKS, MASTER_LINKS } from "@/data/links";
import D20Roller from "@/components/D20Roller/D20Roller";
import { InYan } from "@/components/icons/InYan";

export default async function HomePage() {
   const user = await getSession();
   if (!user) redirect("/login");

   const character = await getCharacter(user);
   const isPlayer = user.role !== "guest";
   const isAdmin = user.role === "admin";
   const isGuest = user.role === "guest";

   return (
      <div className="flex flex-col flex-1 items-center w-full gap-8 p-4">
         <header className="text-center">
            <InYan className="main-icon" />
            <h1 className="text-3xl">Black And White</h1>
            <p>Добро пожаловать, {character?.name ?? user.name}!</p>
         </header>

         <D20Roller />

         <section className="w-full max-w-3xl">
            {isGuest && (
               <>
                  <h2 className="mb-3 text-xl">О кампании</h2>
                  <p className="mb-4">
                     Black And White — настольная ролевая кампания по Dungeons &
                     Dragons, действие которой разворачивается в мире,
                     разделённом на две стороны: Свет и Тьму. Два начала, два
                     взгляда на мир и две силы, чьё противостояние определяет
                     судьбы целых народов.
                  </p>
                  <p className="mb-4">
                     За пределами привычных легенд скрываются забытые тайны,
                     древние конфликты и истории тех, кто оказался между двумя
                     полюсами. Здесь каждое решение может изменить ход событий,
                     а поступки героев способны повлиять не только на их
                     собственные судьбы, но и на будущее всего мира.
                  </p>
                  <p className="mb-4">
                     Этот сайт — собрание материалов кампании, созданное для
                     игроков и мастера. Здесь можно найти правила, карты,
                     описание мира и его обитателей, историю ключевых событий, а
                     также листы персонажей и другие полезные материалы,
                     необходимые для игры.
                  </p>
                  <p>
                     Добро пожаловать в Black And White. Здесь нет гарантии, что
                     свет означает добро, а тьма — зло. Истина может оказаться
                     сложнее, чем кажется на первый взгляд, и только ваши
                     решения определят, какую историю вы оставите после себя.
                  </p>
               </>
            )}
            <h2 className="mb-3 text-xl">Основное</h2>
            <div className="card-grid">
               {PUBLIC_LINKS.map((l) => (
                  <LinkCard key={l.href} {...l} />
               ))}
            </div>
         </section>

         {isPlayer && (
            <section className="w-full max-w-3xl">
               <h2 className="mb-3 text-xl">Материалы игры</h2>
               <div className="card-grid">
                  {PLAYER_LINKS.map((l) => (
                     <LinkCard key={l.href} {...l} />
                  ))}
               </div>
            </section>
         )}

         {isAdmin && (
            <section className="w-full max-w-3xl">
               <h2 className="mb-3 text-xl">Мастерская</h2>
               <div className="card-grid">
                  {MASTER_LINKS.map((l) => (
                     <LinkCard key={l.href} {...l} />
                  ))}
               </div>
            </section>
         )}
      </div>
   );
}
