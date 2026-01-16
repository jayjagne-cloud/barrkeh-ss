"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store"
import { Wallet, ArrowLeft, Save, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"

const expenseCategories = [
  "Tools & Software",
  "Advertising",
  "Subscriptions",
  "Design Assets",
  "Education",
  "Banking Fees",
  "Shipping",
  "Office Supplies",
  "Other",
]

const incomeCategories = ["Product Sales", "Services", "Affiliate", "Refund", "Other"]

function NewTransactionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addTransaction } = useStore()

  const initialType = searchParams.get("type") as "income" | "expense" | null

  const [type, setType] = useState<"income" | "expense">(initialType || "expense")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [stream, setStream] = useState<"etsy" | "website" | "services" | "other">("etsy")
  const [vatRelevant, setVatRelevant] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description) return

    addTransaction({
      type,
      amount: Number.parseFloat(amount),
      currency: "EUR",
      description,
      category: category || (type === "income" ? "Product Sales" : "Other"),
      stream: type === "income" ? stream : undefined,
      vatRelevant,
      date: new Date(date),
    })

    router.push("/finance")
  }

  const categories = type === "income" ? incomeCategories : expenseCategories

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/finance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">
            New Transaction
          </h1>
          <p className="text-muted-foreground mt-1">Record income or expenses.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                className={`flex-1 gap-2 ${type !== "income" ? "bg-transparent" : "bg-green-600 hover:bg-green-700"}`}
                onClick={() => setType("income")}
              >
                <ArrowUpRight className="h-4 w-4" />
                Income
              </Button>
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                className={`flex-1 gap-2 ${type !== "expense" ? "bg-transparent" : "bg-red-600 hover:bg-red-700"}`}
                onClick={() => setType("expense")}
              >
                <ArrowDownRight className="h-4 w-4" />
                Expense
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Amount (EUR) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-secondary text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-secondary" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {type === "income" && (
                <div className="space-y-2">
                  <Label>Income Stream</Label>
                  <Select value={stream} onValueChange={(v) => setStream(v as typeof stream)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etsy">Etsy</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this transaction for?"
                className="bg-secondary"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-secondary/30">
              <div>
                <p className="font-medium text-foreground">VAT Relevant</p>
                <p className="text-sm text-muted-foreground">Mark if this transaction is relevant for VAT reporting</p>
              </div>
              <Switch checked={vatRelevant} onCheckedChange={setVatRelevant} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/finance">Cancel</Link>
              </Button>
              <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4" />
                Save Transaction
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default function NewTransactionPage() {
  return (
    <Suspense fallback={null}>
      <NewTransactionForm />
    </Suspense>
  )
}
