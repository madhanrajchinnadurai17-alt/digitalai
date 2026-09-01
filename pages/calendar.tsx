import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { usePost } from '@/context/PostContext';
import { CalendarEvent, PostFormat } from '@/lib/types';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  Layers, 
  Film, 
  Image as ImageIcon, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Zap, 
  CheckCircle2, 
  CalendarDays,
  Plus,
  RefreshCw
} from 'lucide-react';

export default function CalendarPage() {
  const router = useRouter();
  const { 
    calendarEvents, 
    generateAICalendar, 
    isGeneratingCalendar, 
    currentProfile,
    generatePost,
    setSelectedFormat 
  } = usePost();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [generatingEventId, setGeneratingEventId] = useState<string | null>(null);

  const daysInMonth = 30; // September 2026
  const monthName = 'September 2026';
  const startDayOfWeek = 2; // Tuesday (0=Sun, 1=Mon, 2=Tue...)

  const getFormatIcon = (format: PostFormat) => {
    switch (format) {
      case 'carousel':
        return <Layers className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'reels_script':
        return <Film className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <ImageIcon className="w-3.5 h-3.5 text-violet-400" />;
    }
  };

  const getFormatBadge = (format: PostFormat) => {
    switch (format) {
      case 'carousel':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
            <Layers className="w-3 h-3" /> Carousel
          </span>
        );
      case 'reels_script':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <Film className="w-3 h-3" /> Reels Script
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <ImageIcon className="w-3 h-3" /> Single Post
          </span>
        );
    }
  };

  const handleOpenInStudio = async (event: CalendarEvent) => {
    setGeneratingEventId(event.id);
    setSelectedFormat(event.format);
    try {
      await generatePost(currentProfile, event.format, `${event.festival_occasion || ''}: ${event.title}`);
      router.push('/preview');
    } catch (e) {
      console.error(e);
      setGeneratingEventId(null);
    }
  };

  // Map events by day number
  const eventsByDay: { [key: number]: CalendarEvent[] } = {};
  calendarEvents.forEach((ev) => {
    const day = parseInt(ev.date.split('-')[2], 10);
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(ev);
  });

  return (
    <Layout title="Content Calendar & Festival Planner — MarkAI">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="card-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Phase 2 Priority · 30-Day Festival Planner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-amber-400" />
              <span>30-Day Content Calendar</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              AI-generated monthly campaigns tied to upcoming cultural moments, holidays, and small business occasions for {currentProfile.business_name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateAICalendar()}
              disabled={isGeneratingCalendar}
              className="btn-primary px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2"
            >
              {isGeneratingCalendar ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Claude is Planning 30 Days...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Month with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Calendar Month Navigation & View Toggle */}
        <div className="card-glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-fuchsia-400" />
              <span>{monthName}</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10">
              {calendarEvents.length} Scheduled Campaigns
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'month'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Calendar View: Month Grid */}
        {viewMode === 'month' ? (
          <div className="card-glass rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <span key={i} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {/* Empty leading padding days */}
              {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[105px] sm:min-h-[120px] rounded-2xl bg-white/[0.01] border border-white/[0.03] opacity-30 pointer-events-none"
                />
              ))}

              {/* September Days (1 to 30) */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const events = eventsByDay[dayNum] || [];
                const isPitchDay = dayNum === 9;

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[105px] sm:min-h-[120px] rounded-2xl p-2.5 flex flex-col justify-between transition border ${
                      isPitchDay
                        ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                        : events.length > 0
                        ? 'bg-space-950/80 border-white/10 hover:border-fuchsia-500/40'
                        : 'bg-space-950/40 border-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                          isPitchDay
                            ? 'bg-amber-500 text-black font-extrabold'
                            : 'text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isPitchDay && (
                        <span className="text-[9px] font-extrabold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                          🏆 PITCH
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {events.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left p-1.5 rounded-xl bg-white/[0.04] hover:bg-fuchsia-500/20 border border-white/5 hover:border-fuchsia-500/30 transition group"
                        >
                          <div className="flex items-center gap-1">
                            {getFormatIcon(ev.format)}
                            <span className="text-[10px] font-bold text-slate-200 truncate group-hover:text-fuchsia-300">
                              {ev.title}
                            </span>
                          </div>
                          {ev.festival_occasion && (
                            <span className="text-[9px] text-amber-300/90 block truncate mt-0.5">
                              {ev.festival_occasion}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 gap-4">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="card-glass card-glass-hover rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase text-fuchsia-300">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-base font-extrabold text-white leading-none">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getFormatBadge(ev.format)}
                      {ev.festival_occasion && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {ev.festival_occasion}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{ev.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ev.content_hook}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <button
                    onClick={() => handleOpenInStudio(ev)}
                    disabled={generatingEventId === ev.id}
                    className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md"
                  >
                    {generatingEventId === ev.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Generate in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="card-glass rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">{selectedEvent.date}</span>
                  {getFormatBadge(selectedEvent.format)}
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-secondary px-3 py-1 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>

              <div>
                {selectedEvent.festival_occasion && (
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                    Occasion: {selectedEvent.festival_occasion}
                  </span>
                )}
                <h3 className="text-lg font-extrabold text-white">{selectedEvent.title}</h3>
              </div>

              <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 space-y-2.5">
                <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider block">
                  Campaign Content Hook
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedEvent.content_hook}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedEvent.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-brand-violet bg-violet-500/10 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Optimal Window: <strong className="text-emerald-400">{selectedEvent.best_time || '10:30 AM'}</strong></span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleOpenInStudio(selectedEvent)}
                  disabled={generatingEventId === selectedEvent.id}
                  className="btn-primary w-full py-3.5 px-4 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {generatingEventId === selectedEvent.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Generate Complete Post in Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
