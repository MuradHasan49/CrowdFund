import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Compass, MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-[var(--cf-primary)]/20 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-[var(--cf-surface)] border-2 border-[var(--cf-border)] rounded-full p-6 shadow-xl">
            <MapPinOff className="w-12 h-12 text-[var(--cf-primary)]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-6xl font-black text-[var(--cf-text)] tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-[var(--cf-text)]">Page not found</h2>
          <p className="text-lg text-[var(--cf-text-muted)]">
            Oops! It seems you've ventured off the map. The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild className="w-full sm:w-auto flex items-center gap-2" size="lg">
            <Link href="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full sm:w-auto flex items-center gap-2" size="lg">
            <Link href="/campaigns">
              <Compass className="w-5 h-5" />
              Explore Campaigns
            </Link>
          </Button>
        </div>
        
      </div>
    </div>
  );
}
