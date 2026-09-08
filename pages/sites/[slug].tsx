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
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-ink selection:text-white">
      <Head>
        <title>{site.business_name} — Official Site</title>
        <meta name="description" content={site.hero.tagline} />
      </Head>

      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-grey/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-ink text-white flex items-center justify-center font-serif font-bold text-sm">
              {site.business_name.charAt(0)}
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-ink">
              {site.business_name}
            </span>
          </div>

          <a
            href="#contact"
            className="btn-primary px-3.5 py-1.5 rounded-sm text-xs font-medium transition"
          >
            Contact & Order
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 text-center px-4 max-w-4xl mx-auto relative">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-grey mb-6">
          <span>[{site.industry}]</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-ink tracking-tight leading-[1.12]">
          {site.hero.headline}
        </h1>

        <p className="text-base sm:text-lg text-grey max-w-2xl mx-auto mt-6 leading-relaxed">
          {site.hero.tagline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#offerings"
            className="btn-primary px-6 py-3 rounded-sm text-xs font-medium"
          >
            {site.hero.cta_button_text}
          </a>
          <a
            href="#contact"
            className="btn-secondary px-6 py-3 rounded-sm text-xs font-medium"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white border-y border-grey/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="font-mono text-xs text-grey uppercase block">
              [Our Story & Craft]
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
              {site.about.title}
            </h2>
            <p className="text-xs sm:text-sm text-grey leading-relaxed">
              {site.about.story}
            </p>
          </div>

          <div className="md:col-span-6 space-y-2.5">
            {site.about.bullet_points.map((point, idx) => (
              <div key={idx} className="p-3.5 rounded-sm bg-white border border-grey/30 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-ink flex-shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-ink">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings / Catalog Grid */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6" id="offerings">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs text-grey uppercase">
            [Featured Offerings]
          </span>
          <h2 className="text-3xl font-serif font-bold text-ink mt-2">
            Signature Menu & Catalog
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {site.offerings.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-sm bg-white border border-grey/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-serif font-bold text-ink">{item.name}</h3>
                  <span className="text-xs font-mono text-ink border border-grey/30 px-2 py-0.5 rounded-sm">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-grey leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>

              {item.badge && (
                <div className="mt-4 pt-3 border-t border-grey/20">
                  <span className="font-mono text-[10px] text-ink border border-ink px-2 py-0.5 rounded-sm">
                    [{item.badge}]
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white border-y border-grey/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-mono text-xs text-grey uppercase block">[Community Reviews]</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-1">What Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {site.testimonials.map((t, i) => (
              <div key={i} className="p-5 rounded-sm bg-white border border-grey/30 space-y-3">
                <div className="flex text-ink gap-0.5">
                  {Array.from({ length: t.rating }).map((_, r) => (
                    <Star key={r} className="w-3.5 h-3.5 fill-ink" />
                  ))}
                </div>
                <p className="text-xs text-grey font-serif italic leading-relaxed">"{t.comment}"</p>
                <div className="pt-2 border-t border-grey/20">
                  <span className="text-xs font-medium text-ink block">{t.name}</span>
                  <span className="text-[10px] font-mono text-grey">{t.role}</span>
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
              <span className="font-mono text-xs text-grey uppercase block">[Visit & Connect]</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mt-1">Get In Touch</h2>
              <p className="text-xs text-grey mt-2">Have a question or custom catering inquiry? Send us a message.</p>
            </div>

            <div className="space-y-2.5 text-xs text-ink">
              <div className="flex items-center gap-3 p-3 rounded-sm bg-white border border-grey/30">
                <MapPin className="w-4 h-4 text-ink" />
                <span>{site.address}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-sm bg-white border border-grey/30">
                <Clock className="w-4 h-4 text-ink" />
                <span>{site.hours}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-sm bg-white border border-grey/30">
                <Phone className="w-4 h-4 text-ink" />
                <span>{site.contact_phone}</span>
              </div>
            </div>
          </div>

          {/* Interactive Lead Capture Form */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-7 rounded-sm bg-white border border-grey/30">
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-sm bg-ink text-white flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-ink">Thank You</h3>
                  <p className="text-xs text-grey max-w-xs mx-auto">Your inquiry has been received. Our team will contact you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-mono text-ink underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-grey mb-1 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-white border border-grey/30 rounded-sm px-3 py-2 text-xs text-ink placeholder:text-grey focus:outline-none focus:border-ink transition"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-grey mb-1 uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full bg-white border border-grey/30 rounded-sm px-3 py-2 text-xs text-ink placeholder:text-grey focus:outline-none focus:border-ink transition"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-grey mb-1 uppercase">Message / Inquiry</label>
                    <textarea
                      rows={3}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full bg-white border border-grey/30 rounded-sm p-3 text-xs text-ink placeholder:text-grey focus:outline-none focus:border-ink transition resize-none"
                      placeholder="Tell us what you need..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-2.5 px-4 rounded-sm text-xs font-medium"
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
      <footer className="py-8 border-t border-grey/30 text-center text-xs font-mono text-grey">
        <p>© 2026 {site.business_name}. Powered by MarkAI.</p>
      </footer>
    </div>
  );
}
