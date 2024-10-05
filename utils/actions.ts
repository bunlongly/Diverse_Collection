'use server';

import { profileSchema, productSchema } from './schemas';
import db from './db';
import { upload } from './upload';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWithZodSchema } from './schemas';
import { Product } from './types';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred'
  };
};

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');

    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields
      }
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true
      }
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred'
    };
  }
  redirect('/');
};

export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    },
    select: {
      profileImage: true
    }
  });
  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id
    }
  });
  if (!profile) return redirect('/profile/create');
  return profile;
};

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(profileSchema, rawData);
    await db.profile.update({
      where: {
        clerkId: user.id
      },
      data: validatedFields
    });
    revalidatePath('/profile');
    return { message: 'Profile updated successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    // Logging to see what formData contains
    console.log(Array.from(formData.entries()));

    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      throw new Error('No image file provided or the file is null.');
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);

    const image = await upload(user.imageUrl ?? null, uploadFormData);
    await db.profile.update({
      where: { clerkId: user.id },
      data: { profileImage: image || '' }
    });

    return { message: 'Profile image updated successfully' };
  } catch (error) {
    console.error('Failed in updateProfileImageAction:', error);
    return renderError(error);
  }
};






// Helper function to process FormData and convert it into a structured object
function processData(formData: FormData): Product {
    const rawData: any = {};  // Use `any` temporarily to avoid TypeScript errors during assembly
  
    formData.forEach((value, key) => {
      if (!(value instanceof File)) {
        // Convert string to arrays if the key expects an array
        if (['colors', 'sizes', 'imageUrls'].includes(key)) {
          rawData[key] = typeof value === 'string' ? value.split(',').map(item => item.trim()) : [];
        } else if (['price', 'originalPrice', 'sellingPrice', 'countInStock'].includes(key)) {
          // Convert string to number if the key expects a number, with fallback to null if empty
          rawData[key] = value ? parseFloat(value) : null;
        } else {
          // Directly assign the value for other keys
          rawData[key] = value;
        }
      }
    });
  
    // Ensure the return object strictly conforms to the Product type
    return {
      name: rawData.name || '',
      brand: rawData.brand || '',
      genderCategory: rawData.genderCategory || 'UNISEX',
      category: rawData.category || 'Shoes',
      description: rawData.description || '',
      price: rawData.price || null,
      inventoryStatus: rawData.inventoryStatus || 'In Stock',
      originalPrice: rawData.originalPrice || null,
      sellingPrice: rawData.sellingPrice || null,
      countInStock: rawData.countInStock || null,
      sizes: rawData.sizes || [],
      colors: rawData.colors || [],
      imageUrls: rawData.imageUrls || [],
      releaseDate: rawData.releaseDate || null,
      color: rawData.color || []
    };
  }
  
  // Helper function to handle image uploads
  async function handleImageUpload(formData: FormData): Promise<string> {
    const imageFile = formData.get('image');
    if (imageFile instanceof File) {
      const newFormData = new FormData();
      newFormData.append('image', imageFile);
      const uploadResult = await upload(null, newFormData);
      return uploadResult || ''; // Return the URL or an empty string if the upload fails
    }
    return '';
  }
  
  // Main function to create a new product
  export const createProductAction = async (
    formData: FormData
  ): Promise<{ message: string; product?: any }> => {
    const user = await currentUser();
  
    if (!user) {
      throw new Error('You must be logged in to access this route');
    }
  
    try {
      const preparedData = processData(formData);
      const validatedFields = validateWithZodSchema(productSchema, preparedData);
      const imagePath = await handleImageUpload(formData);
  
      // Create new product in the database
      const newProduct = await db.product.create({
        data: {
          ...validatedFields,
          imageUrls: imagePath ? [imagePath] : [],
          profileId: user.id
        }
      });
  
      return {
        message: 'Product created successfully',
        product: newProduct
      };
    } catch (error) {
      console.error('Failed in createProductAction:', error);
      return {
        message: error instanceof Error ? error.message : 'Failed to create product'
      };
    }
  };
  