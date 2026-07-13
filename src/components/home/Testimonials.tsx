'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    quote: "CrowdFund made it incredibly easy to gather the support I needed to launch my dream tech product. The community here is truly amazing and supportive.",
    author: "Alex Rivera",
    role: "Hardware Creator",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
  },
  {
    id: 2,
    quote: "As a supporter, I love how transparent the platform is. I can track exactly how my contributions are helping creators bring their ideas to life.",
    author: "Sarah Jenkins",
    role: "Angel Supporter",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 3,
    quote: "The low fees and instant withdrawal system allowed me to start production on my indie film weeks ahead of schedule. Best platform hands down.",
    author: "Michael Chang",
    role: "Filmmaker",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Michael",
  },
  {
    id: 4,
    quote: "I've backed over 20 projects on CrowdFund. The credit system makes it so easy to support multiple creators without constantly entering payment details.",
    author: "Emma Stone",
    role: "Top Backer",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma",
  },
  {
    id: 5,
    quote: "From setting up my campaign to receiving the funds, everything was seamless. The dashboard gave me perfect insights into my funding progress.",
    author: "David O'Connor",
    role: "Game Developer",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[var(--cf-surface-2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--cf-text)] sm:text-4xl mb-4">
          Trusted by Creators & Backers
        </h2>
        <p className="text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto mb-16">
          Don't just take our word for it. Here's what our vibrant community has to say about their CrowdFund experience.
        </p>

        <div className="mx-auto max-w-4xl">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 }
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="h-full rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] p-8 text-left shadow-lg">
                  <div className="flex text-[var(--cf-primary)] mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[var(--cf-text)] leading-relaxed italic mb-8 h-24 line-clamp-4">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={t.image} alt={t.author} className="h-12 w-12 rounded-full border border-[var(--cf-border)] bg-[var(--cf-bg)]" />
                    <div>
                      <h4 className="font-semibold text-[var(--cf-text)]">{t.author}</h4>
                      <p className="text-sm text-[var(--cf-text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
