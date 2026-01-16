"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Crown } from "lucide-react"
import { BarrkehLogo } from "@/components/barrkeh-logo"

const templates = [
  {
    id: 1,
    title: "Product Launch Elite",
    category: "social",
    type: "photo",
    gradient: "from-[#1a1a2e] to-[#16213e]",
    accent: "bg-primary",
    premium: true,
  },
  {
    id: 2,
    title: "Flash Sale Banner",
    category: "ads",
    type: "photo",
    gradient: "from-[#0f0f0f] to-[#1a1a1a]",
    accent: "bg-red-500",
    premium: false,
  },
  {
    id: 3,
    title: "Brand Story Vertical",
    category: "social",
    type: "video",
    gradient: "from-[#1a1a2e] to-[#2d1b4e]",
    accent: "bg-primary",
    premium: true,
  },
  {
    id: 4,
    title: "Testimonial Spotlight",
    category: "ads",
    type: "video",
    gradient: "from-[#2d2d2d] to-[#1a1a1a]",
    accent: "bg-primary",
    premium: false,
  },
  {
    id: 5,
    title: "Feature Highlight",
    category: "social",
    type: "photo",
    gradient: "from-[#000000] to-[#1a1a2e]",
    accent: "bg-primary",
    premium: true,
  },
  {
    id: 6,
    title: "Minimalist Promo",
    category: "social",
    type: "photo",
    gradient: "from-[#f5f5f5] to-[#e0e0e0]",
    accent: "bg-gray-900",
    premium: false,
  },
]

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredTemplates = templates.filter((t) => {
    if (activeFilter === "all") return true
    if (activeFilter === "photos") return t.type === "photo"
    if (activeFilter === "videos") return t.type === "video"
    return t.category === activeFilter
  })

  return (
    <section id="gallery" className="border-t border-border px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground md:text-4xl">
              Template Gallery
            </h2>
            <p className="mt-2 text-muted-foreground">Premium templates ready for your brand</p>
          </div>

          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="ads">Ads</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group relative overflow-hidden bg-card transition-all hover:border-primary/50"
            >
              {/* Template Preview */}
              <div className={`aspect-square overflow-hidden bg-gradient-to-br ${template.gradient} relative`}>
                {/* Simulated template content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className={`w-16 h-1 ${template.accent} mb-4 rounded-full`} />
                  <h3
                    className={`font-bold text-xl ${template.gradient.includes("f5f5f5") ? "text-gray-900" : "text-white"}`}
                  >
                    Sample Headline
                  </h3>
                  <p
                    className={`text-sm mt-2 ${template.gradient.includes("f5f5f5") ? "text-gray-600" : "text-gray-300"}`}
                  >
                    Barrkeh DigiProducts
                  </p>
                </div>

                {/* Watermark Preview */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 rounded px-2 py-1">
                  <BarrkehLogo size={14} />
                  <span className="text-[8px] font-bold text-primary tracking-wider">BARRKEH</span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {template.type} • {template.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" className="h-9 w-9">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-9 w-9">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              {template.premium && (
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  <Crown className="h-3 w-3" />
                  Premium
                </div>
              )}

              {template.type === "video" && (
                <div className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  Video
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="bg-transparent">
            Load More Templates
          </Button>
        </div>
      </div>
    </section>
  )
}
