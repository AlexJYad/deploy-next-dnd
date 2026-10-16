"use client";

import { useTransition } from "react";
import { deleteSpell } from "@/app/main/admin/spells/actions";

export default function DeleteSpellButton({
   id,
   name,
}: {
   id: string;
   name: string;
}) {
   const [pending, startTransition] = useTransition();

   return (
      <button
         type="button"
         disabled={pending}
         className="sf-btn sf-btn--danger"
         onClick={() => {
            if (!confirm(`Удалить «${name}»? Оно пропадёт и у всех игроков.`))
               return;
            startTransition(async () => {
               const res = await deleteSpell(id);
               if (res.error) alert(res.error);
            });
         }}
      >
         Удалить
      </button>
   );
}
