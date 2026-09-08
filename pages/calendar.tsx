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
        return <ImageIcon className="w-3.5 h-3.5 text-grey" />;
    }
  };

  const getFormatBadge = (format: PostFormat) => {
    switch (format) {
      case 'carousel':
        return (
          <span className="font-mono text-[10px] text-ink border border-grey/30 px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
            <Layers className="w-3 h-3" /> [Carousel]
          </span>
        );
      case 'reels_script':
        return (
          <span className="font-mono text-[10px] text-ink border border-grey/30 px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
            <Film className="w-3 h-3" /> [Reels Script]
          </span>
        );
      default:
        return (
          <span className="font-mono text-[10px] text-grey border border-grey/30 px-2 py-0.5 rounded-sm inline-flex items-center gap-1">
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
        <div className="bg-white rounded-sm p-6 border border-grey/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-grey mb-1.5">
              [30-Day Campaign Planner]
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
              Content Calendar
            </h1>
            <p className="text-xs sm:text-sm text-grey mt-1 max-w-2xl leading-relaxed">
              AI-generated monthly campaigns tied to upcoming cultural moments, holidays, and small business occasions for {currentProfile.business_name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => generateAICalendar()}
              disabled={isGeneratingCalendar}
              className="btn-primary px-5 py-2.5 rounded-sm text-xs font-medium flex items-center gap-2"
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
        <div className="bg-white rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-grey/30">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-serif font-bold text-ink">
              {monthName}
            </span>
            <span className="text-xs font-mono text-grey">
              [{calendarEvents.length} Scheduled Campaigns]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                viewMode === 'month'
                  ? 'bg-ink text-white'
                  : 'bg-white text-grey hover:text-ink border border-grey/30'
              }`}
            >
              [Grid View]
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition ${
                viewMode === 'list'
                  ? 'bg-ink text-white'
                  : 'bg-white text-grey hover:text-ink border border-grey/30'
              }`}
            >
              [List View]
            </button>
          </div>
        </div>

        {/* Calendar View: Month Grid */}
        {viewMode === 'month' ? (
          <div className="bg-white rounded-sm p-5 sm:p-7 border border-grey/30">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <span key={i} className="text-xs font-mono text-grey uppercase tracking-wider py-1">
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
                  className="min-h-[105px] sm:min-h-[120px] rounded-none bg-white border border-grey/10 opacity-30 pointer-events-none"
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
                    className={`min-h-[105px] sm:min-h-[120px] rounded-none p-2 flex flex-col justify-between transition border ${
                      isPitchDay
                        ? 'border-ink bg-white'
                        : events.length > 0
                        ? 'border-grey/30 bg-white hover:border-ink'
                        : 'border-grey/20 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono w-6 h-6 flex items-center justify-center ${
                          isPitchDay
                            ? 'bg-ink text-white font-bold'
                            : 'text-ink'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isPitchDay && (
                        <span className="text-[9px] font-mono text-ink">
                          [PITCH]
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {events.map((ev) => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full text-left p-1 rounded-none bg-white hover:bg-grey/5 border border-grey/30 hover:border-ink transition group"
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-ink truncate">
                              {ev.title}
                            </span>
                          </div>
                          {ev.festival_occasion && (
                            <span className="text-[9px] text-grey font-mono block truncate mt-0.5">
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
          <div className="grid grid-cols-1 gap-3">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-sm p-5 border border-grey/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-none bg-white border border-grey/30 flex flex-col items-center justify-center text-center p-1 flex-shrink-0">
                    <span className="text-[10px] font-mono uppercase text-grey">
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="text-base font-serif font-bold text-ink leading-none">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono text-ink">
                        [{ev.format.replace('_', ' ')}]
                      </span>
                      {ev.festival_occasion && (
                        <span className="text-[10px] font-mono text-grey">
                          [{ev.festival_occasion}]
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-serif font-bold text-ink">{ev.title}</h3>
                    <p className="text-xs text-grey leading-relaxed">
                      {ev.content_hook}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-grey/20">
                  <button
                    onClick={() => handleOpenInStudio(ev)}
                    disabled={generatingEventId === ev.id}
                    className="btn-primary px-4 py-2 rounded-sm text-xs font-medium flex items-center gap-2"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-sm max-w-lg w-full p-6 border border-ink space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-grey/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ink">Date: {selectedEvent.date}</span>
                  <span className="text-xs font-mono text-grey">[{selectedEvent.format.replace('_', ' ')}]</span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-secondary px-3 py-1 rounded-sm text-xs font-medium"
                >
                  Close
                </button>
              </div>

              <div>
                {selectedEvent.festival_occasion && (
                  <span className="text-[11px] font-mono text-grey block mb-1">
                    Occasion: {selectedEvent.festival_occasion}
                  </span>
                )}
                <h3 className="text-lg font-serif font-bold text-ink">{selectedEvent.title}</h3>
              </div>

              <div className="p-3.5 rounded-sm bg-white border border-grey/30 space-y-2">
                <span className="text-xs font-mono text-ink block">
                  Campaign Content Hook
                </span>
                <p className="text-xs text-grey leading-relaxed whitespace-pre-line font-sans">
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

              <div className="flex items-center justify-between text-xs font-mono text-grey pt-1">
                <span>Optimal Window: {selectedEvent.best_time || '10:30 AM'}</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => handleOpenInStudio(selectedEvent)}
                  disabled={generatingEventId === selectedEvent.id}
                  className="btn-primary w-full py-2.5 px-4 rounded-sm text-xs font-medium flex items-center justify-center gap-2"
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
