import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Crown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Content Studio</span>
          </div>

          <h1 className="max-w-4xl text-balance font-[family-name:var(--font-playfair)] text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Create <span className="text-primary">Premium Marketing</span> Visuals Instantly
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Professional photo and video content for your social media pages and advertising campaigns. Every asset
            includes the Barrkeh DigiProducts watermark for brand protection.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="min-h-12 gap-2 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
              Open Studio
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-12 gap-2 px-8 bg-transparent border-border hover:bg-secondary"
            >
              <Play className="h-4 w-4" />
              View Examples
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {[
              { value: "50+", label: "Premium Templates" },
              { value: "100%", label: "Free to Use" },
              { value: "Instant", label: "Download" },
              { value: "HD", label: "Quality Export" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
