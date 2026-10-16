"use client";

export default function ThemeToggle() {
   function toggle() {
      const isDark = document.documentElement.classList.toggle("dark");
      try {
         localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch {}
   }

   return (
      <button
         type="button"
         className="header-theme"
         onClick={toggle}
         aria-label="Переключить тему"
         title="Переключить тему"
      >
         <i className="bi bi-moon-fill theme-icon-moon" />
         <i className="bi bi-sun-fill theme-icon-sun" />
      </button>
   );
}
