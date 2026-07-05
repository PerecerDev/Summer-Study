import { create } from 'zustand';

interface ParentAuthState {
  parentToken: string | null;
  expiresAt: string | null;
  setParentAuth: (token: string, expiresAt: string) => void;
  clearParentAuth: () => void;
  isParentAuthenticated: () => boolean;
}

export const useParentAuthStore = create<ParentAuthState>((set, get) => ({
  parentToken: null,
  expiresAt: null,
  setParentAuth: (token, expiresAt) => {
    set({ parentToken: token, expiresAt });
  },
  clearParentAuth: () => {
    set({ parentToken: null, expiresAt: null });
  },
  isParentAuthenticated: () => {
    const { parentToken, expiresAt } = get();

    if (!parentToken || !expiresAt) return false;

    return new Date(expiresAt).getTime() > Date.now();
  },
}));
