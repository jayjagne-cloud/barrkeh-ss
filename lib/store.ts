"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Product,
  Project,
  Task,
  ContentPiece,
  Transaction,
  Document,
  SOP,
  Idea,
  BrandRule,
  LedgerEntry,
  Invoice,
  BankConnection,
  ChartOfAccount,
  JournalEntry,
  TaxProfile,
  FiscalSettings,
  Supplier,
  Customer,
  AssetItem,
  ImportJob,
} from "./types"

interface AppState {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  // Content
  content: ContentPiece[]
  addContent: (content: Omit<ContentPiece, "id" | "createdAt">) => void
  updateContent: (id: string, updates: Partial<ContentPiece>) => void
  deleteContent: (id: string) => void

  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Chart of Accounts
  chartOfAccounts: ChartOfAccount[]
  addAccount: (account: Omit<ChartOfAccount, "id">) => void
  updateAccount: (id: string, updates: Partial<ChartOfAccount>) => void

  // Journal
  journalEntries: JournalEntry[]
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "locked">) => void
  lockJournalEntry: (id: string) => void

  // Ledger
  ledgerEntries: LedgerEntry[]
  addLedgerEntry: (entry: Omit<LedgerEntry, "id" | "lastActivity">) => void
  updateLedgerEntry: (id: string, updates: Partial<LedgerEntry>) => void
  deleteLedgerEntry: (id: string) => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, "id" | "status" | "number"> & { status?: Invoice["status"]; number?: string }) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // Banking
  bankConnections: BankConnection[]
  connectBank: (connection: Omit<BankConnection, "id" | "lastSync"> & { lastSync?: Date }) => void
  syncBank: (id: string) => void
  disconnectBank: (id: string) => void

  // Tax + Fiscal
  taxProfile: TaxProfile
  fiscalSettings: FiscalSettings
  updateTaxProfile: (updates: Partial<TaxProfile>) => void
  updateFiscalSettings: (updates: Partial<FiscalSettings>) => void

  // Contacts
  suppliers: Supplier[]
  customers: Customer[]
  addSupplier: (supplier: Omit<Supplier, "id">) => void
  addCustomer: (customer: Omit<Customer, "id">) => void

  // Assets
  assets: AssetItem[]
  addAsset: (asset: Omit<AssetItem, "id">) => void
  disposeAsset: (id: string, disposalDate: Date) => void

  // Imports
  importJobs: ImportJob[]
  addImportJob: (job: Omit<ImportJob, "id" | "status" | "createdAt">) => void
  completeImportJob: (id: string, summary?: string, errors?: string[]) => void

  // Documents
  documents: Document[]
  addDocument: (document: Omit<Document, "id" | "createdAt">) => void
  deleteDocument: (id: string) => void

  // SOPs
  sops: SOP[]
  addSOP: (sop: Omit<SOP, "id" | "createdAt" | "updatedAt">) => void
  updateSOP: (id: string, updates: Partial<SOP>) => void
  deleteSOP: (id: string) => void

  // Ideas
  ideas: Idea[]
  addIdea: (idea: Omit<Idea, "id" | "createdAt">) => void
  deleteIdea: (id: string) => void

  // Brand Rules
  brandRules: BrandRule[]
  addBrandRule: (rule: Omit<BrandRule, "id">) => void
  updateBrandRule: (id: string, updates: Partial<BrandRule>) => void
  deleteBrandRule: (id: string) => void

  // Settings
  taxSetAsidePercent: number
  setTaxSetAsidePercent: (percent: number) => void
  taxSetAsideMethod: "profit" | "revenue"
  setTaxSetAsideMethod: (method: "profit" | "revenue") => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Products
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Projects
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: generateId(), createdAt: new Date() }],
        })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // Tasks
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: generateId(), createdAt: new Date() }],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      // Content
      content: [],
      addContent: (content) =>
        set((state) => ({
          content: [...state.content, { ...content, id: generateId(), createdAt: new Date() }],
        })),
      updateContent: (id, updates) =>
        set((state) => ({
          content: state.content.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteContent: (id) => set((state) => ({ content: state.content.filter((c) => c.id !== id) })),

      // Transactions
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, { ...transaction, id: generateId(), createdAt: new Date() }],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Chart of Accounts
      chartOfAccounts: [
        { id: "1000", code: "1000", name: "Cash - Operating", type: "asset", isActive: true },
        { id: "1100", code: "1100", name: "Bank - Operating", type: "asset", isActive: true },
        { id: "1200", code: "1200", name: "Accounts Receivable", type: "asset", isActive: true },
        { id: "2000", code: "2000", name: "Accounts Payable", type: "liability", isActive: true },
        { id: "2100", code: "2100", name: "VAT Payable", type: "liability", isActive: true },
        { id: "3000", code: "3000", name: "Owner Equity", type: "equity", isActive: true },
        { id: "4000", code: "4000", name: "Sales - Etsy", type: "revenue", isActive: true, channel: "etsy" },
        { id: "4010", code: "4010", name: "Sales - Website", type: "revenue", isActive: true, channel: "website" },
        { id: "4020", code: "4020", name: "Services Revenue", type: "revenue", isActive: true, channel: "services" },
        { id: "5000", code: "5000", name: "Software & Tools", type: "expense", isActive: true },
        { id: "5100", code: "5100", name: "Advertising", type: "expense", isActive: true },
        { id: "5200", code: "5200", name: "Education", type: "expense", isActive: true },
        { id: "5300", code: "5300", name: "Professional Fees", type: "expense", isActive: true },
        { id: "5400", code: "5400", name: "Hosting & Domains", type: "expense", isActive: true },
      ],
      addAccount: (account) =>
        set((state) => ({
          chartOfAccounts: [...state.chartOfAccounts, { ...account, id: generateId() }],
        })),
      updateAccount: (id, updates) =>
        set((state) => ({
          chartOfAccounts: state.chartOfAccounts.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc)),
        })),

      // Journal
      journalEntries: [
        {
          id: generateId(),
          date: new Date(),
          description: "Opening Balance",
          lines: [
            { id: generateId(), accountId: "1100", debit: 5000, credit: 0 },
            { id: generateId(), accountId: "3000", debit: 0, credit: 5000 },
          ],
          source: "manual",
          reference: "OPENING",
        },
      ],
      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [...state.journalEntries, { ...entry, id: generateId(), locked: false }],
        })),
      lockJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((je) => (je.id === id ? { ...je, locked: true } : je)),
        })),

      // Ledger
      ledgerEntries: [
        {
          id: generateId(),
          kind: "debtor",
          name: "Acme Studios",
          balance: 2400,
          currency: "EUR",
          dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
          lastActivity: new Date(),
          contactEmail: "accounts@acmestudio.com",
          notes: "Awaiting final files sign-off.",
        },
        {
          id: generateId(),
          kind: "creditor",
          name: "Cloud Render Co",
          balance: 850,
          currency: "EUR",
          dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          lastActivity: new Date(),
          contactEmail: "billing@cloudrender.co",
          notes: "Monthly infra + storage.",
        },
      ],
      addLedgerEntry: (entry) =>
        set((state) => ({
          ledgerEntries: [
            ...state.ledgerEntries,
            {
              ...entry,
              id: generateId(),
              lastActivity: new Date(),
            },
          ],
        })),
      updateLedgerEntry: (id, updates) =>
        set((state) => ({
          ledgerEntries: state.ledgerEntries.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deleteLedgerEntry: (id) =>
        set((state) => ({
          ledgerEntries: state.ledgerEntries.filter((l) => l.id !== id),
        })),

      // Invoices
      invoices: [
        {
          id: generateId(),
          number: "INV-2024-001",
          client: "Acme Studios",
          email: "accounts@acmestudio.com",
          amount: 2400,
          currency: "EUR",
          status: "sent",
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
          description: "Creative direction + video kit",
        },
      ],
      addInvoice: (invoice) =>
        set((state) => {
          const nextNumber = invoice.number || `${state.fiscalSettings.invoiceNumberPrefix}${String(state.fiscalSettings.nextInvoiceNumber).padStart(3, "0")}`
          return {
            invoices: [
              ...state.invoices,
              {
                ...invoice,
                id: generateId(),
                number: nextNumber,
                status: invoice.status || "draft",
              },
            ],
            fiscalSettings: {
              ...state.fiscalSettings,
              nextInvoiceNumber: state.fiscalSettings.nextInvoiceNumber + 1,
            },
          }
        }),
      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)),
        })),
      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        })),

      // Banking
      bankConnections: [
        {
          id: generateId(),
          institution: "Demo Bank",
          status: "connected",
          lastSync: new Date(),
          accounts: [
            {
              id: generateId(),
              name: "Operating Account",
              balance: 12540.75,
              currency: "EUR",
              lastUpdated: new Date(),
            },
            {
              id: generateId(),
              name: "Tax Reserve",
              balance: 4800,
              currency: "EUR",
              lastUpdated: new Date(),
            },
          ],
        },
      ],
      connectBank: (connection) =>
        set((state) => ({
          bankConnections: [
            ...state.bankConnections,
            {
              ...connection,
              id: generateId(),
              lastSync: connection.lastSync ?? new Date(),
            },
          ],
        })),
      syncBank: (id) =>
        set((state) => ({
          bankConnections: state.bankConnections.map((conn) =>
            conn.id === id ? { ...conn, lastSync: new Date(), status: "connected" } : conn,
          ),
        })),
      disconnectBank: (id) =>
        set((state) => ({
          bankConnections: state.bankConnections.filter((conn) => conn.id !== id),
        })),

      // Tax + Fiscal
      taxProfile: {
        country: "NL",
        korEnabled: false,
        vatRates: [
          { id: "VAT-HIGH", name: "Standard 21%", rate: 21, scope: "domestic", code: "high" },
          { id: "VAT-LOW", name: "Reduced 9%", rate: 9, scope: "domestic", code: "low" },
          { id: "VAT-ZERO", name: "Zero Rated", rate: 0, scope: "eu", code: "zero" },
        ],
        placeOfSupplyNotes: "EU B2C digital services: VAT based on customer location; keep two pieces of evidence.",
        vatNumber: undefined,
        returnFrequency: "quarterly",
      },
      fiscalSettings: {
        fiscalYearStartMonth: 1,
        openingEquity: 0,
        openingDate: new Date(new Date().getFullYear(), 0, 1),
        lockDate: undefined,
        invoiceNumberPrefix: "INV-2024-",
        nextInvoiceNumber: 2,
        expenseRefPrefix: "EXP-2024-",
        nextExpenseRef: 1,
      },
      updateTaxProfile: (updates) =>
        set((state) => ({
          taxProfile: { ...state.taxProfile, ...updates },
        })),
      updateFiscalSettings: (updates) =>
        set((state) => ({
          fiscalSettings: { ...state.fiscalSettings, ...updates },
        })),

      // Contacts
      suppliers: [
        { id: generateId(), name: "Cloud Render Co", email: "billing@cloudrender.co", defaultAccountId: "5000" },
        { id: generateId(), name: "Domainly", email: "accounts@domainly.com", defaultAccountId: "5400" },
      ],
      customers: [
        { id: generateId(), name: "Acme Studios", email: "accounts@acmestudio.com", channel: "services" },
      ],
      addSupplier: (supplier) =>
        set((state) => ({
          suppliers: [...state.suppliers, { ...supplier, id: generateId() }],
        })),
      addCustomer: (customer) =>
        set((state) => ({
          customers: [...state.customers, { ...customer, id: generateId() }],
        })),

      // Assets
      assets: [
        {
          id: generateId(),
          name: "MacBook Pro",
          category: "equipment",
          value: 2400,
          salvageValue: 200,
          depreciationYears: 5,
          startDate: new Date(new Date().getFullYear(), 0, 1),
        },
      ],
      addAsset: (asset) =>
        set((state) => ({
          assets: [...state.assets, { ...asset, id: generateId() }],
        })),
      disposeAsset: (id, disposalDate) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, disposed: true, disposalDate } : a)),
        })),

      // Imports
      importJobs: [],
      addImportJob: (job) =>
        set((state) => ({
          importJobs: [...state.importJobs, { ...job, id: generateId(), status: "pending", createdAt: new Date() }],
        })),
      completeImportJob: (id, summary, errors) =>
        set((state) => ({
          importJobs: state.importJobs.map((j) =>
            j.id === id
              ? {
                  ...j,
                  status: errors && errors.length > 0 ? "failed" : "processed",
                  processedAt: new Date(),
                  summary,
                  errors,
                }
              : j,
          ),
        })),

      // Documents
      documents: [],
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, { ...document, id: generateId(), createdAt: new Date() }],
        })),
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        })),

      // SOPs
      sops: [],
      addSOP: (sop) =>
        set((state) => ({
          sops: [
            ...state.sops,
            {
              ...sop,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateSOP: (id, updates) =>
        set((state) => ({
          sops: state.sops.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s)),
        })),
      deleteSOP: (id) => set((state) => ({ sops: state.sops.filter((s) => s.id !== id) })),

      // Ideas
      ideas: [],
      addIdea: (idea) =>
        set((state) => ({
          ideas: [...state.ideas, { ...idea, id: generateId(), createdAt: new Date() }],
        })),
      deleteIdea: (id) => set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) })),

      // Brand Rules
      brandRules: [],
      addBrandRule: (rule) =>
        set((state) => ({
          brandRules: [...state.brandRules, { ...rule, id: generateId() }],
        })),
      updateBrandRule: (id, updates) =>
        set((state) => ({
          brandRules: state.brandRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteBrandRule: (id) =>
        set((state) => ({
          brandRules: state.brandRules.filter((r) => r.id !== id),
        })),

      // Settings
      taxSetAsidePercent: 25,
      setTaxSetAsidePercent: (percent) => set({ taxSetAsidePercent: percent }),
      taxSetAsideMethod: "profit",
      setTaxSetAsideMethod: (method) => set({ taxSetAsideMethod: method }),
    }),
    {
      name: "barrkeh-super-system",
    },
  ),
)
