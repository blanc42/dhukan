import { HOST } from '@/config'
import { Store } from '@/types'




export async function fetchStores(): Promise<Store[]> {
  try {
    const response = await fetch(`${HOST}/stores`)
    if (!response.ok) {
      throw new Error('Failed to fetch stores')
    }
    const stores: Store[] = await response.json()
    return stores
  } catch (error) {
    console.error('Error fetching stores:', error)
    return []
  }
}
