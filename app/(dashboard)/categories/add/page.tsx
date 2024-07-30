'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd'
import { Plus, GripVertical, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSelectedStore } from '@/store/userSelectedStore'

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  options: z.array(z.string()).min(1, 'At least one option is required'),
})

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  parentCategoryId: z.string().optional(),
  storeId: z.number(),
  variants: z.array(variantSchema),
})

type FormValues = z.infer<typeof formSchema>

// Mock data for parent categories
const parentCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' },
]

export default function AddCategoryPage() {

  const { selectedStore } = useSelectedStore()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      parentCategoryId: '',
      storeId: selectedStore?.ID,
      variants: [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Here you would typically send the data to your API
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    move(result.source.index, result.destination.index)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {parentCategories.map((category) => (
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

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Variants</h2>
              <Button
                type="button"
                onClick={() => append({ name: '', options: [''] })}
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Variant
              </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="variants">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-4 p-4 border rounded-md"
                          >
                            <div className="flex items-center mb-2">
                              <div {...provided.dragHandleProps} className="mr-2">
                                <GripVertical className="h-5 w-5 text-gray-500" />
                              </div>
                              <FormField
                                control={form.control}
                                name={`variants.${index}.name`}
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormControl>
                                      <Input placeholder="Variant name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => remove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="ml-7">
                              {form.watch(`variants.${index}.options`).map((_, optionIndex) => (
                                <FormField
                                  key={optionIndex}
                                  control={form.control}
                                  name={`variants.${index}.options.${optionIndex}`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center mb-2">
                                      <FormControl>
                                        <Input placeholder="Option value" {...field} />
                                      </FormControl>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => {
                                          const currentOptions = form.getValues(`variants.${index}.options`)
                                          form.setValue(`variants.${index}.options`, currentOptions.filter((_, i) => i !== optionIndex))
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </FormItem>
                                  )}
                                />
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const currentOptions = form.getValues(`variants.${index}.options`)
                                  form.setValue(`variants.${index}.options`, [...currentOptions, ''])
                                }}
                              >
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <Button type="submit">Create Category</Button>
        </form>
      </Form>
    </div>
  )
}