import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  name: string
  email: string
  setName: (name: string) => void
  setEmail: (email: string) => void
  updateProfile: (name: string, email: string) => void
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Aisha',
      email: 'aisha@example.com',
      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      updateProfile: (name, email) => set({ name, email }),
    }),
    {
      name: 'user-profile', // name of the item in the storage (must be unique)
    },
  ),
)
