import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { WebsiteData } from '@/lib/types';
import { DEFAULT_WEBSITE_DATA } from '@/lib/mockData';
import { getWebsiteData } from '@/lib/supabase';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Star, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  Check 
} from 'lucide-react';

export default function HostedSitePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [site, setSite] = useState<WebsiteData>(DEFAULT_WEBSITE_DATA);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      if (slug && typeof slug === 'string') {
        const data = await getWebsiteData(slug);
        setSite(data);
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_slug: site.slug,
          name: formName,
          email: formEmail,
          phone: formPhone,
          message: formMessage
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormMessage('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A2E] font-sans antialiased selection:bg-kanchipuram selection:text-white">
      <Head>
        <title>{site.business_name} — Official Website</title>
        <meta name="description" content={site.hero.tagline} />
      </Head>

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
              style={{ backgroundColor: site.primary_color }}
            >
              {site.business_name.charAt(0)}
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#1A1A2E]">
              {site.business_name}
            </span>
          </div>

          <a
            href="#contact"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-sm"
            style={{ backgroundColor: site.primary_color }}
          >
            Contact & Order
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 text-center px-4 max-w-5xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A1A2E]/5 text-xs font-semibold text-[#1A1A2E] border border-[#1A1A2E]/10 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-tumbler" />
          <span>{site.industry}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#1A1A2E] tracking-tight leading-[1.15]">
          {site.hero.headline}
        </h1>

        <p className="text-base sm:text-xl text-[#6B7280] max-w-2xl mx-auto mt-6 leading-relaxed">
          {site.hero.tagline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#offerings"
            className="px-8 py-4 rounded-xl text-sm font-semibold text-white shadow-sm transition transform active:scale-95"
            style={{ backgroundColor: site.primary_color }}
          >
            {site.hero.cta_button_text}
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl text-sm font-semibold bg-white hover:bg-[#FAFAF8] text-[#1A1A2E] border border-[#E5E7EB] transition shadow-sm"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-tumbler">
              Our Craft & Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A2E]">
              {site.about.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              {site.about.story}
            </p>
          </div>

          <div className="md:col-span-6 space-y-3">
            {site.about.bullet_points.map((point, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-[#1A1A2E]">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings / Catalog Grid */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6" id="offerings">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-kanchipuram">
            Featured Highlights
          </span>
          <h2 className="text-3xl font-display font-bold text-[#1A1A2E] mt-2">
            Signature Offerings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {site.offerings.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-card flex flex-col justify-between hover:shadow-card-hover transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-display font-bold text-[#1A1A2E]">{item.name}</h3>
                  <span
                    className="text-sm font-bold font-mono px-2.5 py-1 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: site.primary_color }}
                  >
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              {item.badge && (
                <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                  <span className="text-[10px] font-semibold text-tumbler bg-tumbler/10 px-2 py-0.5 rounded-full border border-tumbler/20">
                    ★ {item.badge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-tumbler">Customer Love</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A2E] mt-1">What Our Community Says</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {site.testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] space-y-3">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: t.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#6B7280] italic leading-relaxed">"{t.comment}"</p>
                <div className="pt-2 border-t border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#1A1A2E] block">{t.name}</span>
                  <span className="text-[10px] text-[#6B7280]">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Lead Capture Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6" id="contact">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Business Info */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tumbler">Visit & Connect</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A2E] mt-1">Get In Touch</h2>
              <p className="text-xs text-[#6B7280] mt-2">Have a question or custom catering inquiry? Send us a message.</p>
            </div>

            <div className="space-y-3 text-xs text-[#1A1A2E]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E7EB]">
                <MapPin className="w-4 h-4 text-kanchipuram" />
                <span>{site.address}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E7EB]">
                <Clock className="w-4 h-4 text-tumbler" />
                <span>{site.hours}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E5E7EB]">
                <Phone className="w-4 h-4 text-success" />
                <span>{site.contact_phone}</span>
              </div>
            </div>
          </div>

          {/* Interactive Lead Capture Form */}
          <div className="md:col-span-7">
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-card">
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success/10 text-success border border-success/20 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#1A1A2E]">Thank You!</h3>
                  <p className="text-xs text-[#6B7280] max-w-xs mx-auto">Your inquiry has been received. Our team will contact you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-semibold text-kanchipuram underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A2E] focus:outline-none focus:border-kanchipuram"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A2E] focus:outline-none focus:border-kanchipuram"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A2E] mb-1">Message / Inquiry</label>
                    <textarea
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#1A1A2E] focus:outline-none focus:border-kanchipuram resize-none"
                      placeholder="Tell us what you need..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white shadow-sm transition"
                    style={{ backgroundColor: site.primary_color }}
                  >
                    {submitting ? 'Submitting...' : 'Send Customer Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E5E7EB] text-center text-xs text-[#6B7280]">
        <p>© 2026 {site.business_name}. Powered by MarkAI.</p>
      </footer>
    </div>
  );
}
