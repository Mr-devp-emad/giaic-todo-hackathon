"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote:
      "TaskFlow transformed how our engineering team operates. We shipped 40% more features last quarter.",
    author: "Sarah Chen",
    role: "VP Engineering",
    company: "TechStart",
    avatar: "SC",
  },
  {
    quote:
      "Finally, a task manager that doesn't get in the way. The keyboard shortcuts alone save me hours.",
    author: "Marcus Johnson",
    role: "Product Designer",
    company: "DesignCo",
    avatar: "MJ",
  },
  {
    quote:
      "We tried everything else. TaskFlow is the only tool our whole team actually enjoys using.",
    author: "Emily Rodriguez",
    role: "CEO",
    company: "GrowthLabs",
    avatar: "ER",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;

    const cards = sectionRef.current.querySelectorAll(".testimonial-card");

    gsap.fromTo(
      cards,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
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
      id="testimonials"
      ref={sectionRef}
      className="bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Loved by teams worldwide
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            See why thousands of teams choose TaskFlow for their daily work.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              className="testimonial-card relative overflow-hidden rounded-2xl border border-border bg-card p-8"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${testimonial.author}-${i}`}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-foreground leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
