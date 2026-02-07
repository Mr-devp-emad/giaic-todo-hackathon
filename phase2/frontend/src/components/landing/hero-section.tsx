"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!headingRef.current || !isInView) return;

    const words = headingRef.current.querySelectorAll(".word");
    gsap.fromTo(
      words,
      { y: 100, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-background pt-32 pb-20"
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Gradient Orbs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-40 left-1/3 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Now with AI-powered task suggestions</span>
            </Badge>
          </motion.div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{ perspective: "1000px" }}
          >
            <span className="word inline-block">The</span>{" "}
            <span className="word inline-block">modern</span>{" "}
            <span className="word inline-block">way</span>{" "}
            <span className="word inline-block">to</span>
            <br />
            <span className="word inline-block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              manage
            </span>{" "}
            <span className="word inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              your
            </span>{" "}
            <span className="word inline-block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              tasks
            </span>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            TaskFlow helps teams move faster with beautiful boards, powerful
            automations, and integrations that keep everyone aligned.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="gap-2 px-8 animate-glow" asChild>
              <Link href="/dashboard">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-8 bg-transparent"
            >
              <Play className="h-4 w-4" />
              Watch demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12"
          >
            <p className="mb-4 text-sm text-muted-foreground">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
              {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map((company) => (
                <span
                  key={company}
                  className="text-lg font-semibold tracking-tight text-foreground"
                >
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
