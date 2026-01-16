"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ImageIcon,
  Download,
  RotateCcw,
  Type,
  Palette,
  Upload,
  Trash2,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  Loader2,
  Wand2,
  Bot,
} from "lucide-react"
import { BARRKEH_LOGO_URL } from "@/components/barrkeh-logo"

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
  "soft-spiritual": {
    name: "Soft Spiritual",
    bgGradient: ["#1a1a2e", "#2d1b4e"],
    accentColor: "#d4af37",
    textColor: "#ffffff",
  },
}

const platformSizes = {
  "etsy-listing": { width: 2000, height: 2000, label: "Etsy Listing (1:1)" },
  "etsy-thumbnail": { width: 570, height: 456, label: "Etsy Thumbnail" },
  "instagram-post": { width: 1080, height: 1080, label: "Instagram Post (1:1)" },
  "instagram-story": { width: 1080, height: 1920, label: "Instagram Story (9:16)" },
  "instagram-carousel": { width: 1080, height: 1350, label: "Instagram Carousel (4:5)" },
  "pinterest-pin": { width: 1000, height: 1500, label: "Pinterest Pin (2:3)" },
  "pinterest-idea": { width: 1080, height: 1920, label: "Pinterest Idea Pin (9:16)" },
  "facebook-post": { width: 1200, height: 630, label: "Facebook Post" },
  "facebook-cover": { width: 820, height: 312, label: "Facebook Cover" },
  "tiktok-video": { width: 1080, height: 1920, label: "TikTok (9:16)" },
  "youtube-thumbnail": { width: 1280, height: 720, label: "YouTube Thumbnail" },
}

const deviceFrames = {
  none: { name: "No Frame", padding: 0 },
  ipad: { name: "iPad Frame", padding: 40 },
  iphone: { name: "iPhone Frame", padding: 30 },
  macbook: { name: "MacBook Frame", padding: 50 },
}

const aiStylePresets = [
  {
    value: "product-photography",
    label: "Product Photography",
    prompt: "professional product photography, studio lighting, clean background",
  },
  { value: "lifestyle", label: "Lifestyle Shot", prompt: "lifestyle photography, natural lighting, cozy atmosphere" },
  { value: "minimalist", label: "Minimalist", prompt: "minimalist design, clean lines, negative space, elegant" },
  { value: "luxury", label: "Luxury & Premium", prompt: "luxury aesthetic, gold accents, premium feel, sophisticated" },
  { value: "vibrant", label: "Vibrant & Bold", prompt: "vibrant colors, bold design, eye-catching, energetic" },
  { value: "soft-aesthetic", label: "Soft Aesthetic", prompt: "soft pastel colors, dreamy, ethereal, gentle lighting" },
  { value: "dark-moody", label: "Dark & Moody", prompt: "dark background, dramatic lighting, moody atmosphere" },
  { value: "flat-lay", label: "Flat Lay", prompt: "flat lay photography, organized arrangement, top-down view" },
]

export default function MockupStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [headline, setHeadline] = useState("Your Premium Product")
  const [subtext, setSubtext] = useState("Barrkeh DigiProducts")
  const [selectedTemplate, setSelectedTemplate] = useState("product-launch")
  const [selectedPlatform, setSelectedPlatform] = useState("instagram-post")
  const [selectedFrame, setSelectedFrame] = useState("none")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState([72])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  const [aiPrompt, setAiPrompt] = useState("")
  const [aiStyle, setAiStyle] = useState("product-photography")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Array<{ base64: string; mediaType: string }>>([])
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setLogoImage(img)
    img.src = BARRKEH_LOGO_URL
  }, [])

  const generateAIImage = async () => {
    if (!aiPrompt.trim()) return

    setIsGeneratingAI(true)
    setAiError(null)

    const stylePreset = aiStylePresets.find((s) => s.value === aiStyle)
    const fullPrompt = `${aiPrompt}. ${stylePreset?.prompt || ""}`

    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: aiStyle,
          size: platformSizes[selectedPlatform as keyof typeof platformSizes],
        }),
      })

      const data = await response.json()

      if (data.success && data.images.length > 0) {
        setGeneratedImages(data.images)
        // Auto-select the first generated image
        const firstImage = data.images[0]
        setUploadedImage(`data:${firstImage.mediaType};base64,${firstImage.base64}`)
      } else {
        setAiError(data.error || "Failed to generate image")
      }
    } catch (error) {
      setAiError("Failed to connect to AI service")
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const template = templates[selectedTemplate as keyof typeof templates]
    const size = platformSizes[selectedPlatform as keyof typeof platformSizes]
    const frame = deviceFrames[selectedFrame as keyof typeof deviceFrames]

    const scale = 0.4
    canvas.width = size.width * scale
    canvas.height = size.height * scale

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, template.bgGradient[0])
    gradient.addColorStop(1, template.bgGradient[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (uploadedImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const padding = frame.padding * scale
        const maxWidth = canvas.width - padding * 2
        const maxHeight = canvas.height * 0.5

        const aspectRatio = img.width / img.height
        let drawWidth = maxWidth * 0.8
        let drawHeight = drawWidth / aspectRatio

        if (drawHeight > maxHeight) {
          drawHeight = maxHeight
          drawWidth = drawHeight * aspectRatio
        }

        const x = (canvas.width - drawWidth) / 2
        const y = canvas.height * 0.12 + padding

        if (selectedFrame !== "none") {
          ctx.fillStyle = "#1a1a1a"
          const frameRadius = 12 * scale
          const framePadding = 8 * scale
          ctx.beginPath()
          ctx.roundRect(
            x - framePadding,
            y - framePadding,
            drawWidth + framePadding * 2,
            drawHeight + framePadding * 2,
            frameRadius,
          )
          ctx.fill()
        }

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

      ctx.fillStyle = template.accentColor
      ctx.fillRect(canvas.width * 0.35, canvas.height * 0.48, canvas.width * 0.3, 3 * scale)

      ctx.fillStyle = template.textColor
      ctx.font = `bold ${fontSize[0] * scale}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

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
      const startY = uploadedImage ? canvas.height * 0.68 : canvas.height * 0.5 - (lines.length * lineHeight) / 2

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
      })

      ctx.font = `500 ${24 * scale}px Inter, sans-serif`
      ctx.fillStyle = template.accentColor
      ctx.fillText(subtext, canvas.width / 2, startY + lines.length * lineHeight + 30 * scale)

      const watermarkY = canvas.height - 40 * scale
      const logoSize = 28 * scale
      const watermarkPadding = 12 * scale
      const textWidth = 140 * scale

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      const watermarkWidth = logoSize + textWidth + watermarkPadding * 3
      const watermarkHeight = logoSize + watermarkPadding
      const watermarkX = canvas.width - watermarkWidth - 15 * scale

      ctx.beginPath()
      ctx.roundRect(watermarkX, watermarkY - watermarkHeight / 2, watermarkWidth, watermarkHeight, 6 * scale)
      ctx.fill()

      if (logoImage) {
        ctx.drawImage(logoImage, watermarkX + watermarkPadding, watermarkY - logoSize / 2, logoSize, logoSize)
      }

      ctx.fillStyle = "#d4af37"
      ctx.font = `bold ${10 * scale}px Inter, sans-serif`
      ctx.textAlign = "left"
      ctx.fillText("BARRKEH", watermarkX + logoSize + watermarkPadding * 2, watermarkY - 4 * scale)
      ctx.font = `500 ${8 * scale}px Inter, sans-serif`
      ctx.fillStyle = "#ffffff"
      ctx.fillText("DIGIPRODUCTS", watermarkX + logoSize + watermarkPadding * 2, watermarkY + 8 * scale)
    }
  }, [headline, subtext, selectedTemplate, selectedPlatform, selectedFrame, uploadedImage, fontSize, logoImage])

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

    const fullCanvas = document.createElement("canvas")
    const fullCtx = fullCanvas.getContext("2d")
    const size = platformSizes[selectedPlatform as keyof typeof platformSizes]

    fullCanvas.width = size.width
    fullCanvas.height = size.height

    if (!fullCtx) return

    const template = templates[selectedTemplate as keyof typeof templates]

    const gradient = fullCtx.createLinearGradient(0, 0, fullCanvas.width, fullCanvas.height)
    gradient.addColorStop(0, template.bgGradient[0])
    gradient.addColorStop(1, template.bgGradient[1])
    fullCtx.fillStyle = gradient
    fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height)

    if (uploadedImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const frame = deviceFrames[selectedFrame as keyof typeof deviceFrames]
        const padding = frame.padding
        const maxWidth = fullCanvas.width - padding * 2
        const maxHeight = fullCanvas.height * 0.5

        const aspectRatio = img.width / img.height
        let drawWidth = maxWidth * 0.8
        let drawHeight = drawWidth / aspectRatio

        if (drawHeight > maxHeight) {
          drawHeight = maxHeight
          drawWidth = drawHeight * aspectRatio
        }

        const x = (fullCanvas.width - drawWidth) / 2
        const y = fullCanvas.height * 0.12 + padding

        if (selectedFrame !== "none") {
          fullCtx.fillStyle = "#1a1a1a"
          fullCtx.beginPath()
          fullCtx.roundRect(x - 16, y - 16, drawWidth + 32, drawHeight + 32, 24)
          fullCtx.fill()
        }

        fullCtx.drawImage(img, x, y, drawWidth, drawHeight)
        drawFullResTextAndWatermark()
        downloadCanvas()
      }
      img.src = uploadedImage
    } else {
      drawFullResTextAndWatermark()
      downloadCanvas()
    }

    function drawFullResTextAndWatermark() {
      if (!fullCtx) return

      fullCtx.fillStyle = template.accentColor
      fullCtx.fillRect(fullCanvas.width * 0.35, fullCanvas.height * 0.48, fullCanvas.width * 0.3, 6)

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
      const startY = uploadedImage
        ? fullCanvas.height * 0.68
        : fullCanvas.height * 0.5 - (lines.length * lineHeight) / 2

      lines.forEach((line, index) => {
        fullCtx.fillText(line, fullCanvas.width / 2, startY + index * lineHeight)
      })

      fullCtx.font = `500 ${48}px Inter, sans-serif`
      fullCtx.fillStyle = template.accentColor
      fullCtx.fillText(subtext, fullCanvas.width / 2, startY + lines.length * lineHeight + 60)

      const watermarkY = fullCanvas.height - 80
      const logoSize = 56
      const watermarkPadding = 24
      const textWidth = 280

      fullCtx.fillStyle = "rgba(0, 0, 0, 0.7)"
      const watermarkWidth = logoSize + textWidth + watermarkPadding * 3
      const watermarkHeight = logoSize + watermarkPadding
      const watermarkX = fullCanvas.width - watermarkWidth - 30

      fullCtx.beginPath()
      fullCtx.roundRect(watermarkX, watermarkY - watermarkHeight / 2, watermarkWidth, watermarkHeight, 12)
      fullCtx.fill()

      if (logoImage) {
        fullCtx.drawImage(logoImage, watermarkX + watermarkPadding, watermarkY - logoSize / 2, logoSize, logoSize)
      }

      fullCtx.fillStyle = "#d4af37"
      fullCtx.font = `bold ${20}px Inter, sans-serif`
      fullCtx.textAlign = "left"
      fullCtx.fillText("BARRKEH", watermarkX + logoSize + watermarkPadding * 2, watermarkY - 8)
      fullCtx.font = `500 ${16}px Inter, sans-serif`
      fullCtx.fillStyle = "#ffffff"
      fullCtx.fillText("DIGIPRODUCTS", watermarkX + logoSize + watermarkPadding * 2, watermarkY + 16)
    }

    function downloadCanvas() {
      const link = document.createElement("a")
      link.download = `barrkeh-${selectedTemplate}-${selectedPlatform}.png`
      link.href = fullCanvas.toDataURL("image/png")
      link.click()
    }
  }

  const resetDesign = () => {
    setHeadline("Your Premium Product")
    setSubtext("Barrkeh DigiProducts")
    setSelectedTemplate("product-launch")
    setSelectedFrame("none")
    setUploadedImage(null)
    setFontSize([72])
    setAiPrompt("")
    setGeneratedImages([])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground flex items-center gap-3">
            AI Photo Studio
            <Badge variant="secondary" className="text-xs gap-1">
              <Bot className="h-3 w-3" />
              AI Powered
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate stunning product images with AI or upload your own screenshots.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Design Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="ai-generate">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ai-generate" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span className="hidden sm:inline">AI</span>
                </TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="ai-generate" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    Describe Your Image
                  </Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A digital planner displayed on an iPad with coffee and flowers in the background..."
                    className="bg-secondary min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image Style</Label>
                  <Select value={aiStyle} onValueChange={setAiStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiStylePresets.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateAIImage}
                  disabled={!aiPrompt.trim() || isGeneratingAI}
                  className="w-full gap-2 bg-primary text-primary-foreground"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Image
                    </>
                  )}
                </Button>

                {aiError && <p className="text-sm text-red-500">{aiError}</p>}

                {/* Generated images gallery */}
                {generatedImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Generated Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedImages.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setUploadedImage(`data:${img.mediaType};base64,${img.base64}`)}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                        >
                          <img
                            src={`data:${img.mediaType};base64,${img.base64}`}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Quick Prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Digital planner on iPad",
                      "Product flat lay with flowers",
                      "Minimalist desk setup",
                      "Cozy workspace aesthetic",
                    ].map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => setAiPrompt(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-4 space-y-4">
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

                <div className="space-y-3">
                  <Label>Font Size: {fontSize[0]}px</Label>
                  <Slider value={fontSize} onValueChange={setFontSize} min={32} max={120} step={4} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    Or Upload Screenshot
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
                      Upload Screenshot
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
              </TabsContent>

              <TabsContent value="style" className="mt-4 space-y-4">
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

                <div className="space-y-2">
                  <Label>Device Frame</Label>
                  <Select value={selectedFrame} onValueChange={setSelectedFrame}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(deviceFrames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            {key === "ipad" && <Tablet className="h-4 w-4" />}
                            {key === "iphone" && <Smartphone className="h-4 w-4" />}
                            {key === "macbook" && <Monitor className="h-4 w-4" />}
                            {value.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="export" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Platform & Size</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etsy-listing">Etsy Listing (1:1)</SelectItem>
                      <SelectItem value="etsy-thumbnail">Etsy Thumbnail</SelectItem>
                      <SelectItem value="instagram-post">Instagram Post (1:1)</SelectItem>
                      <SelectItem value="instagram-story">Instagram Story (9:16)</SelectItem>
                      <SelectItem value="instagram-carousel">Instagram Carousel (4:5)</SelectItem>
                      <SelectItem value="pinterest-pin">Pinterest Pin (2:3)</SelectItem>
                      <SelectItem value="pinterest-idea">Pinterest Idea Pin (9:16)</SelectItem>
                      <SelectItem value="facebook-post">Facebook Post</SelectItem>
                      <SelectItem value="facebook-cover">Facebook Cover</SelectItem>
                      <SelectItem value="tiktok-video">TikTok (9:16)</SelectItem>
                      <SelectItem value="youtube-thumbnail">YouTube Thumbnail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1 gap-2 bg-primary text-primary-foreground">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={resetDesign} className="bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Preview
              <Badge variant="outline" className="ml-auto text-xs">
                {platformSizes[selectedPlatform as keyof typeof platformSizes].label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <canvas ref={canvasRef} className="rounded-lg border border-border max-w-full" />
          </CardContent>
        </Card>
      </div>

      {/* AI Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Image Generation Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>Be specific with your descriptions - include colors, objects, lighting, and mood</li>
            <li>Mention the product type (planner, notebook, template) for better results</li>
            <li>Include environment details like "on a marble desk" or "with coffee cup"</li>
            <li>Try different style presets to find the perfect aesthetic for your brand</li>
            <li>Generated images can be combined with your templates and text overlays</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
