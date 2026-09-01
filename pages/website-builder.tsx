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
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Phase 5 · Instant Digital Presence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <Globe className="w-7 h-7 text-amber-400" />
              <span>AI One-Page Website Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Instantly turn your social audience into paying customers. MarkAI generates and hosts a responsive, branded landing page with built-in lead capture in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/sites/${siteData.slug}`}
              target="_blank"
              className="btn-primary px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
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
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40 shadow-lg'
                    : 'bg-space-950/60 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{t.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Cockpit: Left Site Summary & Action | Right Lead Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Generated Site Preview & Generator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>Hosted Domain: {siteData.slug}.markai.site</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Live & Hosted
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] font-bold uppercase">Hero Headline:</span>
                  <p className="text-sm font-bold text-white mt-0.5">{siteData.hero.headline}</p>
                  <p className="text-slate-300 mt-1">{siteData.hero.tagline}</p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-slate-500 block text-[11px] font-bold uppercase">Included Offerings ({siteData.offerings.length} items):</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {siteData.offerings.map((item) => (
                      <div key={item.id} className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="font-bold text-white block truncate">{item.name}</span>
                        <span className="text-[10px] text-amber-300 font-mono">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerateSite} className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="btn-primary w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Claude AI is Generating Full One-Page Site...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
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
            <div className="card-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-fuchsia-400" />
                  <span>Lead Capture Inquiries</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {leads.length} submissions
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                  <p>No customer inquiries submitted yet.</p>
                  <p className="text-[11px] text-slate-500">Test the lead form on your live site!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-2xl bg-space-950/80 border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{lead.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-fuchsia-400 font-mono">{lead.email}</p>
                      <p className="text-xs text-slate-300 italic">"{lead.message}"</p>
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
