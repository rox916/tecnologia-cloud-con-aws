import React, { createContext, useContext, useState } from 'react';
import type { CostItem, CloudProposal } from '../types/cloud';
import { INITIAL_COST_ITEMS } from '../data/mockData';

type AppStateType = {
  items: CostItem[];
  addItem: (item: CostItem) => void;
  deleteItem: (id: string) => void;
  proposals: CloudProposal[];
  addProposal: (proposal: CloudProposal) => void;
};

const AppStateContext = createContext<AppStateType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CostItem[]>(INITIAL_COST_ITEMS);
  const [proposals, setProposals] = useState<CloudProposal[]>([]);

  const addItem = (item: CostItem) => setItems((prev) => [...prev, item]);
  const deleteItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const addProposal = (proposal: CloudProposal) => setProposals((prev) => [proposal, ...prev]);

  return (
    <AppStateContext.Provider value={{ items, addItem, deleteItem, proposals, addProposal }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
};
