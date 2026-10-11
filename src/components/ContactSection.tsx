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
  const [serverStatus, setServerStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setServerStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          company_hp: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setServerStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setServerStatus("error");
        setServerMessage(
          data.error ||
            "Unable to deliver message through the contact server. Please reach out directly by email."
        );
      }
    } catch {
      setServerStatus("error");
      setServerMessage(
        "Network connection issue. Please use the direct email link below."
      );
    }
  };

  const fallbackMailto = `mailto:sasotomujaddid@gmail.com?subject=${encodeURIComponent(
    `Portfolio Inquiry from ${formData.name || "Visitor"}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

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

          {/* Right: Working Form with Server Action / API */}
          <div className="lg:col-span-7">
            <div className="border border-white/10 p-8 sm:p-12 bg-[#0a0a0a]">
              {serverStatus === "success" ? (
                <div className="py-12 space-y-4">
                  <div className="font-mono text-xs text-[#c6ff3d] uppercase tracking-widest">
                    {"//"} MESSAGE SENT
                  </div>
                  <h3 className="font-display text-3xl font-bold uppercase text-[#f2f2f2]">
                    Thank You.
                  </h3>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-md">
                    Your message has been sent successfully. I will get back to you shortly.
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        setServerStatus("idle");
                        setServerMessage("");
                      }}
                      className="px-6 py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors"
                      data-cursor="hover"
                    >
                      Send Another Message
                    </button>
                    <a
                      href="mailto:sasotomujaddid@gmail.com"
                      className="px-6 py-3 border border-white/20 font-mono text-xs uppercase tracking-widest hover:border-white text-neutral-300 transition-colors inline-flex items-center"
                      data-cursor="hover"
                    >
                      Direct Email: sasotomujaddid@gmail.com
                    </a>
                  </div>
                </div>
              ) : serverStatus === "error" ? (
                <div className="py-8 space-y-4">
                  <div className="font-mono text-xs text-red-400 uppercase tracking-widest">
                    {"//"} DELIVERY NOTICE
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#f2f2f2]">
                    Direct Email Fallback
                  </h3>
                  <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-md">
                    {serverMessage}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-4">
                    <a
                      href={fallbackMailto}
                      className="px-6 py-3 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors inline-flex items-center gap-2"
                      data-cursor="hover"
                    >
                      <span>Open in Email App</span>
                      <span>↗</span>
                    </a>
                    <button
                      onClick={() => setServerStatus("idle")}
                      className="px-6 py-3 border border-white/20 font-mono text-xs uppercase tracking-widest hover:border-white text-neutral-300 transition-colors"
                      data-cursor="hover"
                    >
                      Back to Form
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for bot spam deterrence - fully hidden off-screen */}
                  <div
                    className="absolute -left-[9999px] -top-[9999px] w-px h-px opacity-0 overflow-hidden pointer-events-none select-none"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      top: "-9999px",
                      width: "1px",
                      height: "1px",
                      opacity: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="company_hp" aria-hidden="true" tabIndex={-1}>
                      Company
                    </label>
                    <input
                      id="company_hp"
                      type="text"
                      name="company_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
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
                    disabled={serverStatus === "submitting"}
                    data-cursor="hover"
                    className="w-full py-4 border border-[#c6ff3d] bg-[#c6ff3d] text-[#0a0a0a] font-mono font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#c6ff3d] transition-colors duration-300 disabled:opacity-50"
                  >
                    {serverStatus === "submitting" ? "Sending Message..." : "Send Message →"}
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
