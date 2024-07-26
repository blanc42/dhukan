"use client"

import { useEffect } from 'react'
import { useUserStore } from '@/store/userUserStore'
import { useSelectedStore } from '@/store/userSelectedStore'
import { useStoreModal } from '@/store/useStoreModal'
import { StoreModal } from "@/components/modals/storeModal"
import { HOST } from '@/config'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Store } from '@/types'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser)
  const setSelectedStore = useSelectedStore((state) => state.setSelectedStore)
  const storeModal = useStoreModal()
  const [storedStore, setStoredStore] = useLocalStorage<Store | null>('selectedStore', null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${HOST}/user`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }

        const userData = await response.json()
        setUser(userData.data)

        if (userData.data.stores && userData.data.stores.length > 0) {
          if (storedStore) {
            setSelectedStore(storedStore)
          } else {
            const firstStore = userData.data.stores[0]
            setSelectedStore(firstStore)
            setStoredStore(firstStore)
          }
        } else {
          storeModal.onOpen()
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [setUser, setSelectedStore, storeModal, storedStore, setStoredStore])

  return (
    <><h1>main</h1></>
  )
}