'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userUserStore'
import { useSelectedStore } from '@/store/userSelectedStore'
import { Store, User } from '@/types'
import { HOST } from '@/config'
import useLocalStorage from '@/hooks/useLocalStorage'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)
  const setSelectedStore = useSelectedStore((state) => state.setSelectedStore)
  const [, setStoredStore] = useLocalStorage<Store | null>('selectedStore', null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch(`${HOST}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const userData: { data: User } = await response.json()
      setUser(userData.data)
      
      if (userData.data.stores && userData.data.stores.length > 0) {
        const firstStore = userData.data.stores[0]
        setSelectedStore(firstStore)
        setStoredStore(firstStore)
      }

      toast({
        title: "Login successful",
        description: "You have been logged in.",
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem logging in.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Form>
      <p className="mt-4 text-center">
        Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  )
}