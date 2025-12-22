import { motion } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import { format } from 'date-fns';
import { X, MapPin, Clock, Calendar } from 'lucide-react';
import { GlossCard } from '../ui/GlossCard';

export const EventLens = () => {
  const selectedEventId = useCalendarStore((state) => state.selectedEventId);
  const selectEvent = useCalendarStore((state) => state.actions.selectEvent);
  const event = useCalendarStore((state) => 
    state.events.find((e) => e.id === selectedEventId)
  );

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={() => selectEvent(null)}
    >
      <motion.div
        layoutId={`event-${event.id}`}
        className="w-full max-w-2xl text-[#0A0A0A]" // Force dark text globally for this component content
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <GlossCard className="overflow-hidden flex flex-col max-h-[80vh] shadow-2xl border-white/50">
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="p-8 border-b border-white/20 flex justify-between items-start bg-white/10">
                <div>
                  <h2 className="text-3xl font-display font-bold tracking-tight mb-2 drop-shadow-sm text-[#0A0A0A]">{event.title}</h2>
                  <div className="flex items-center gap-4 text-sm font-mono opacity-80 text-[#0A0A0A]">
                    <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {format(event.start, 'EEEE, MMMM do, yyyy')}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </span>
                  </div>
                </div>
                <button 
                    onClick={() => selectEvent(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors text-[#0A0A0A]"
                >
                    <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                
                {/* Location */}
                {event.location && (
                    <div className="flex gap-4 items-start text-[#0A0A0A]">
                        <MapPin className="mt-1 opacity-50" />
                        <div>
                            <h4 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-1">Location</h4>
                            <p className="text-lg font-medium">{event.location}</p>
                        </div>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div className="text-[#0A0A0A]">
                         <h4 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-2">Description</h4>
                         <div className="prose prose-invert prose-sm max-w-none opacity-90 whitespace-pre-wrap leading-relaxed text-[#0A0A0A]">
                            {event.description}
                         </div>
                    </div>
                )}

                {/* Raw Data */}
                <div className="pt-8 border-t border-white/20 text-[#0A0A0A]">
                     <h4 className="font-mono text-xs uppercase tracking-widest opacity-40 mb-4">Raw Metadata</h4>
                     <div className="bg-black/80 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto shadow-inner border border-white/5">
                        <pre>{JSON.stringify({
                            uid: event.id,
                            dtstart: event.start.toISOString(),
                            dtend: event.end.toISOString(),
                            rrule: event.recurrenceRule || 'null',
                            is_all_day: event.isAllDay
                        }, null, 2)}</pre>
                     </div>
                </div>
              </div>
            </div>
        </GlossCard>
      </motion.div>
    </motion.div>
  );
};
