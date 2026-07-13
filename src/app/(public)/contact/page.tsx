'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your message has been sent successfully!');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--cf-bg)] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--cf-primary)]/20 rounded-full blur-[80px] pointer-events-none" />
          <h1 className="relative text-4xl font-extrabold tracking-tight text-[var(--cf-text)] sm:text-5xl">
            Get in touch
          </h1>
          <p className="relative mt-4 text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about campaigns, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[var(--cf-surface)] border border-[var(--cf-border)] p-8 rounded-2xl shadow-sm h-full">
              <h3 className="text-xl font-bold text-[var(--cf-text)] mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cf-primary)]/10">
                      <Mail className="h-5 w-5 text-[var(--cf-primary)]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[var(--cf-text)]">Email</p>
                    <p className="text-sm text-[var(--cf-text-muted)] mt-1">support@crowdfund.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cf-secondary)]/10">
                      <Phone className="h-5 w-5 text-[var(--cf-secondary)]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[var(--cf-text)]">Phone</p>
                    <p className="text-sm text-[var(--cf-text-muted)] mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cf-accent)]/10">
                      <MapPin className="h-5 w-5 text-[var(--cf-accent)]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[var(--cf-text)]">Office</p>
                    <p className="text-sm text-[var(--cf-text-muted)] mt-1">
                      123 Innovation Drive<br />
                      Tech City, TC 90210<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--cf-surface)] border border-[var(--cf-border)] p-8 rounded-2xl shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="firstName"
                    label="First Name"
                    placeholder="John"
                    required
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    required
                  />
                </div>

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  required
                />

                <Input
                  id="subject"
                  label="Subject"
                  placeholder="How can we help you?"
                  required
                />

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--cf-text-muted)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="flex w-full rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-4 py-3 text-sm text-[var(--cf-text)] placeholder-[var(--cf-text-muted)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cf-primary)] transition-all duration-200"
                    placeholder="Please describe your issue or question in detail..."
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4" />
                  </span>
                </Button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
