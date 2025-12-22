import { create } from 'zustand';
import type { ParsedEvent, ViewMode } from '../types';
import { parseICS } from '../lib/icsParser';
import { addMonths, subMonths, addYears, subYears } from 'date-fns';

interface CalendarState {
  events: ParsedEvent[];
  view: ViewMode;
  focusedDate: Date;
  selectedEventId: string | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    setView: (view: ViewMode) => void;
    setFocusedDate: (date: Date) => void;
    nextMonth: () => void;
    prevMonth: () => void;
    nextYear: () => void;
    prevYear: () => void;
    selectEvent: (id: string | null) => void;
    loadICS: (file: File) => Promise<void>;
  };
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  view: 'grid',
  focusedDate: new Date(),
  selectedEventId: null,
  isLoading: false,
  error: null,
  actions: {
    setView: (view) => set({ view }),
    setFocusedDate: (focusedDate) => set({ focusedDate }),
    nextMonth: () => set((state) => ({ focusedDate: addMonths(state.focusedDate, 1) })),
    prevMonth: () => set((state) => ({ focusedDate: subMonths(state.focusedDate, 1) })),
    nextYear: () => set((state) => ({ focusedDate: addYears(state.focusedDate, 1) })),
    prevYear: () => set((state) => ({ focusedDate: subYears(state.focusedDate, 1) })),
    selectEvent: (selectedEventId) => set({ selectedEventId }),
    loadICS: async (file) => {
      set({ isLoading: true, error: null });
      try {
        const text = await file.text();
        const events = await parseICS(text);
        set({ events, isLoading: false });
      } catch (err) {
        set({ 
            error: err instanceof Error ? err.message : 'Failed to parse calendar file', 
            isLoading: false 
        });
      }
    },
  },
}));

export const useCalendarActions = () => useCalendarStore((state) => state.actions);
