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
        <div className="bg-surface rounded-xl p-6 sm:p-8 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-muted mb-2">
              <Globe className="w-3.5 h-3.5 text-ink" />
              <span>[Instant Digital Presence]</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight flex items-center gap-3">
              AI One-Page Website Builder
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              Convert your social audience into direct inquiries. MarkAI generates and hosts a branded, responsive micro-site with built-in lead capture.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/sites/${siteData.slug}`}
              target="_blank"
              className="btn-primary px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
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
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-line bg-surface ring-1 ring-ink'
                    : 'bg-surface border-line text-muted hover:border-line'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-process' : 'text-muted'}`} />
                  {isSelected && (
                    <span className="font-mono text-[10px] text-process bg-process-light border border-process-border px-1.5 py-0.5 rounded-xl">
                      [Active]
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-sans font-bold text-ink">{t.label}</h4>
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
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <span className="text-xs font-mono text-ink flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-process" />
                  <span>Hosted: {siteData.slug}.markai.site</span>
                </span>
                <span className="font-mono text-[10px] text-success bg-success-light border border-success-border px-2 py-0.5 rounded-xl">
                  [Live & Hosted]
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-line space-y-3 text-xs">
                <div>
                  <span className="text-muted block text-[10px] font-mono uppercase">Hero Headline:</span>
                  <p className="text-sm font-sans font-bold text-ink mt-0.5">{siteData.hero.headline}</p>
                  <p className="text-muted mt-1">{siteData.hero.tagline}</p>
                </div>

                <div className="pt-2 border-t border-line">
                  <span className="text-muted block text-[10px] font-mono uppercase">Offerings ({siteData.offerings.length} items):</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {siteData.offerings.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-surface border border-line">
                        <span className="font-medium text-ink block truncate">{item.name}</span>
                        <span className="text-[10px] text-muted font-mono">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerateSite} className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claude is Generating Micro-Site...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Re-Generate Site with Selected Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Captured Customer Inquiries & Leads */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-xl p-6 sm:p-7 border border-line space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="text-base font-sans font-bold text-ink flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ink" />
                  <span>Lead Inquiries</span>
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  [{leads.length} submissions]
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted space-y-2">
                  <Users className="w-6 h-6 mx-auto text-muted/50 mb-2" />
                  <p>No customer inquiries submitted yet.</p>
                  <p className="text-[11px] font-mono text-muted/70">Test the lead form on your live site</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-surface border border-line space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink">{lead.name}</span>
                        <span className="text-[10px] text-muted font-mono">
                          {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink font-mono">{lead.email}</p>
                      <p className="text-xs text-muted font-sans italic">"{lead.message}"</p>
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
