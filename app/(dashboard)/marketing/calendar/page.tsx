"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Video,
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

const platformIcons = {
  instagram: "IG",
  tiktok: "TT",
  pinterest: "Pin",
  facebook: "FB",
  linkedin: "LI",
}

const typeIcons = {
  post: ImageIcon,
  reel: Video,
  carousel: FileText,
  story: ImageIcon,
  pin: ImageIcon,
  video: Video,
}

export default function ContentCalendarPage() {
  const { content, updateContent } = useStore()
  const [activeQueue, setActiveQueue] = useState<"ready" | "scheduled" | "posted">("ready")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const filteredContent = useMemo(() => {
    return content.filter((c) => {
      if (activeQueue === "ready") return c.status === "ready"
      if (activeQueue === "scheduled") return c.status === "scheduled"
      if (activeQueue === "posted") return c.status === "posted"
      return true
    })
  }, [content, activeQueue])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const dayContent = content.filter((c) => {
        if (c.scheduledDate) {
          const scheduled = new Date(c.scheduledDate)
          return scheduled.getDate() === i && scheduled.getMonth() === month && scheduled.getFullYear() === year
        }
        if (c.postedDate) {
          const posted = new Date(c.postedDate)
          return posted.getDate() === i && posted.getMonth() === month && posted.getFullYear() === year
        }
        return false
      })
      days.push({ date: i, content: dayContent })
    }

    return days
  }, [currentMonth, content])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const markAsPosted = (id: string) => {
    updateContent(id, {
      status: "posted",
      postedDate: new Date(),
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Content Calendar
          </h1>
          <p className="text-muted-foreground mt-1">Manage your content queue and track performance.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/marketing/content/new">
            <Plus className="h-4 w-4" />
            New Content
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Content Queues */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Content Queues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeQueue} onValueChange={(v) => setActiveQueue(v as typeof activeQueue)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ready" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Ready
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Scheduled
                </TabsTrigger>
                <TabsTrigger value="posted" className="gap-1">
                  <Eye className="h-3 w-3" />
                  Posted
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeQueue} className="mt-4 space-y-3">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => {
                    const TypeIcon = typeIcons[item.type]
                    return (
                      <div key={item.id} className="rounded-lg border border-border p-3 bg-secondary/30 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground capitalize">{item.type}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {platformIcons[item.platform]}
                          </Badge>
                        </div>

                        {item.caption && <p className="text-xs text-muted-foreground line-clamp-2">{item.caption}</p>}

                        <div className="flex items-center justify-between">
                          {item.scheduledDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.scheduledDate).toLocaleDateString()}
                            </span>
                          )}
                          {activeQueue === "ready" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => markAsPosted(item.id)}
                            >
                              Mark Posted
                            </Button>
                          )}
                        </div>

                        {item.performance && (
                          <div className="flex gap-3 text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                            {item.performance.views !== undefined && <span>{item.performance.views} views</span>}
                            {item.performance.saves !== undefined && <span>{item.performance.saves} saves</span>}
                            {item.performance.clicks !== undefined && <span>{item.performance.clicks} clicks</span>}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No content in this queue</p>
                    <Button variant="link" size="sm" asChild className="mt-2">
                      <Link href="/marketing/content/new">Create content</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-20 rounded-lg border ${
                    day ? "border-border bg-secondary/20" : "border-transparent"
                  } p-1`}
                >
                  {day && (
                    <>
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                      <div className="mt-1 space-y-1">
                        {day.content.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              item.status === "posted" ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
                            }`}
                          >
                            {platformIcons[item.platform]} {item.type}
                          </div>
                        ))}
                        {day.content.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{day.content.length - 2} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track your content performance by adding views, saves, clicks, and sales data to posted content. This helps
            you understand what resonates with your audience.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
