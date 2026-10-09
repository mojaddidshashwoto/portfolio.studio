"use client";

import { useState } from "react";

export default function ContactSection({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const HeadingTag = headingLevel;

  const sanitize = (val: string, maxLen: number) => {
    return val.slice(0, maxLen).replace(/[<>]/g, "").trim();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const name = sanitize(formData.name, 100);
    const email = sanitize(formData.email, 150);
    const message = sanitize(formData.message, 3000);

    if (!name) errs.name = "Name required";
    if (!email) {
      errs.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Valid email required";
    }
    if (!message) errs.message = "Message required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection via honeypot field
    if (honeypot.trim()) {
      setSubmitted(true);
      return;
    }

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      const cleanName = sanitize(formData.name, 100);
      const cleanEmail = sanitize(formData.email, 150);
      const cleanMsg = sanitize(formData.message, 3000);

      const subject = encodeURIComponent(`Portfolio Inquiry from ${cleanName}`);
      const body = encodeURIComponent(
        `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMsg}`
      );
      const mailtoUrl = `mailto:sasotomujaddid@gmail.com?subject=${subject}&body=${body}`;

      // Open user's default email client addressed to sasotomujaddid@gmail.com
      window.location.href = mailtoUrl;

      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 500);
    }
  };

  return (
    <section id="contact" className="relative w-full py-28 px-6 md:px-12 bg-[#0a0a0a] border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="font-mono text-xs uppercase tracking-widest text-[#c6ff3d] mb-4 inline-flex items-center gap-2 px-2.5 py-1 border border-[#c6ff3d]/30 bg-[#c6ff3d]/5">
          <span className="w-1.5 h-1.5 bg-[#c6ff3d]" />
          <span>Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-white/10 pt-12">
          {/* Left: Contact Information */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <HeadingTag className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[#f2f2f2] leading-[0.9]">
                Get in Touch.
              </HeadingTag>
              <p className="mt-6 text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                For questions, feedback, or print inquiries, send a message through the form or email directly.
              </p>

              <div className="mt-12 space-y-6 font-mono text-xs">
                <div className="pb-4 border-b border-white/10">
                  <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">
                    Direct Email
                  </span>
                  <a
                    href="mailto:sasotomujaddid@gmail.com"
                    className="text-[#f2f2f2] hover:text-[#c6ff3d] transition-colors mt-1 block"
                    data-cursor="hover"
                  >
                    sasotomujaddid@gmail.com
                  </a>
                </div>

                <div className="pb-4 border-b border-white/10">
                  <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">
                    Social & Profiles
                  </span>
                  <div className="mt-2 flex flex-col gap-1">
                    <a
                      href="https://www.instagram.com/mojaddid_shashwoto/"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="min-h-[44px] py-2 text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5 uppercase"
                      data-cursor="hover"
                    >
                      <span>Mojaddid Shashwoto on Instagram</span>
                      <span className="text-[10px] text-neutral-500">↗</span>
                    </a>
                    <a
                      href="https://www.facebook.com/Mojaddid.Shashwotoo/"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="min-h-[44px] py-2 text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5 uppercase"
                      data-cursor="hover"
                    >
                      <span>Mojaddid Shashwoto on Facebook</span>
                      <span className="text-[10px] text-neutral-500">↗</span>
                    </a>
                    <a
                      href="https://mojaddidshashwoto.me"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="min-h-[44px] py-2 text-neutral-300 hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-1.5 uppercase"
                      data-cursor="hover"
                    >
                      <span>Mojaddid Shashwoto Personal Website</span>
                      <span className="text-[10px] text-neutral-500">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Simplified Form */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 p-8 sm:p-12 bg-[#0a0a0a]">
              {submitted ? (
                <div className="py-12 space-y-4">
                  <div className="font-mono text-xs text-[#c6ff3d] uppercase tracking-widest">
                    {"//"} MESSAGE PREPARED
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase text-[#f2f2f2]">
                    Ready to Send.
                  </h3>
                  <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                    Your email client should have opened addressed to{" "}
                    <strong className="text-white font-medium">sasotomujaddid@gmail.com</strong>. If it didn’t open automatically, you can send an email directly using the link below.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <a
                      href={`mailto:sasotomujaddid@gmail.com?subject=${encodeURIComponent(
                        `Portfolio Inquiry from ${formData.name}`
                      )}&body=${encodeURIComponent(
                        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
                      )}`}
                      className="px-6 py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors"
                      data-cursor="hover"
                    >
                      Open Email App Again ↗
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          message: "",
                        });
                      }}
                      className="px-6 py-3 border border-white/20 font-mono text-xs uppercase tracking-widest hover:border-white text-neutral-300 transition-colors"
                      data-cursor="hover"
                    >
                      Write Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for bot spam deterrence - fully hidden */}
                  <div className="hidden" style={{ display: "none" }} aria-hidden="true">
                    <label htmlFor="company_hp">Company</label>
                    <input
                      id="company_hp"
                      type="text"
                      name="company_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
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
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-transparent border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                    />
                    {errors.email && (
                      <span className="font-mono text-[10px] text-red-400 mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 bg-transparent border border-white/15 text-[#f2f2f2] text-sm focus:outline-none focus:border-[#c6ff3d] transition-colors font-sans"
                    />
                    {errors.message && (
                      <span className="font-mono text-[10px] text-red-400 mt-1 block">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    data-cursor="hover"
                    className="w-full py-4 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitting ? "Opening Email..." : "Send Message →"}
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
