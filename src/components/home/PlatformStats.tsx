'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  { id: 1, name: 'Total Funded', value: 24, suffix: 'M+', prefix: '$' },
  { id: 2, name: 'Successful Projects', value: 8500, suffix: '+' },
  { id: 3, name: 'Active Backers', value: 120, suffix: 'k+' },
  { id: 4, name: 'Countries Supported', value: 195, suffix: '' },
];

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        let start = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / value));
        const increment = Math.ceil(value / (duration / 16)); 

        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
      }
    });
  }, { scope: ref });

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-[var(--cf-text)] drop-shadow-sm">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function PlatformStats() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.from('.stat-card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 bg-[var(--cf-surface-2)] border-b border-[var(--cf-border)] relative overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="stat-card flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--cf-bg)]/50 border border-[var(--cf-border)] backdrop-blur-sm"
            >
              <div className="mb-3 text-[var(--cf-primary)]">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-sm md:text-base font-medium text-[var(--cf-text-muted)] tracking-wide uppercase">
                {stat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
