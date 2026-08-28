'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Thanks for subscribing to our newsletter!');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-24 bg-[var(--cf-bg)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[var(--cf-surface-2)] to-[var(--cf-surface)] border border-[var(--cf-border)] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--cf-primary)]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--cf-secondary)]/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--cf-text)] sm:text-4xl mb-4">
              Get the latest updates
            </h2>
            <p className="text-lg text-[var(--cf-text-muted)] mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter to receive curated campaigns, platform news, and tips for creators directly in your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  id="email-address"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-[var(--cf-bg)]"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 w-full sm:w-auto" isLoading={isLoading}>
                Subscribe <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-[var(--cf-text-muted)] mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
