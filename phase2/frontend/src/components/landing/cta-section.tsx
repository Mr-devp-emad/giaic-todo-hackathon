"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!bgRef.current || typeof window === "undefined") return;

    gsap.to(bgRef.current, {
      backgroundPosition: "100% 100%",
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Animated Background */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/5 to-primary/10"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Ready to transform how your team works?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Join 50,000+ teams already using TaskFlow. Start free, no credit
            card required.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/dashboard">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
              <Link href="#pricing">View pricing</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Free forever for individuals. Team plans start at $12/user/month.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
