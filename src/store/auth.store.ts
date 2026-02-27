import { create } from "zustand"

interface AuthState {
  user: any | null
  isLoading: boolean
  setUser: (user: any) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) =>
    set({ user, isLoading: false }),
  

  logout: () => {
    set({ user: null })
    window.location.href = "/login"
  },
}))