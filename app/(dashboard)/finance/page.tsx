"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Receipt,
  FileText,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Globe,
  Briefcase,
  Banknote,
  Send,
  CreditCard,
  ArrowRightLeft,
  ShieldCheck,
  BookOpen,
  Calculator,
  Shield,
  FileSpreadsheet,
} from "lucide-react"
import Link from "next/link"

const incomeCategories = {
  etsy: { label: "Etsy", icon: Building, color: "text-orange-500" },
  website: { label: "Website", icon: Globe, color: "text-blue-500" },
  services: { label: "Services", icon: Briefcase, color: "text-purple-500" },
  other: { label: "Other", icon: DollarSign, color: "text-gray-500" },
}

const expenseCategories = [
  "Tools & Software",
  "Advertising",
  "Subscriptions",
  "Design Assets",
  "Education",
  "Banking Fees",
  "Other",
]

export default function FinancePage() {
  const {
    transactions,
    taxSetAsidePercent,
    taxSetAsideMethod,
    setTaxSetAsidePercent,
    setTaxSetAsideMethod,
    chartOfAccounts,
    journalEntries,
    addJournalEntry,
    ledgerEntries,
    addLedgerEntry,
    invoices,
    addInvoice,
    bankConnections,
    connectBank,
    syncBank,
    taxProfile,
    fiscalSettings,
    updateTaxProfile,
    updateFiscalSettings,
    suppliers,
    customers,
    addSupplier,
    addCustomer,
    assets,
    addAsset,
    importJobs,
    addImportJob,
    addDocument,
  } = useStore()

  const [debtorForm, setDebtorForm] = useState({ name: "", amount: "", due: "" })
  const [creditorForm, setCreditorForm] = useState({ name: "", amount: "", due: "" })
  const [invoiceForm, setInvoiceForm] = useState({ client: "", email: "", amount: "", due: "", description: "" })
  const [bankStatusMessage, setBankStatusMessage] = useState("")
  const [supplierForm, setSupplierForm] = useState({ name: "", email: "" })
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", channel: "services" })
  const [assetForm, setAssetForm] = useState({ name: "", value: "", years: "3" })
  const [journalForm, setJournalForm] = useState({ description: "", debit: "1200", credit: "4000", amount: "" })
  const [importNote, setImportNote] = useState("")

  const stats = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Monthly stats
    const monthlyTransactions = transactions.filter((t) => new Date(t.date) >= startOfMonth)
    const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    const monthlyProfit = monthlyIncome - monthlyExpenses

    // Yearly stats
    const yearlyTransactions = transactions.filter((t) => new Date(t.date) >= startOfYear)
    const yearlyIncome = yearlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const yearlyExpenses = yearlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
    const yearlyProfit = yearlyIncome - yearlyExpenses

    // Tax calculation
    const taxBase = taxSetAsideMethod === "profit" ? monthlyProfit : monthlyIncome
    const monthlyTax = Math.max(0, taxBase * (taxSetAsidePercent / 100))

    const yearlyTaxBase = taxSetAsideMethod === "profit" ? yearlyProfit : yearlyIncome
    const yearlyTax = Math.max(0, yearlyTaxBase * (taxSetAsidePercent / 100))

    // VAT relevant
    const vatRelevant = transactions.filter((t) => t.vatRelevant).reduce((sum, t) => sum + t.amount, 0)

    // By stream
    const byStream = {
      etsy: yearlyTransactions
        .filter((t) => t.type === "income" && t.stream === "etsy")
        .reduce((s, t) => s + t.amount, 0),
      website: yearlyTransactions
        .filter((t) => t.type === "income" && t.stream === "website")
        .reduce((s, t) => s + t.amount, 0),
      services: yearlyTransactions
        .filter((t) => t.type === "income" && t.stream === "services")
        .reduce((s, t) => s + t.amount, 0),
      other: yearlyTransactions
        .filter((t) => t.type === "income" && t.stream === "other")
        .reduce((s, t) => s + t.amount, 0),
    }

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlyProfit,
      monthlyTax,
      yearlyIncome,
      yearlyExpenses,
      yearlyProfit,
      yearlyTax,
      vatRelevant,
      byStream,
      recentTransactions: transactions.slice(-10).reverse(),
    }
  }, [transactions, taxSetAsidePercent, taxSetAsideMethod])

  const ledgerSummary = useMemo(() => {
    const debtors = ledgerEntries.filter((l) => l.kind === "debtor")
    const creditors = ledgerEntries.filter((l) => l.kind === "creditor")
    const debtorTotal = debtors.reduce((sum, l) => sum + l.balance, 0)
    const creditorTotal = creditors.reduce((sum, l) => sum + l.balance, 0)
    const overdueDebtors = debtors.filter((l) => l.dueDate && new Date(l.dueDate) < new Date())
    const nextDue = debtors
      .filter((l) => l.dueDate)
      .sort((a, b) => new Date(a.dueDate as Date).getTime() - new Date(b.dueDate as Date).getTime())[0]
    const openInvoices = invoices.filter((inv) => inv.status !== "paid")
    const openInvoiceTotal = openInvoices.reduce((sum, inv) => sum + inv.amount, 0)

    return {
      debtors,
      creditors,
      debtorTotal,
      creditorTotal,
      overdueDebtors,
      nextDue,
      openInvoices,
      openInvoiceTotal,
    }
  }, [ledgerEntries, invoices])

  const handleAddLedgerEntry = (kind: "creditor" | "debtor") => {
    const form = kind === "debtor" ? debtorForm : creditorForm
    if (!form.name || !form.amount) return

    addLedgerEntry({
      kind,
      name: form.name.trim(),
      balance: Number.parseFloat(form.amount),
      currency: "EUR",
      dueDate: form.due ? new Date(form.due) : undefined,
      contactEmail: undefined,
      notes: kind === "debtor" ? "Quick debtor add from dashboard" : "Quick creditor add from dashboard",
    })

    if (kind === "debtor") {
      setDebtorForm({ name: "", amount: "", due: "" })
    } else {
      setCreditorForm({ name: "", amount: "", due: "" })
    }
  }

  const handleGenerateInvoice = () => {
    if (!invoiceForm.client || !invoiceForm.amount) return

    const counter = invoices.length + 1
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(counter).padStart(3, "0")}`
    const dueDate = invoiceForm.due
      ? new Date(invoiceForm.due)
      : new Date(new Date().setDate(new Date().getDate() + 14))
    const amount = Number.parseFloat(invoiceForm.amount)

    addInvoice({
      client: invoiceForm.client,
      email: invoiceForm.email || undefined,
      amount,
      currency: "EUR",
      status: "sent",
      issueDate: new Date(),
      dueDate,
      description: invoiceForm.description || "Generated from finance workspace",
      number: invoiceNumber,
    })

    addDocument({
      type: "invoice",
      name: `${invoiceNumber} - ${invoiceForm.client}`,
    })

    const invoiceText = `
Invoice ${invoiceNumber}
Client: ${invoiceForm.client}${invoiceForm.email ? ` (${invoiceForm.email})` : ""}
Amount: €${amount.toFixed(2)}
Due: ${dueDate.toLocaleDateString()}
Notes: ${invoiceForm.description || "N/A"}
    `.trim()

    const blob = new Blob([invoiceText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${invoiceNumber}.txt`
    link.click()
    URL.revokeObjectURL(url)

    setInvoiceForm({ client: "", email: "", amount: "", due: "", description: "" })
  }

  const primaryBank = bankConnections[0]
  const handleBankConnect = () => {
    if (primaryBank) {
      syncBank(primaryBank.id)
      setBankStatusMessage("Bank feed synced just now.")
      return
    }

    connectBank({
      institution: "Demo Bank",
      status: "connected",
      accounts: [
        {
          id: `acct-${Date.now()}`,
          name: "Operating Account",
          balance: 0,
          currency: "EUR",
          lastUpdated: new Date(),
        },
      ],
      lastSync: new Date(),
    })
    setBankStatusMessage("Connected to a demo bank feed. Balances will refresh on next sync.")
  }

  const handleJournalPost = () => {
    if (!journalForm.description || !journalForm.amount) return
    const amount = Number.parseFloat(journalForm.amount)
    addJournalEntry({
      date: new Date(),
      description: journalForm.description,
      source: "manual",
      lines: [
        { id: `debit-${Date.now()}`, accountId: journalForm.debit, debit: amount, credit: 0 },
        { id: `credit-${Date.now()}`, accountId: journalForm.credit, debit: 0, credit: amount },
      ],
    })
    setJournalForm({ description: "", debit: "1200", credit: "4000", amount: "" })
  }

  const handleAddSupplier = () => {
    if (!supplierForm.name) return
    addSupplier({ name: supplierForm.name, email: supplierForm.email || undefined })
    setSupplierForm({ name: "", email: "" })
  }

  const handleAddCustomer = () => {
    if (!customerForm.name) return
    addCustomer({ name: customerForm.name, email: customerForm.email || undefined, channel: customerForm.channel as typeof customerForm.channel })
    setCustomerForm({ name: "", email: "", channel: "services" })
  }

  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.value) return
    addAsset({
      name: assetForm.name,
      category: "equipment",
      value: Number.parseFloat(assetForm.value),
      salvageValue: 0,
      depreciationYears: Number.parseInt(assetForm.years),
      startDate: new Date(),
    })
    setAssetForm({ name: "", value: "", years: "3" })
  }

  const handleImport = (type: "bank_csv" | "etsy_csv") => {
    addImportJob({ type, summary: importNote || undefined })
    setImportNote("")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            Finance + Tax Vault
          </h1>
          <p className="text-muted-foreground mt-1">Your mini accounting system. Track income, expenses, and taxes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/finance/new?type=income">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              Add Income
            </Link>
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/finance/new?type=expense">
              <ArrowDownRight className="h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Business Profile & Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fiscal year start</span>
              <span className="font-semibold">
                {new Date(2024, fiscalSettings.fiscalYearStartMonth - 1, 1).toLocaleDateString("en", {
                  month: "long",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Invoice numbering</span>
              <span className="font-semibold">
                {fiscalSettings.invoiceNumberPrefix}
                {String(fiscalSettings.nextInvoiceNumber).padStart(3, "0")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lock date</span>
              <span className="font-semibold">{fiscalSettings.lockDate ? new Date(fiscalSettings.lockDate).toLocaleDateString() : "Open"}</span>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => updateFiscalSettings({ lockDate: new Date() })}
            >
              Lock to today
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              VAT Profile (NL)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">KOR small business scheme</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{taxProfile.korEnabled ? "On" : "Off"}</span>
                <Switch checked={taxProfile.korEnabled} onCheckedChange={(checked) => updateTaxProfile({ korEnabled: checked })} />
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">VAT rates</p>
              <div className="flex flex-wrap gap-2">
                {taxProfile.vatRates.map((rate) => (
                  <Badge key={rate.id} variant="outline" className="text-xs">
                    {rate.name}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{taxProfile.placeOfSupplyNotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              General Ledger Quick Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <Input
                value={journalForm.description}
                onChange={(e) => setJournalForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="bg-secondary"
              />
              <Input
                type="number"
                value={journalForm.amount}
                onChange={(e) => setJournalForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="Amount"
                className="bg-secondary"
              />
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={journalForm.debit}
                  onValueChange={(v) => setJournalForm((prev) => ({ ...prev, debit: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Debit" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartOfAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.code} {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={journalForm.credit}
                  onValueChange={(v) => setJournalForm((prev) => ({ ...prev, credit: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Credit" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartOfAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.code} {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleJournalPost}>
              Post balanced entry
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue MTD</p>
                <p className="text-3xl font-bold text-green-500">€{stats.monthlyIncome.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expenses MTD</p>
                <p className="text-3xl font-bold text-red-500">€{stats.monthlyExpenses.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit MTD</p>
                <p className={`text-3xl font-bold ${stats.monthlyProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  €{stats.monthlyProfit.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tax Set-Aside</p>
                <p className="text-3xl font-bold text-primary">€{stats.monthlyTax.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {taxSetAsidePercent}% of {taxSetAsideMethod}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              Accounts Receivable (Debtors)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-green-500">€{ledgerSummary.debtorTotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Open invoices</p>
                <p className="text-foreground font-semibold">{ledgerSummary.openInvoices.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {ledgerSummary.overdueDebtors.length} overdue
              </Badge>
              {ledgerSummary.nextDue && (
                <span>
                  Next due {new Date(ledgerSummary.nextDue.dueDate as Date).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {ledgerSummary.debtors.length > 0 ? (
                ledgerSummary.debtors.slice(0, 3).map((debtor) => (
                  <div
                    key={debtor.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{debtor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {debtor.dueDate ? new Date(debtor.dueDate).toLocaleDateString() : "Flexible terms"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-500">€{debtor.balance.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-xs">
                        Debtor
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No debtors logged yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-border p-3 bg-secondary/30 space-y-3">
              <p className="text-xs text-muted-foreground">Quick add debtor</p>
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  value={debtorForm.name}
                  onChange={(e) => setDebtorForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Client name"
                  className="bg-background"
                />
                <Input
                  type="number"
                  value={debtorForm.amount}
                  onChange={(e) => setDebtorForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount"
                  className="bg-background"
                />
                <Input
                  type="date"
                  value={debtorForm.due}
                  onChange={(e) => setDebtorForm((prev) => ({ ...prev, due: e.target.value }))}
                  className="bg-background"
                />
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleAddLedgerEntry("debtor")}>
                Add Debtor
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Accounts Payable (Creditors)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Upcoming payouts</p>
                <p className="text-2xl font-bold text-red-500">€{ledgerSummary.creditorTotal.toFixed(2)}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {ledgerSummary.creditors.length} vendors
              </Badge>
            </div>

            <div className="space-y-2">
              {ledgerSummary.creditors.length > 0 ? (
                ledgerSummary.creditors.slice(0, 3).map((creditor) => (
                  <div
                    key={creditor.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium text-foreground">{creditor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {creditor.dueDate ? new Date(creditor.dueDate).toLocaleDateString() : "On receipt"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-500">€{creditor.balance.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        Creditor
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No creditors recorded yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-border p-3 bg-secondary/30 space-y-3">
              <p className="text-xs text-muted-foreground">Quick add creditor</p>
              <div className="grid gap-2 md:grid-cols-3">
                <Input
                  value={creditorForm.name}
                  onChange={(e) => setCreditorForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Vendor name"
                  className="bg-background"
                />
                <Input
                  type="number"
                  value={creditorForm.amount}
                  onChange={(e) => setCreditorForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount"
                  className="bg-background"
                />
                <Input
                  type="date"
                  value={creditorForm.due}
                  onChange={(e) => setCreditorForm((prev) => ({ ...prev, due: e.target.value }))}
                  className="bg-background"
                />
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleAddLedgerEntry("creditor")}
              >
                Add Creditor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Invoice Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Open invoice value</p>
                <p className="font-semibold text-foreground">€{ledgerSummary.openInvoiceTotal.toFixed(2)}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {ledgerSummary.openInvoices.length} open
              </Badge>
            </div>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                handleGenerateInvoice()
              }}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={invoiceForm.client}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, client: e.target.value }))}
                  placeholder="Client or company"
                  className="bg-secondary"
                  required
                />
                <Input
                  type="email"
                  value={invoiceForm.email}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Billing email (optional)"
                  className="bg-secondary"
                />
                <Input
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Amount (EUR)"
                  className="bg-secondary"
                  required
                />
                <Input
                  type="date"
                  value={invoiceForm.due}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, due: e.target.value }))}
                  className="bg-secondary"
                />
              </div>
              <Textarea
                value={invoiceForm.description}
                onChange={(e) => setInvoiceForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Line items or notes"
                className="bg-secondary"
              />
              <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
                Generate invoice + download
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Bank Connections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold text-foreground">
                  {primaryBank ? "Connected" : "Not connected"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {primaryBank?.lastSync
                    ? `Last sync ${new Date(primaryBank.lastSync).toLocaleString()}`
                    : "Sync to reconcile transactions"}
                </p>
              </div>
              <Badge variant={primaryBank ? "secondary" : "outline"} className="text-xs">
                {primaryBank ? primaryBank.institution : "No bank"}
              </Badge>
            </div>

            {primaryBank && (
              <div className="grid gap-2 sm:grid-cols-2">
                {primaryBank.accounts.map((account) => (
                  <div key={account.id} className="rounded-lg border border-border p-3 bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{account.name}</span>
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-lg font-bold mt-1 text-foreground">€{account.balance.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(account.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleBankConnect}>
                {primaryBank ? "Sync bank feed" : "Connect bank"}
              </Button>
              {primaryBank && (
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/finance/export">Export + reconcile</Link>
                </Button>
              )}
            </div>
            {bankStatusMessage && <p className="text-xs text-muted-foreground">{bankStatusMessage}</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Chart of Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartOfAccounts.slice(0, 6).map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell className="font-semibold">{acc.code}</TableCell>
                    <TableCell>{acc.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground text-xs">{acc.type}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {acc.channel ? acc.channel : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-3">
              Keep CoA lean: revenue by channel, VAT payable, AR/AP, bank/cash, recurring expenses, equity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {journalEntries.slice(-4).reverse().map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border p-3 bg-secondary/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{entry.description}</span>
                  <span className="text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  {entry.lines.map((line) => (
                    <div key={line.id} className="flex items-center justify-between">
                      <span>{line.accountId}</span>
                      <span className="text-green-500">€{line.debit || 0}</span>
                      <span className="text-red-500">€{line.credit || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              All postings are double-entry. Use AR/AP + VAT accounts so your balance sheet stays balanced.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Income by Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Income by Stream (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(incomeCategories).map(([key, config]) => {
              const amount = stats.byStream[key as keyof typeof stats.byStream]
              const percentage = stats.yearlyIncome > 0 ? (amount / stats.yearlyIncome) * 100 : 0
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                      {config.label}
                    </span>
                    <span className="font-medium text-foreground">€{amount.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-1.5" />
                </div>
              )
            })}
            <div className="pt-2 border-t border-border">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">Total YTD</span>
                <span className="text-green-500">€{stats.yearlyIncome.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Set-Aside Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              Tax Set-Aside Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Percentage</label>
              <div className="flex gap-2">
                {[15, 20, 25, 30].map((pct) => (
                  <Button
                    key={pct}
                    variant={taxSetAsidePercent === pct ? "default" : "outline"}
                    size="sm"
                    className={taxSetAsidePercent !== pct ? "bg-transparent" : ""}
                    onClick={() => setTaxSetAsidePercent(pct)}
                  >
                    {pct}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Calculate based on</label>
              <div className="flex gap-2">
                <Button
                  variant={taxSetAsideMethod === "profit" ? "default" : "outline"}
                  size="sm"
                  className={taxSetAsideMethod !== "profit" ? "bg-transparent" : ""}
                  onClick={() => setTaxSetAsideMethod("profit")}
                >
                  Profit
                </Button>
                <Button
                  variant={taxSetAsideMethod === "revenue" ? "default" : "outline"}
                  size="sm"
                  className={taxSetAsideMethod !== "revenue" ? "bg-transparent" : ""}
                  onClick={() => setTaxSetAsideMethod("revenue")}
                >
                  Revenue
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">Yearly Tax Set-Aside</p>
              <p className="text-2xl font-bold text-primary">€{stats.yearlyTax.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
              <Link href="/finance/monthly-close">
                <Calendar className="h-4 w-4" />
                Monthly Close
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
              <Link href="/finance/documents">
                <Receipt className="h-4 w-4" />
                Document Vault
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
              <Link href="/finance/export">
                <Download className="h-4 w-4" />
                Export Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Customers (AR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Input
                value={customerForm.name}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Customer name"
                className="bg-secondary"
              />
              <Input
                value={customerForm.email}
                onChange={(e) => setCustomerForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email (optional)"
                className="bg-secondary"
              />
              <Select
                value={customerForm.channel}
                onValueChange={(v) => setCustomerForm((prev) => ({ ...prev, channel: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="etsy">Etsy</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleAddCustomer}>
                Add customer
              </Button>
            </div>
            <div className="space-y-2">
              {customers.slice(0, 3).map((cust) => (
                <div key={cust.id} className="rounded-lg border border-border p-3 bg-secondary/30">
                  <p className="font-medium text-foreground">{cust.name}</p>
                  <p className="text-xs text-muted-foreground">{cust.channel || "general"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Suppliers (AP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Input
                value={supplierForm.name}
                onChange={(e) => setSupplierForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Supplier name"
                className="bg-secondary"
              />
              <Input
                value={supplierForm.email}
                onChange={(e) => setSupplierForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email (optional)"
                className="bg-secondary"
              />
              <Button variant="outline" className="w-full bg-transparent" onClick={handleAddSupplier}>
                Add supplier
              </Button>
            </div>
            <div className="space-y-2">
              {suppliers.slice(0, 3).map((sup) => (
                <div key={sup.id} className="rounded-lg border border-border p-3 bg-secondary/30">
                  <p className="font-medium text-foreground">{sup.name}</p>
                  <p className="text-xs text-muted-foreground">{sup.email || "—"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Assets & Depreciation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-3">
              <Input
                value={assetForm.name}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Asset"
                className="bg-secondary"
              />
              <Input
                type="number"
                value={assetForm.value}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="Value"
                className="bg-secondary"
              />
              <Input
                type="number"
                value={assetForm.years}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, years: e.target.value }))}
                placeholder="Years"
                className="bg-secondary"
              />
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleAddAsset}>
              Add asset
            </Button>
            <div className="space-y-2">
              {assets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="rounded-lg border border-border p-3 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{asset.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {asset.depreciationYears} yrs
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">€{asset.value.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Imports & Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Bring in bank CSVs and Etsy payouts, then post to bank/fee/sales/VAT accounts for clean reconciliation.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <Button variant="outline" className="bg-transparent" onClick={() => handleImport("bank_csv")}>
                Upload bank CSV
              </Button>
              <Button variant="outline" className="bg-transparent" onClick={() => handleImport("etsy_csv")}>
                Import Etsy CSV
              </Button>
            </div>
            <Textarea
              value={importNote}
              onChange={(e) => setImportNote(e.target.value)}
              placeholder="Notes for this import (period, file name)"
              className="bg-secondary"
            />
            <div className="space-y-1 text-xs text-muted-foreground">
              {importJobs.slice(-3).reverse().map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-md border border-border p-2">
                  <span className="capitalize">{job.type.replace("_", " ")}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              VAT & Reporting Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              NL-ready outputs: VAT return, P&L, Balance Sheet, Trial Balance, General Ledger, Debtor/Creditor listings, Asset register.
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Track VAT per transaction with links to receipts.</li>
              <li>Lock periods after filing to keep the audit trail intact.</li>
              <li>Store evidence for place-of-supply (EU digital services).</li>
            </ul>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/finance/monthly-close">Run monthly close</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Recent Transactions
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href="/finance/transactions">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {stats.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        {transaction.vatRelevant && (
                          <Badge variant="secondary" className="text-xs">
                            VAT
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.type === "income" ? "+" : "-"}€{transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No transactions yet</p>
              <Button variant="link" size="sm" asChild className="mt-2">
                <Link href="/finance/new">Add your first transaction</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
