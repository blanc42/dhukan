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