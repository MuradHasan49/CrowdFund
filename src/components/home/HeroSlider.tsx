'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

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

export function HeroSlider() {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full bg-[var(--cf-bg)]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        loop
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--cf-bg)] via-[var(--cf-bg)]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--cf-bg)] via-transparent to-transparent opacity-80" />
              
              {/* Content */}
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-12 sm:px-16 lg:px-24">
                <div className="max-w-2xl space-y-6">
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-[var(--cf-text-muted)] sm:text-xl drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button asChild size="lg">
                      <Link href={slide.link1}>{slide.cta1}</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
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
