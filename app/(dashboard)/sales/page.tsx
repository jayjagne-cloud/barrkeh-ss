"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import {
  ShoppingBag,
  Plus,
  Package,
  TrendingUp,
  Star,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Hammer,
  Sparkles,
  PlayCircle,
  CheckCircle,
  Settings2,
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  idea: { icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-500/10", label: "Idea" },
  build: { icon: Hammer, color: "text-amber-500", bg: "bg-amber-500/10", label: "Building" },
  polish: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10", label: "Polishing" },
  demo: { icon: PlayCircle, color: "text-cyan-500", bg: "bg-cyan-500/10", label: "Demo Ready" },
  listed: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Listed" },
  optimizing: { icon: Settings2, color: "text-primary", bg: "bg-primary/10", label: "Optimizing" },
}

const statusOrder = ["idea", "build", "polish", "demo", "listed", "optimizing"]

export default function SalesPage() {
  const { products, transactions } = useStore()

  const stats = useMemo(() => {
    const totalProducts = products.length
    const listedProducts = products.filter((p) => p.status === "listed" || p.status === "optimizing").length
    const inProgress = products.filter((p) => ["build", "polish", "demo"].includes(p.status)).length

    const totalRevenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalTestimonials = products.reduce((sum, p) => sum + (p.testimonials?.length || 0), 0)

    return { totalProducts, listedProducts, inProgress, totalRevenue, totalTestimonials }
  }, [products, transactions])

  const productsByStatus = useMemo(() => {
    const grouped: Record<string, typeof products> = {}
    statusOrder.forEach((status) => {
      grouped[status] = products.filter((p) => p.status === status)
    })
    return grouped
  }, [products])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Sales + Listings Hub
          </h1>
          <p className="text-muted-foreground mt-1">Your product control room. Track everything from idea to sale.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/sales/products/new">
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Listed</p>
                <p className="text-3xl font-bold text-green-500">{stats.listedProducts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-amber-500">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Hammer className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-primary">€{stats.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Product Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-4">
            {statusOrder.map((status) => {
              const config = statusConfig[status as keyof typeof statusConfig]
              const count = productsByStatus[status]?.length || 0
              return (
                <div key={status} className={`flex-1 min-w-32 rounded-lg ${config.bg} p-3 text-center`}>
                  <config.icon className={`h-5 w-5 ${config.color} mx-auto mb-1`} />
                  <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">All Products</h2>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/sales/products">View All</Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => {
              const config = statusConfig[product.status as keyof typeof statusConfig]
              const statusIndex = statusOrder.indexOf(product.status)
              const progress = ((statusIndex + 1) / statusOrder.length) * 100

              return (
                <Card key={product.id} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <Badge variant="outline" className={`mt-1 ${config.color} border-current`}>
                          <config.icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      {product.pricing && <span className="text-lg font-bold text-primary">€{product.pricing}</span>}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>

                    {product.testimonials && product.testimonials.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <span>{product.testimonials.length} reviews</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      {product.etsyLink ? (
                        <a
                          href={product.etsyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View on Etsy <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not listed yet</span>
                      )}
                      <Button variant="ghost" size="sm" className="h-7" asChild>
                        <Link href={`/sales/products/${product.id}`}>
                          Details <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-foreground mb-2">No products yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first digital product.</p>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/sales/products/new">
                  <Plus className="h-4 w-4" />
                  Create Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
