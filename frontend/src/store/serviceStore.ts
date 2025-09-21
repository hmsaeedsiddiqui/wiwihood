import { create } from 'zustand';
import type { Service } from '@/lib/api';

interface ServiceStore {
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  clearSelectedService: () => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  selectedService: null,
  setSelectedService: (service) => set({ selectedService: service }),
  clearSelectedService: () => set({ selectedService: null }),
}));

