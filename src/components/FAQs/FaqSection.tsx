import React, { useState } from 'react';
import { FAQS_DATA } from '../../data/faqs';
import { Plus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  // First item open by default
  const [openId, setOpenId] = useState<string | null>(FAQS_DATA[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="overflow-hidden">
      <div className="mx-auto grid w-full max-w-[var(--site-content-width,1280px)] gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
        {/* Left Column Sticky Header */}
        <h2 className="lg:sticky lg:top-8 lg:self-start font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl text-foreground">
          FAQs
        </h2>

        {/* Right Column Accordion Items */}
        <div className="divide-y divide-border border-b border-border">
          {FAQS_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id}>
                <h3 className="m-0 text-base font-normal">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleItem(faq.id)}
                    className="focus-visible:ring-primary/30 flex w-full items-start justify-between gap-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer transition-colors"
                  >
                    <span className="text-foreground text-base font-medium leading-6">
                      {faq.question}
                    </span>
                    <span
                      className={`mt-0.5 text-foreground/60 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <Plus className="size-5" />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    role="region"
                    className="overflow-hidden transition-all duration-300"
                  >
                    <div className="text-muted-foreground max-w-2xl pr-11 pb-6 text-sm sm:text-base leading-relaxed">
                      <p>{faq.answer}</p>
                      {faq.hasLink && faq.linkHref && faq.linkText && (
                        <div className="mt-3">
                          <a
                            href={faq.linkHref}
                            className="text-foreground underline underline-offset-4 hover:text-foreground/80 font-medium"
                          >
                            {faq.linkText}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
