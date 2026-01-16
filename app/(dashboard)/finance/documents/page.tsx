"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { FileText, ArrowLeft, Upload, Search, Trash2, ExternalLink, Receipt, File, FileCheck } from "lucide-react"
import Link from "next/link"

const documentTypes = {
  receipt: { label: "Receipt", icon: Receipt, color: "text-green-500" },
  invoice: { label: "Invoice", icon: FileText, color: "text-blue-500" },
  contract: { label: "Contract", icon: FileCheck, color: "text-purple-500" },
  kvk: { label: "KvK Document", icon: File, color: "text-amber-500" },
  license: { label: "License", icon: FileText, color: "text-cyan-500" },
  other: { label: "Other", icon: File, color: "text-gray-500" },
}

export default function DocumentVaultPage() {
  const { documents, addDocument, deleteDocument } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesType
  })

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addDocument({
        type: "receipt",
        name: file.name,
        url: URL.createObjectURL(file),
      })
    }
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
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-foreground">Document Vault</h1>
          <p className="text-muted-foreground mt-1">
            Store receipts, invoices, contracts, and important business documents.
          </p>
        </div>
      </div>

      {/* Search and Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="pl-10 bg-secondary"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(documentTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
            <Button className="gap-2 bg-primary text-primary-foreground" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const config = documentTypes[doc.type as keyof typeof documentTypes]
            return (
              <Card key={doc.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center`}>
                      <config.icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.name}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {config.label}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {doc.url && (
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-red-500 hover:text-red-600"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="h-3 w-3" />
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
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
            </p>
            <Button className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Document Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Document Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(documentTypes).map(([key, config]) => {
              const count = documents.filter((d) => d.type === key).length
              return (
                <div key={key} className="flex items-center gap-3 rounded-lg border border-border p-3 bg-secondary/30">
                  <config.icon className={`h-5 w-5 ${config.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{count} documents</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
