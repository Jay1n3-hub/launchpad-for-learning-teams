import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import SprintBoardVisual from "./SprintBoardVisual";

const HeroSection = () => {
  return (
    <section className="relative pt-[15vh] pb-[10vh] overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(217_19%_18%/0.15)_1px,transparent_1px),linear-gradient(90deg,hsl(217_19%_18%/0.15)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(199_89%_48%/0.08),transparent)]" />

      <div className="container relative mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h1 className="text-5xl font-semibold leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
              Launch Your Teams Beyond Traditional Scrum.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              LaunchPad is a board management system designed to support Agile workflows and learning-focused teams — internship programs, junior developer teams, and mentorship-based organizations.
            </p>
            <p className="mt-3 text-sm text-muted-foreground/70">
              Most Scrum tools focus only on delivery. LaunchPad supports delivery <em>and</em> learning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#get-started"
                className="h-11 px-6 inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium brand-transition hover:brightness-110 active-press"
              >
                Get Started
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href="#artifacts"
                className="h-11 px-6 inline-flex items-center gap-2 rounded-md border border-border text-sm font-medium text-foreground brand-transition glow-hover active-press"
              >
                View Scrum Artifacts
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="relative" style={{ perspective: "1000px" }}>
              <div style={{ transform: "rotateX(5deg)" }}>
                <SprintBoardVisual />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
