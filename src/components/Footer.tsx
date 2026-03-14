import logo from "@/assets/launchpad-logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-foreground">LaunchPad</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6">
          {[
            { label: "About", href: "#about" },
            { label: "Artifacts", href: "#artifacts" },
            { label: "Contact", href: "#contact" },
            { label: "Login", href: "#login" },
            { label: "Create Organization", href: "#get-started" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground brand-transition hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LaunchPad BMS. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
