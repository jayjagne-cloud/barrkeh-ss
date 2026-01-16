"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  FileText,
  Type,
  Hash,
  Layers,
  Film,
  Bot,
  Loader2,
  Wand2,
  Megaphone,
  Send,
  Gauge,
} from "lucide-react"

const contentTypes = [
  { value: "campaign", label: "Campaign Kit", icon: Megaphone, description: "Multi-channel plan with assets" },
  { value: "hooks", label: "Hooks", icon: MessageSquare, description: "10 attention-grabbing hooks" },
  { value: "captions", label: "Captions", icon: FileText, description: "Short, medium, and long versions" },
  { value: "ctas", label: "CTAs", icon: Type, description: "Call-to-action phrases" },
  { value: "hashtags", label: "Hashtags", icon: Hash, description: "Platform-optimized hashtags" },
  { value: "carousel", label: "Carousel", icon: Layers, description: "Slide-by-slide outline" },
  { value: "reel", label: "Reel Script", icon: Film, description: "Script + shot list" },
  { value: "ads", label: "Paid Ads", icon: Gauge, description: "Ad angles, copy, and targeting" },
  { value: "email", label: "Email", icon: Send, description: "High-converting email draft" },
]

const goalOptions = [
  { value: "launch", label: "Product Launch" },
  { value: "reviews", label: "Get Reviews" },
  { value: "awareness", label: "Build Awareness" },
  { value: "conversion", label: "Drive Conversion" },
]

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "pinterest", label: "Pinterest" },
  { value: "facebook", label: "Facebook" },
]

const toneOptions = [
  { value: "soft-spiritual", label: "Soft Spiritual" },
  { value: "bold-premium", label: "Bold Premium" },
  { value: "minimal-luxury", label: "Minimal Luxury" },
  { value: "casual-friendly", label: "Casual Friendly" },
  { value: "urgent-fomo", label: "Urgent FOMO" },
]

export default function ContentGeneratorPage() {
  const [productName, setProductName] = useState("")
  const [selectedType, setSelectedType] = useState("campaign")
  const [goal, setGoal] = useState("launch")
  const [platform, setPlatform] = useState("instagram")
  const [tone, setTone] = useState("bold-premium")
  const [customDetails, setCustomDetails] = useState("")
  const [audience, setAudience] = useState("")
  const [offer, setOffer] = useState("")
  const [keywords, setKeywords] = useState("")
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: `/api/ai/generate-content?type=${selectedType}` }),
  })

  const isGenerating = status === "streaming" || status === "submitted"

  const handleGenerate = async () => {
    if (!productName.trim()) return

    setMessages([])

    const contextPrompt = `Build a state-of-the-art ${contentTypes.find((t) => t.value === selectedType)?.label} for:
Product: ${productName}
Goal: ${goalOptions.find((g) => g.value === goal)?.label}
Primary Platform: ${platformOptions.find((p) => p.value === platform)?.label}
Tone / Voice: ${toneOptions.find((t) => t.value === tone)?.label}
Audience: ${audience || "Not provided"}
Offer/Proof: ${offer || "Not provided"}
Keywords / angles to emphasize: ${keywords || "Not provided"}
Additional context: ${customDetails || "None"}

Output must be concise, skimmable, and formatted with clear headings and bullet points. Where relevant, include platform-specific tweaks, conversion psychology, and fresh angles that feel modern (no cliché marketing fluff).`

    sendMessage({ text: contextPrompt })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getGeneratedContent = () => {
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (lastAssistantMessage) {
      return (
        lastAssistantMessage.parts?.map((part) => (part.type === "text" ? part.text : "")).join("") ||
        (lastAssistantMessage as { content?: string }).content ||
        ""
      )
    }
    return ""
  }

  const generatedContent = getGeneratedContent()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground flex items-center gap-3">
          AI Content Generator
          <Badge variant="secondary" className="text-xs gap-1">
            <Bot className="h-3 w-3" />
            AI Powered
          </Badge>
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate campaign kits, hooks, captions, ads, emails, hashtags, carousel outlines, and reel scripts with AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Type Selection */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedType === type.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/30 hover:border-primary/50"
                  }`}
                >
                  <type.icon
                    className={`h-5 w-5 mb-2 ${selectedType === type.value ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <p className="font-medium text-sm text-foreground">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Strategy Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Ramadan Planner"
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g., busy Muslim moms, 25-40, US/UK"
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goalOptions.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Offer / Proof</Label>
              <Input
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="e.g., 20% launch promo, 1,200 customers, 4.8★ reviews"
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Keywords / Non‑negotiables</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., faith-forward, minimal aesthetic, time-saving"
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Target audience, key features, special offers..."
                className="bg-secondary min-h-20"
              />
            </div>

            <Button
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleGenerate}
              disabled={!productName.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate {contentTypes.find((t) => t.value === selectedType)?.label}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {(() => {
                  const Icon = contentTypes.find((t) => t.value === selectedType)?.icon || MessageSquare
                  return <Icon className="h-5 w-5 text-primary" />
                })()}
                Generated {contentTypes.find((t) => t.value === selectedType)?.label}
              </span>
              {generatedContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent, "all")}
                  className="gap-1"
                >
                  {copiedIndex === "all" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  Copy All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">{productName || "No product set"}</p>
                <p>
                  Goal: {goalOptions.find((g) => g.value === goal)?.label} • Platform:{" "}
                  {platformOptions.find((p) => p.value === platform)?.label}
                </p>
              </div>
              <div className="text-right sm:text-left">
                <p>Audience: {audience || "—"}</p>
                <p>Offer: {offer || "—"}</p>
              </div>
            </div>
            <ScrollArea className="h-[500px]">
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border p-4 bg-secondary/30">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{generatedContent}</pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground py-20">
                  <div>
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your product details and click Generate</p>
                    <p className="text-sm mt-2">
                      AI will create {contentTypes.find((t) => t.value === selectedType)?.description}
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Content Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Be Specific</p>
                <p className="text-sm text-muted-foreground">
                  The more details you provide, the better the AI can tailor content to your needs. Include audience, offer,
                  proof, and angles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Iterate & Refine</p>
                <p className="text-sm text-muted-foreground">
                  Regenerate with different tones or goals to find the perfect content.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Copy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mix & Match</p>
                <p className="text-sm text-muted-foreground">
                  Combine hooks, captions, and hashtags for complete posts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
