import { motion } from "framer-motion";
import { BookOpen, ArrowUpRight, RotateCcw } from "lucide-react";

const ScrumEducationSection = () => (
  <section id="artifacts" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Learn Scrum While You Work
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          LaunchPad helps teams understand Scrum artifacts and ceremonies through guided workflows and embedded learning resources.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-12 max-w-lg rounded-xl border border-border bg-card p-8 glow-hover"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Scrum Retrospective Guide</h3>
        </div>

        {/* Abstract loop visual */}
        <div className="my-6 flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/20">
            <RotateCcw className="h-10 w-10 text-primary/40 animate-[spin_8s_linear_infinite]" strokeWidth={1} />
            <span className="absolute text-[10px] font-mono text-primary">RETRO</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Retrospectives allow teams to reflect on completed work and continuously improve their process. They are one of the most powerful Scrum ceremonies for growth.
        </p>

        <a
          href="https://joanneperold.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-9 items-center gap-2 rounded-md bg-primary/10 px-4 text-sm font-medium text-primary brand-transition hover:bg-primary/20"
        >
          Read the Retrospective Guide
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </a>
      </motion.div>
    </div>
  </section>
);

export default ScrumEducationSection;
