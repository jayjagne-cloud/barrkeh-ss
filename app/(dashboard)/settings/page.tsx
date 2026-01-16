"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { BarrkehLogo } from "@/components/barrkeh-logo"
import { Settings, Wallet, Shield, Download, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { taxSetAsidePercent, setTaxSetAsidePercent, taxSetAsideMethod, setTaxSetAsideMethod } = useStore()
  const [localTaxPercent, setLocalTaxPercent] = useState(taxSetAsidePercent.toString())

  const handleTaxPercentSave = () => {
    const percent = Number.parseFloat(localTaxPercent)
    if (!isNaN(percent) && percent >= 0 && percent <= 100) {
      setTaxSetAsidePercent(percent)
    }
  }

  const handleExportData = () => {
    const data = localStorage.getItem("barrkeh-super-system")
    if (data) {
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `barrkeh-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem("barrkeh-super-system")
      window.location.reload()
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your Barrkeh Super System</p>
        </div>
      </div>

      {/* Brand */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarrkehLogo size={24} />
            Brand Identity
          </CardTitle>
          <CardDescription>Your brand information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input value="Barrkeh DigiProducts" disabled className="bg-secondary/50" />
            </div>
            <div className="space-y-2">
              <Label>Primary Platform</Label>
              <Input value="Etsy" disabled className="bg-secondary/50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Tax Set-Aside
          </CardTitle>
          <CardDescription>Configure your automatic tax savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Set-Aside Percentage</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={localTaxPercent}
                  onChange={(e) => setLocalTaxPercent(e.target.value)}
                  className="bg-secondary/50"
                />
                <Button variant="outline" onClick={handleTaxPercentSave}>
                  Save
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Current: {taxSetAsidePercent}%</p>
            </div>

            <div className="space-y-2">
              <Label>Calculation Method</Label>
              <Select value={taxSetAsideMethod} onValueChange={(v) => setTaxSetAsideMethod(v as "profit" | "revenue")}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Based on Profit</SelectItem>
                  <SelectItem value="revenue">Based on Revenue</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {taxSetAsideMethod === "profit"
                  ? "Tax calculated on income minus expenses"
                  : "Tax calculated on total income"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>Export or clear your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-medium text-foreground">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
            </div>
            <Button variant="outline" onClick={handleExportData} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div>
              <p className="font-medium text-foreground">Clear All Data</p>
              <p className="text-sm text-muted-foreground">Permanently delete everything</p>
            </div>
            <Button variant="destructive" onClick={handleClearData} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Barrkeh Super System v1.0</p>
        <p className="text-xs mt-1">Built with precision for premium digital product creators</p>
      </div>
    </div>
  )
}
