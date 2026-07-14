import React from 'react';

export default function BlogPage() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-[--cf-surface] border border-[--cf-border] p-10 rounded-xl shadow-lg shadow-black/30 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-[--cf-text] mb-4">Our Blog</h1>
        <div className="w-16 h-1 bg-[--cf-primary] mx-auto mb-6 rounded-full"></div>
        <p className="text-lg text-[--cf-text-muted]">
          Exciting stories, insights, and updates are on the way.
        </p>
        <div className="mt-8">
          <span className="inline-block px-4 py-2 rounded-lg bg-[--cf-surface-2] text-[--cf-secondary] font-semibold tracking-wide uppercase text-sm">
            Coming Soon
          </span>
        </div>
      </div>
    </main>
  );
}
