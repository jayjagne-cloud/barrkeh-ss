"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import {
  FolderKanban,
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  ChevronRight,
  Target,
  Zap,
  Calendar,
  LayoutList,
} from "lucide-react"
import Link from "next/link"

const statusConfig = {
  planning: { label: "Planning", color: "text-blue-500", bg: "bg-blue-500/10" },
  "in-progress": { label: "In Progress", color: "text-amber-500", bg: "bg-amber-500/10" },
  review: { label: "Review", color: "text-purple-500", bg: "bg-purple-500/10" },
  completed: { label: "Completed", color: "text-green-500", bg: "bg-green-500/10" },
}

const priorityConfig = {
  urgent: { label: "Urgent", color: "text-red-500", bg: "bg-red-500/10" },
  high: { label: "High", color: "text-orange-500", bg: "bg-orange-500/10" },
  medium: { label: "Medium", color: "text-amber-500", bg: "bg-amber-500/10" },
  low: { label: "Low", color: "text-gray-500", bg: "bg-gray-500/10" },
}

export default function ProjectsPage() {
  const { projects, tasks, products, updateTask } = useStore()
  const [activeView, setActiveView] = useState<"projects" | "tasks" | "sprint">("projects")

  const stats = useMemo(() => {
    const totalProjects = projects.length
    const activeProjects = projects.filter((p) => p.status === "in-progress").length
    const completedProjects = projects.filter((p) => p.status === "completed").length

    const totalTasks = tasks.length
    const doneTasks = tasks.filter((t) => t.status === "done").length
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
    const stuckTasks = tasks.filter((t) => t.status === "stuck").length

    // This week's sprint (tasks due this week or recently created)
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const sprintTasks = tasks.filter((t) => {
      if (t.status === "done") return false
      if (t.dueDate) {
        const due = new Date(t.dueDate)
        return due >= startOfWeek && due <= endOfWeek
      }
      // Include high priority tasks in sprint
      return t.priority === "urgent" || t.priority === "high"
    })

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      doneTasks,
      inProgressTasks,
      stuckTasks,
      sprintTasks,
      taskCompletionRate: totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0,
    }
  }, [projects, tasks])

  const toggleTaskStatus = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "done" ? "todo" : currentStatus === "in-progress" ? "done" : "in-progress"
    updateTask(taskId, { status: nextStatus as "todo" | "in-progress" | "done" | "stuck" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Project + Product Tracker
          </h1>
          <p className="text-muted-foreground mt-1">Your shipping machine. Avoid 20 unfinished things.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/projects/tasks/new">
              <Plus className="h-4 w-4" />
              New Task
            </Link>
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New Project
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
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-3xl font-bold text-foreground">{stats.activeProjects}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks In Progress</p>
                <p className="text-3xl font-bold text-foreground">{stats.inProgressTasks}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-500">{stats.doneTasks}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.stuckTasks > 0 ? "bg-red-500/10 border-red-500/20" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stuck Tasks</p>
                <p className={`text-3xl font-bold ${stats.stuckTasks > 0 ? "text-red-500" : "text-foreground"}`}>
                  {stats.stuckTasks}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${stats.stuckTasks > 0 ? "bg-red-500/20" : "bg-secondary"}`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${stats.stuckTasks > 0 ? "text-red-500" : "text-muted-foreground"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
        <TabsList>
          <TabsTrigger value="sprint" className="gap-2">
            <Zap className="h-4 w-4" />
            Weekly Sprint
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="projects" className="gap-2">
            <FolderKanban className="h-4 w-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Weekly Sprint View */}
        <TabsContent value="sprint" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  This Week's Sprint
                </CardTitle>
                <Badge variant="outline">{stats.sprintTasks.length} tasks</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {stats.sprintTasks.length > 0 ? (
                <div className="space-y-3">
                  {stats.sprintTasks.map((task) => {
                    const priority = priorityConfig[task.priority]
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <button
                          onClick={() => toggleTaskStatus(task.id, task.status)}
                          className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === "done"
                              ? "bg-green-500 border-green-500"
                              : task.status === "in-progress"
                                ? "border-amber-500"
                                : "border-muted-foreground"
                          }`}
                        >
                          {task.status === "done" && <CheckSquare className="h-3 w-3 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${priority.bg} ${priority.color} border-0`}>
                              {priority.label}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-muted-foreground">
                                Due {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks in this week's sprint</p>
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link href="/projects/tasks/new">Add a task</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Tasks View */}
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <LayoutList className="h-5 w-5 text-primary" />
                  All Tasks
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={stats.taskCompletionRate} className="w-24 h-2" />
                  <span className="text-xs text-muted-foreground">{Math.round(stats.taskCompletionRate)}% done</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks
                    .sort((a, b) => {
                      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
                      if (a.status === "done" && b.status !== "done") return 1
                      if (a.status !== "done" && b.status === "done") return -1
                      return priorityOrder[a.priority] - priorityOrder[b.priority]
                    })
                    .map((task) => {
                      const priority = priorityConfig[task.priority]
                      return (
                        <div
                          key={task.id}
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            task.status === "stuck" ? "border-red-500/30 bg-red-500/5" : "border-border bg-secondary/30"
                          }`}
                        >
                          <button
                            onClick={() => toggleTaskStatus(task.id, task.status)}
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                              task.status === "done"
                                ? "bg-green-500 border-green-500"
                                : task.status === "in-progress"
                                  ? "border-amber-500"
                                  : task.status === "stuck"
                                    ? "border-red-500"
                                    : "border-muted-foreground"
                            }`}
                          >
                            {task.status === "done" && <CheckSquare className="h-3 w-3 text-white" />}
                          </button>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${task.status === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}
                            >
                              {task.title}
                            </p>
                          </div>
                          <Badge className={`text-xs ${priority.bg} ${priority.color} border-0`}>
                            {priority.label}
                          </Badge>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks yet</p>
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link href="/projects/tasks/new">Create your first task</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects View */}
        <TabsContent value="projects" className="mt-6">
          {projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const config = statusConfig[project.status]
                const projectTasks = tasks.filter((t) => t.projectId === project.id)
                const completedTasks = projectTasks.filter((t) => t.status === "done").length
                const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0

                return (
                  <Card key={project.id} className="group hover:border-primary/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{project.name}</h3>
                          <Badge variant="outline" className={`mt-1 ${config.color}`}>
                            {config.label}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/projects/${project.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            {completedTasks}/{projectTasks.length} tasks
                          </span>
                          <span className="text-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>

                      {project.dueDate && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-foreground mb-2">No projects yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first project to start tracking.</p>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/projects/new">
                    <Plus className="h-4 w-4" />
                    New Project
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
