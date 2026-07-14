import { Metadata } from 'next';
import { Target, Users, ShieldCheck, TrendingUp, Globe, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | CrowdFund',
  description: 'Learn more about CrowdFund, our mission, and the team behind the platform.',
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--cf-bg)] pb-24">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-[var(--cf-border)]">
        <div className="absolute inset-0 bg-[var(--cf-surface-2)] opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--cf-primary)_0%,_transparent_70%)] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--cf-text)] sm:text-5xl lg:text-6xl mb-6">
            Empowering Dreams, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-primary)] to-[var(--cf-secondary)]">
              Funding the Future.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-[var(--cf-text-muted)] leading-relaxed">
            CrowdFund is the premier platform connecting visionary creators with passionate backers to bring innovative projects to life.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[var(--cf-text)] mb-6 flex items-center gap-3">
              <Target className="h-8 w-8 text-[var(--cf-accent)]" />
              Our Mission
            </h2>
            <p className="text-lg text-[var(--cf-text-muted)] leading-relaxed mb-6">
              We believe that great ideas shouldn't be held back by a lack of capital. Our mission is to democratize funding by providing a secure, transparent, and community-driven platform where anyone can raise funds for their creative, entrepreneurial, or social initiatives.
            </p>
            <p className="text-lg text-[var(--cf-text-muted)] leading-relaxed">
              By leveraging modern technology and a seamless user experience, we aim to eliminate the friction between having an idea and making it a reality.
            </p>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--cf-border)]">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop" 
              alt="Team collaborating" 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--cf-primary)]/40 to-transparent mix-blend-overlay" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[var(--cf-surface)] border-y border-[var(--cf-border)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-extrabold text-[var(--cf-secondary)] mb-2">$50M+</div>
              <div className="text-[var(--cf-text-muted)] font-medium">Funds Raised</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-[var(--cf-primary)] mb-2">12,000+</div>
              <div className="text-[var(--cf-text-muted)] font-medium">Projects Funded</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-[var(--cf-accent)] mb-2">2M+</div>
              <div className="text-[var(--cf-text-muted)] font-medium">Global Backers</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-extrabold text-[var(--cf-text)] mb-2">99.9%</div>
              <div className="text-[var(--cf-text-muted)] font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--cf-text)]">Why Choose CrowdFund?</h2>
          <p className="mt-4 text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto">
            We're built differently to ensure both creators and backers have the best experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-8 hover:border-[var(--cf-primary)] transition-colors">
            <div className="h-12 w-12 rounded-xl bg-[var(--cf-primary)]/10 flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-[var(--cf-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-3">Secure & Trustworthy</h3>
            <p className="text-[var(--cf-text-muted)] leading-relaxed">
              Every project is vetted, and our secure escrow system ensures funds are only released when milestones are met.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-8 hover:border-[var(--cf-secondary)] transition-colors">
            <div className="h-12 w-12 rounded-xl bg-[var(--cf-secondary)]/10 flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-[var(--cf-secondary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-3">Global Reach</h3>
            <p className="text-[var(--cf-text-muted)] leading-relaxed">
              Accept contributions from anywhere in the world. Our platform automatically handles currency conversions and international compliance.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-8 hover:border-[var(--cf-accent)] transition-colors">
            <div className="h-12 w-12 rounded-xl bg-[var(--cf-accent)]/10 flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-[var(--cf-accent)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--cf-text)] mb-3">Community First</h3>
            <p className="text-[var(--cf-text-muted)] leading-relaxed">
              We foster deep connections between creators and their supporters with integrated communication and update tools.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center pb-12">
        <div className="rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface-2)] p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-[var(--cf-text)] mb-4">Ready to start your journey?</h2>
            <p className="text-lg text-[var(--cf-text-muted)] mb-8">
              Join thousands of creators who have already brought their dreams to life.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/campaigns" 
                className="rounded-lg bg-[var(--cf-primary)] px-8 py-3 font-semibold text-white hover:bg-[var(--cf-primary)]/90 transition-colors shadow-lg shadow-[var(--cf-primary)]/20"
              >
                Explore Projects
              </Link>
              <Link 
                href="/register" 
                className="rounded-lg border border-[var(--cf-border)] bg-[var(--cf-bg)] px-8 py-3 font-semibold text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
          
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-[var(--cf-primary)]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-[var(--cf-secondary)]/10 blur-3xl" />
        </div>
      </div>

    </div>
  );
}
