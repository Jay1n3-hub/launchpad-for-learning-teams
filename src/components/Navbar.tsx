import { useState } from "react";
import { Rocket, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "About", href: "#about" },
    { label: "Artifacts", href: "#artifacts" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-full items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <span className="text-lg font-semibold tracking-tight text-foreground">LaunchPad</span>
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground brand-transition hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#login"
            className="h-9 px-4 inline-flex items-center rounded-md text-sm font-medium text-muted-foreground brand-transition hover:text-foreground"
          >
            Login
          </a>
          <a
            href="#get-started"
            className="h-9 px-5 inline-flex items-center rounded-md bg-primary text-primary-foreground text-sm font-medium brand-transition hover:brightness-110 active-press"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-foreground/10 bg-background/95 backdrop-blur-md px-6 pb-6 pt-2"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <a href="#login" className="text-sm text-muted-foreground hover:text-foreground py-2">
                Login
              </a>
              <a
                href="#get-started"
                className="h-9 px-5 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
