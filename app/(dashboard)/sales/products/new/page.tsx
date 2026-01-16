"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { Package, ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useStore()

  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idea" | "build" | "polish" | "demo" | "listed" | "optimizing">("idea")
  const [etsyLink, setEtsyLink] = useState("")
  const [pricing, setPricing] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<string[]>([])
  const [newFile, setNewFile] = useState("")

  const handleAddFile = () => {
    if (newFile.trim()) {
      setFiles([...files, newFile.trim()])
      setNewFile("")
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    addProduct({
      name,
      status,
      etsyLink: etsyLink || undefined,
      pricing: pricing ? Number.parseFloat(pricing) : undefined,
      description,
      files,
      testimonials: [],
    })

    router.push("/sales")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sales">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">New Product</h1>
          <p className="text-muted-foreground mt-1">Add a new digital product to your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ramadan Digital Planner"
                  className="bg-secondary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="build">Building</SelectItem>
                    <SelectItem value="polish">Polishing</SelectItem>
                    <SelectItem value="demo">Demo Ready</SelectItem>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="optimizing">Optimizing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (EUR)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  placeholder="9.99"
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label>Etsy Listing URL</Label>
                <Input
                  value={etsyLink}
                  onChange={(e) => setEtsyLink(e.target.value)}
                  placeholder="https://etsy.com/listing/..."
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  className="bg-secondary min-h-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Track the files included with this product.</p>

              <div className="flex gap-2">
                <Input
                  value={newFile}
                  onChange={(e) => setNewFile(e.target.value)}
                  placeholder="e.g., Main Planner PDF"
                  className="bg-secondary"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFile())}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddFile}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-2 bg-secondary/30"
                    >
                      <span className="text-sm text-foreground">{file}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No files added yet
                </div>
              )}

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <h4 className="font-medium text-foreground mb-2">Suggested Files</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Main product file (PDF/ZIP)</li>
                  <li>Bonus content</li>
                  <li>Instructions/How-to guide</li>
                  <li>Preview images</li>
                  <li>Thumbnail for listing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/sales">Cancel</Link>
          </Button>
          <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}
