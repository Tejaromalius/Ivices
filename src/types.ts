export interface ParsedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  isAllDay: boolean;
  recurrenceRule?: string; // Storing RRULE string for now, to be handled by rrule.js if needed later
}

export type ViewMode = 'grid' | 'stream';
