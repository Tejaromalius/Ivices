import ICAL from 'ical.js';
import type { ParsedEvent } from '../types';

export const parseICS = async (fileContent: string): Promise<ParsedEvent[]> => {
  return new Promise((resolve, reject) => {
    try {
      const jcalData = ICAL.parse(fileContent);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      const events: ParsedEvent[] = vevents.map((vevent) => {
        const event = new ICAL.Event(vevent);
        
        // Handle dates carefully. 
        // ICAL.Time needs to be converted to native JS Date.
        const startDate = event.startDate.toJSDate();
        const endDate = event.endDate.toJSDate();

        return {
          id: event.uid || crypto.randomUUID(),
          title: event.summary || 'Untitled Event',
          start: startDate,
          end: endDate,
          location: event.location || undefined,
          description: event.description || undefined,
          isAllDay: event.startDate.isDate, // isDate is true if it's just a date (no time), hence all-day
          recurrenceRule: vevent.getFirstPropertyValue('rrule')?.toString(),
        };
      });

      resolve(events);
    } catch (error) {
      console.error("ICS Parsing Failed:", error);
      reject(error);
    }
  });
};
