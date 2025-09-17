import { NativeModules, NativeEventEmitter } from 'react-native';

const { CalendarModule } = NativeModules;

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: number;
  endDate: number;
  notes?: string;
}

class CalendarService {
  async requestCalendarAccess(): Promise<boolean> {
    try {
      return await CalendarModule.requestCalendarAccess();
    } catch (error) {
      console.error('Error requesting calendar access:', error);
      throw error;
    }
  }

  async createEvent(
    title: string,
    startDate: Date,
    endDate: Date,
    notes?: string
  ): Promise<CalendarEvent> {
    try {
      const event = await CalendarModule.createEvent(
        title,
        startDate.getTime(),
        endDate.getTime(),
        notes
      );
      return event;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      return await CalendarModule.getEvents(startDate.getTime(), endDate.getTime());
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      return await CalendarModule.deleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  async syncTransactionWithCalendar(
    transactionTitle: string,
    transactionDate: Date,
    notes?: string
  ): Promise<CalendarEvent> {
    try {
      const startDate = new Date(transactionDate);
      const endDate = new Date(transactionDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      return await this.createEvent(
        `Transaction: ${transactionTitle}`,
        startDate,
        endDate,
        notes
      );
    } catch (error) {
      console.error('Error syncing transaction with calendar:', error);
      throw error;
    }
  }
}

export const calendarService = new CalendarService();
