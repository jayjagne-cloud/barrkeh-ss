"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { FolderKanban, ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const router = useRouter()
  const { addProject, products } = useStore()

  const [name, setName] = useState("")
  const [status, setStatus] = useState<"planning" | "in-progress" | "review" | "completed">("planning")
  const [productId, setProductId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [definitionOfDone, setDefinitionOfDone] = useState<string[]>([])
  const [newDod, setNewDod] = useState("")

  const handleAddDod = () => {
    if (newDod.trim()) {
      setDefinitionOfDone([...definitionOfDone, newDod.trim()])
      setNewDod("")
    }
  }

  const handleRemoveDod = (index: number) => {
    setDefinitionOfDone(definitionOfDone.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    addProject({
      name,
      status,
      productId: productId || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      milestones: [],
      tasks: [],
      definitionOfDone,
    })

    router.push("/projects")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">New Project</h1>
          <p className="text-muted-foreground mt-1">Create a new project to track your work.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ramadan Planner Launch"
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
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Link to Product (Optional)</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-secondary"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Definition of Done</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                What criteria must be met for this project to be considered complete?
              </p>

              <div className="flex gap-2">
                <Input
                  value={newDod}
                  onChange={(e) => setNewDod(e.target.value)}
                  placeholder="e.g., All files uploaded to Etsy"
                  className="bg-secondary"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDod())}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleAddDod}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {definitionOfDone.length > 0 ? (
                <div className="space-y-2">
                  {definitionOfDone.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-2 bg-secondary/30"
                    >
                      <span className="text-sm text-foreground">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveDod(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No criteria added yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/projects">Cancel</Link>
          </Button>
          <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}
