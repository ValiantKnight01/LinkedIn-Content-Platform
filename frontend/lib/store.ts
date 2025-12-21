import { create } from 'zustand';
import dayjs from 'dayjs';

export type PostStatus = 'draft' | 'in-progress' | 'scheduled';

export interface Post {
  id: string;
  title: string;
  date: string; // ISO format
  status: PostStatus;
}

interface CalendarState {
  currentDate: dayjs.Dayjs;
  posts: Post[];
  isLoading: boolean;
  nextMonth: () => void;
  prevMonth: () => void;
  fetchPosts: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: dayjs().startOf('month'),
  posts: [],
  isLoading: false,

  nextMonth: () => {
    set((state) => ({ currentDate: state.currentDate.add(1, 'month') }));
    get().fetchPosts();
  },

  prevMonth: () => {
    set((state) => ({ currentDate: state.currentDate.subtract(1, 'month') }));
    get().fetchPosts();
  },

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const { currentDate } = get();
      const month = currentDate.format('MM');
      const year = currentDate.format('YYYY');
      
      const response = await fetch(`/api/posts?month=${month}&year=${year}`);
      const data = await response.json();
      
      set({ posts: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      set({ isLoading: false });
    }
  },
}));
