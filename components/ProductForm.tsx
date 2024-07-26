"use client"
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { productSchema, ProductFormValues, Category, Store, Variant, VariantOption } from '@/types';

// Mock data - replace with actual API calls
const categories: Category[] = [
  { id: '1', name: 'Category 1', store_id: '1' },
  { id: '2', name: 'Category 2', store_id: '2' },
];

const stores: Store[] = [
  { id: '1', name: 'Store 1', description: 'Description for Store 1', admin_id: 1 },
  { id: '2', name: 'Store 2', description: 'Description for Store 2', admin_id: 2 },
];

const variants: Variant[] = [
  { 
    id: '1', 
    name: 'Size', 
    description: 'Size variant', 
    weight: 1, 
    categoryId: '1', 
    options: [
      { id: '1', value: 'S', description: 'Small', weight: 1, variantId: '1' },
      { id: '2', value: 'M', description: 'Medium', weight: 2, variantId: '1' },
      { id: '3', value: 'L', description: 'Large', weight: 3, variantId: '1' },
    ]
  },
  { 
    id: '2', 
    name: 'Color', 
    description: 'Color variant', 
    weight: 2, 
    categoryId: '1', 
    options: [
      { id: '4', value: 'Red', description: 'Red color', weight: 1, variantId: '2' },
      { id: '5', value: 'Blue', description: 'Blue color', weight: 2, variantId: '2' },
      { id: '6', value: 'Green', description: 'Green color', weight: 3, variantId: '2' },
    ]
  },
];

const ProductForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableVariants, setAvailableVariants] = useState<Variant[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      rating: 0,
      isFeatured: false,
      isArchived: false,
      categoryId: '',
      storeId: '',
      selectedVariants: [],
      items: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (selectedCategory) {
      // Fetch variants based on the selected category
      // For now, we'll use the mock data
      setAvailableVariants(variants);
    }
  }, [selectedCategory]);

  const generateProductItems = (selectedVariants: string[]) => {
    const selectedVariantOptions = selectedVariants.map(variantId => 
      variants.find(v => v.id === variantId)
    ).filter(Boolean) as Variant[];

    if (selectedVariantOptions.length === 0) {
      replace([{ sku: '', quantity: 0, price: 0, discountedPrice: undefined, variantOptions: [] }]);
      return;
    }

    const combinations = getCombinations(selectedVariantOptions.map(v => v.options));

    const newItems = combinations.map((combination, index) => {
      const variantOptions: VariantOption[] = combination.map((option, i) => ({
        ...option,
        variantId: selectedVariantOptions[i].id,
      }));

      return {
        sku: `SKU-${index + 1}`,
        quantity: 0,
        price: 0,
        discountedPrice: undefined,
        variantOptions,
      };
    });

    replace(newItems);
  };

  const getCombinations = (arrays: VariantOption[][]): VariantOption[][] => {
    return arrays.reduce((acc, curr) => 
      acc.flatMap(x => curr.map(y => [...x, y])),
      [[]] as VariantOption[][]
    );
  };

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
    // Here you would typically send the data to your API
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCategory(value);
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCategory && (
          <FormField
            control={form.control}
            name="selectedVariants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variants</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      generateProductItems(value as unknown as string[]);
                    }}
                    defaultValue={field.value.join(',')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variants" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableVariants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          <h3 className="mb-4 text-lg font-medium">Product Items</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 p-4 border rounded">
              {field.variantOptions.map((variantOption) => (
                <div key={variantOption.id} className="mb-2">
                  <span className="font-medium">{variantOption.value}:</span> {variantOption.description}
                </div>
              ))}
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
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
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
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.discountedPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="storeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={5} step={0.1} {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <FormLabel>Featured</FormLabel>
                <FormDescription>
                  This product will appear on the featured products list
                </FormDescription>
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
                <FormLabel>Archived</FormLabel>
                <FormDescription>
                  This product will be hidden from the store
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Create Product</Button>
      </form>
    </Form>
  );
};

export default ProductForm;