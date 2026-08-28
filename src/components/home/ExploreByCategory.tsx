import Link from 'next/link';
import { Monitor, HeartPulse, Palette, Users, GraduationCap, LayoutGrid } from 'lucide-react';

const categories = [
  { id: 'tech', name: 'Technology', icon: Monitor, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'art', name: 'Art', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'community', name: 'Community', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'health', name: 'Health', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'other', name: 'Other', icon: LayoutGrid, color: 'text-slate-400', bg: 'bg-slate-400/10' },
];

export function ExploreByCategory() {
  return (
    <section className="py-24 bg-[var(--cf-surface)] border-y border-[var(--cf-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--cf-text)] sm:text-4xl mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-[var(--cf-text-muted)] max-w-2xl">
            Find the projects that resonate with your passions. From cutting-edge tech to local community initiatives, there's something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                href={`/campaigns?category=${cat.name}`}
                className="group flex flex-col items-center justify-center p-8 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-bg)] transition-all duration-300 hover:border-[var(--cf-primary)] hover:shadow-lg hover:shadow-[var(--cf-primary)]/10 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-[var(--cf-text)] group-hover:text-[var(--cf-primary)] transition-colors text-center">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
