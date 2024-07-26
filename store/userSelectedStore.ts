import { create } from 'zustand'
import { Store } from '@/types'

interface SelectedStoreState {
  selectedStore: Store | null
  setSelectedStore: (store: Store | null) => void
}

export const useSelectedStore = create<SelectedStoreState>((set) => ({
  selectedStore: null,
  setSelectedStore: (store) => set({ selectedStore: store }),
}))
