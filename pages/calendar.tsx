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
        return <Layers className="w-3.5 h-3.5 text-kanchipuram" />;
      case 'reels_script':
        return <Film className="w-3.5 h-3.5 text-tumbler" />;
      default:
        return <ImageIcon className="w-3.5 h-3.5 text-muted" />;
    }
  };

  const getFormatBadge = (format: PostFormat) => {
    switch (format) {
      case 'carousel':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-kanchipuram/10 text-kanchipuram border border-kanchipuram/20">
            <Layers className="w-3 h-3" /> Carousel
          </span>
        );
      case 'reels_script':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-tumbler/10 text-tumbler border border-tumbler/20">
            <Film className="w-3 h-3" /> Reels Script
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-border text-ink border border-border">
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
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-kanchipuram/5 border border-kanchipuram/15 text-xs font-semibold text-kanchipuram mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-tumbler" />
              <span>30-Day Festival Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-kanchipuram" />
              <span>30-Day Content Calendar</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              AI-generated monthly campaigns tied to upcoming cultural moments, holidays, and small business occasions for {currentProfile.business_name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateAICalendar()}
              disabled={isGeneratingCalendar}
              className="btn-primary px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-2"
            >
              {isGeneratingCalendar ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Claude is Planning 30 Days...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-tumbler" />
                  <span>Generate Month with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Calendar Month Navigation & View Toggle */}
        <div className="bg-surface rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border shadow-card">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-display font-bold text-ink flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-kanchipuram" />
              <span>{monthName}</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-canvas text-muted border border-border">
              {calendarEvents.length} Scheduled Campaigns
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'month'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-canvas text-muted hover:text-ink border border-border'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-kanchipuram text-white shadow-sm'
                  : 'bg-canvas text-muted hover:text-ink border border-border'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Calendar View: Month Grid */}
        {viewMode === 'month' ? (
          <div className="bg-surface rounded-2xl p-5 sm:p-7 border border-border shadow-card">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <span key={i} className="text-xs font-bold text-muted uppercase tracking-wider py-1">
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
                  className="min-h-[105px] sm:min-h-[120px] rounded-xl bg-canvas/40 border border-border/40 opacity-40 pointer-events-none"
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
                    className={`min-h-[105px] sm:min-h-[120px] rounded-xl p-2 flex flex-col justify-between transition border ${
                      isPitchDay
                        ? 'bg-tumbler/5 border-tumbler/50 ring-1 ring-tumbler/30 shadow-sm'
                        : events.length > 0
                        ? 'bg-canvas border-border hover:border-kanchipuram/50'
                        : 'bg-canvas/60 border-border/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                          isPitchDay
                            ? 'bg-tumbler text-white font-extrabold'
                            : 'text-ink'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isPitchDay && (
                        <span className="text-[9px] font-extrabold text-tumbler bg-tumbler/10 px-1.5 py-0.5 rounded border border-tumbler/20">
                          🏆 PITCH
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {events.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left p-1.5 rounded-lg bg-surface hover:bg-kanchipuram/5 border border-border hover:border-kanchipuram/30 transition group shadow-sm"
                        >
                          <div className="flex items-center gap-1">
                            {getFormatIcon(ev.format)}
                            <span className="text-[10px] font-bold text-ink truncate group-hover:text-kanchipuram">
                              {ev.title}
                            </span>
                          </div>
                          {ev.festival_occasion && (
                            <span className="text-[9px] text-tumbler font-medium block truncate mt-0.5">
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
                className="bg-surface rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-card-hover border border-border transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-kanchipuram/5 border border-kanchipuram/15 flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase text-kanchipuram">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-base font-extrabold text-ink leading-none">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getFormatBadge(ev.format)}
                      {ev.festival_occasion && (
                        <span className="text-[10px] font-semibold text-tumbler bg-tumbler/10 px-2 py-0.5 rounded-full border border-tumbler/20">
                          {ev.festival_occasion}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-display font-bold text-ink">{ev.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {ev.content_hook}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <button
                    onClick={() => handleOpenInStudio(ev)}
                    disabled={generatingEventId === ev.id}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    {generatingEventId === ev.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-tumbler" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-elevation relative border border-border space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">{selectedEvent.date}</span>
                  {getFormatBadge(selectedEvent.format)}
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              <div>
                {selectedEvent.festival_occasion && (
                  <span className="text-[11px] font-bold text-tumbler uppercase tracking-wider block mb-1">
                    Occasion: {selectedEvent.festival_occasion}
                  </span>
                )}
                <h3 className="text-lg font-display font-bold text-ink">{selectedEvent.title}</h3>
              </div>

              <div className="p-4 rounded-xl bg-canvas border border-border space-y-2.5">
                <span className="text-[11px] font-bold text-kanchipuram uppercase tracking-wider block">
                  Campaign Content Hook
                </span>
                <p className="text-xs text-ink leading-relaxed whitespace-pre-line">
                  {selectedEvent.content_hook}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedEvent.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-medium text-kanchipuram bg-kanchipuram/10 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted pt-1">
                <span>Optimal Window: <strong className="text-success">{selectedEvent.best_time || '10:30 AM'}</strong></span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleOpenInStudio(selectedEvent)}
                  disabled={generatingEventId === selectedEvent.id}
                  className="btn-primary w-full py-3.5 px-4 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
                >
                  {generatingEventId === selectedEvent.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-4 h-4 text-tumbler" />
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
