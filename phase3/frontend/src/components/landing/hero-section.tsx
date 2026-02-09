"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Users, Zap } from "lucide-react";
import { useGSAP } from "@/hooks/useGSAP";
import { Poppins } from "next/font/google";

const bbh = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/**
 * Hero section with split layout
 * Left: Bold typography with cyan gradient
 * Right: Interactive dashboard mockup with perspective
 */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gsapInstance = useGSAP();

  useEffect(() => {
    if (!gsapInstance || !heroRef.current) return;

    const { gsap } = gsapInstance;

    // Animate hero elements on load
    gsap.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
    });

    gsap.from(".hero-cta", {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.4,
      ease: "power3.out",
    });

    gsap.from(".hero-stats", {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });

    gsap.from(".hero-mockup", {
      opacity: 0,
      x: 100,
      duration: 1.2,
      delay: 0.3,
      ease: "power3.out",
    });

    // Floating animation for dashboard mockup
    gsap.to(".hero-mockup", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, [gsapInstance]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-40 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden "
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                className={`${bbh.className} leading-18  text-5xl sm:text-6xl lg:text-7xl font-bold `}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  Organize Tasks.
                </span>
                <br />
                <span className="text-white">Amplify Productivity.</span>
              </h1>
              <p className="hero-subtitle text-xl text-gray-400 max-w-xl">
                TaskFlow is the ultimate task management platform designed for
                modern teams. Collaborate seamlessly, track progress in
                real-time, and achieve your goals faster with our intuitive
                Kanban boards and powerful automation features.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                Start Free Today
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="hero-stats flex items-center gap-2">
                <Users className="text-emerald-400" size={24} />
                <div>
                  <p className="text-white font-bold text-lg">50K+</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
              </div>
              <div className="hero-stats flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={24} />
                <div>
                  <p className="text-white font-bold text-lg">1M+</p>
                  <p className="text-gray-400 text-sm">Tasks Completed</p>
                </div>
              </div>
              <div className="hero-stats flex items-center gap-2">
                <Zap className="text-emerald-400" size={24} />
                <div>
                  <p className="text-white font-bold text-lg">99.9%</p>
                  <p className="text-gray-400 text-sm">Uptime</p>
                </div>
              </div>
            </div>

            {/* User Avatars Stack */}
            <div className="hero-stats flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 border-2 border-slate-950 flex items-center justify-center text-white text-sm font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                Join{" "}
                <span className="text-emerald-400 font-semibold">
                  thousands
                </span>{" "}
                of productive teams
              </p>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="hero-mockup relative lg:block hidden">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
                boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)",
              }}
            >
              {/* Glassmorphism Card */}
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-xl">My Projects</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-4">
                  {[
                    {
                      title: "Design System Update",
                      status: "In Progress",
                      color: "cyan",
                    },
                    {
                      title: "API Integration",
                      status: "Review",
                      color: "blue",
                    },
                    {
                      title: "User Testing",
                      status: "Completed",
                      color: "green",
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="bg-slate-950/50 rounded-lg p-4 border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">
                          {task.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-${task.color}-500/20 text-${task.color}-400`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 border-2 border-slate-950"
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs">3 members</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">
                      Overall Progress
                    </span>
                    <span className="text-emerald-400 font-semibold text-sm">
                      67%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950/50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-600/20 pointer-events-none" />
            </div>

            {/* Floating Task Badges */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl p-4 shadow-xl animate-float">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 shadow-xl animate-float-delayed">
              <Zap className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
