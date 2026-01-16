"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, VideoIcon, Download, RotateCcw, Instagram, Type, Palette, Upload, Trash2 } from "lucide-react"
import { BarrkehLogo } from "@/components/barrkeh-logo"

const templates = {
  "product-launch": {
    name: "Product Launch",
    bgGradient: ["#1a1a2e", "#16213e"],
    accentColor: "#d4af37",
    textColor: "#ffffff",
  },
  "sale-banner": {
    name: "Sale Banner",
    bgGradient: ["#0f0f0f", "#1a1a1a"],
    accentColor: "#ff4757",
    textColor: "#ffffff",
  },
  "elegant-promo": {
    name: "Elegant Promo",
    bgGradient: ["#2d2d2d", "#1a1a1a"],
    accentColor: "#d4af37",
    textColor: "#f5f5f5",
  },
  minimalist: {
    name: "Minimalist",
    bgGradient: ["#ffffff", "#f0f0f0"],
    accentColor: "#1a1a1a",
    textColor: "#1a1a1a",
  },
  "bold-statement": {
    name: "Bold Statement",
    bgGradient: ["#000000", "#1a1a2e"],
    accentColor: "#d4af37",
    textColor: "#ffffff",
  },
  "social-story": {
    name: "Social Story",
    bgGradient: ["#1a1a2e", "#2d1b4e"],
    accentColor: "#d4af37",
    textColor: "#ffffff",
  },
}

const platformSizes = {
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)" },
  "facebook-post": { width: 1200, height: 630, label: "Facebook Post" },
  "facebook-cover": { width: 820, height: 312, label: "Facebook Cover" },
  "twitter-post": { width: 1200, height: 675, label: "Twitter/X Post" },
  "linkedin-post": { width: 1200, height: 1200, label: "LinkedIn Post" },
  "tiktok-video": { width: 1080, height: 1920, label: "TikTok (9:16)" },
  "youtube-thumbnail": { width: 1280, height: 720, label: "YouTube Thumbnail" },
}

export function GeneratorSection() {
  const [activeTab, setActiveTab] = useState("photo")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headline, setHeadline] = useState("Your Premium Content")
  const [subtext, setSubtext] = useState("Barrkeh DigiProducts")
  const [selectedTemplate, setSelectedTemplate] = useState("product-launch")
  const [selectedPlatform, setSelectedPlatform] = useState("instagram-post")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState([72])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const template = templates[selectedTemplate as keyof typeof templates]
    const size = platformSizes[selectedPlatform as keyof typeof platformSizes]

    // Set canvas size (scaled down for preview)
    const scale = 0.5
    canvas.width = size.width * scale
    canvas.height = size.height * scale

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, template.bgGradient[0])
    gradient.addColorStop(1, template.bgGradient[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw uploaded image if exists
    if (uploadedImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const aspectRatio = img.width / img.height
        let drawWidth = canvas.width * 0.6
        let drawHeight = drawWidth / aspectRatio

        if (drawHeight > canvas.height * 0.5) {
          drawHeight = canvas.height * 0.5
          drawWidth = drawHeight * aspectRatio
        }

        const x = (canvas.width - drawWidth) / 2
        const y = canvas.height * 0.15

        ctx.drawImage(img, x, y, drawWidth, drawHeight)
        drawTextAndWatermark()
      }
      img.src = uploadedImage
    } else {
      drawTextAndWatermark()
    }

    function drawTextAndWatermark() {
      if (!ctx || !canvas) return
      const template = templates[selectedTemplate as keyof typeof templates]

      // Decorative accent line
      ctx.fillStyle = template.accentColor
      ctx.fillRect(canvas.width * 0.35, canvas.height * 0.45, canvas.width * 0.3, 3 * scale)

      // Draw headline
      ctx.fillStyle = template.textColor
      ctx.font = `bold ${fontSize[0] * scale}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Text wrapping for headline
      const maxWidth = canvas.width * 0.85
      const words = headline.split(" ")
      const lines: string[] = []
      let currentLine = ""

      words.forEach((word) => {
        const testLine = currentLine + word + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== "") {
          lines.push(currentLine.trim())
          currentLine = word + " "
        } else {
          currentLine = testLine
        }
      })
      lines.push(currentLine.trim())

      const lineHeight = fontSize[0] * scale * 1.2
      const startY = uploadedImage ? canvas.height * 0.65 : canvas.height * 0.5 - (lines.length * lineHeight) / 2

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
      })

      // Draw subtext
      ctx.font = `500 ${24 * scale}px Inter, sans-serif`
      ctx.fillStyle = template.accentColor
      ctx.fillText(subtext, canvas.width / 2, startY + lines.length * lineHeight + 30 * scale)

      const watermarkY = canvas.height - 40 * scale

      // Watermark background
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      const watermarkWidth = 180 * scale
      const watermarkHeight = 30 * scale
      const watermarkX = canvas.width - watermarkWidth - 20 * scale
      ctx.fillRect(watermarkX, watermarkY - watermarkHeight / 2, watermarkWidth, watermarkHeight)

      // Watermark text
      ctx.fillStyle = template.accentColor
      ctx.font = `bold ${12 * scale}px Inter, sans-serif`
      ctx.textAlign = "right"
      ctx.fillText("BARRKEH DIGIPRODUCTS", canvas.width - 30 * scale, watermarkY + 4 * scale)

      // Small logo square
      ctx.fillStyle = template.accentColor
      ctx.fillRect(watermarkX + 5 * scale, watermarkY - 10 * scale, 20 * scale, 20 * scale)
      ctx.fillStyle = template.bgGradient[0]
      ctx.font = `bold ${14 * scale}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText("B", watermarkX + 15 * scale, watermarkY + 5 * scale)
    }
  }, [headline, subtext, selectedTemplate, selectedPlatform, uploadedImage, fontSize])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create full-size canvas for download
    const fullCanvas = document.createElement("canvas")
    const fullCtx = fullCanvas.getContext("2d")
    const size = platformSizes[selectedPlatform as keyof typeof platformSizes]

    fullCanvas.width = size.width
    fullCanvas.height = size.height

    if (!fullCtx) return

    const template = templates[selectedTemplate as keyof typeof templates]

    // Draw gradient background
    const gradient = fullCtx.createLinearGradient(0, 0, fullCanvas.width, fullCanvas.height)
    gradient.addColorStop(0, template.bgGradient[0])
    gradient.addColorStop(1, template.bgGradient[1])
    fullCtx.fillStyle = gradient
    fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height)

    // Decorative accent line
    fullCtx.fillStyle = template.accentColor
    fullCtx.fillRect(fullCanvas.width * 0.35, fullCanvas.height * 0.45, fullCanvas.width * 0.3, 6)

    // Draw headline
    fullCtx.fillStyle = template.textColor
    fullCtx.font = `bold ${fontSize[0] * 2}px Inter, sans-serif`
    fullCtx.textAlign = "center"
    fullCtx.textBaseline = "middle"

    const maxWidth = fullCanvas.width * 0.85
    const words = headline.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      const testLine = currentLine + word + " "
      const metrics = fullCtx.measureText(testLine)
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine.trim())
        currentLine = word + " "
      } else {
        currentLine = testLine
      }
    })
    lines.push(currentLine.trim())

    const lineHeight = fontSize[0] * 2 * 1.2
    const startY = fullCanvas.height * 0.5 - (lines.length * lineHeight) / 2

    lines.forEach((line, index) => {
      fullCtx.fillText(line, fullCanvas.width / 2, startY + index * lineHeight)
    })

    // Draw subtext
    fullCtx.font = `500 ${48}px Inter, sans-serif`
    fullCtx.fillStyle = template.accentColor
    fullCtx.fillText(subtext, fullCanvas.width / 2, startY + lines.length * lineHeight + 60)

    // Watermark
    const watermarkY = fullCanvas.height - 80
    fullCtx.fillStyle = "rgba(0, 0, 0, 0.6)"
    const watermarkWidth = 360
    const watermarkHeight = 60
    const watermarkX = fullCanvas.width - watermarkWidth - 40
    fullCtx.fillRect(watermarkX, watermarkY - watermarkHeight / 2, watermarkWidth, watermarkHeight)

    fullCtx.fillStyle = template.accentColor
    fullCtx.font = `bold ${24}px Inter, sans-serif`
    fullCtx.textAlign = "right"
    fullCtx.fillText("BARRKEH DIGIPRODUCTS", fullCanvas.width - 60, watermarkY + 8)

    fullCtx.fillStyle = template.accentColor
    fullCtx.fillRect(watermarkX + 10, watermarkY - 20, 40, 40)
    fullCtx.fillStyle = template.bgGradient[0]
    fullCtx.font = `bold ${28}px Inter, sans-serif`
    fullCtx.textAlign = "center"
    fullCtx.fillText("B", watermarkX + 30, watermarkY + 10)

    const link = document.createElement("a")
    link.download = `barrkeh-${selectedTemplate}-${selectedPlatform}.png`
    link.href = fullCanvas.toDataURL("image/png")
    link.click()
  }

  const resetDesign = () => {
    setHeadline("Your Premium Content")
    setSubtext("Barrkeh DigiProducts")
    setSelectedTemplate("product-launch")
    setUploadedImage(null)
    setFontSize([72])
  }

  return (
    <section id="studio" className="border-t border-border px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground md:text-4xl">
            Content Studio
          </h2>
          <p className="mt-3 text-muted-foreground">
            Create premium marketing content with the Barrkeh DigiProducts watermark
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Controls Panel */}
          <Card className="bg-card p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photo" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Photo
                </TabsTrigger>
                <TabsTrigger value="video" className="gap-2">
                  <VideoIcon className="h-4 w-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo" className="mt-6 space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-primary" />
                    Platform & Size
                  </Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(platformSizes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    Template Style
                  </Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templates).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    Headline
                  </Label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter your headline..."
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subtext</Label>
                  <Input
                    value={subtext}
                    onChange={(e) => setSubtext(e.target.value)}
                    placeholder="Enter subtext..."
                    className="bg-secondary"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <Label>Font Size: {fontSize[0]}px</Label>
                  <Slider value={fontSize} onValueChange={setFontSize} min={32} max={120} step={4} className="w-full" />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    Product Image (Optional)
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    {uploadedImage && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                        onClick={() => setUploadedImage(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Watermark Notice */}
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <BarrkehLogo size={28} />
                    <div>
                      <p className="text-sm font-medium text-foreground">Watermark Protected</p>
                      <p className="text-xs text-muted-foreground">
                        All exports include the Barrkeh DigiProducts watermark
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <VideoIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Video Creator Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Create animated marketing videos with the same premium templates and watermark protection.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={resetDesign}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download HD
              </Button>
            </div>
          </Card>

          {/* Preview Panel */}
          <Card className="flex flex-col bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Live Preview</h3>
              <span className="text-xs text-muted-foreground">
                {platformSizes[selectedPlatform as keyof typeof platformSizes]?.label}
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-secondary/30 p-4 min-h-80">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
                style={{ imageRendering: "crisp-edges" }}
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
