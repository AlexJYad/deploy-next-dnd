export function InYan({ className }: { className?: string }) {
   return (
      <svg
         viewBox="0 0 24 24"
         width="42"
         height="42"
         className={className}
         fill="none"
         stroke="currentColor"
         strokeWidth="1.5"
      >
         <circle cx="12" cy="12" r="9" />

         <path
            d="M12 3
               A4.5 4.5 0 0 1 12 12
               A4.5 4.5 0 0 0 12 21
               A9 9 0 0 0 12 3Z"
            fill="currentColor"
            stroke="none"
         />
      </svg>
   );
}
