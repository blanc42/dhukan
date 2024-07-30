import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  rating: z.number().min(0).max(5).optional(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
  categoryId: z.string().min(1, 'Category is required'),
  storeId: z.string().min(1, 'Store is required'),
  selectedVariants: z.array(z.string()),
  items: z.array(z.object({
    sku: z.string().min(1, 'SKU is required'),
    quantity: z.number().min(0, 'Quantity must be 0 or greater'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    discountedPrice: z.number().min(0, 'Discounted price must be 0 or greater').optional(),
    variantOptions: z.array(z.object({
      id : z.string().min(1, 'ID is required'),
      value: z.string().min(1, 'Value is required'),
      description: z.string().optional(),
      // weight: z.number().min(0, 'Weight must be 0 or greater'),
      variantId: z.string().min(1, 'Variant ID is required'),
    })),
  })).default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export type Category = {
  id: string;
  name: string;
  store_id: string;
};

export type Store = {
  ID: number;
  name: string;
  description: string
  admin_id: number
};

export type Variant = {
  id: string;
  name: string;
  description: string;
  weight: number;
  categoryId: string;
  options: VariantOption[];
};

export type VariantOption = {
  id: string;
  value: string;
  description: string;
  weight: number;
  variantId: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  stores: Store[];
};
