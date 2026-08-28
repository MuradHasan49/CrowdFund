'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const slides = [
  {
    id: 1,
    title: 'Fund the Next Big Idea',
    subtitle: 'Join a community of backers supporting innovative projects.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80',
    cta1: 'Explore Campaigns',
    link1: '/campaigns',
    cta2: 'Start a Project',
    link2: '/register',
  },
  {
    id: 2,
    title: 'Turn Dreams into Reality',
    subtitle: 'Empower creators to bring their visions to life with your support.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80',
    cta1: 'Start a Project',
    link1: '/register',
    cta2: 'Explore Campaigns',
    link2: '/campaigns',
  },
  {
    id: 3,
    title: 'Secure & Transparent',
    subtitle: 'Every transaction is protected and you have full visibility into the funding.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    cta1: 'Join Now',
    link1: '/register',
    cta2: 'Learn More',
    link2: '/about',
  }
];

function AmbientParticles() {
  const ref = useRef<any>(null);
  
  // Responsive particle count: less on small screens for performance
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 1000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create a dispersed box of particles
      pos[i * 3] = (Math.random() - 0.5) * 20;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Primary Color Particles */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00D4AA" // --cf-secondary
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
      {/* Secondary Color Particles for depth */}
      <Points positions={positions} stride={3} frustumCulled={false} rotation={[Math.PI, 0, 0]}>
        <PointMaterial
          transparent
          color="#6C47FF" // --cf-primary
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

export function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true); // Default true for safer hydration
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateSlide = contextSafe(() => {
    if (prefersReducedMotion) {
      // Ensure they are visible if reduced motion is on
      gsap.set('.hero-anim', { opacity: 1, y: 0 });
      return;
    }
    
    // Kill previous animations to prevent stacking on rapid slide change
    gsap.killTweensOf('.hero-anim');
    
    // Set initial state for the active slide elements
    gsap.set('.swiper-slide-active .hero-anim', { 
      opacity: 0, 
      y: 30 
    });

    // Animate them in with a stagger
    gsap.to('.swiper-slide-active .hero-anim', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.1 
    });
  });

  // Handle slide change
  useEffect(() => {
    if (swiper) {
      // When transition starts, run animation
      swiper.on('slideChangeTransitionStart', animateSlide);
      return () => {
        swiper.off('slideChangeTransitionStart', animateSlide);
      };
    }
  }, [swiper, animateSlide]);

  // Initial animation on mount (or when reduced motion state changes)
  useGSAP(() => {
    if (!prefersReducedMotion) {
      animateSlide();
    }
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  // Autoplay config: slow down or disable entirely if reduced motion is preferred
  const autoplayConfig = prefersReducedMotion 
    ? false 
    : { delay: 5000, disableOnInteraction: false };

  return (
    <div ref={containerRef} className="relative h-[70vh] min-h-[500px] w-full bg-[var(--cf-bg)] overflow-hidden">
      
      {/* 3D Background - Absolute behind content, no pointer events */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <AmbientParticles />
          </Canvas>
        </div>
      )}

      {/* Reduced Motion Fallback */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[var(--cf-bg)] via-[var(--cf-surface)] to-[var(--cf-bg)] opacity-50" />
      )}

      <Swiper
        onSwiper={setSwiper}
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        autoplay={autoplayConfig}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        loop
        className="h-full w-full z-10"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image - opacity reduced to let 3D layer show through slightly */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay transition-opacity duration-1000"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--cf-bg)] via-[var(--cf-bg)]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--cf-bg)] via-transparent to-transparent opacity-80" />
              
              {/* Content */}
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-12 sm:px-16 lg:px-24">
                <div className="max-w-2xl space-y-6">
                  {/* Added 'hero-anim' class to elements we want to stagger */}
                  <h1 className="hero-anim text-4xl font-extrabold tracking-tight text-[var(--cf-text)] sm:text-5xl md:text-6xl drop-shadow-md opacity-0">
                    {slide.title}
                  </h1>
                  <p className="hero-anim text-lg text-[var(--cf-text-muted)] sm:text-xl drop-shadow-sm opacity-0">
                    {slide.subtitle}
                  </p>
                  <div className="hero-anim flex flex-wrap gap-4 pt-4 opacity-0">
                    <Button asChild size="lg" className="shadow-lg shadow-[var(--cf-primary)]/20">
                      <Link href={slide.link1}>{slide.cta1}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="bg-[var(--cf-surface)]/30 backdrop-blur-sm border-[var(--cf-border)] hover:bg-[var(--cf-surface)]/60 text-[var(--cf-text)]">
                      <Link href={slide.link2}>{slide.cta2}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
