# ECMS Admin Panel

ECMS Admin Panel is a modern, user-friendly interface for managing e-commerce operations. This project serves as the frontend for the E-Commerce Management System (ECMS) backend, providing a seamless experience for store administrators to manage their products, categories, and variants.

## Live Demo

Visit [https://dhukan.vercel.app](https://dhukan.vercel.app) to see the application in action.

## Screenshots

![Screenshot 1](screenshots/screenshot1.png)
![Screenshot 2](screenshots/screenshot2.png)

## Backend Repository

The backend for this project is available at [https://github.com/blanc42/ecms](https://github.com/blanc42/ecms). It's built with Go, using the Gin web framework and GORM for database operations.

## Features

- User authentication (signup and login)
- Store management
- Product management with variant support
- Category management with hierarchical structure
- Responsive design for desktop and mobile use

## Technology Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Zustand for state management
- React Hook Form with Zod for form validation

## Getting Started

To run this project locally:

```
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


```7:15:README.md
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
```


## Project Structure

- `app/`: Next.js app router pages and layouts
- `components/`: Reusable React components
- `hooks/`: Custom React hooks
- `store/`: Zustand store configurations
- `types/`: TypeScript type definitions
- `lib/`: Utility functions and configurations

## Key Components

### Navbar

The Navbar component provides navigation and store selection functionality:


```1:106:components/Navbar.tsx
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
```


### Product Management

The product management page allows for listing, adding, and editing products:


```1:127:app/(dashboard)/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSelectedStore } from '@/store/userSelectedStore'
import { HOST } from '@/config'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ProductFormValues } from '@/types'

// Mock products
const mockProducts: ProductFormValues[] = [
  {
    name: "Smartphone X",
    description: "Latest model with advanced features",
    rating: 4.5,
    isFeatured: true,
    isArchived: false,
    categoryId: "1",
    storeId: "1",
    selectedVariants: ["color", "storage"],
    items: [
      {
        sku: "SMX-BLK-128",
        quantity: 50,
        price: 999.99,
        variantOptions: [
          { id: "1", value: "Black", description: "Sleek black color", variantId: "color" },
          { id: "2", value: "128GB", description: "128GB storage", variantId: "storage" }
        ]
      }
    ]
  },
  {
    name: "Wireless Earbuds Pro",
    description: "High-quality sound with noise cancellation",
    rating: 4.8,
    isFeatured: true,
    isArchived: false,
    categoryId: "2",
    storeId: "1",
    selectedVariants: ["color"],
    items: [
      {
        sku: "WEP-WHT",
        quantity: 100,
        price: 199.99,
        variantOptions: [
          { id: "3", value: "White", description: "Classic white color", variantId: "color" }
        ]
      }
    ]
  }
]

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductFormValues[]>(mockProducts)
  const { selectedStore } = useSelectedStore()

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedStore) {
        // Commented out actual fetch function
        // try {
        //   const response = await fetch(`${HOST}/stores/${selectedStore.ID}/products`, {
        //     credentials: 'include',
        //   })
        //   if (!response.ok) {
        //     throw new Error('Failed to fetch products')
        //   }
        //   const data = await response.json()
        //   setProducts(data.data)
        // } catch (error) {
        //   console.error('Error fetching products:', error)
        //   // Fallback to mock products in case of error
        //   setProducts(mockProducts)
        // }

        // Using mock data instead
        setProducts(mockProducts)
      }
    }

    fetchProducts()
  }, [selectedStore])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/products/add">Add New Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Archived</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.categoryId}</TableCell>
              <TableCell>${product.items[0]?.price.toFixed(2)}</TableCell>
              <TableCell>{product.isFeatured ? 'Yes' : 'No'}</TableCell>
              <TableCell>{product.isArchived ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/products/${product.name}/edit`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```


### Variant Selector

The VariantSelector component enables dynamic selection of product variants:


```80:148:app/(dashboard)/products/add/page.tsx
export default function VariantSelector() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariants, setSelectedVariants] = useState<Variant[]>([])
  const [combinations, setCombinations] = useState<string[][]>([])
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      isFeatured: false,
      isArchived: false,
      categoryId: 0,
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  useEffect(() => {
    const loadVariants = async () => {
      const fetchedVariants = await fetchVariants()
      setVariants(fetchedVariants)
    }
    loadVariants()
  }, [])

  const handleSelectVariant = (variantId: string) => {
    const selectedVariant = variants.find((variant) => variant.id === variantId)
    if (selectedVariant) {
      setSelectedVariants((prevSelectedVariants) => [...prevSelectedVariants, selectedVariant])
      setVariants((prevVariants) => prevVariants.filter((variant) => variant.id !== variantId))
      setSelectedVariant('')
      updateCombinations([...selectedVariants, selectedVariant])
    }
  }

  const handleRemoveVariant = (variantId: string) => {
    const removedVariant = selectedVariants.find((variant) => variant.id === variantId)
    if (removedVariant) {
      const newSelectedVariants = selectedVariants.filter((variant) => variant.id !== variantId)
      setSelectedVariants(newSelectedVariants)
      setVariants((prevVariants) => [...prevVariants, removedVariant])
      updateCombinations(newSelectedVariants)
    }
  }

  const handleRemoveOption = (variantId: string, optionValue: string) => {
    const newSelectedVariants = selectedVariants.map((variant) =>
      variant.id === variantId
        ? { ...variant, options: variant.options.map((option) => option.value === optionValue ? { ...option, selected: false } : option) }
        : variant
    )
    setSelectedVariants(newSelectedVariants)
    updateCombinations(newSelectedVariants)
  }

  const handleAddOption = (variantId: string, optionValue: string) => {
    const newSelectedVariants = selectedVariants.map((variant) =>
      variant.id === variantId
        ? { ...variant, options: variant.options.map((option) => option.value === optionValue ? { ...option, selected: true } : option) }
        : variant
    )
    setSelectedVariants(newSelectedVariants)
    updateCombinations(newSelectedVariants)
  }
```


## Deployment

This project is deployed on Vercel. For more information on deploying Next.js applications, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).