import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { useCalendarActions, useCalendarStore } from '../store/calendarStore';
import { UploadCloud } from 'lucide-react';
import { cn } from '../lib/utils';

export const Portal = () => {
  const { loadICS } = useCalendarActions();
  const isLoading = useCalendarStore((state) => state.isLoading);
  const error = useCalendarStore((state) => state.error);
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(useTransform(mouseX, (value) => value * 0.4), springConfig);
  const y = useSpring(useTransform(mouseY, (value) => value * 0.4), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      loadICS(file);
    }
  }, [loadICS]);

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-[var(--color-canvas)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Grid Hint */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <motion.div
          ref={containerRef}
          style={{ x, y }}
          className={cn(
            "w-96 h-96 rounded-full glass-panel flex flex-col items-center justify-center border border-white/40 shadow-2xl transition-colors duration-500",
            isDragging ? "bg-white/40 scale-110 border-accent-primary/50" : "bg-white/10"
          )}
        >
          {isLoading ? (
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               className="w-12 h-12 border-4 border-t-accent-primary border-black/10 rounded-full"
             />
          ) : (
            <>
              <motion.div
                animate={isDragging ? { scale: 1.2, y: -10 } : { scale: 1, y: 0 }}
              >
                 <UploadCloud className="w-16 h-16 text-ink opacity-80 mb-6" strokeWidth={1} />
              </motion.div>
              <h2 className="text-2xl font-display font-light tracking-tight text-ink">
                Drop Time Here
              </h2>
              <p className="mt-2 font-mono text-xs opacity-40">.ICS / .ICAL</p>
            </>
          )}
        </motion.div>
      </div>

      {error && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-red-500 font-mono text-sm">
          {error}
        </div>
      )}
    </motion.div>
  );
};
