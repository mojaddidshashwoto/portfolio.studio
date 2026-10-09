"use client";

import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    scope: "Editorial / Fashion",
    budget: "$3,500 – $8,000",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name required";
    if (!formData.email.trim()) {
      errs.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Valid email required";
    }
    if (!formData.message.trim()) errs.message = "Project notes required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 700);
    }
  };

  return (
    <section id="contact" className="relative w-full py-28 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4">
          04 / CONTACT
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/10 pt-12">
          {/* Left: Studio Information */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[#f2f2f2] leading-[0.9]">
                Get in Touch.
              </h2>
              <p className="mt-6 text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                Available for editorial assignments, portrait sessions, and print inquiries.
              </p>

              <div className="mt-12 space-y-6 font-mono text-xs">
                <div className="pb-4 border-b border-white/10">
                  <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">
                    Email
                  </span>
                  <a
                    href="mailto:contact@shashwoto.com"
                    className="text-[#f2f2f2] hover:text-[#c6ff3d] transition-colors mt-1 block"
                    data-cursor="hover"
                  >
                    contact@shashwoto.com
                  </a>
                </div>

                <div className="pb-4 border-b border-white/10">
                  <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">
                    Primary Operational Bases
                  </span>
                  <span className="text-[#f2f2f2] mt-1 block">
                    Dhaka / Tokyo / London / Remote
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">
                    Response Latency
                  </span>
                  <span className="text-[#c6ff3d] mt-1 block">Within 24 Hours</span>
                </div>
              </div>
            </div>

            <div className="mt-12 font-mono text-[11px] text-neutral-500 uppercase tracking-wider">
              [ 2026 CALENDAR: OPEN FOR ASSIGNMENTS ]
            </div>
          </div>

          {/* Right: Editorial Form */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 p-8 sm:p-12 bg-[#0a0a0a]">
              {submitted ? (
                <div className="py-12 space-y-4">
                  <div className="font-mono text-xs text-[#c6ff3d] uppercase tracking-widest">
                    {"//"} MESSAGE RECEIVED
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase text-[#f2f2f2]">
                    Thank You.
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                    Thank you, {formData.name}. Your message has been received. I will review your
                    inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        scope: "Editorial / Portrait",
                        budget: "Flexible",
                        message: "",
                      });
                    }}
                    className="mt-6 px-6 py-2 border border-white/20 font-mono text-xs uppercase tracking-widest hover:border-[#c6ff3d] hover:text-[#c6ff3d] transition-colors"
                    data-cursor="hover"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                        01 / Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Vance"
                        className="w-full px-4 py-3 bg-transparent border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                      />
                      {errors.name && (
                        <span className="font-mono text-[10px] text-red-400 mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                        02 / Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@studio.com"
                        className="w-full px-4 py-3 bg-transparent border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                      />
                      {errors.email && (
                        <span className="font-mono text-[10px] text-red-400 mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                        03 / Scope of Project
                      </label>
                      <select
                        value={formData.scope}
                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                      >
                        <option value="Editorial / Fashion">Editorial & High Fashion</option>
                        <option value="Commercial Campaign">Commercial Advertising</option>
                        <option value="Private Sitting">Private Portrait Sitting</option>
                        <option value="Archival Print">Fine Art Print Acquisition</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                        04 / Estimated Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                      >
                        <option value="$1,500 – $3,500">$1,500 – $3,500</option>
                        <option value="$3,500 – $8,000">$3,500 – $8,000</option>
                        <option value="$8,000 – $20,000">$8,000 – $20,000</option>
                        <option value="$20,000+">$20,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                      05 / Narrative / Timeline Notes *
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline target dates, visual tone, deliverables, and shooting locations..."
                      className="w-full px-4 py-3 bg-transparent border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                    />
                    {errors.message && (
                      <span className="font-mono text-[10px] text-red-400 mt-1 block">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Sharp editorial button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    data-cursor="hover"
                    className="w-full py-4 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitting ? "Transmitting..." : "Send Inquiry →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
