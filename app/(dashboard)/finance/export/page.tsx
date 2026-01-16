"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { Download, FileText, ArrowLeft, Table } from "lucide-react"
import Link from "next/link"

export default function ExportReportPage() {
  const { transactions, taxSetAsidePercent, taxSetAsideMethod } = useStore()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState("all")

  const years = useMemo(() => {
    const uniqueYears = [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))]
    if (uniqueYears.length === 0) uniqueYears.push(new Date().getFullYear())
    return uniqueYears.sort((a, b) => b - a)
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const date = new Date(t.date)
      const yearMatch = date.getFullYear().toString() === selectedYear
      const monthMatch = selectedMonth === "all" || date.getMonth().toString() === selectedMonth
      return yearMatch && monthMatch
    })
  }, [transactions, selectedYear, selectedMonth])

  const stats = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const profit = income - expenses
    const taxBase = taxSetAsideMethod === "profit" ? profit : income
    const taxSetAside = Math.max(0, taxBase * (taxSetAsidePercent / 100))

    return { income, expenses, profit, taxSetAside }
  }, [filteredTransactions, taxSetAsidePercent, taxSetAsideMethod])

  const exportCSV = () => {
    const headers = ["Date", "Type", "Category", "Description", "Amount", "VAT Relevant"]
    const rows = filteredTransactions.map((t) => [
      new Date(t.date).toISOString().split("T")[0],
      t.type,
      t.category,
      t.description,
      t.amount.toFixed(2),
      t.vatRelevant ? "Yes" : "No",
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `barrkeh-finance-${selectedYear}-${selectedMonth === "all" ? "full" : selectedMonth}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportSummary = () => {
    const summary = `
BARRKEH DIGIPRODUCTS - FINANCIAL SUMMARY
========================================
Period: ${selectedMonth === "all" ? selectedYear : `${months[Number.parseInt(selectedMonth)]} ${selectedYear}`}

INCOME:     €${stats.income.toFixed(2)}
EXPENSES:   €${stats.expenses.toFixed(2)}
-----------------
PROFIT:     €${stats.profit.toFixed(2)}

Tax Set-Aside (${taxSetAsidePercent}% of ${taxSetAsideMethod}): €${stats.taxSetAside.toFixed(2)}

Total Transactions: ${filteredTransactions.length}
    `.trim()

    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `barrkeh-summary-${selectedYear}-${selectedMonth === "all" ? "full" : selectedMonth}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">Export Report</h1>
          <p className="text-muted-foreground mt-1">Download your financial data for accounting.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Select Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Period Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Income</span>
              <span className="font-semibold text-green-500">€{stats.income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expenses</span>
              <span className="font-semibold text-red-500">€{stats.expenses.toFixed(2)}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Profit</span>
              <span className={`font-bold ${stats.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                €{stats.profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Set-Aside</span>
              <span className="font-semibold text-primary">€{stats.taxSetAside.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">{filteredTransactions.length} transactions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" onClick={exportCSV}>
              <Table className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">Export CSV</p>
                <p className="text-xs text-muted-foreground">Full transaction list for spreadsheets</p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" onClick={exportSummary}>
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">Export Summary</p>
                <p className="text-xs text-muted-foreground">Quick overview for records</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
