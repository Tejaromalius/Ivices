import { AnimatePresence, motion } from 'framer-motion';
import { Portal } from './components/Portal';
import { useCalendarStore } from './store/calendarStore';
import { SwissGrid } from './components/views/SwissGrid';
import { TimeStream } from './components/views/TimeStream';
import { ControlPanel } from './components/ui/ControlPanel';
import { EventLens } from './components/views/EventLens';
import { MonthNavigator } from './components/ui/MonthNavigator';
import { GithubButton } from './components/ui/GithubButton';
import './App.css';

function App() {
  const hasEvents = useCalendarStore((state) => state.events.length > 0);
  const events = useCalendarStore((state) => state.events);
  const view = useCalendarStore((state) => state.view);
  const selectedEventId = useCalendarStore((state) => state.selectedEventId);

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasEvents && <Portal key="portal" />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEventId && <EventLens key="event-lens" />}
      </AnimatePresence>

      {hasEvents && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen p-6 md:p-10 bg-[var(--color-canvas)] flex flex-col relative" // Changed min-h-screen to h-screen and added flex-col
        >
          {/* Header Layer */}
          <header className="sticky top-0 z-40 flex flex-col items-center gap-2 mb-8 py-2 bg-[var(--color-canvas)]/80 backdrop-blur-md -mx-10 px-10 border-b border-black/5 dark:border-white/5 transition-colors">
            <MonthNavigator />
            <ControlPanel />
          </header>

                    {/* Main Content Layer */}
                    <main className="flex-1 w-full max-w-[1400px] mx-auto relative z-10 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={view}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="h-full w-full" 
                        >
                          {view === 'grid' ? <SwissGrid /> : <TimeStream />}
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Event Count - Just below right of content - This might need to move inside the views if they are scrolling containers, otherwise it floats over */}
                      <div className="absolute bottom-4 right-4 z-20"> 
                        <span className="font-mono text-xs opacity-40 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm">
                          {events.length} Events Loaded
                        </span>
                      </div>
                    </main>
          {/* Footer Layer */}
          <footer className="w-full max-w-[1400px] mx-auto mt-12 flex justify-between items-end border-t border-black/5 pt-6 opacity-60 hover:opacity-100 transition-opacity">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src="/icon.webp" alt="Ivices Logo" className="w-8 h-8 object-contain" />
              <span className="font-display font-bold tracking-tight text-lg">Ivices</span>
            </div>

            {/* Socials */}
            <GithubButton />
          </footer>
        </motion.div>
      )}
    </>
  );
}

export default App;