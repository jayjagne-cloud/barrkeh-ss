"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import {
  Calendar,
  ArrowLeft,
  CheckCircle,
  Circle,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
} from "lucide-react"
import Link from "next/link"

export default function MonthlyClosePage() {
  const { transactions, taxSetAsidePercent, taxSetAsideMethod } = useStore()

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const months = useMemo(() => {
    const result = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      result.push({
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      })
    }
    return result
  }, [])

  const monthlyStats = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number)
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0)

    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date >= startOfMonth && date <= endOfMonth
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const profit = income - expenses

    const taxBase = taxSetAsideMethod === "profit" ? profit : income
    const taxSetAside = Math.max(0, taxBase * (taxSetAsidePercent / 100))

    const incomeCount = monthTransactions.filter((t) => t.type === "income").length
    const expenseCount = monthTransactions.filter((t) => t.type === "expense").length

    return {
      income,
      expenses,
      profit,
      taxSetAside,
      incomeCount,
      expenseCount,
      transactions: monthTransactions,
    }
  }, [transactions, selectedMonth, taxSetAsidePercent, taxSetAsideMethod])

  const checklistItems = [
    { label: "Review all income entries", done: monthlyStats.incomeCount > 0 },
    { label: "Review all expense entries", done: monthlyStats.expenseCount > 0 },
    { label: "Reconcile with bank statement", done: false },
    { label: "Attach all receipts", done: false },
    { label: "Calculate tax set-aside", done: true },
    { label: "Export monthly report", done: false },
  ]

  const exportReport = () => {
    const report = {
      month: selectedMonth,
      income: monthlyStats.income,
      expenses: monthlyStats.expenses,
      profit: monthlyStats.profit,
      taxSetAside: monthlyStats.taxSetAside,
      transactions: monthlyStats.transactions,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `barrkeh-finance-${selectedMonth}.json`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">Monthly Close</h1>
          <p className="text-muted-foreground mt-1">Reconcile and close your monthly finances.</p>
        </div>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-primary" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-500">€{monthlyStats.income.toFixed(2)}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {monthlyStats.incomeCount} entries
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-500">€{monthlyStats.expenses.toFixed(2)}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {monthlyStats.expenseCount} entries
                </Badge>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${monthlyStats.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  €{monthlyStats.profit.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tax Set-Aside</p>
                <p className="text-2xl font-bold text-primary">€{monthlyStats.taxSetAside.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {taxSetAsidePercent}% of {taxSetAsideMethod}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Close Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Monthly Close Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklistItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  item.done ? "border-green-500/30 bg-green-500/5" : "border-border bg-secondary/30"
                }`}
              >
                {item.done ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={`text-sm ${item.done ? "text-green-500" : "text-foreground"}`}>{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Download a complete report of this month's finances including all transactions, totals, and tax
              calculations.
            </p>

            <div className="rounded-lg border border-border p-4 bg-secondary/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Month</span>
                <span className="text-foreground">{months.find((m) => m.value === selectedMonth)?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transactions</span>
                <span className="text-foreground">{monthlyStats.transactions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format</span>
                <span className="text-foreground">JSON / CSV</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={exportReport}>
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={exportReport}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
