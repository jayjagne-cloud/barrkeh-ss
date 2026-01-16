import Image from "next/image"

const LOGO_URL = "/images/barrkeh-logo.png"

export function BarrkehLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <Image
      src={LOGO_URL || "/placeholder.svg"}
      alt="Barrkeh DigiProducts Logo"
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  )
}

// Watermark version for generated content
export function BarrkehWatermark({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-2 opacity-90">
      <BarrkehLogo size={24} />
      <span
        className={`text-xs font-semibold tracking-wider uppercase ${variant === "dark" ? "text-white" : "text-foreground"}`}
      >
        Barrkeh DigiProducts
      </span>
    </div>
  )
}

// Export the logo URL for canvas rendering
export const BARRKEH_LOGO_URL = LOGO_URL
