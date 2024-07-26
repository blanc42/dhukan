'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchStores } from '@/lib/api/fetchStores'
import { Store } from '@/types' // Import the Store type from types.ts

export default function Navbar() {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>('')

  useEffect(() => {
    const loadStores = async () => {
      try {
        const fetchedStores = await fetchStores()
        setStores(fetchedStores)
      } catch (error) {
        console.error('Failed to fetch stores:', error)
      }
    }
    loadStores()
  }, [])

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Image src="/logo.png" alt="Logo" width={40} height={40} className='rounded-full border border-black' />

        {/* Store Selector */}
        <Select onValueChange={setSelectedStore} value={selectedStore}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Nav Items */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
        <Link href="/products" className="text-sm font-medium">Products</Link>
        <Link href="/categories" className="text-sm font-medium">Categories</Link>
        <Link href="/variants" className="text-sm font-medium">Variants</Link>
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/profile.jpg" alt="Profile" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">

            
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/store-settings">Store Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/login">Login</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/signup">Signup</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}