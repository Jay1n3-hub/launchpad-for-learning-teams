import { motion } from "framer-motion";
import { Kanban, AlertTriangle, Activity, Eye, Building2 } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Sprint Boards",
    desc: "Manage tasks through drag-and-drop sprint boards with structured column workflows.",
  },
  {
    icon: AlertTriangle,
    title: "Blocker Tracking",
    desc: "Automatically log blockers when work becomes blocked. Mentors are notified instantly.",
  },
  {
    icon: Activity,
    title: "Activity Logs",
    desc: "Track every action for accountability and transparency across your team.",
  },
  {
    icon: Eye,
    title: "Mentorship Visibility",
    desc: "Mentors and scrum masters can monitor team progress and intervene when needed.",
  },
  {
    icon: Building2,
    title: "Organizational Management",
    desc: "Teams operate within organizations, enabling structured collaboration at scale.",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24">
    <div className="container mx-auto px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-3xl font-semibold text-foreground sm:text-4xl"
      >
        Built for Agile Learning Teams
      </motion.h2>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-8 glow-hover"
          >
            <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
