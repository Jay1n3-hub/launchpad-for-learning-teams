import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowUpRight, RotateCcw, Users, Target, ClipboardList, Layers, BarChart3 } from "lucide-react";

const ceremonies = [
  {
    icon: RotateCcw,
    title: "Sprint Planning",
    desc: "The team selects items from the product backlog and commits to delivering them within the sprint. Goals and scope are defined collaboratively.",
  },
  {
    icon: Users,
    title: "Daily Standup",
    desc: "A short daily meeting where each team member shares progress, plans, and blockers to maintain alignment and momentum.",
  },
  {
    icon: ClipboardList,
    title: "Sprint Review",
    desc: "At the end of each sprint, the team demonstrates completed work to stakeholders and gathers feedback for future iterations.",
  },
  {
    icon: BookOpen,
    title: "Retrospective",
    desc: "The team reflects on the sprint process to identify improvements. One of the most powerful ceremonies for continuous growth.",
    link: { label: "Read the Retrospective Guide", href: "https://joanneperold.substack.com/" },
  },
];

const artifacts = [
  {
    icon: Layers,
    title: "Product Backlog",
    desc: "An ordered list of everything that might be needed in the product — maintained and prioritised by the Product Owner.",
  },
  {
    icon: Target,
    title: "Sprint Backlog",
    desc: "The set of backlog items selected for the sprint, plus a plan for delivering them and achieving the sprint goal.",
  },
  {
    icon: BarChart3,
    title: "Increment",
    desc: "The sum of all completed backlog items during a sprint. Each increment must be usable and meet the Definition of Done.",
  },
];

const tabs = [
  { id: "ceremonies", label: "Ceremonies" },
  { id: "artifacts", label: "Artifacts" },
] as const;

const ScrumEducationSection = () => {
  const [activeTab, setActiveTab] = useState<"ceremonies" | "artifacts">("ceremonies");
  const items = activeTab === "ceremonies" ? ceremonies : artifacts;

  return (
    <>
      {/* Ceremonies anchor */}
      <div id="ceremonies" className="scroll-mt-16" />
      {/* Artifacts anchor */}
      <div id="artifacts" className="scroll-mt-16" />

      <section className="py-24">
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
              Boardly helps teams understand Scrum ceremonies and artifacts through guided workflows and embedded learning resources.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mx-auto mt-10 flex max-w-xs rounded-lg border border-border bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-8 glow-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                {"link" in item && (item as any).link && (
                  <a
                    href={(item as any).link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {(item as any).link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ScrumEducationSection;
