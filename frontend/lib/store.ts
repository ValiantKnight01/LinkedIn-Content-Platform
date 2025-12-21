import { create } from 'zustand';
import dayjs from 'dayjs';

export type PostStatus = 'draft' | 'in-progress' | 'scheduled';

export interface Post {
  id: string;
  title: string;
  date: string; // ISO format
  status: PostStatus;
}

// --- Calendar Store ---

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

// --- Newsroom Kanban Store ---

export type KanbanStatus = 'proposed' | 'selected' | 'inDraft' | 'scheduled';

export interface KanbanCard {
  id: string;
  title: string;
  type: 'link' | 'forum' | 'article';
  status: KanbanStatus;
  research_status?: 'queued' | 'researching' | 'complete';
  angle?: string;
  angle_guidance?: Record<string, string>;
  read_time?: string;
  description?: string;
  data_points?: string[];
  tags?: string[];
  audience?: string;
  source_url?: string;
}

interface NewsroomState {
  cards: KanbanCard[];
  isLoading: boolean;
  fetchCards: () => Promise<void>;
  moveCard: (cardId: string, newStatus: KanbanStatus, index: number) => void;
  generateCycle: () => Promise<void>;
  approveCard: (id: string) => Promise<void>;
  discardCard: (id: string) => Promise<void>;
  updateCardDetails: (id: string, updates: Partial<KanbanCard>) => Promise<void>;
}

export const useNewsroomStore = create<NewsroomState>((set, get) => ({
  cards: [],
  isLoading: false,

  fetchCards: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/newsroom');
      const data = await response.json();
      set({ cards: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch newsroom cards:", error);
      set({ isLoading: false });
    }
  },

  moveCard: (cardId, newStatus, index) => {
    set((state) => {
      const cards = [...state.cards];
      const cardIndex = cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return state;

      const [movedCard] = cards.splice(cardIndex, 1);
      const updatedCard = { ...movedCard, status: newStatus };
      
      // Get other cards in the target status to find the correct insertion point
      const statusCards = cards.filter(c => c.status === newStatus);
      // This is a simplified move; real sortable logic will handle reordering within the same column
      // but for dnd-kit we usually manage the global array.
      
      return { cards: [...cards, updatedCard] }; // We'll refine this for sortable later
    });
  },

  generateCycle: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/newsroom/generate', { method: 'POST' });
      const newCards = await response.json();
      set((state) => ({ 
        cards: [...state.cards, ...newCards], 
        isLoading: false 
      }));
    } catch (error) {
      console.error("Failed to generate cycle:", error);
      set({ isLoading: false });
    }
  },

  approveCard: async (id) => {
    try {
      const response = await fetch(`/api/newsroom/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'inDraft' }),
      });
      if (response.ok) {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, status: 'inDraft' } : c)),
        }));
      }
    } catch (error) {
      console.error("Failed to approve card:", error);
    }
  },

  discardCard: async (id) => {
    try {
      const response = await fetch(`/api/newsroom/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to discard card:", error);
    }
  },

  updateCardDetails: async (id, updates) => {
     try {
      const response = await fetch(`/api/newsroom/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const updatedCard = await response.json();
      set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? updatedCard : c)),
      }));
    } catch (error) {
      console.error("Failed to update card details:", error);
    }
  }
}));