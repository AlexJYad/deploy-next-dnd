export type AppLink = { label: string; href: string; icon: string };

export const PUBLIC_LINKS: AppLink[] = [
   {
      label: "Анонс",
      href: "https://yad-spellbook.netlify.app/static/media/announcement.073932ca6cdd0eecdfd1.png",
      icon: "📜",
   },
];

export const PLAYER_LINKS: AppLink[] = [
   {
      label: "Файлы игры",
      href: "https://drive.google.com/drive/folders/1CNGQq8Rxdielqe_IJ5XP_kt_q3XPxNDb",
      icon: "📂",
   },
   {
      label: "Атмосферная музыка",
      href: "https://w2g.tv/?r=16dtz6alo4ag9jdxby",
      icon: "🎶",
   },
   {
      label: "Dice roll",
      href: "https://rolldicewithfriends.com/rooms/blackandwight",
      icon: "🎲",
   },
   {
      label: "Dating App",
      href: "https://docs.google.com/spreadsheets/d/14M-Oa3vs3zgYOY1gd_GiPmWjKFX5l1TY3aZdPUdcfDM/edit?usp=drive_link",
      icon: "📅",
   },
];

export const MASTER_LINKS: AppLink[] = [
   {
      label: "Генератор городов",
      href: "https://watabou.github.io/city-generator/",
      icon: "🏙️",
   },
   {
      label: "Генератор деревень",
      href: "https://watabou.github.io/village-generator/",
      icon: "🏘️",
   },
   {
      label: "Генератор пещер",
      href: "https://watabou.github.io/cave-generator/",
      icon: "🕳️",
   },
   { label: "Генератор добычи", href: "https://dnd.su/loot/", icon: "💰" },
];
