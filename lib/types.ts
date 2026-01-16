// Core data objects for Barrkeh Super System
export interface Product {
  id: string
  name: string
  status: "idea" | "build" | "polish" | "demo" | "listed" | "optimizing"
  etsyLink?: string
  pricing?: number
  description?: string
  files: string[]
  bundles?: string[]
  testimonials: Testimonial[]
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  productId?: string
  status: "planning" | "in-progress" | "review" | "completed"
  milestones: Milestone[]
  tasks: Task[]
  definitionOfDone: string[]
  startDate?: Date
  dueDate?: Date
  createdAt: Date
}

export interface Milestone {
  id: string
  name: string
  completed: boolean
  dueDate?: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "done" | "stuck"
  priority: "low" | "medium" | "high" | "urgent"
  projectId?: string
  productId?: string
  dueDate?: Date
  stuckSince?: Date
  createdAt: Date
}

export interface ContentPiece {
  id: string
  type: "post" | "reel" | "carousel" | "story" | "pin" | "video"
  platform: "instagram" | "tiktok" | "pinterest" | "facebook" | "linkedin"
  productId?: string
  status: "idea" | "drafting" | "ready" | "scheduled" | "posted"
  scheduledDate?: Date
  postedDate?: Date
  caption?: string
  hooks?: string[]
  hashtags?: string[]
  assets: Asset[]
  performance?: ContentPerformance
  createdAt: Date
}

export interface ContentPerformance {
  views?: number
  saves?: number
  clicks?: number
  sales?: number
  notes?: string
}

export interface Asset {
  id: string
  type: "image" | "video" | "export"
  url: string
  name: string
  contentPieceId?: string
  productId?: string
  createdAt: Date
}

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  currency: string
  category: string
  stream?: "etsy" | "website" | "services" | "other"
  counterparty?: string
  counterpartyType?: "creditor" | "debtor"
  status?: "open" | "cleared"
  accountId?: string
  description: string
  vatRelevant: boolean
  receiptId?: string
  date: Date
  createdAt: Date
}

export interface Document {
  id: string
  type: "receipt" | "invoice" | "contract" | "kvk" | "license" | "other"
  name: string
  url?: string
  transactionId?: string
  projectId?: string
  createdAt: Date
}

export interface LedgerEntry {
  id: string
  kind: "creditor" | "debtor"
  name: string
  balance: number
  currency: string
  dueDate?: Date
  lastActivity: Date
  contactEmail?: string
  notes?: string
}

export interface Invoice {
  id: string
  number: string
  client: string
  email?: string
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue"
  issueDate: Date
  dueDate: Date
  description?: string
  journalEntryId?: string
}

export interface BankAccount {
  id: string
  name: string
  balance: number
  currency: string
  lastUpdated: Date
}

export interface BankConnection {
  id: string
  institution: string
  status: "connected" | "needs_auth" | "disconnected"
  lastSync?: Date
  accounts: BankAccount[]
}

export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "revenue"
  | "expense"
  | "contra-asset"
  | "contra-liability"

export interface ChartOfAccount {
  id: string
  code: string
  name: string
  type: AccountType
  description?: string
  isActive: boolean
  vatRateId?: string
  channel?: "etsy" | "website" | "services" | "general"
}

export interface JournalLine {
  id: string
  accountId: string
  debit: number
  credit: number
  description?: string
}

export interface JournalEntry {
  id: string
  date: Date
  description: string
  lines: JournalLine[]
  source?: "bank" | "etsy" | "manual" | "import" | "invoice" | "bill"
  reference?: string
  locked?: boolean
}

export interface VATRate {
  id: string
  name: string
  rate: number
  scope: "domestic" | "eu" | "non-eu"
  code: "high" | "low" | "zero" | "exempt"
}

export interface TaxProfile {
  country: "NL"
  korEnabled: boolean
  vatRates: VATRate[]
  placeOfSupplyNotes: string
  vatNumber?: string
  returnFrequency: "monthly" | "quarterly" | "yearly"
}

export interface FiscalSettings {
  fiscalYearStartMonth: number
  openingEquity: number
  openingDate: Date
  lockDate?: Date
  invoiceNumberPrefix: string
  nextInvoiceNumber: number
  expenseRefPrefix: string
  nextExpenseRef: number
}

export interface Supplier {
  id: string
  name: string
  email?: string
  vatNumber?: string
  defaultAccountId?: string
}

export interface Customer {
  id: string
  name: string
  email?: string
  vatNumber?: string
  country?: string
  channel?: "etsy" | "website" | "services"
}

export interface AssetItem {
  id: string
  name: string
  category: "equipment" | "device" | "furniture" | "other"
  value: number
  salvageValue: number
  depreciationYears: number
  startDate: Date
  disposed?: boolean
  disposalDate?: Date
}

export interface ImportJob {
  id: string
  type: "bank_csv" | "etsy_csv" | "stripe_csv"
  status: "pending" | "processed" | "failed"
  createdAt: Date
  processedAt?: Date
  errors?: string[]
  summary?: string
}

export interface Testimonial {
  id: string
  productId: string
  original: string
  rewritten?: string
  rating?: number
  source?: string
  date: Date
}

export interface SOP {
  id: string
  title: string
  category: string
  steps: SOPStep[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SOPStep {
  id: string
  order: number
  instruction: string
  notes?: string
}

export interface Idea {
  id: string
  title: string
  description?: string
  tags: string[]
  productId?: string
  season?: string
  createdAt: Date
}

export interface BrandRule {
  id: string
  category: "font" | "color" | "pattern" | "tone" | "other"
  name: string
  value: string
  notes?: string
}

// Dashboard widget types
export interface DashboardStats {
  contentReady: number
  contentScheduled: number
  contentMissing: number
  monthlyRevenue: number
  monthlyExpenses: number
  monthlyProfit: number
  taxSetAside: number
  stuckTasks: Task[]
  topPriorities: Task[]
  currentProduct?: Product
}
