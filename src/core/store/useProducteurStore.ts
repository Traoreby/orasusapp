import { create } from 'zustand';
import { Producteur } from '../types/producteur';
import { INITIAL_PRODUCTEURS } from '../../constants/data';

export interface ProducteurState {
  producteurs: Producteur[];
  isLoading: boolean;
  
  // Actions
  initStore: () => void;
  addProducteur: (producteur: Producteur) => void;
  updateProducteur: (id: string, data: Partial<Producteur>) => void;
  deleteProducteur: (id: string) => void;
  
  // Getters
  getProducteur: (id: string) => Producteur | undefined;
  getStats: () => {
    totalProducteurs: number;
    superficieTotale: number;
    productionTotale: number;
    revenuTotal: number;
  };
}

export const useProducteurStore = create<ProducteurState>((set, get) => ({
  producteurs: [],
  isLoading: true,

  initStore: () => {
    // Simulons un chargement initial rapide (pour l'UI State)
    set({ producteurs: INITIAL_PRODUCTEURS, isLoading: false });
  },

  addProducteur: (producteur) => {
    set((state) => ({
      producteurs: [...state.producteurs, producteur]
    }));
  },

  updateProducteur: (id, data) => {
    const existing = get().getProducteur(id);
    if (!existing) return;
    const updated = { ...existing, ...data };
    
    set((state) => ({
      producteurs: state.producteurs.map(p => p.id === id ? updated : p)
    }));
  },

  deleteProducteur: (id) => {
    set((state) => ({
      producteurs: state.producteurs.filter(p => p.id !== id)
    }));
  },

  getProducteur: (id) => {
    return get().producteurs.find(p => p.id === id);
  },

  getStats: () => {
    const { producteurs } = get();
    return {
      totalProducteurs: producteurs.length,
      superficieTotale: producteurs.reduce((s, p) => s + (p.supCacao || 0), 0),
      productionTotale: producteurs.reduce((s, p) => s + (Array.isArray(p.cultures) ? p.cultures.reduce((cs, c) => cs + (parseFloat(String(c.production)) || 0), 0) : 0), 0),
      revenuTotal: producteurs.reduce((s, p) => s + (Array.isArray(p.cultures) ? p.cultures.reduce((cs, c) => cs + (parseFloat(String(c.revenu)) || 0), 0) : 0), 0),
    };
  }
}));
