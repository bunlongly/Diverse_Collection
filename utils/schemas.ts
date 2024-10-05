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
    name: z.string(),
    brand: z.string(),
    category: z.string(),
    description: z.string().optional(),
    originalPrice: z.number(),
    sellingPrice: z.number(),
    inventoryStatus: z.string(),
    color: z.array(z.string()),
    sizes: z.array(z.string()).optional(),
    imageUrls: z.array(z.string()).optional(), // If you handle image URLs separately
  });
  