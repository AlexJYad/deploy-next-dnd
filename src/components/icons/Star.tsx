export function StarIcon({ className }: { className?: string }) {
   return (
      <svg
         viewBox="0 0 24 24"
         width="16"
         height="16"
         className={className}
         fill="currentColor"
      >
         <path d="M12 0 C13 8 15 10.5 23 12 C15 13.5 13 16 12 24 C11 16 9 13.5 1 12 C9 10.5 11 8 12 0 Z" />
      </svg>
   );
}
