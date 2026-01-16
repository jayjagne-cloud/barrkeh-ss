import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import Link from "next/link"
import { BarrkehLogo } from "@/components/barrkeh-logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <BarrkehLogo size={36} />
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-foreground">Barrkeh</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-primary">DigiProducts</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium content creation platform for modern marketing teams. Create stunning visuals with brand
              protection.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              {["Photo Generator", "Video Generator", "Templates", "Brand Kit", "Export Options"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm">
              {["Tutorials", "Blog", "Support", "FAQ", "Updates"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "Careers", "Press", "Contact", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 Barrkeh DigiProducts. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
