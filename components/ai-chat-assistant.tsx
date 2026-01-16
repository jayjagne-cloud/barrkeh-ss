"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Bot, Send, Sparkles, Loader2, Copy, Check, MessageSquare, Lightbulb, Target, Zap } from "lucide-react"

interface AIChatAssistantProps {
  productName?: string
  onInsertContent?: (content: string) => void
}

const quickPrompts = [
  { icon: MessageSquare, label: "Hook ideas", prompt: "Give me 5 viral hook ideas for my product" },
  { icon: Target, label: "Target audience", prompt: "Help me define my target audience" },
  { icon: Lightbulb, label: "Content strategy", prompt: "Suggest a weekly content strategy" },
  { icon: Zap, label: "Trending formats", prompt: "What content formats are trending right now?" },
]

export function AIChatAssistant({ productName, onInsertContent }: AIChatAssistantProps) {
  const [input, setInput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/generate-content?type=chat" }),
    initialMessages: productName
      ? [
          {
            id: "system-context",
            role: "assistant",
            content: `I'm ready to help you create amazing marketing content for **${productName}**! What would you like to work on today?`,
          },
        ]
      : [],
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const context = productName ? `[Product: ${productName}] ${input}` : input
    sendMessage({ text: context })
    setInput("")
  }

  const handleQuickPrompt = (prompt: string) => {
    const context = productName ? `[Product: ${productName}] ${prompt}` : prompt
    sendMessage({ text: context })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          AI Content Assistant
          <Badge variant="secondary" className="ml-auto text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {quickPrompts.map((item) => (
              <Button
                key={item.label}
                variant="outline"
                size="sm"
                className="text-xs gap-1 bg-transparent"
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={isLoading}
              >
                <item.icon className="h-3 w-3" />
                {item.label}
              </Button>
            ))}
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 border border-border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.parts?.map((part, i) => (part.type === "text" ? part.text : null)).join("") ||
                      (message as { content?: string }).content}
                  </p>
                  {message.role === "assistant" && (
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() =>
                          copyToClipboard(
                            message.parts?.map((part) => (part.type === "text" ? part.text : "")).join("") ||
                              (message as { content?: string }).content ||
                              "",
                            message.id,
                          )
                        }
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      {onInsertContent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() =>
                            onInsertContent(
                              message.parts?.map((part) => (part.type === "text" ? part.text : "")).join("") ||
                                (message as { content?: string }).content ||
                                "",
                            )
                          }
                        >
                          Use this
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-xs text-primary-foreground font-medium">You</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary/50 border border-border rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about marketing..."
              className="flex-1 bg-secondary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="bg-primary text-primary-foreground"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
