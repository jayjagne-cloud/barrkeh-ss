"use client"

import { Suspense } from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import {
  BookOpen,
  Plus,
  Search,
  FileText,
  Lightbulb,
  Palette,
  Sparkles,
  Tag,
  Clock,
  Trash2,
  Edit,
  Copy,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const categoryIcons: Record<string, typeof FileText> = {
  marketing: Sparkles,
  product: FileText,
  finance: FileText,
  operations: FileText,
  design: Palette,
}

function KnowledgeContent() {
  const { sops, ideas, brandRules, deleteSOP, deleteIdea, deleteBrandRule } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("sops")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredSOPs = useMemo(() => {
    if (!searchTerm) return sops
    const term = searchTerm.toLowerCase()
    return sops.filter(
      (sop) =>
        sop.title.toLowerCase().includes(term) ||
        sop.category.toLowerCase().includes(term) ||
        sop.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }, [sops, searchTerm])

  const filteredIdeas = useMemo(() => {
    if (!searchTerm) return ideas
    const term = searchTerm.toLowerCase()
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(term) ||
        idea.description?.toLowerCase().includes(term) ||
        idea.tags.some((tag) => tag.toLowerCase().includes(term)),
    )
  }, [ideas, searchTerm])

  const filteredBrandRules = useMemo(() => {
    if (!searchTerm) return brandRules
    const term = searchTerm.toLowerCase()
    return brandRules.filter(
      (rule) =>
        rule.name.toLowerCase().includes(term) ||
        rule.category.toLowerCase().includes(term) ||
        rule.value.toLowerCase().includes(term),
    )
  }, [brandRules, searchTerm])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const stats = {
    totalSOPs: sops.length,
    totalIdeas: ideas.length,
    totalRules: brandRules.length,
    categories: [...new Set(sops.map((s) => s.category))].length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Knowledge + SOP Library
          </h1>
          <p className="text-muted-foreground mt-1">Your second brain. SOPs, ideas, and brand rules.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/knowledge/ideas/new">
              <Lightbulb className="h-4 w-4" />
              Capture Idea
            </Link>
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/knowledge/sops/new">
              <Plus className="h-4 w-4" />
              New SOP
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total SOPs</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalSOPs}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ideas Captured</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalIdeas}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Brand Rules</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalRules}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Palette className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold text-foreground">{stats.categories}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Tag className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search SOPs, ideas, brand rules..."
          className="pl-10 bg-secondary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sops" className="gap-2">
            <FileText className="h-4 w-4" />
            SOPs ({sops.length})
          </TabsTrigger>
          <TabsTrigger value="ideas" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Ideas ({ideas.length})
          </TabsTrigger>
          <TabsTrigger value="brand" className="gap-2">
            <Palette className="h-4 w-4" />
            Brand Rules ({brandRules.length})
          </TabsTrigger>
        </TabsList>

        {/* SOPs Tab */}
        <TabsContent value="sops" className="mt-6">
          {filteredSOPs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSOPs.map((sop) => {
                const Icon = categoryIcons[sop.category] || FileText
                return (
                  <Card key={sop.id} className="group hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{sop.title}</h3>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {sop.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {sop.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground mb-3">{sop.steps.length} steps</div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(sop.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/knowledge/sops/${sop.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteSOP(sop.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-foreground mb-2">No SOPs yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Document your processes to save time and ensure consistency.
                </p>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/knowledge/sops/new">
                    <Plus className="h-4 w-4" />
                    Create Your First SOP
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="mt-6">
          {filteredIdeas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="group hover:border-amber-500/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-amber-500" />
                        </div>
                        <h3 className="font-semibold text-foreground">{idea.title}</h3>
                      </div>
                    </div>

                    {idea.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{idea.description}</p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {idea.season && (
                        <Badge variant="outline" className="text-xs text-amber-500">
                          {idea.season}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => deleteIdea(idea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-foreground mb-2">No ideas captured</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Quickly capture product ideas, content concepts, and inspiration.
                </p>
                <Button className="gap-2 bg-amber-500 text-white hover:bg-amber-600" asChild>
                  <Link href="/knowledge/ideas/new">
                    <Lightbulb className="h-4 w-4" />
                    Capture Your First Idea
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Brand Rules Tab */}
        <TabsContent value="brand" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/knowledge/brand/new">
                <Plus className="h-4 w-4" />
                Add Rule
              </Link>
            </Button>
          </div>

          {filteredBrandRules.length > 0 ? (
            <div className="space-y-4">
              {["font", "color", "pattern", "tone", "other"].map((category) => {
                const rules = filteredBrandRules.filter((r) => r.category === category)
                if (rules.length === 0) return null

                return (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg capitalize flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        {category === "font"
                          ? "Fonts"
                          : category === "color"
                            ? "Colors"
                            : category === "pattern"
                              ? "Patterns & Textures"
                              : category === "tone"
                                ? "Voice & Tone"
                                : "Other"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30"
                          >
                            <div className="flex items-center gap-3">
                              {rule.category === "color" && (
                                <div
                                  className="h-8 w-8 rounded-full border border-border"
                                  style={{ backgroundColor: rule.value }}
                                />
                              )}
                              <div>
                                <p className="font-medium text-foreground text-sm">{rule.name}</p>
                                <p className="text-xs text-muted-foreground">{rule.value}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(rule.value, rule.id)}
                              >
                                {copiedId === rule.id ? (
                                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600"
                                onClick={() => deleteBrandRule(rule.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-foreground mb-2">No brand rules defined</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep your fonts, colors, and design patterns in one place.
                </p>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/knowledge/brand/new">
                    <Plus className="h-4 w-4" />
                    Add Brand Rule
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={null}>
      <KnowledgeContent />
    </Suspense>
  )
}
