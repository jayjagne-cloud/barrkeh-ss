"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"

const categories = [
  { value: "font", label: "Font", placeholder: "e.g., Playfair Display, Inter" },
  { value: "color", label: "Color", placeholder: "e.g., #C9A962 or rgb(201, 169, 98)" },
  { value: "pattern", label: "Pattern / Texture", placeholder: "e.g., Subtle grain texture" },
  { value: "tone", label: "Voice & Tone", placeholder: "e.g., Professional but approachable" },
  { value: "other", label: "Other", placeholder: "Enter value" },
]

export default function NewBrandRulePage() {
  const router = useRouter()
  const { addBrandRule } = useStore()

  const [category, setCategory] = useState<string>("")
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [notes, setNotes] = useState("")

  const selectedCategory = categories.find((c) => c.value === category)

  const handleSubmit = () => {
    if (!category || !name || !value) return

    addBrandRule({
      category: category as "font" | "color" | "pattern" | "tone" | "other",
      name,
      value,
      notes: notes || undefined,
    })

    router.push("/knowledge")
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/knowledge">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground">
              Add Brand Rule
            </h1>
            <p className="text-muted-foreground text-sm">Define your brand standards</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Category</Label>
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

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Primary Brand Color, Heading Font"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            {category === "color" ? (
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={value.startsWith("#") ? value : "#C9A962"}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-14 h-10 p-1 bg-secondary/50"
                />
                <Input
                  id="value"
                  placeholder={selectedCategory?.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-secondary/50 flex-1"
                />
              </div>
            ) : (
              <Input
                id="value"
                placeholder={selectedCategory?.placeholder || "Enter value"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-secondary/50"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="When to use this, examples, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/50 min-h-[80px]"
            />
          </div>

          {/* Preview for colors */}
          {category === "color" && value && (
            <div className="p-4 rounded-lg border border-border bg-secondary/30">
              <p className="text-sm text-muted-foreground mb-2">Preview</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border border-border" style={{ backgroundColor: value }} />
                <div>
                  <p className="font-medium text-foreground">{name || "Color Name"}</p>
                  <p className="text-sm text-muted-foreground font-mono">{value}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" asChild>
          <Link href="/knowledge">Cancel</Link>
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!category || !name || !value}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Add Rule
        </Button>
      </div>
    </div>
  )
}
