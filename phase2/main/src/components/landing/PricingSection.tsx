'use client';

import { useEffect, useRef } from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';

/**
 * Pricing section highlighting the zero-cost value proposition
 * Emphasizes the free nature of the product with premium features
 */
export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gsapInstance = useGSAP();

  useEffect(() => {
    if (!gsapInstance || !sectionRef.current) return;

    const { gsap, ScrollTrigger } = gsapInstance;

    // Animate section on scroll
    gsap.from('.pricing-title', {
      scrollTrigger: {
        trigger: '.pricing-title',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.pricing-card', {
      scrollTrigger: {
        trigger: '.pricing-card',
        start: 'top 75%',
      },
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.7)',
    });

    gsap.from('.pricing-feature', {
      scrollTrigger: {
        trigger: '.pricing-features',
        start: 'top 75%',
      },
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, [gsapInstance]);

  const features = [
    'Unlimited projects and tasks',
    'Unlimited team members',
    'Real-time collaboration',
    'Kanban, List, and Calendar views',
    'File attachments up to 10GB per file',
    'Advanced search and filters',
    'Custom fields and tags',
    'Mobile apps (iOS & Android)',
    'Email and Slack integrations',
    'Priority support',
    'Advanced analytics and reporting',
    'API access for integrations',
    'Single Sign-On (SSO)',
    'Audit logs and compliance',
    'Dedicated account manager',
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 pricing-title">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-6">
            <Sparkles className="text-emerald-400" size={20} />
            <span className="text-emerald-400 font-semibold text-sm">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Start for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Absolutely Free
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No credit card required. No hidden fees. No surprises. 
            Get full access to all premium features at zero cost.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="pricing-card relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl blur-xl opacity-50" />
            
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 border border-emerald-500/20">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full shadow-lg">
                  <Crown className="text-white" size={20} />
                  <span className="text-white font-bold text-sm">PREMIUM ACCESS</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-8 mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-6xl sm:text-7xl font-bold text-white">$0</span>
                  <div className="text-left">
                    <p className="text-gray-400 text-sm">per month</p>
                    <p className="text-emerald-400 text-sm font-semibold">Forever</p>
                  </div>
                </div>
                <p className="text-gray-400 text-lg">
                  Full access to all features. No billing. Ever.
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 mb-8">
                Get Started Now - It's Free!
              </button>

              {/* Features List */}
              <div className="pricing-features space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="text-emerald-400" size={24} />
                  <h3 className="text-white font-bold text-xl">Everything Included:</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="pricing-feature flex items-start gap-3 text-gray-300"
                    >
                      <Check className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={16} />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={16} />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="text-green-400" size={16} />
                    <span>24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            Questions about our pricing?
          </p>
          <a
            href="#faq"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
          >
            View Frequently Asked Questions →
          </a>
        </div>
      </div>
    </section>
  );
}
