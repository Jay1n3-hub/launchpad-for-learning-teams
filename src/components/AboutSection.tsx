import { motion } from "framer-motion";

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
          About LaunchPad
        </h2>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          LaunchPad was built to support internship programs, junior developer teams, organizations adopting Agile, and mentorship-driven development teams. We believe new teams deserve tools designed for their reality — not tools built for senior engineers with a decade of experience.
        </p>
        <blockquote className="mt-8 border-l-2 border-primary pl-4 text-left text-lg font-medium text-foreground/90 italic">
          "Helping new teams launch into Agile with structure, guidance, and transparency."
        </blockquote>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
