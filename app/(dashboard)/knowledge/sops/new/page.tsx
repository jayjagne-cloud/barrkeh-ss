"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { ArrowLeft, Plus, Trash2, GripVertical, X } from "lucide-react"
import Link from "next/link"

const categories = [
  { value: "marketing", label: "Marketing" },
  { value: "product", label: "Product Creation" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "design", label: "Design" },
]

export default function NewSOPPage() {
  const router = useRouter()
  const { addSOP } = useStore()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [steps, setSteps] = useState([{ instruction: "", notes: "" }])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addStep = () => {
    setSteps([...steps, { instruction: "", notes: "" }])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, field: "instruction" | "notes", value: string) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = () => {
    if (!title || !category || steps.every((s) => !s.instruction)) return

    addSOP({
      title,
      category,
      steps: steps
        .filter((s) => s.instruction)
        .map((s, i) => ({
          id: Math.random().toString(36).substring(2, 15),
          order: i + 1,
          instruction: s.instruction,
          notes: s.notes || undefined,
        })),
      tags,
    })

    router.push("/knowledge")
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/knowledge">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground">Create New SOP</h1>
          <p className="text-muted-foreground text-sm">Document your process step by step</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>SOP Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., How to List a Product on Etsy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="bg-secondary/50"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Steps</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="gap-1 bg-transparent">
                <Plus className="h-3 w-3" />
                Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3 p-4 rounded-lg border border-border bg-secondary/30">
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                    <span className="ml-1 font-mono text-sm w-6">{index + 1}.</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="What needs to be done?"
                      value={step.instruction}
                      onChange={(e) => updateStep(index, "instruction", e.target.value)}
                      className="bg-background"
                    />
                    <Textarea
                      placeholder="Additional notes (optional)"
                      value={step.notes}
                      onChange={(e) => updateStep(index, "notes", e.target.value)}
                      className="bg-background min-h-[60px]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => removeStep(index)}
                    disabled={steps.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" asChild>
          <Link href="/knowledge">Cancel</Link>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!title || !category}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create SOP
        </Button>
      </div>
    </div>
  )
}
