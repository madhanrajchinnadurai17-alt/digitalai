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
        return <Layers className="w-3.5 h-3.5 text-ink" />;
      case 'reels_script':
        return <Film className="w-3.5 h-3.5 text-ink" />;
      default:
        return <ImageIcon className="w-3.5 h-3.5 text-muted" />;
    }
  };

  const getFormatBadge = (format: PostFormat) => {
    switch (format) {
      case 'carousel':
        return (
          <span className="font-mono text-[10px] text-ink border border-line px-2 py-0.5 rounded-xl inline-flex items-center gap-1">
            <Layers className="w-3 h-3" /> [Carousel]
          </span>
        );
      case 'reels_script':
        return (
          <span className="font-mono text-[10px] text-ink border border-line px-2 py-0.5 rounded-xl inline-flex items-center gap-1">
            <Film className="w-3 h-3" /> [Reels Script]
          </span>
        );
      default:
        return (
          <span className="font-mono text-[10px] text-muted border border-line px-2 py-0.5 rounded-xl inline-flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> [Single Post]
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
        <div className="bg-surface rounded-xl p-6 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-muted mb-1.5">
              [30-Day Campaign Planner]
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-ink tracking-tight">
              Content Calendar
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
              AI-generated monthly campaigns tied to upcoming cultural moments, holidays, and small business occasions for {currentProfile.business_name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateAICalendar()}
              disabled={isGeneratingCalendar}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2"
            >
              {isGeneratingCalendar ? (
                <span>Claude is Planning 30 Days...</span>
              ) : (
                <span>Generate Month with AI</span>
              )}
            </button>
          </div>
        </div>

        {/* Calendar Month Navigation & View Toggle */}
        <div className="bg-surface rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-line">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-sans font-bold text-ink">
              {monthName}
            </span>
            <span className="text-xs font-mono text-muted">
              [{calendarEvents.length} Scheduled Campaigns]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                viewMode === 'month'
                  ? 'bg-surface text-white'
                  : 'bg-surface text-muted hover:text-ink border border-line'
              }`}
            >
              [Grid View]
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                viewMode === 'list'
                  ? 'bg-surface text-white'
                  : 'bg-surface text-muted hover:text-ink border border-line'
              }`}
            >
              [List View]
            </button>
          </div>
        </div>

        {/* Calendar View: Month Grid */}
        {viewMode === 'month' ? (
          <div className="bg-surface rounded-xl p-5 sm:p-7 border border-line">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <span key={i} className="text-xs font-mono text-muted uppercase tracking-wider py-1">
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
                  className="min-h-[105px] sm:min-h-[120px] rounded-lg bg-surface border border-line/50 opacity-30 pointer-events-none"
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
                    className={`min-h-[105px] sm:min-h-[120px] rounded-lg p-2 flex flex-col justify-between transition border ${
                      isPitchDay
                        ? 'border-process bg-process-light/30 ring-1 ring-process/30'
                        : events.length > 0
                        ? 'border-line bg-surface hover:border-line'
                        : 'border-line bg-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono w-6 h-6 flex items-center justify-center rounded-xl ${
                          isPitchDay
                            ? 'bg-process text-white font-bold'
                            : 'text-ink'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isPitchDay && (
                        <span className="text-[9px] font-mono text-process font-bold px-1 py-0.5 bg-process-light border border-process-border rounded-xl">
                          [PITCH DAY]
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {events.map((ev) => {
                        const isReel = ev.format.toLowerCase().includes('reel');
                        const isCarousel = ev.format.toLowerCase().includes('carousel');
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`w-full text-left p-1 rounded-lg border transition group ${
                              isCarousel
                                ? 'bg-process-light/50 border-process-border hover:border-process'
                                : isReel
                                ? 'bg-pending-light/50 border-pending-border hover:border-pending'
                                : 'bg-surface hover:bg-grey/5 border border-line hover:border-line'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-medium text-ink truncate">
                                {ev.title}
                              </span>
                            </div>
                            {ev.festival_occasion && (
                              <span className="text-[9px] text-muted font-mono block truncate mt-0.5">
                                {ev.festival_occasion}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="grid grid-cols-1 gap-3">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-surface rounded-xl p-5 border border-line transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface border border-line flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                    <span className="text-[10px] font-mono uppercase text-muted">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-base font-sans font-bold text-ink leading-none">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {(() => {
                          const isReel = ev.format.toLowerCase().includes('reel');
                          const isCarousel = ev.format.toLowerCase().includes('carousel');
                          return (
                            <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-xl border ${
                              isCarousel
                                ? 'bg-process-light text-process border-process-border font-medium'
                                : isReel
                                ? 'bg-pending-light text-pending border-pending-border font-medium'
                                : 'bg-surface text-ink border-line'
                            }`}>
                              [{ev.format.replace('_', ' ')}]
                            </span>
                          );
                        })()}
                        {ev.festival_occasion && (
                          <span className="text-[10px] font-mono text-muted">
                            [{ev.festival_occasion}]
                          </span>
                        )}
                      </div>
                    <h3 className="text-sm font-sans font-bold text-ink">{ev.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {ev.content_hook}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-line">
                  <button
                    onClick={() => handleOpenInStudio(ev)}
                    disabled={generatingEventId === ev.id}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
                  >
                    <span>{generatingEventId === ev.id ? 'Loading...' : 'Generate in Studio'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-surface rounded-xl max-w-lg w-full p-6 border border-line shadow-ai-glow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink">Date: {selectedEvent.date}</span>
                  <span className="text-xs font-mono text-muted">[{selectedEvent.format.replace('_', ' ')}]</span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-secondary px-3 py-1 rounded-xl text-xs font-medium"
                >
                  Close
                </button>
              </div>

              <div>
                {selectedEvent.festival_occasion && (
                  <span className="text-[11px] font-mono text-muted block mb-1">
                    Occasion: {selectedEvent.festival_occasion}
                  </span>
                )}
                <h3 className="text-lg font-sans font-bold text-ink">{selectedEvent.title}</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-line space-y-2">
                <span className="text-xs font-mono text-ink block">
                  Campaign Content Hook
                </span>
                <p className="text-xs text-muted leading-relaxed whitespace-pre-line font-sans">
                  {selectedEvent.content_hook}
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {selectedEvent.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-ink">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-muted pt-1">
                <span>Optimal Window: {selectedEvent.best_time || '10:30 AM'}</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleOpenInStudio(selectedEvent)}
                  disabled={generatingEventId === selectedEvent.id}
                  className="btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2"
                >
                  <span>Generate Complete Post in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
