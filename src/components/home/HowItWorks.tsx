import { Lightbulb, Rocket, HandCoins } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Create Your Campaign',
    description: 'Share your idea, set a funding goal, and tell your story with engaging images and descriptions.',
    icon: Lightbulb,
    color: 'var(--cf-primary)',
  },
  {
    id: 2,
    title: 'Get Funded by the Community',
    description: 'Supporters discover your project and contribute credits to help you reach your milestone.',
    icon: Rocket,
    color: 'var(--cf-secondary)',
  },
  {
    id: 3,
    title: 'Withdraw & Build',
    description: 'Once funded, convert your credits into real money and start bringing your project to life.',
    icon: HandCoins,
    color: 'var(--cf-accent)',
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[var(--cf-bg)] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-[var(--cf-primary)] rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-[var(--cf-secondary)] rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--cf-text)] sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[var(--cf-text-muted)]">
            Bringing your ideas to the world is simpler than you think. Three easy steps to turn your dream into reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[var(--cf-primary)] via-[var(--cf-secondary)] to-[var(--cf-accent)] opacity-20" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col items-center text-center">
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-xl relative z-10 transition-transform hover:-translate-y-2 duration-300"
                  style={{ backgroundColor: `${step.color}20`, border: `1px solid ${step.color}40` }}
                >
                  <Icon className="w-10 h-10" style={{ color: step.color }} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--cf-surface)] border-2 border-[var(--cf-bg)] flex items-center justify-center text-sm font-bold" style={{ color: step.color }}>
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[var(--cf-text)] mb-3">{step.title}</h3>
                <p className="text-[var(--cf-text-muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
