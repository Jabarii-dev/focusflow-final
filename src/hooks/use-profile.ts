import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  name: string
  email: string
  bio: string
  avatarUrl?: string
  language: string
  setName: (name: string) => void
  setEmail: (email: string) => void
  setBio: (bio: string) => void
  setAvatarUrl: (avatarUrl: string) => void
  setLanguage: (language: string) => void
  updateProfile: (name: string, email: string, bio: string, avatarUrl?: string, language?: string) => void
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Aisha',
      email: 'aisha@example.com',
      bio: 'Product Designer & Developer',
      avatarUrl: undefined,
      language: 'English',
      setName: (name) => set({ name }),
      setEmail: (email) => set({ email }),
      setBio: (bio) => set({ bio }),
      setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
      setLanguage: (language) => set({ language }),
      updateProfile: (name, email, bio, avatarUrl, language) => set((state) => ({ 
        name, 
        email, 
        bio,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : state.avatarUrl,
        language: language !== undefined ? language : state.language
      })),
    }),
    {
      name: 'user-profile', // name of the item in the storage (must be unique)
    },
  ),
)
