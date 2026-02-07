"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Layers,
  Users,
  BarChart3,
  Lock,
  Workflow,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built for speed. Every interaction feels instant with optimistic updates and smart caching.",
  },
  {
    icon: Layers,
    title: "Multiple Views",
    description:
      "Switch between list, board, and calendar views. Work the way that suits you best.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "See changes as they happen. Comments, mentions, and live cursors keep everyone in sync.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description:
      "Track team velocity, identify bottlenecks, and celebrate wins with beautiful dashboards.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant with SSO, SAML, and granular permissions. Your data is safe with us.",
  },
  {
    icon: Workflow,
    title: "Automations",
    description:
      "Automate repetitive work with custom rules. Move tasks, assign members, and more.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;

    const cards = sectionRef.current.querySelectorAll(".feature-card");

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative bg-muted/30 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything you need to ship faster
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Powerful features that help teams move from idea to done without the
            chaos.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="feature-card group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              whileHover={{ y: -4 }}
            >
              {/* Hover Gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
