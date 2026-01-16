"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  Type,
  Play,
  Trash2,
  Plus,
  Download,
  GripVertical,
  Pause,
  Sparkles,
  Bot,
  Loader2,
  Wand2,
  Copy,
  Check,
  FileText,
} from "lucide-react"
import { BARRKEH_LOGO_URL } from "@/components/barrkeh-logo"

interface Slide {
  id: string
  imageUrl: string
  text: string
  textPosition: "top" | "center" | "bottom"
  duration: number
}

interface AIVideoScript {
  title: string
  hook: string
  scenes: Array<{
    timestamp: string
    visual: string
    textOverlay: string
    voiceover: string
  }>
  cta: string
  totalDuration: string
}

const textAnimations = [
  { value: "fade", label: "Fade In" },
  { value: "slide-up", label: "Slide Up" },
  { value: "slide-down", label: "Slide Down" },
  { value: "zoom", label: "Zoom In" },
]

const videoTypes = [
  { value: "product-showcase", label: "Product Showcase", description: "Highlight your product features" },
  { value: "testimonial", label: "Customer Testimonial", description: "Social proof video" },
  { value: "tutorial", label: "Quick Tutorial", description: "How-to or walkthrough" },
  { value: "behind-scenes", label: "Behind the Scenes", description: "Show your process" },
  { value: "announcement", label: "Announcement", description: "New launch or update" },
  { value: "trending", label: "Trending Format", description: "Viral-style content" },
]

export default function VideoBuilderPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [textAnimation, setTextAnimation] = useState("fade")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  // AI State
  const [aiProductName, setAiProductName] = useState("")
  const [aiVideoType, setAiVideoType] = useState("product-showcase")
  const [aiAdditionalContext, setAiAdditionalContext] = useState("")
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [generatedScript, setGeneratedScript] = useState<AIVideoScript | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setLogoImage(img)
    img.src = BARRKEH_LOGO_URL
  }, [])

  const generateAIScript = async () => {
    if (!aiProductName.trim()) return

    setIsGeneratingScript(true)

    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video-script",
          context: `Product: ${aiProductName}
Video Type: ${videoTypes.find((v) => v.value === aiVideoType)?.label}
Additional Context: ${aiAdditionalContext}

Generate a detailed video script with:
1. A catchy title
2. An attention-grabbing hook (first 3 seconds)
3. 5-6 scenes with timestamps, visual descriptions, text overlays, and voiceover suggestions
4. A strong call-to-action
5. Total duration recommendation

Format the response as a structured script that can be easily followed when creating the video.`,
          messages: [
            {
              id: "1",
              role: "user",
              content: `Create a ${videoTypes.find((v) => v.value === aiVideoType)?.label} video script for ${aiProductName}. ${aiAdditionalContext}`,
            },
          ],
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullText += decoder.decode(value)
        }
      }

      // Parse the AI response into a structured format
      const script: AIVideoScript = {
        title: `${aiProductName} - ${videoTypes.find((v) => v.value === aiVideoType)?.label}`,
        hook: extractSection(fullText, "hook") || "Stop scrolling - this changes everything!",
        scenes: parseScenes(fullText),
        cta: extractSection(fullText, "cta") || "Link in bio - grab yours now!",
        totalDuration: "15-30 seconds",
      }

      setGeneratedScript(script)

      // Auto-generate slide text overlays from the script
      if (slides.length > 0 && script.scenes.length > 0) {
        const updatedSlides = slides.map((slide, index) => ({
          ...slide,
          text: script.scenes[index]?.textOverlay || slide.text,
        }))
        setSlides(updatedSlides)
      }
    } catch (error) {
      console.error("Error generating script:", error)
    } finally {
      setIsGeneratingScript(false)
    }
  }

  const extractSection = (text: string, section: string): string => {
    const patterns: Record<string, RegExp> = {
      hook: /hook[:\s]*(.+?)(?=\n|scene|$)/i,
      cta: /(?:cta|call.to.action)[:\s]*(.+?)(?=\n|$)/i,
    }
    const match = text.match(patterns[section])
    return match ? match[1].trim() : ""
  }

  const parseScenes = (
    text: string,
  ): Array<{ timestamp: string; visual: string; textOverlay: string; voiceover: string }> => {
    const scenes = []
    const scenePattern = /scene\s*(\d+)[:\s]*(.+?)(?=scene\s*\d+|cta|call|$)/gi
    let match

    while ((match = scenePattern.exec(text)) !== null) {
      scenes.push({
        timestamp: `${(Number.parseInt(match[1]) - 1) * 5}-${Number.parseInt(match[1]) * 5}s`,
        visual: match[2].substring(0, 100),
        textOverlay: match[2].substring(0, 50),
        voiceover: match[2],
      })
    }

    // Default scenes if parsing fails
    if (scenes.length === 0) {
      return [
        { timestamp: "0-3s", visual: "Hook with attention grabber", textOverlay: "Stop scrolling!", voiceover: "" },
        { timestamp: "3-8s", visual: "Show the problem", textOverlay: "Struggling with...", voiceover: "" },
        { timestamp: "8-15s", visual: "Introduce solution", textOverlay: "Introducing...", voiceover: "" },
        { timestamp: "15-22s", visual: "Feature highlights", textOverlay: "Key benefits", voiceover: "" },
        { timestamp: "22-28s", visual: "Social proof", textOverlay: "Join 1000+ customers", voiceover: "" },
        { timestamp: "28-30s", visual: "Call to action", textOverlay: "Link in bio!", voiceover: "" },
      ]
    }

    return scenes
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const applySceneToSlide = (sceneIndex: number) => {
    if (!generatedScript || slides.length === 0) return

    const scene = generatedScript.scenes[sceneIndex]
    if (scene && slides[currentSlideIndex]) {
      updateSlide(slides[currentSlideIndex].id, { text: scene.textOverlay })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newSlide: Slide = {
          id: Math.random().toString(36).substring(2, 15),
          imageUrl: event.target?.result as string,
          text: "",
          textPosition: "bottom",
          duration: 3000,
        }
        setSlides((prev) => [...prev, newSlide])
      }
      reader.readAsDataURL(file)
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const removeSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id))
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, slides.length - 2))
    }
  }

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || slides.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const slide = slides[currentSlideIndex]
    if (!slide) return

    canvas.width = 360
    canvas.height = 640

    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const aspectRatio = img.width / img.height
      let drawWidth = canvas.width
      let drawHeight = drawWidth / aspectRatio

      if (drawHeight < canvas.height * 0.7) {
        drawHeight = canvas.height * 0.7
        drawWidth = drawHeight * aspectRatio
      }

      const x = (canvas.width - drawWidth) / 2
      const y = (canvas.height - drawHeight) / 2

      ctx.drawImage(img, x, y, drawWidth, drawHeight)

      if (slide.text) {
        const textY =
          slide.textPosition === "top" ? 80 : slide.textPosition === "center" ? canvas.height / 2 : canvas.height - 120

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        const textWidth = Math.min(ctx.measureText(slide.text).width + 40, canvas.width - 40)
        ctx.fillRect((canvas.width - textWidth) / 2 - 10, textY - 25, textWidth + 20, 50)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 24px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(slide.text, canvas.width / 2, textY, canvas.width - 40)
      }

      const watermarkY = canvas.height - 30
      const logoSize = 20
      const watermarkPadding = 8

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      const watermarkWidth = 120
      const watermarkHeight = logoSize + watermarkPadding
      const watermarkX = canvas.width - watermarkWidth - 10

      ctx.beginPath()
      ctx.roundRect(watermarkX, watermarkY - watermarkHeight / 2, watermarkWidth, watermarkHeight, 4)
      ctx.fill()

      if (logoImage) {
        ctx.drawImage(logoImage, watermarkX + watermarkPadding, watermarkY - logoSize / 2, logoSize, logoSize)
      }

      ctx.fillStyle = "#d4af37"
      ctx.font = "bold 8px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("BARRKEH", watermarkX + logoSize + watermarkPadding + 4, watermarkY - 3)
      ctx.font = "500 6px Inter, sans-serif"
      ctx.fillStyle = "#ffffff"
      ctx.fillText("DIGIPRODUCTS", watermarkX + logoSize + watermarkPadding + 4, watermarkY + 6)
    }
    img.src = slide.imageUrl
  }, [slides, currentSlideIndex, logoImage])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    } else {
      setIsPlaying(true)
      playSlideshow()
    }
  }

  const playSlideshow = () => {
    let index = currentSlideIndex

    const advanceSlide = () => {
      index = (index + 1) % slides.length
      setCurrentSlideIndex(index)
    }

    playIntervalRef.current = setInterval(() => {
      advanceSlide()
    }, slides[index]?.duration || 3000)
  }

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [])

  const downloadCurrentFrame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `barrkeh-video-frame-${currentSlideIndex + 1}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground flex items-center gap-3">
            AI Video Builder
            <Badge variant="secondary" className="text-xs gap-1">
              <Bot className="h-3 w-3" />
              AI Powered
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Create videos with AI-generated scripts, shot lists, and text overlays.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Script Generator */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Script Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                value={aiProductName}
                onChange={(e) => setAiProductName(e.target.value)}
                placeholder="e.g., Ramadan Planner 2026"
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Video Type</Label>
              <Select value={aiVideoType} onValueChange={setAiVideoType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {videoTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Details</Label>
              <Textarea
                value={aiAdditionalContext}
                onChange={(e) => setAiAdditionalContext(e.target.value)}
                placeholder="Target audience, key features, tone..."
                className="bg-secondary min-h-20"
              />
            </div>

            <Button
              onClick={generateAIScript}
              disabled={!aiProductName.trim() || isGeneratingScript}
              className="w-full gap-2 bg-primary text-primary-foreground"
            >
              {isGeneratingScript ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Video Script
                </>
              )}
            </Button>

            {/* Generated Script Display */}
            {generatedScript && (
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Generated Script</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() =>
                      copyToClipboard(
                        `${generatedScript.title}\n\nHook: ${generatedScript.hook}\n\n${generatedScript.scenes.map((s, i) => `Scene ${i + 1} (${s.timestamp}):\n${s.visual}\nText: ${s.textOverlay}`).join("\n\n")}\n\nCTA: ${generatedScript.cta}`,
                        "full",
                      )
                    }
                  >
                    {copiedField === "full" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    Copy All
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded bg-primary/10 text-sm">
                    <span className="font-medium text-primary">Hook:</span> {generatedScript.hook}
                  </div>

                  {generatedScript.scenes.map((scene, index) => (
                    <div key={index} className="p-2 rounded bg-secondary/50 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {scene.timestamp}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => applySceneToSlide(index)}
                        >
                          Apply to Slide
                        </Button>
                      </div>
                      <p className="text-muted-foreground">{scene.visual}</p>
                      <p className="font-medium">"{scene.textOverlay}"</p>
                    </div>
                  ))}

                  <div className="p-2 rounded bg-green-500/10 text-sm">
                    <span className="font-medium text-green-500">CTA:</span> {generatedScript.cta}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Builder Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Build Your Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="slides">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="slides">Slides</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="slides" className="mt-4 space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Screenshots
                </Button>

                {slides.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                          index === currentSlideIndex ? "border-primary bg-primary/10" : "border-border bg-secondary/30"
                        }`}
                        onClick={() => setCurrentSlideIndex(index)}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <img
                          src={slide.imageUrl || "/placeholder.svg"}
                          alt={`Slide ${index + 1}`}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <span className="flex-1 text-sm">Slide {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSlide(slide.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {slides.length > 0 && slides[currentSlideIndex] && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-primary" />
                        Text Overlay
                      </Label>
                      <Input
                        value={slides[currentSlideIndex].text}
                        onChange={(e) => updateSlide(slides[currentSlideIndex].id, { text: e.target.value })}
                        placeholder="Add text..."
                        className="bg-secondary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Select
                        value={slides[currentSlideIndex].textPosition}
                        onValueChange={(v) =>
                          updateSlide(slides[currentSlideIndex].id, { textPosition: v as "top" | "center" | "bottom" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Duration: {slides[currentSlideIndex].duration / 1000}s</Label>
                      <Slider
                        value={[slides[currentSlideIndex].duration]}
                        onValueChange={(v) => updateSlide(slides[currentSlideIndex].id, { duration: v[0] })}
                        min={1000}
                        max={10000}
                        step={500}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Text Animation</Label>
                  <Select value={textAnimation} onValueChange={setTextAnimation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textAnimations.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value}>
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Preview (9:16)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {slides.length > 0 ? (
                <canvas ref={canvasRef} className="rounded-lg border border-border max-h-[400px]" />
              ) : (
                <div className="w-full aspect-[9/16] max-h-[400px] rounded-lg border border-dashed border-border flex items-center justify-center bg-secondary/30">
                  <div className="text-center text-muted-foreground p-4">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Upload screenshots to get started</p>
                  </div>
                </div>
              )}
            </div>

            {slides.length > 0 && (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                  >
                    {"<"}
                  </Button>

                  <Button onClick={togglePlayback} className="gap-2 bg-primary text-primary-foreground">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                  >
                    {">"}
                  </Button>
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={downloadCurrentFrame}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Frame
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            AI Video Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>Use AI to generate a complete script before uploading your screenshots</li>
            <li>Apply scene text overlays directly to your slides with one click</li>
            <li>Keep each slide between 2-4 seconds for optimal engagement</li>
            <li>Upload 5-10 screenshots that follow your generated shot list</li>
            <li>Download frames to create videos in your favorite editing app</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
