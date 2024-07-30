"use client"

import { useEffect } from 'react'
import { useUserStore } from '@/store/userUserStore'
import { useSelectedStore } from '@/store/userSelectedStore'
import { useStoreModal } from '@/store/useStoreModal'
import { StoreModal } from "@/components/modals/storeModal"
import { HOST } from '@/config'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Store } from '@/types'
import { useRouter } from 'next/navigation'

export default function HomeComponent({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser)
  const setSelectedStore = useSelectedStore((state) => state.setSelectedStore)
  const storeModal = useStoreModal()
  const [storedStore, setStoredStore] = useLocalStorage<Store | null>('selectedStore', null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${HOST}/admin`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        setUser(userData.data)
        console.log(userData.data)
        router.push('/dashboard')

      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [setUser, setSelectedStore, storeModal, storedStore, setStoredStore, router])

  return <>
    {children}
  </>
}