import { motion } from "framer-motion";

const steps = [
  { num: 1, title: "Create an Organization", desc: "Set up your workspace with org name and admin credentials." },
  { num: 2, title: "Create a Project Board", desc: "Define your first board and organize work streams." },
  { num: 3, title: "Plan a Sprint", desc: "Add tasks, assign team members, and set sprint goals." },
  { num: 4, title: "Track Work and Blockers", desc: "Move tasks through columns. Blockers are surfaced to mentors." },
  { num: 5, title: "Reflect Through Retrospectives", desc: "Review completed sprints and drive continuous improvement." },
];

const HowItWorksSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl font-semibold text-foreground sm:text-4xl"
      >
        How Boardly Works
      </motion.h2>

      <div className="relative mx-auto mt-16 max-w-md">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex items-start gap-5 pl-0"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {s.num}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
