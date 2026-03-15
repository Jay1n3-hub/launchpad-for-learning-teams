import logo from "@/assets/boardly-logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Boardly" className="h-6 w-6" />
          <span className="text-sm font-semibold text-foreground">Boardly</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6">
          {[
            { label: "About", href: "#about" },
            { label: "Ceremonies", href: "#ceremonies" },
            { label: "Artifacts", href: "#artifacts" },
            { label: "Contact", href: "#contact" },
            { label: "Login", href: "/auth" },
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
        © {new Date().getFullYear()} Boardly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
