import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const ScrumGapSection = () => (
  <section id="gap" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          The Gap in Traditional Scrum Tools
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Scrum assumes teams can self-organize, estimate accurately, resolve blockers quickly, and collaborate independently. Interns and new developers are still learning these skills.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {/* Traditional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-8 opacity-60"
        >
          <h3 className="text-lg font-semibold text-foreground">Traditional Scrum Platforms</h3>
          <p className="mt-1 text-xs text-muted-foreground">Tools like Jira, Trello, and similar</p>
          <ul className="mt-6 space-y-3">
            {[
              "Assume experienced, self-organizing teams",
              "Focus primarily on delivery metrics",
              "Lack training-oriented visibility",
              "Hide blockers in sub-menus",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-log-blocker" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* LaunchPad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-primary/30 bg-card p-8 glow-hover"
        >
          <h3 className="text-lg font-semibold text-foreground">LaunchPad BMS</h3>
          <p className="mt-1 text-xs text-primary">Built for learning teams</p>
          <ul className="mt-6 space-y-3">
            {[
              "Structured Agile workflows for any experience level",
              "Blocker visibility with mentor notifications",
              "Transparent activity logs for accountability",
              "Organizational management and mentorship support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-log-complete" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ScrumGapSection;
