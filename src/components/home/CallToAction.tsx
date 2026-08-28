import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-[var(--cf-border)]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--cf-bg)] via-[var(--cf-surface)] to-[var(--cf-surface-2)]" />
      
      {/* Abstract Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-gradient-to-tr from-[var(--cf-primary)]/20 to-[var(--cf-secondary)]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cf-text)] mb-6 drop-shadow-sm">
          Ready to Bring Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-primary)] to-[var(--cf-secondary)]">Ideas to Life?</span>
        </h2>
        
        <p className="text-xl text-[var(--cf-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of creators and backers building the future together. Start your campaign today or find the next big thing to support.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto px-8">
            <Link href="/register">Start a Campaign</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-[var(--cf-surface)]/50 backdrop-blur-sm">
            <Link href="/campaigns">Explore Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
