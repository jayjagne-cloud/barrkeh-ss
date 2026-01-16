"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import {
  ImageIcon,
  Receipt,
  CheckSquare,
  Lightbulb,
  Upload,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Package,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { tasks, content, transactions, products, projects, taxSetAsidePercent, taxSetAsideMethod } = useStore()

  const stats = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Content stats
    const contentReady = content.filter((c) => c.status === "ready").length
    const contentScheduled = content.filter((c) => c.status === "scheduled").length
    const contentPosted = content.filter((c) => c.status === "posted").length

    // Finance stats
    const monthlyTransactions = transactions.filter((t) => new Date(t.date) >= startOfMonth)
    const monthlyRevenue = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    const monthlyProfit = monthlyRevenue - monthlyExpenses

    const taxBase = taxSetAsideMethod === "profit" ? monthlyProfit : monthlyRevenue
    const taxSetAside = Math.max(0, taxBase * (taxSetAsidePercent / 100))

    // Stuck tasks (7+ days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const stuckTasks = tasks.filter(
      (t) => t.status === "stuck" || (t.status === "in-progress" && new Date(t.createdAt) < sevenDaysAgo),
    )

    // Top priorities
    const topPriorities = tasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
      .slice(0, 3)

    // Current focus product
    const activeProducts = products.filter((p) => p.status !== "idea" && p.status !== "listed")
    const currentProduct = activeProducts[0]

    return {
      contentReady,
      contentScheduled,
      contentPosted,
      monthlyRevenue,
      monthlyExpenses,
      monthlyProfit,
      taxSetAside,
      stuckTasks,
      topPriorities,
      currentProduct,
      activeProjects: projects.filter((p) => p.status === "in-progress").length,
    }
  }, [tasks, content, transactions, products, projects, taxSetAsidePercent, taxSetAsideMethod])

  const quickActions = [
    { label: "New Post", icon: ImageIcon, href: "/marketing/content/new" },
    { label: "New Expense", icon: Receipt, href: "/finance/new?type=expense" },
    { label: "New Task", icon: CheckSquare, href: "/projects/tasks/new" },
    { label: "New Idea", icon: Lightbulb, href: "/knowledge/ideas/new" },
    { label: "Upload Receipt", icon: Upload, href: "/finance/documents/new" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Command Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is what needs your attention today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.label} variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
              <Link href={action.href}>
                <action.icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top 3 Priorities */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckSquare className="h-4 w-4 text-primary" />
              Today's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPriorities.length > 0 ? (
              stats.topPriorities.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 bg-secondary/30"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          task.priority === "urgent"
                            ? "destructive"
                            : task.priority === "high"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks yet</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/projects/tasks/new">Add your first task</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Focus Product */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-primary" />
              Current Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.currentProduct ? (
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground">{stats.currentProduct.name}</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {stats.currentProduct.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">
                      {Math.round(
                        (["idea", "build", "polish", "demo", "listed", "optimizing"].indexOf(
                          stats.currentProduct.status,
                        ) /
                          5) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (["idea", "build", "polish", "demo", "listed", "optimizing"].indexOf(
                        stats.currentProduct.status,
                      ) /
                        5) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={`/sales/products/${stats.currentProduct.id}`}>View Details</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active products</p>
                <Button variant="link" size="sm" asChild className="mt-2">
                  <Link href="/sales/products/new">Create product</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Queue Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Content Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-green-500/10 p-3">
                <p className="text-2xl font-bold text-green-500">{stats.contentReady}</p>
                <p className="text-xs text-muted-foreground">Ready</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <p className="text-2xl font-bold text-blue-500">{stats.contentScheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-2xl font-bold text-primary">{stats.contentPosted}</p>
                <p className="text-xs text-muted-foreground">Posted</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <Link href="/marketing/calendar">View Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sales Snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Sales Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue MTD</span>
                <span className="font-semibold text-green-500">€{stats.monthlyRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expenses MTD</span>
                <span className="font-semibold text-red-500">€{stats.monthlyExpenses.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Profit MTD</span>
                <span className={`font-bold ${stats.monthlyProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  €{stats.monthlyProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Finance Snapshot */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-primary" />
              Finance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Tax Set-Aside ({taxSetAsidePercent}% of {taxSetAsideMethod})
              </p>
              <p className="text-2xl font-bold text-primary mt-1">€{stats.taxSetAside.toFixed(2)}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
              <Link href="/finance">View Finance Vault</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Loose Ends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Loose Ends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.stuckTasks.length > 0 ? (
              <div className="space-y-2">
                {stats.stuckTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2"
                  >
                    <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-sm text-foreground truncate">{task.title}</span>
                  </div>
                ))}
                {stats.stuckTasks.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{stats.stuckTasks.length - 3} more stuck tasks
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50 text-green-500" />
                <p className="text-sm text-green-500">All clear!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Active Projects ({stats.activeProjects})
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/projects">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.activeProjects > 0 ? (
            <div className="text-sm text-muted-foreground">
              You have {stats.activeProjects} active project(s) in progress.
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active projects</p>
              <Button variant="link" size="sm" asChild className="mt-2">
                <Link href="/projects/new">Start a project</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
