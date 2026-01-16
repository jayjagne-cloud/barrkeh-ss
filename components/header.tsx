"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { BarrkehLogo } from "@/components/barrkeh-logo"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <BarrkehLogo size={36} />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-foreground">Barrkeh</span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-primary">DigiProducts</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#studio" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Studio
          </Link>
          <Link href="#templates" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Templates
          </Link>
          <Link href="#gallery" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            Gallery
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="#studio" className="py-2 text-sm text-muted-foreground">
              Studio
            </Link>
            <Link href="#templates" className="py-2 text-sm text-muted-foreground">
              Templates
            </Link>
            <Link href="#gallery" className="py-2 text-sm text-muted-foreground">
              Gallery
            </Link>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
