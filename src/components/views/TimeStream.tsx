import { format, isSameMonth, isAfter, startOfMonth } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { GlossCard } from '../ui/GlossCard';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const TimeStream = () => {
  const focusedDate = useCalendarStore((state) => state.focusedDate);
  const events = useCalendarStore((state) => state.events);
  const selectEvent = useCalendarStore((state) => state.actions.selectEvent);
  const setFocusedDate = useCalendarStore((state) => state.actions.setFocusedDate);

  const scrollRef = useRef<HTMLDivElement>(null);
  const ignoreScrollRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Show all events, sorted by date
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = a.start instanceof Date ? a.start.getTime() : 0;
    const timeB = b.start instanceof Date ? b.start.getTime() : 0;
    return timeA - timeB;
  });

  // Sync Header to Scroll
  useEffect(() => {
    if (!scrollRef.current) return;

    const options = {
      root: scrollRef.current,
      rootMargin: '-10% 0px -80% 0px', // Active zone is near the top
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Find the first intersecting entry that is visible
      const visibleEntry = entries.find(entry => entry.isIntersecting);

      if (visibleEntry) {
        const dateStr = visibleEntry.target.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          // Only update if month changed to avoid spam
          if (!isSameMonth(date, useCalendarStore.getState().focusedDate)) {
            ignoreScrollRef.current = true; // Flag to skip auto-scroll
            setFocusedDate(date);
          }
        }
      }
    }, options);

    const elements = document.querySelectorAll('.stream-event-row');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sortedEvents, setFocusedDate]); // Depend on sortedEvents to re-attach if list changes

  // Sync Scroll to Header (Auto-scroll on navigation)
  useEffect(() => {
    if (ignoreScrollRef.current) {
      ignoreScrollRef.current = false;
      return;
    }

    if (!scrollRef.current) return;

    const monthStart = startOfMonth(focusedDate);
    const targetIndex = sortedEvents.findIndex(e => isSameMonth(e.start, focusedDate) || isAfter(e.start, monthStart));

    if (targetIndex !== -1) {
      const targetElement = document.getElementById(`stream-event-${sortedEvents[targetIndex].id}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedDate, sortedEvents]);

  return (
    <div className="w-full h-full overflow-y-auto max-w-5xl mx-auto py-10 px-4 space-y-20 scrollbar-hide" ref={scrollRef}>
      {sortedEvents.map((event) => {
        if (!event.start || isNaN(event.start.getTime())) return null;

        const isFocusedMonth = isSameMonth(event.start, focusedDate);

        return (
          <motion.div
            id={`stream-event-${event.id}`}
            data-date={event.start.toISOString()}
            className={`stream-event-row group relative flex gap-10 items-start cursor-pointer transition-opacity duration-500 ${isFocusedMonth ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            key={event.id}
            onClick={() => selectEvent(event.id)}
          >
            {/* Sticky Date */}
            <div className="w-32 sticky top-0 text-right shrink-0 pt-2">
              <div className={`font-display font-black text-6xl tracking-tighter transition-colors duration-300 group-hover:text-accent-primary ${isFocusedMonth ? 'text-ink' : 'text-ink/20'}`}>
                {format(event.start, 'dd')}
              </div>
              <div className="font-mono text-xs uppercase tracking-widest opacity-50 group-hover:text-accent-primary transition-colors duration-300">
                {format(event.start, 'MMM yyyy')}
              </div>
            </div>

            {/* Event Card */}
            <div className="flex-1">
              <GlossCard className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-accent-primary transition-colors duration-300 mt-[-4px]">{event.title}</h3>
                  <div className="font-mono text-xs px-4 py-1 rounded-full border border-black/10 min-w-[140px] text-center mt-1">
                    {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                  </div>
                </div>
                {event.location && (
                  <div className="font-mono text-xs opacity-50 flex items-center gap-2">
                    📍 {event.location}
                  </div>
                )}
              </GlossCard>
            </div>
          </motion.div>
        );
      })}

      {sortedEvents.length === 0 && (
        <div className="text-center opacity-40 font-mono py-20">
          No events found.
        </div>
      )}
    </div>
  );
};
