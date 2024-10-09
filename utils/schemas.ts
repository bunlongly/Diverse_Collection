import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(2, {
    message: 'first name must be at least 2 characters'
  }),
  lastName: z.string().min(2, {
    message: 'first name must be at least 2 characters'
  }),
  username: z.string().min(2, {
    message: 'first name must be at least 2 characters'
  })
});

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(error => error.message);

    throw new Error(errors.join(', '));
  }
  return result.data;
}

export const imageSchema = z.object({
  image: validateFile()
});

function validateFile() {
  const maxUploadSize = 1024 * 1024;
  const acceptedFileTypes = ['image/'];
  return z
    .instanceof(File)
    .refine(file => {
      return !file || file.size <= maxUploadSize;
    }, `File size must be less than 1 MB`)
    .refine(file => {
      return (
        !file || acceptedFileTypes.some(type => file.type.startsWith(type))
      );
    }, 'File must be an image');
}

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  description: z.string().optional(),
  originalPrice: z
    .number()
    .nonnegative({ message: 'Original price must be a non-negative number' }),
  sellingPrice: z
    .number()
    .nonnegative({ message: 'Selling price must be a non-negative number' }),
  inventoryStatus: z
    .string()
    .min(1, { message: 'Inventory status is required' }),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional()
});
