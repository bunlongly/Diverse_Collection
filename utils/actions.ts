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
  console.log('Current user ID:', user.id);
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

function processData(formData: FormData): Product {
  const rawData: any = {};

  formData.forEach((value, key) => {
    console.log(`Key: ${key}, Value: ${value}`); // Log each key-value pair received

    if (!(value instanceof File)) {
      if (['colors', 'sizes', 'imageUrls'].includes(key)) {
        if (!rawData[key]) rawData[key] = [];
        // Handle comma-separated strings as well as single values
        const items = Array.isArray(value)
          ? value
          : value.split(',').map(item => item.trim());
        rawData[key] = rawData[key].concat(items);
        console.log(`Processed array for ${key}:`, rawData[key]);
      } else if (
        ['price', 'originalPrice', 'sellingPrice', 'countInStock'].includes(key)
      ) {
        rawData[key] = value ? parseFloat(value) : null;
        console.log(`Processed number for ${key}:`, rawData[key]);
      } else if (key === 'releaseDate' && value) {
        // Convert releaseDate to an ISO string if it's not empty
        const date = new Date(value.toString());
        if (!isNaN(date.getTime())) {
          rawData[key] = date.toISOString(); // Store date as ISO 8601 string
          console.log(`Processed date for ${key}:`, rawData[key]);
        }
      } else {
        rawData[key] = value;
      }
    }
  });

  console.log('Final processed data:', rawData);
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
    releaseDate: rawData.releaseDate || null, // Ensure releaseDate is in ISO format or null
    condition: rawData.condition || 'New'
  };
}

async function handleImageUpload(formData: FormData): Promise<string[]> {
  const imageUrls: string[] = [];

  formData.forEach(async (value, key) => {
    if (value instanceof File && key === 'image') {
      const newFormData = new FormData();
      newFormData.append('image', value);
      try {
        const uploadResult = await upload(null, newFormData); // Assuming 'upload' returns a promise
        if (uploadResult) {
          imageUrls.push(uploadResult);
        }
      } catch (error) {
        console.error('Upload failed for image:', error);
      }
    }
  });

  return imageUrls; // This will be an array of URLs or empty if uploads fail
}


// Main function to create a new product
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
    console.log('Data to be validated:', preparedData); // Log the data right before validation

    // Handle image upload and integration into product data
    const imageUrls = await handleImageUpload(formData);
    if (imageUrls.length > 0) {
      preparedData.imageUrls = imageUrls; // Assuming imageUrls should be an array of strings
      console.log('Image URLs after upload:', imageUrls);
    }

    const validatedFields = validateWithZodSchema(productSchema, preparedData);
    console.log('Validated fields:', validatedFields); // Log validated data to ensure correctness

    // Create new product in the database
    const newProduct = await db.product.create({
      data: {
        ...validatedFields,
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
      message:
        error instanceof Error ? error.message : 'Failed to create product'
    };
  }
};
