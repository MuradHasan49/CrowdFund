import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--cf-border)] bg-[var(--cf-surface)] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cf-primary)]">
                <span className="font-bold text-white">CF</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--cf-text)]">
                CrowdFund
              </span>
            </Link>
            <p className="text-sm text-[var(--cf-text-muted)] max-w-xs leading-relaxed">
              Empowering creators and dreamers to bring their ideas to life through community-driven funding. Secure, transparent, and rewarding.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--cf-text)] tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/campaigns" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--cf-text)] tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--cf-text)] tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/trust" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--cf-text-muted)] hover:text-[var(--cf-primary)] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[var(--cf-border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--cf-text-muted)]">
            &copy; {currentYear} CrowdFund Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-[var(--cf-text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--cf-text)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--cf-text)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
