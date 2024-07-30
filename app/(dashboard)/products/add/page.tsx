'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import { X, Plus, Trash, Upload } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

type VariantOption = {
  value: string
  label: string
  selected: boolean
}

type Variant = {
  id: string
  name: string
  options: VariantOption[]
}

// Simulate fetching variants from an API
const fetchVariants = async (): Promise<Variant[]> => {
  return [
    {
      id: 'color',
      name: 'Color',
      options: [
        { value: 'red', label: 'Red', selected: true },
        { value: 'blue', label: 'Blue', selected: true },
        { value: 'green', label: 'Green', selected: true },
        { value: 'yellow', label: 'Yellow', selected: true },
      ],
    },
    {
      id: 'size',
      name: 'Size',
      options: [
        { value: 'small', label: 'Small', selected: true },
        { value: 'medium', label: 'Medium', selected: true },
        { value: 'large', label: 'Large', selected: true },
      ],
    },
    {
      id: 'clothType',
      name: 'Cloth Type',
      options: [
        { value: 'cotton', label: 'Cotton', selected: true },
        { value: 'wool', label: 'Wool', selected: true },
        { value: 'silk', label: 'Silk', selected: true },
      ],
    },
  ]
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  categoryId: z.number().positive('Category ID is required'),
  items: z.array(z.object({
    sku: z.string().min(1, 'SKU is required'),
    quantity: z.number().min(0, 'Quantity must be 0 or greater'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    discountedPrice: z.number().min(0, 'Discounted price must be 0 or greater').optional(),
    variantOptions: z.array(z.object({
      id: z.string().min(1, 'ID is required'),
      value: z.string().min(1, 'Value is required'),
      description: z.string().optional(),
      variantId: z.string().min(1, 'Variant ID is required'),
    })),
  }))
})

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

  const updateCombinations = (selectedVariants: Variant[]) => {
    const generateCombinations = (variants: Variant[], index: number, currentCombination: string[], allCombinations: string[][]) => {
      if (index === variants.length) {
        allCombinations.push([...currentCombination])
        return
      }
      for (const option of variants[index].options) {
        if (option.selected) {
          currentCombination.push(option.label)
          generateCombinations(variants, index + 1, currentCombination, allCombinations)
          currentCombination.pop()
        }
      }
    }

    const newCombinations: string[][] = []
    generateCombinations(selectedVariants, 0, [], newCombinations)
    setCombinations(newCombinations)

    // Update form items
    form.setValue('items', newCombinations.map((combination, index) => ({
      sku: `SKU-${index + 1}`,
      quantity: 0,
      price: 0,
      discountedPrice: 0,
      variantOptions: combination.map((option, optionIndex) => ({
        id: `${index}-${optionIndex}`,
        value: option,
        description: '',
        variantId: selectedVariants[optionIndex].id,
      })),
    })))
  }

  const allVariantsSelected = variants.length === 0

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit((data) => console.log(data))}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 md:w-1/3">
              <FormItem>
                <FormLabel>Image Upload</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop or click to upload</p>
                </div>
              </FormItem>
            </div>
          </div>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Electronics</SelectItem>
                    <SelectItem value="2">Clothing</SelectItem>
                    <SelectItem value="3">Books</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <h2 className="text-xl font-bold mt-6 mb-4">Product Options</h2>
          <div className="mb-4">
            <FormItem>
              <FormLabel>Option title*</FormLabel>
              <Select onValueChange={handleSelectVariant} value={selectedVariant} disabled={allVariantsSelected}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
          <div className="mt-4">
            {selectedVariants.map((variant) => (
              <div key={variant.id} className="mt-2 border p-4 rounded">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium">{variant.name}</h3>
                  <button type="button" onClick={() => handleRemoveVariant(variant.id)} className="text-red-500">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {variant.options.filter(option => option.selected).map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 bg-green-200 p-2 rounded">
                      <span>{option.label}</span>
                      <button type="button" onClick={() => handleRemoveOption(variant.id, option.value)}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {variant.options.filter(option => !option.selected).map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 bg-red-200 p-2 rounded">
                      <span>{option.label}</span>
                      <button type="button" onClick={() => handleAddOption(variant.id, option.value)}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* variants div */}
          <div className="mt-4">
            <h2 className="text-lg font-medium">Variants</h2>
            <div className="mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="border-b py-4">
                  <h3 className="font-medium mb-2">{form.watch(`items.${index}.variantOptions`).map(vo => vo.value).join(' / ')}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}