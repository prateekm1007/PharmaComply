import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AdminUIState {
  activeRequestId: string | null;
  isDetailOpen: boolean;
  isConfirmOpen: boolean;

  viewLockedBy: string | null;

  filters: {
    status: 'all' | 'pending' | 'critical';
    search: string;
  };

  openRequest: (id: string) => void;
  closeRequest: () => void;
  setFilters: (filters: Partial<AdminUIState['filters']>) => void;
  setViewLock: (adminId: string | null) => void;
}

export const useAdminUI = create<AdminUIState>()(
  devtools((set) => ({
    activeRequestId: null,
    isDetailOpen: false,
    isConfirmOpen: false,
    viewLockedBy: null,

    filters: {
      status: 'pending',
      search: '',
    },

    openRequest: (id: string) =>
      set({
        activeRequestId: id,
        isDetailOpen: true,
        viewLockedBy: null,
      }),

    closeRequest: () =>
      set({
        activeRequestId: null,
        isDetailOpen: false,
        isConfirmOpen: false,
      }),

    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

    setViewLock: (adminId) => set({ viewLockedBy: adminId }),
  }))
);
