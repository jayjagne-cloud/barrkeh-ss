"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Package,
  Star,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Layers,
  Megaphone,
} from "lucide-react"
import Link from "next/link"

const statusOrder = ["idea", "build", "polish", "demo", "listed", "optimizing"]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { products, updateProduct, deleteProduct } = useStore()

  const product = useMemo(() => {
    return products.find((p) => p.id === params.id)
  }, [products, params.id])

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(product?.name || "")
  const [status, setStatus] = useState(product?.status || "idea")
  const [etsyLink, setEtsyLink] = useState(product?.etsyLink || "")
  const [pricing, setPricing] = useState(product?.pricing?.toString() || "")
  const [description, setDescription] = useState(product?.description || "")

  const [newTestimonial, setNewTestimonial] = useState("")
  const [newRewritten, setNewRewritten] = useState("")

  if (!product) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">Product not found</h3>
            <Button asChild>
              <Link href="/sales">Back to Sales Hub</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusIndex = statusOrder.indexOf(product.status)
  const progress = ((statusIndex + 1) / statusOrder.length) * 100

  const handleSave = () => {
    updateProduct(product.id, {
      name,
      status: status as typeof product.status,
      etsyLink: etsyLink || undefined,
      pricing: pricing ? Number.parseFloat(pricing) : undefined,
      description,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id)
      router.push("/sales")
    }
  }

  const handleAddTestimonial = () => {
    if (newTestimonial.trim()) {
      const testimonials = [...(product.testimonials || [])]
      testimonials.push({
        id: Math.random().toString(36).substring(2, 15),
        productId: product.id,
        original: newTestimonial,
        rewritten: newRewritten || undefined,
        date: new Date(),
      })
      updateProduct(product.id, { testimonials })
      setNewTestimonial("")
      setNewRewritten("")
    }
  }

  const launchChecklist = [
    { label: "Product files ready", done: product.files.length > 0 },
    { label: "Pricing set", done: !!product.pricing },
    { label: "Description written", done: !!product.description },
    { label: "Listing images created", done: false },
    { label: "SEO keywords added", done: false },
    { label: "Preview video ready", done: false },
    { label: "Published on Etsy", done: !!product.etsyLink },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sales">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {product.status}
              </Badge>
              {product.pricing && <span className="text-primary font-semibold">€{product.pricing}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="bg-transparent" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Product Progress</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              {statusOrder.map((s, i) => (
                <span key={s} className={i <= statusIndex ? "text-primary font-medium" : ""}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details" className="gap-1">
            <Package className="h-3 w-3" />
            Details
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1">
            <Star className="h-3 w-3" />
            Testimonials
          </TabsTrigger>
          <TabsTrigger value="launch" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Launch Checklist
          </TabsTrigger>
          <TabsTrigger value="bundles" className="gap-1">
            <Layers className="h-3 w-3" />
            Bundles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary" />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={setStatus}>
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
                        className="bg-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Etsy Link</Label>
                      <Input value={etsyLink} onChange={(e) => setEtsyLink(e.target.value)} className="bg-secondary" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-secondary min-h-32"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {product.etsyLink && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Etsy Listing</p>
                        <a
                          href={product.etsyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          View on Etsy <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {product.description && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-foreground">{product.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Files ({product.files.length})</p>
                      {product.files.length > 0 ? (
                        <ul className="space-y-1">
                          {product.files.map((file, i) => (
                            <li key={i} className="text-sm text-foreground flex items-center gap-2">
                              <FileText className="h-3 w-3 text-primary" />
                              {file}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No files added</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href={`/marketing/generator?product=${product.name}`}>Generate Marketing Content</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/marketing/mockup">Create Listing Images</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href={`/marketing/content/new?product=${product.id}`}>Schedule Post</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Testimonial Bank
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Original Review</Label>
                  <Textarea
                    value={newTestimonial}
                    onChange={(e) => setNewTestimonial(e.target.value)}
                    placeholder="Paste the customer review..."
                    className="bg-secondary min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rewritten Version (Optional)</Label>
                  <Textarea
                    value={newRewritten}
                    onChange={(e) => setNewRewritten(e.target.value)}
                    placeholder="Rewrite for marketing use..."
                    className="bg-secondary min-h-24"
                  />
                </div>
              </div>
              <Button onClick={handleAddTestimonial} className="gap-2" disabled={!newTestimonial.trim()}>
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>

              {product.testimonials && product.testimonials.length > 0 ? (
                <div className="space-y-3 pt-4 border-t border-border">
                  {product.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="rounded-lg border border-border p-4 bg-secondary/30">
                      <div className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-primary fill-primary shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm text-foreground">{testimonial.original}</p>
                          {testimonial.rewritten && (
                            <div className="rounded bg-primary/10 p-2">
                              <p className="text-xs text-muted-foreground mb-1">Rewritten:</p>
                              <p className="text-sm text-foreground">{testimonial.rewritten}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(testimonial.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-t border-border">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No testimonials yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="launch" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Launch Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {launchChecklist.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      item.done ? "border-green-500/30 bg-green-500/5" : "border-border bg-secondary/30"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        item.done ? "bg-green-500 text-white" : "border-2 border-muted-foreground"
                      }`}
                    >
                      {item.done && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <span className={`text-sm ${item.done ? "text-green-500" : "text-foreground"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Bundle Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create bundles by combining this product with others for special pricing.
              </p>
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Bundle feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
