'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    quote: "CrowdFund completely changed my life. We hit our funding goal in just 48 hours, and the community feedback helped us refine our final product before launch.",
    author: "Elena Rodriguez",
    role: "Tech Startup Founder",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Elena",
  },
  {
    id: 2,
    quote: "I've been backing projects here for over a year. The platform is incredibly transparent, and I love getting direct updates from the creators I support.",
    author: "Marcus Chen",
    role: "Top Tier Backer",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
  },
  {
    id: 3,
    quote: "The low fees meant more money actually went into producing my documentary. The withdrawal process was fast, secure, and completely hassle-free.",
    author: "Sophia Williams",
    role: "Independent Filmmaker",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophia",
  },
  {
    id: 4,
    quote: "It's so easy to discover new and exciting campaigns. The credit system is a game-changer—I can easily manage all my contributions in one place.",
    author: "James Peterson",
    role: "Community Supporter",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
  },
  {
    id: 5,
    quote: "We wouldn't have been able to build our community garden without the local support we found through CrowdFund. This platform truly connects people.",
    author: "Aisha Patel",
    role: "Community Organizer",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha",
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
