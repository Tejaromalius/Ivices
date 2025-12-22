import { motion, useMotionValue, useTransform, animate, type PanInfo, useSpring } from 'framer-motion';
import { useCalendarStore } from '../../store/calendarStore';
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WheelProps {
  value: Date;
  type: 'month' | 'year';
  onNext: () => void;
  onPrev: () => void;
}

const ITEM_WIDTH = 150;
const DRAG_THRESHOLD = ITEM_WIDTH;

const RouletteWheel = ({ value, type, onNext, onPrev }: WheelProps) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Spring for the expansion effect (0 = collapsed at center, 1 = expanded)
  const spread = useSpring(0, { stiffness: 400, damping: 30 });

  // Update spread based on drag state
  if (isDragging) {
    spread.set(1);
  } else {
    spread.set(0);
  }

  // Helper to get date at offset
  const getDate = (offset: number) => {
    if (offset === 0) return value;
    if (type === 'month') {
      return offset > 0 ? addMonths(value, offset) : subMonths(value, Math.abs(offset));
    } else {
      return offset > 0 ? addYears(value, offset) : subYears(value, Math.abs(offset));
    }
  };

  const formatStr = type === 'month' ? 'MMMM' : 'yyyy';

  // Handle continuous drag
  const handlePanStart = () => setIsDragging(true);
  const handlePan = (_: any, info: PanInfo) => {
    const currentX = x.get();
    const newX = currentX + info.delta.x;

    if (newX > DRAG_THRESHOLD) {
      onPrev();
      x.set(newX - DRAG_THRESHOLD);
    } else if (newX < -DRAG_THRESHOLD) {
      onNext();
      x.set(newX + DRAG_THRESHOLD);
    } else {
      x.set(newX);
    }
  };

  const handlePanEnd = () => {
    setIsDragging(false);
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  const offsets = [-2, -1, 0, 1, 2];

  return (
    <div
      className="relative h-12 w-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none group"
      ref={containerRef}
    >
      {/* Navigation Arrows (Visible only when not dragging) */}
      <motion.button
        onClick={onPrev}
        className="absolute left-[75px] p-2 rounded-full text-ink/30 hover:text-ink hover:bg-black/5 z-30 transition-colors" // Adjusted left position
        animate={{ opacity: isDragging ? 0 : 1, scale: isDragging ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronLeft size={type === 'month' ? 24 : 16} />
      </motion.button>

      <motion.button
        onClick={onNext}
        className="absolute right-[75px] p-2 rounded-full text-ink/30 hover:text-ink hover:bg-black/5 z-30 transition-colors" // Adjusted right position
        animate={{ opacity: isDragging ? 0 : 1, scale: isDragging ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronRight size={type === 'month' ? 24 : 16} />
      </motion.button>

      {/* Interactive Overlay */}
      <motion.div
        className="absolute inset-0 z-20"
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
      />

      {/* Items */}
      {offsets.map((offset) => (
        <WheelItem
          key={`${type}-${offset}-${value.toISOString()}`}
          offset={offset}
          date={getDate(offset)}
          formatStr={formatStr}
          parentX={x}
          spread={spread}
          type={type}
        />
      ))}
    </div>
  );
};

const WheelItem = ({ offset, date, formatStr, parentX, spread, type }: any) => {
  // Calculate dynamic X: (offset * width * spreadFactor) + dragDelta
  // When spread is 0, all items sit at 'dragDelta' (effectively center relative to drag)
  // When spread is 1, they sit at their proper list positions
  const baseX = useTransform(spread, (s: number) => offset * ITEM_WIDTH * s);
  const x = useTransform([baseX, parentX], ([b, p]) => (b as number) + (p as number));

  // Opacity Logic:
  // 1. Distance fade: Fade out as they move away from center (standard list behavior)
  const centerRange = [-ITEM_WIDTH, 0, ITEM_WIDTH];
  const distanceOpacity = useTransform(x, centerRange, [0.2, 1, 0.2]);

  // 2. Collapse fade: If not center item, fade out when collapsed (spread = 0)
  const isCenterItem = offset === 0;
  const finalOpacity = useTransform(spread, (s: number) => {
    const currentDistOpacity = distanceOpacity.get();
    if (isCenterItem) return currentDistOpacity;
    return currentDistOpacity * s; // Side items fade to 0 as spread goes to 0
  });

  const scale = useTransform(x, centerRange, [0.6, 1, 0.6]);

  return (
    <motion.div
      className={`absolute font-bold select-none pointer-events-none flex justify-center items-center w-[${ITEM_WIDTH}px] ${type === 'month' ? 'text-4xl tracking-tighter' : 'text-lg font-mono tracking-widest'
        }`}
      style={{ x, opacity: finalOpacity, scale }}
    >
      {format(date, formatStr)}
    </motion.div>
  );
};

export const MonthNavigator = () => {

  const focusedDate = useCalendarStore((state) => state.focusedDate);

  const { nextMonth, prevMonth, nextYear, prevYear } = useCalendarStore((state) => state.actions);



  return (

    <div className="flex flex-col items-center justify-center gap-1 py-2 relative group/nav">

      <RouletteWheel 

        value={focusedDate} 

        type="month" 

        onNext={nextMonth} 

        onPrev={prevMonth} 

      />
              <div className="mt-[-8px]">
                <RouletteWheel 
                    value={focusedDate} 
                    type="year" 
                    onNext={nextYear} 
                    onPrev={prevYear} 
                />
              </div>
            </div>
          );
        };
