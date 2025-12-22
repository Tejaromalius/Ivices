import { motion } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import { cn } from '../../lib/utils';
import { Grid, List } from 'lucide-react';
import type { ViewMode } from '../../types';

export const ViewToggle = () => {
    const view = useCalendarStore((state) => state.view);
    const setView = useCalendarStore((state) => state.actions.setView);

    const toggle = (mode: ViewMode) => () => setView(mode);

    return (
        <div className="bg-black/5 backdrop-blur-md p-1 rounded-lg flex gap-1 relative border border-white/20">
            {/* Active Pill Background */}
            <motion.div 
                className="absolute inset-1 bg-white shadow-sm rounded-md z-0"
                layoutId="toggle-pill"
                initial={false}
                animate={{ 
                    x: view === 'grid' ? 0 : '100%',
                    width: 'calc(50% - 4px)' // Adjust based on gap/padding
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <button 
                onClick={toggle('grid')}
                className={cn(
                    "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors w-32 justify-center",
                    view === 'grid' ? "text-black" : "text-black/50 hover:text-black/70"
                )}
            >
                <Grid size={16} />
                <span className="font-mono text-xs">GRID</span>
            </button>
            
            <button 
                onClick={toggle('stream')}
                className={cn(
                    "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors w-32 justify-center",
                    view === 'stream' ? "text-black" : "text-black/50 hover:text-black/70"
                )}
            >
                <List size={16} />
                <span className="font-mono text-xs">STREAM</span>
            </button>
        </div>
    );
};
