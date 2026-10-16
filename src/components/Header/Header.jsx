"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "../LogoutButton/LogoutButton";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Header.css";

export default function Header({ user }) {
   const pathname = usePathname();
   const [openMenu, setOpenMenu] = useState(null);
   const [mobileOpen, setMobileOpen] = useState(false);
   const navRef = useRef(null);
   const headerRef = useRef(null);

   const plainLinks = [{ href: "/main", label: "Главная" }];

   const trailingLinks = [
      { href: "/main/about", label: "Разработка" },
      ...(user?.role === "admin" ?
         [{ href: "/main/admin/characters", label: "Мастерская" }]
      :  []),
   ];

   const dropdowns = [
      // {
      //    key: "rules",
      //    label: "Правила",
      //    basePath: "/main/rules",
      //    items: [
      //       { href: "/main/rules", label: "Общие сведения" },
      //       {
      //          href: "/main/rules#character-creation",
      //          label: "Создание персонажа",
      //       },
      //       { href: "/main/rules#combat", label: "Бой" },
      //    ],
      // },
      {
         key: "lor",
         label: "Лор",
         basePath: "/main/lor",
         items: [
            { href: "/main/lor", label: "Общие сведения" },
            { href: "/main/lor/magic", label: "Магия" },
            { href: "/main/lor/religion", label: "Религия" },
            { href: "/main/lor/history", label: "История" },
            { href: "/main/lor/economy", label: "Экономика" },
            { href: "/main/lor/politics", label: "Политика" },
            { href: "/main/lor/culture", label: "Культура" },
         ],
      },
      {
         key: "maps",
         label: "Карты",
         basePath: "/main/maps",
         items: [
            { href: "/main/maps", label: "Карта мира" },
            { href: "/main/maps#regions", label: "Регионы" },
            { href: "/main/maps#locations", label: "Ключевые локации" },
         ],
      },
      {
         key: "spells",
         label: "Заклинания",
         basePath: "/main/spells",
         items: [
            { href: "/main/spells", label: "Все заклинания" },
            { href: "/main/spells#schools", label: "Школы магии" },
            { href: "/main/spells#tiers", label: "Уровни/тиры" },
         ],
      },
      {
         key: "profile",
         label: "Профиль",
         basePath: "/main/profile",
         items: [
            { href: "/main/profile", label: "Лист персонажа" },
            { href: "/main/backstory", label: "Предыстория" },
         ],
      },
   ];

   function closeAll() {
      setOpenMenu(null);
      setMobileOpen(false);
   }

   useEffect(() => {
      function handleClickOutside(event) {
         if (navRef.current && !navRef.current.contains(event.target)) {
            setOpenMenu(null);
         }
         if (headerRef.current && !headerRef.current.contains(event.target)) {
            setMobileOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   useEffect(() => {
      setOpenMenu(null);
      setMobileOpen(false);
   }, [pathname]);

   return (
      <header className="header" ref={headerRef}>
         <div className="header-inner">
            <Link href="/" className="header-logo" onClick={closeAll}>
               <svg
                  className="header-logo-mark"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
               >
                  {/* закрашенные грани */}
                  <g fill="currentColor" stroke="none">
                     <path d="M16 8 23 21H9Z" />
                     <path d="M16 2V8L4 9Z" />
                     <path d="M28 9 23 21 28 23Z" />
                     <path d="M9 21 4 23 16 30Z" />
                  </g>

                  {/* контур */}
                  <g
                     stroke="currentColor"
                     strokeWidth="1.8"
                     strokeLinejoin="round"
                     strokeLinecap="round"
                  >
                     <path d="M16 2 28 9v14L16 30 4 23V9L16 2Z" />
                     <path d="M16 8 23 21H9L16 8Z" />
                     <path d="M16 8V2M16 8 4 9M16 8 28 9M9 21 4 9M9 21 4 23M9 21l7 9M23 21l5-12M23 21l5 2M23 21l-7 9" />
                  </g>
               </svg>
               <span></span>
            </Link>

            <nav
               className={`header-nav ${mobileOpen ? "open" : ""}`}
               ref={navRef}
            >
               {plainLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className={`header-link ${pathname === link.href ? "active" : ""}`}
                     onClick={closeAll}
                  >
                     {link.label}
                  </Link>
               ))}

               {dropdowns.map((menu) => {
                  const isActive = pathname === menu.basePath;
                  const isOpen = openMenu === menu.key;
                  return (
                     <div className="header-dropdown" key={menu.key}>
                        <button
                           type="button"
                           className={`header-link header-dropdown-trigger ${isActive ? "active" : ""}`}
                           onClick={() =>
                              setOpenMenu((prev) =>
                                 prev === menu.key ? null : menu.key,
                              )
                           }
                           aria-expanded={isOpen}
                        >
                           {menu.label}
                           <svg
                              className={`header-dropdown-arrow ${isOpen ? "open" : ""}`}
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                           >
                              <path
                                 d="M2 3.5L5 6.5L8 3.5"
                                 stroke="currentColor"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              />
                           </svg>
                        </button>

                        {isOpen && (
                           <div className="header-dropdown-menu">
                              {menu.items.map((item) => (
                                 <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`header-dropdown-item ${pathname === item.href ? "active" : ""}`}
                                    onClick={closeAll}
                                 >
                                    {item.label}
                                 </Link>
                              ))}
                           </div>
                        )}
                     </div>
                  );
               })}

               {trailingLinks.map((link) => (
                  <Link
                     key={link.href}
                     href={link.href}
                     className={`header-link ${pathname === link.href ? "active" : ""}`}
                     onClick={closeAll}
                  >
                     {link.label}
                  </Link>
               ))}
            </nav>

            <div className="header-actions">
               <ThemeToggle />
               <div className="header-divider" />
               <LogoutButton className="header-logout" />
               <button
                  type="button"
                  className="header-theme header-burger"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  aria-label="Меню"
                  aria-expanded={mobileOpen}
               >
                  <i className={`bi ${mobileOpen ? "bi-x-lg" : "bi-list"}`} />
               </button>
            </div>
         </div>
      </header>
   );
}
