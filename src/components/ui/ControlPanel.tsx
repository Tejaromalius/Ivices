import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import { Grid, List, Sun, Moon, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import type { ViewMode } from '../../types';

export const ControlPanel = () => {
    const view = useCalendarStore((state) => state.view);
    const setView = useCalendarStore((state) => state.actions.setView);
    const setFocusedDate = useCalendarStore((state) => state.actions.setFocusedDate);

    // Theme Logic with LocalStorage Persistence
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('ivices-theme');
            if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        }
        return 'light';
    });
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        localStorage.setItem('ivices-theme', theme);
    }, [theme]);
    
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const toggleView = (mode: ViewMode) => () => setView(mode);

    // Button Base Style
    const btnClass = "relative flex items-center justify-center gap-2 h-10 rounded-md transition-all duration-200 border border-transparent hover:border-black/5 dark:hover:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95";
    const activeClass = "bg-white dark:bg-white/10 shadow-sm text-ink";
    const inactiveClass = "text-ink/50 hover:text-ink";

    return (
        <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md p-1.5 rounded-xl border border-white/20 dark:border-white/10 w-auto shadow-xl">
             <div className="flex gap-2">
                {/* View Toggles */}
                <button 
                    onClick={toggleView('grid')}
                    className={cn(btnClass, view === 'grid' ? activeClass : inactiveClass, "w-24")}
                >
                    <Grid size={16} />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Grid</span>
                </button>
                
                <button 
                    onClick={toggleView('stream')}
                    className={cn(btnClass, view === 'stream' ? activeClass : inactiveClass, "w-24")}
                >
                    <List size={16} />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Stream</span>
                </button>

                {/* Today */}
                <button 
                    onClick={() => setFocusedDate(new Date())}
                    className={cn(btnClass, inactiveClass, "w-24")}
                >
                    <Calendar size={16} />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Today</span>
                </button>

                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className={cn(btnClass, inactiveClass, "w-24")}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme}
                            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                        </motion.div>
                    </AnimatePresence>
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                        {theme}
                    </span>
                </button>
             </div>
        </div>
    );
};
