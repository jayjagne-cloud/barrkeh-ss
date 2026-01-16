"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import {
  FileVideo,
  Sparkles,
  Bot,
  Loader2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Film,
  Mic,
  Camera,
  Clock,
  Target,
  Megaphone,
  Lightbulb,
  Play,
} from "lucide-react"

const scriptTypes = [
  { value: "reel", label: "Instagram Reel", icon: Film, duration: "15-60s" },
  { value: "tiktok", label: "TikTok Video", icon: Play, duration: "15-60s" },
  { value: "promo", label: "Promotional Video", icon: Megaphone, duration: "30-90s" },
  { value: "tutorial", label: "Tutorial/How-To", icon: Lightbulb, duration: "60-180s" },
  { value: "testimonial", label: "Testimonial Style", icon: Mic, duration: "30-60s" },
  { value: "story", label: "Story Format", icon: Camera, duration: "15s per slide" },
]

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "energetic", label: "Energetic & Bold" },
  { value: "soft", label: "Soft & Spiritual" },
  { value: "luxury", label: "Luxury & Premium" },
  { value: "urgent", label: "Urgent & FOMO" },
]

const goalOptions = [
  { value: "awareness", label: "Build Awareness" },
  { value: "engagement", label: "Drive Engagement" },
  { value: "conversion", label: "Drive Sales/Conversion" },
  { value: "education", label: "Educate Audience" },
  { value: "trust", label: "Build Trust" },
  { value: "launch", label: "Product Launch" },
]

interface GeneratedScript {
  id: string
  type: string
  title: string
  content: string
  createdAt: Date
}

export default function ScriptWriterPage() {
  const [productName, setProductName] = useState("")
  const [scriptType, setScriptType] = useState("reel")
  const [tone, setTone] = useState("professional")
  const [goal, setGoal] = useState("awareness")
  const [keyPoints, setKeyPoints] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [currentScript, setCurrentScript] = useState<string>("")
  const [savedScripts, setSavedScripts] = useState<GeneratedScript[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/generate-content?type=script" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    // Extract the script content from AI messages
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (lastAssistantMessage) {
      const content =
        lastAssistantMessage.parts?.map((part) => (part.type === "text" ? part.text : "")).join("") ||
        (lastAssistantMessage as { content?: string }).content ||
        ""
      setCurrentScript(content)
    }
  }, [messages])

  const generateScript = async () => {
    if (!productName.trim()) return

    setIsGenerating(true)
    setMessages([])

    const selectedType = scriptTypes.find((t) => t.value === scriptType)
    const selectedTone = toneOptions.find((t) => t.value === tone)
    const selectedGoal = goalOptions.find((g) => g.value === goal)

    const prompt = `Create a detailed ${selectedType?.label} script for "${productName}".

REQUIREMENTS:
- Script Type: ${selectedType?.label} (${selectedType?.duration})
- Tone: ${selectedTone?.label}
- Goal: ${selectedGoal?.label}
- Target Audience: ${targetAudience || "General audience"}
- Key Points to Include: ${keyPoints || "Product benefits and features"}
${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ""}

FORMAT THE SCRIPT WITH:
1. TITLE - A catchy title for the video
2. HOOK (First 3 seconds) - Attention-grabbing opening
3. SCENE-BY-SCENE BREAKDOWN with:
   - Timestamp (e.g., 0:00-0:03)
   - [VISUAL] What appears on screen
   - [TEXT OVERLAY] Any text to show
   - [VOICEOVER/AUDIO] What to say or sound
4. CALL-TO-ACTION - Clear ending CTA
5. SHOT LIST - Summary of shots needed
6. MUSIC/SOUND SUGGESTIONS - Recommended audio style

Make it engaging, authentic, and optimized for the platform.`

    sendMessage({ text: prompt })
  }

  const saveScript = () => {
    if (!currentScript.trim()) return

    const newScript: GeneratedScript = {
      id: Math.random().toString(36).substring(2, 15),
      type: scriptType,
      title: `${productName} - ${scriptTypes.find((t) => t.value === scriptType)?.label}`,
      content: currentScript,
      createdAt: new Date(),
    }

    setSavedScripts((prev) => [newScript, ...prev])
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const downloadScript = (content: string, title: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-script.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setProductName("")
    setKeyPoints("")
    setTargetAudience("")
    setAdditionalNotes("")
    setCurrentScript("")
    setMessages([])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground flex items-center gap-3">
            AI Script Writer
            <Badge variant="secondary" className="text-xs gap-1">
              <Bot className="h-3 w-3" />
              AI Powered
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Professional video scripts for reels, TikToks, and promotional content.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Script
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <FileVideo className="h-4 w-4" />
            Saved Scripts ({savedScripts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Script Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Product/Topic Name *</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Ramadan Planner 2026"
                    className="bg-secondary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-primary" />
                      Script Type
                    </Label>
                    <Select value={scriptType} onValueChange={setScriptType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <span>{type.label}</span>
                              <Badge variant="outline" className="text-xs ml-2">
                                {type.duration}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-primary" />
                      Tone
                    </Label>
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
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Goal
                  </Label>
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
                  <Label>Target Audience</Label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Busy Muslim professionals aged 25-40"
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Points to Include</Label>
                  <Textarea
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="e.g., Daily habit tracking, Quran reading log, Meal planning..."
                    className="bg-secondary min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any specific requirements, hooks to include, or style preferences..."
                    className="bg-secondary min-h-16"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={generateScript}
                    disabled={!productName.trim() || isLoading}
                    className="flex-1 gap-2 bg-primary text-primary-foreground"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Script
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Script */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileVideo className="h-5 w-5 text-primary" />
                    Generated Script
                  </span>
                  {currentScript && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => copyToClipboard(currentScript, "script")}
                      >
                        {copiedField === "script" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => downloadScript(currentScript, productName || "script")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8" onClick={saveScript}>
                        Save
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]" ref={scrollRef}>
                  {currentScript ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-foreground bg-secondary/50 p-4 rounded-lg font-sans">
                        {currentScript}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center text-muted-foreground p-8">
                      <div>
                        <FileVideo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Your generated script will appear here.</p>
                        <p className="text-sm mt-2">Fill in the settings and click Generate Script.</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="h-5 w-5 text-primary" />
                Saved Scripts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedScripts.length > 0 ? (
                <div className="space-y-4">
                  {savedScripts.map((script) => (
                    <Card key={script.id} className="bg-secondary/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{script.title}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {script.createdAt.toLocaleDateString()} at {script.createdAt.toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {scriptTypes.find((t) => t.value === script.type)?.label}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(script.content, script.id)}
                            >
                              {copiedField === script.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadScript(script.content, script.title)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-background/50 p-3 rounded max-h-32 overflow-y-auto font-sans">
                          {script.content.substring(0, 300)}...
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <FileVideo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No saved scripts yet.</p>
                  <p className="text-sm mt-2">Generate and save scripts to see them here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Script Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Hook in 3 Seconds</p>
                <p className="text-xs text-muted-foreground">Capture attention immediately with a strong opening</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">One Clear Message</p>
                <p className="text-xs text-muted-foreground">Focus on one key point per video</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Strong CTA</p>
                <p className="text-xs text-muted-foreground">Always end with a clear call-to-action</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mic className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Authentic Voice</p>
                <p className="text-xs text-muted-foreground">Write how you naturally speak to your audience</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
