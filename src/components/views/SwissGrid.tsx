import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const SwissGrid = () => {
  const focusedDate = useCalendarStore((state) => state.focusedDate);
  const events = useCalendarStore((state) => state.events);
  const selectEvent = useCalendarStore((state) => state.actions.selectEvent);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(focusedDate)),
    end: endOfWeek(endOfMonth(focusedDate))
  });

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-[1px]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-4 font-mono text-xs uppercase opacity-40">
            {day}
          </div>
        ))}
      </div>

            {/* Calendar Grid - Ensure 6 rows for consistent height */}

            <div className="grid grid-cols-7 grid-rows-6 gap-[1px] rounded-2xl overflow-hidden shadow-inner flex-grow"

                 style={{ backgroundColor: 'var(--color-grid-border)', border: '2px solid var(--color-grid-border)' }}

            >

              {days.map((day) => {

                const isCurrentMonth = isSameMonth(day, focusedDate);

                const dayEvents = events.filter(e => isSameDay(e.start, day));

      

                return (

                  <div 

                    key={day.toISOString()}

                    style={{ 

                        backgroundColor: isCurrentMonth ? 'var(--color-grid-active)' : 'var(--color-grid-inactive)',

                        opacity: isCurrentMonth ? 1 : 0.6

                    }}

                    className={cn(

                      "p-4 hover:brightness-95 dark:hover:brightness-110 transition-[background-color,filter] duration-300 relative group flex flex-col"

                    )}

                  >

                    <span className={cn(

                      "font-display font-bold text-2xl tracking-tighter block mb-2 text-ink", // Added text-ink to ensure color follows theme

                      !isCurrentMonth ? "opacity-30" : "opacity-100"

                    )}>                {format(day, 'd')}
              </span>

              <div className="flex flex-col gap-1 overflow-hidden flex-grow"> {/* Added flex-grow and overflow-hidden */}
                {dayEvents.slice(0, 3).map(event => (
                  <motion.div
                    layoutId={`event-${event.id}`}
                    key={event.id}
                    onClick={(e) => { e.stopPropagation(); selectEvent(event.id); }}
                    className="text-[10px] font-mono p-1 px-2 rounded bg-accent-secondary/10 text-accent-secondary truncate border border-accent-secondary/20 cursor-pointer hover:bg-accent-secondary hover:text-white transition-colors"
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-mono opacity-50 pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
