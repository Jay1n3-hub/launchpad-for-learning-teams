import { motion } from "framer-motion";
import { UserPlus, Mail, LogIn, Kanban } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create an Organization",
    desc: "Click Get Started and enter your organization name, administrator email, and password. This creates your first admin account.",
  },
  {
    icon: Mail,
    title: "Invite Your Team",
    desc: "Admins can invite team members by email. Invited users receive a link to create their accounts.",
  },
  {
    icon: LogIn,
    title: "Login Through Your Organization",
    desc: "Click Login, enter your organization email and password. The system authenticates and redirects you to the dashboard.",
  },
  {
    icon: Kanban,
    title: "Start Managing Work",
    desc: "Access project boards, manage sprint tasks, track blockers, and collaborate with your team.",
  },
];

const GettingStartedSection = () => (
  <section id="get-started" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Start Your Organization in Minutes
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          LaunchPad uses organization-based onboarding. Create your workspace, invite your team, and start managing work.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-6 glow-hover"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </div>
              <s.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default GettingStartedSection;
