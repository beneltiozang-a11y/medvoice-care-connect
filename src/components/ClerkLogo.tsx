/**
 * Clerk logo mark — a single continuous fluid curve suggesting voice/sound,
 * inspired by the Vocca AI aesthetic. Pure stroke, no fills.
 */
export function ClerkLogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 20C6 20 9 8 14 8C19 8 13 24 18 24C23 24 26 12 26 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClerkLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ClerkLogoMark className="h-6 w-6 text-[#0070C9]" />
      <span
        className="text-[20px] font-semibold tracking-tight"
        style={{ color: "#1A2B3C", fontFamily: "'Inter', sans-serif" }}
      >
        Clerk
      </span>
    </div>
  );
}
