"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: "What is CrowdFund?",
    answer: "CrowdFund is a community-driven platform where creators can raise funds for their projects, causes, or ideas, and supporters can contribute to help bring them to life."
  },
  {
    question: "How do credits work?",
    answer: "Credits are our platform's currency. You can purchase credits to support campaigns. 10 credits equal $1. Creators can withdraw their received credits."
  },
  {
    question: "How do I start a campaign?",
    answer: "Sign up as a Creator, go to your dashboard, and click 'Add Campaign'. Fill in your campaign details, set a goal, and publish it for the world to see."
  },
  {
    question: "Is there a minimum withdrawal amount?",
    answer: "Yes, you need a minimum of 200 credits to request a withdrawal. The current withdrawal rate for creators is 20 credits per $1."
  },
  {
    question: "What happens if a campaign doesn't reach its goal?",
    answer: "This depends on the campaign's specific rules, but generally, funds are still kept by the creator to help them make progress, unless stated otherwise in the campaign description."
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[--cf-text] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[--cf-text-muted]">
            Everything you need to know about CrowdFund.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-[--cf-surface] border border-[--cf-border] rounded-xl overflow-hidden transition-all duration-200 ease-out shadow-lg shadow-black/30"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[--cf-primary]"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-lg text-[--cf-text]">
                  {faq.question}
                </span>
                <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-[--cf-primary]' : 'text-[--cf-text-muted]'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`px-6 pb-5 text-[--cf-text-muted] leading-relaxed transition-all duration-200 ${openIndex === index ? 'block' : 'hidden'}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-[--cf-surface-2] border border-[--cf-border] p-8 rounded-xl shadow-lg shadow-black/30">
          <h2 className="text-2xl font-bold text-[--cf-text] mb-3">Still have questions?</h2>
          <p className="text-[--cf-text-muted] mb-6">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Link href="/contact" className="inline-block bg-[--cf-primary] hover:bg-[--cf-primary]/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
