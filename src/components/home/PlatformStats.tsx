'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { id: 1, name: 'Total Funded', value: 24, suffix: 'M+', prefix: '$' },
  { id: 2, name: 'Successful Projects', value: 8500, suffix: '+' },
  { id: 3, name: 'Active Backers', value: 120, suffix: 'k+' },
  { id: 4, name: 'Countries Supported', value: 195, suffix: '' },
];

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
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

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-[var(--cf-text)] drop-shadow-sm">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function PlatformStats() {
  return (
    <section className="py-24 bg-[var(--cf-surface-2)] border-b border-[var(--cf-border)] relative overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--cf-bg)]/50 border border-[var(--cf-border)] backdrop-blur-sm"
            >
              <div className="mb-3 text-[var(--cf-primary)]">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-sm md:text-base font-medium text-[var(--cf-text-muted)] tracking-wide uppercase">
                {stat.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
