"use client";

import { useEffect, useRef } from "react";
import {
  Kanban,
  RefreshCw,
  Shield,
  Zap,
  Users,
  BarChart3,
  Bell,
  Lock,
  Cloud,
} from "lucide-react";
import { useGSAP } from "@/hooks/useGSAP";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

/**
 * Feature Grid showcasing key platform capabilities
 * Includes hover-responsive cards with Lucide icons
 */
export function FeatureGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gsapInstance = useGSAP();

  useEffect(() => {
    if (!gsapInstance || !sectionRef.current) return;

    const { gsap } = gsapInstance;

    // Animate section title on scroll
    gsap.from(".features-title", {
      scrollTrigger: {
        trigger: ".features-title",
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });

    // Stagger animation for feature cards
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".feature-grid",
        start: "top 70%",
      },
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, [gsapInstance]);

  const features: Feature[] = [
    {
      icon: <Kanban className="text-emerald-400" size={32} />,
      title: "Intuitive Kanban Boards",
      description: "Visualize your workflow with drag-and-drop simplicity",
      details: [
        "Customizable columns and swimlanes",
        "Drag-and-drop task management",
        "Visual workflow optimization",
        "Multiple board views (List, Grid, Calendar)",
      ],
    },
    {
      icon: <RefreshCw className="text-emerald-400" size={32} />,
      title: "Real-Time Synchronization",
      description: "Stay in sync with your team across all devices",
      details: [
        "Instant updates across all devices",
        "Live collaboration indicators",
        "Conflict-free data synchronization",
        "Offline mode with auto-sync",
      ],
    },
    {
      icon: <Shield className="text-emerald-400" size={32} />,
      title: "Enterprise-Grade Security",
      description: "Your data is protected with bank-level encryption",
      details: [
        "End-to-end encryption",
        "SOC 2 Type II certified",
        "GDPR & CCPA compliant",
        "Regular security audits",
      ],
    },
    {
      icon: <Zap className="text-emerald-400" size={32} />,
      title: "Powerful Automation",
      description: "Automate repetitive tasks and focus on what matters",
      details: [
        "Custom workflow automation",
        "Smart task assignments",
        "Automated notifications",
        "Integration with 100+ apps",
      ],
    },
    {
      icon: <Users className="text-emerald-400" size={32} />,
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in communication",
      details: [
        "Real-time comments and mentions",
        "File sharing and attachments",
        "Team activity feeds",
        "Role-based permissions",
      ],
    },
    {
      icon: <BarChart3 className="text-emerald-400" size={32} />,
      title: "Advanced Analytics",
      description: "Gain insights with comprehensive reporting and metrics",
      details: [
        "Customizable dashboards",
        "Productivity metrics",
        "Time tracking and estimates",
        "Export reports in multiple formats",
      ],
    },
    {
      icon: <Bell className="text-emerald-400" size={32} />,
      title: "Smart Notifications",
      description: "Stay informed without being overwhelmed",
      details: [
        "Customizable notification preferences",
        "Digest emails for updates",
        "Mobile push notifications",
        "Slack and email integrations",
      ],
    },
    {
      icon: <Lock className="text-emerald-400" size={32} />,
      title: "Granular Access Control",
      description: "Control who sees what with flexible permissions",
      details: [
        "Role-based access control",
        "Project-level permissions",
        "Guest access with limitations",
        "Audit logs for compliance",
      ],
    },
    {
      icon: <Cloud className="text-emerald-400" size={32} />,
      title: "Cloud-Native Architecture",
      description: "Built for scale, reliability, and performance",
      details: [
        "99.9% uptime SLA",
        "Auto-scaling infrastructure",
        "Global CDN for fast access",
        "Automatic backups",
      ],
    },
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 features-title">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            TaskFlow combines powerful features with an intuitive interface to
            help your team collaborate effectively and deliver projects on time,
            every time.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Details List */}
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-500"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-blue-600/0 group-hover:from-emerald-500/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            Ready to transform your workflow?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
            Explore All Features
          </button>
        </div>
      </div>
    </section>
  );
}
