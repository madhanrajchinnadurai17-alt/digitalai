import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { WebsiteData, WebsiteTemplateType, LeadInquiry } from '@/lib/types';
import { DEFAULT_WEBSITE_DATA } from '@/lib/mockData';
import { getWebsiteData, saveWebsiteData, getLeadInquiries } from '@/lib/supabase';
import { 
  Globe, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Coffee, 
  ShoppingBag, 
  Briefcase, 
  Dumbbell, 
  Users, 
  ArrowRight, 
  Eye, 
  Mail, 
  MessageSquare,
  Clock
} from 'lucide-react';

export default function WebsiteBuilderPage() {
  const { currentProfile } = usePost();
  const [siteData, setSiteData] = useState<WebsiteData>(DEFAULT_WEBSITE_DATA);
  const [templateType, setTemplateType] = useState<WebsiteTemplateType>('cafe');
  const [isGenerating, setIsGenerating] = useState(false);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);

  useEffect(() => {
    async function load() {
      const slug = currentProfile.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      const data = await getWebsiteData(slug);
      const leadList = await getLeadInquiries();
      setSiteData(data);
      setLeads(leadList);
    }
    load();
  }, [currentProfile.business_name]);

  const templateCards: { id: WebsiteTemplateType; label: string; icon: any; desc: string }[] = [
    { id: 'cafe', label: 'Cafe, Bakery & Restaurant', icon: Coffee, desc: 'Menu cards, opening hours, story, table reservations' },
    { id: 'retail', label: 'Boutique Retail & Fashion', icon: ShoppingBag, desc: 'Hero product showcase, catalog grid, customer reviews' },
    { id: 'services', label: 'Services & B2B Tech', icon: Briefcase, desc: 'Value propositions, booking consultation, case studies' },
    { id: 'fitness', label: 'Fitness & Wellness Studio', icon: Dumbbell, desc: 'Class schedules, trainer bios, membership passes' }
  ];

  const handleGenerateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: currentProfile,
          template_type: templateType
        })
      });
      const json = await res.json();
      if (json.data) {
        setSiteData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout title="AI One-Page Website Builder — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-kanchipuram/5 border border-kanchipuram/15 text-xs font-semibold text-kanchipuram mb-2">
              <Globe className="w-3.5 h-3.5 text-tumbler" />
              <span>Instant Digital Presence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-3">
              <Globe className="w-7 h-7 text-kanchipuram" />
              <span>AI One-Page Website Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Instantly turn your social audience into paying customers. MarkAI generates and hosts a responsive, branded landing page with built-in lead capture in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/sites/${siteData.slug}`}
              target="_blank"
              className="btn-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Template Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {templateCards.map((t) => {
            const isSelected = templateType === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateType(t.id)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between shadow-card hover:shadow-card-hover ${
                  isSelected
                    ? 'bg-kanchipuram/5 border-kanchipuram ring-2 ring-kanchipuram/20'
                    : 'bg-surface border-border text-muted hover:border-kanchipuram/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-kanchipuram' : 'text-muted'}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-kanchipuram animate-ping"></span>}
                </div>
                <div>
                  <h4 className="text-xs font-display font-bold text-ink">{t.label}</h4>
                  <p className="text-[10px] text-muted mt-0.5 leading-snug">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Cockpit: Left Site Summary & Action | Right Lead Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Generated Site Preview & Generator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-kanchipuram" />
                  <span>Hosted Domain: {siteData.slug}.markai.site</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  Live & Hosted
                </span>
              </div>

              <div className="p-4 rounded-xl bg-canvas border border-border space-y-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px] font-bold uppercase">Hero Headline:</span>
                  <p className="text-sm font-display font-bold text-ink mt-0.5">{siteData.hero.headline}</p>
                  <p className="text-muted mt-1">{siteData.hero.tagline}</p>
                </div>

                <div className="pt-2 border-t border-border">
                  <span className="text-muted block text-[11px] font-bold uppercase">Included Offerings ({siteData.offerings.length} items):</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {siteData.offerings.map((item) => (
                      <div key={item.id} className="p-2 rounded-lg bg-surface border border-border">
                        <span className="font-bold text-ink block truncate">{item.name}</span>
                        <span className="text-[10px] text-tumbler font-mono font-semibold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerateSite} className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claude AI is Generating Full One-Page Site...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-tumbler" />
                      <span>Re-Generate Site with Selected Template</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Captured Customer Inquiries & Leads */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
                  <Mail className="w-5 h-5 text-kanchipuram" />
                  <span>Lead Capture Inquiries</span>
                </h3>
                <span className="text-[10px] font-semibold text-muted">
                  {leads.length} submissions
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted space-y-2">
                  <Users className="w-8 h-8 mx-auto text-muted/50 mb-2" />
                  <p>No customer inquiries submitted yet.</p>
                  <p className="text-[11px] text-muted/70">Test the lead form on your live site!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl bg-canvas border border-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink">{lead.name}</span>
                        <span className="text-[10px] text-muted font-mono">
                          {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-kanchipuram font-mono">{lead.email}</p>
                      <p className="text-xs text-muted italic">"{lead.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
