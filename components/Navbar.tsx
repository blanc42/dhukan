'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSelectedStore } from '@/store/userSelectedStore'
import { useUserStore } from '@/store/userUserStore'
import { Store } from '@/types'

export default function Navbar() {
  const { selectedStore, setSelectedStore } = useSelectedStore()
  const { user } = useUserStore()

  useEffect(() => {
    if (user?.stores && user.stores.length > 0 && !selectedStore) {
      setSelectedStore(user.stores[0])
    }
  }, [user, selectedStore, setSelectedStore])

  const handleStoreChange = (storeId: string) => {
    const newSelectedStore = user?.stores.find(store => store.ID === parseInt(storeId)) || null
    setSelectedStore(newSelectedStore)
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Image src="/logo.png" alt="Logo" width={60} height={60} className='rounded-full' />

        {/* Store Selector */}
        <Select onValueChange={handleStoreChange} value={selectedStore?.ID.toString() || ''}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a store">
              {selectedStore?.name || "Select a store"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {user?.stores.map((store) => (
              <SelectItem key={store.ID} value={store.ID.toString()}>
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

<div className='flex items-center space-x-4'>

      {/* Create Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center space-x-2">
            <span>+</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/products/add">Create Product</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/categories/add">Create Category</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
</div>

    </nav>
  )
}