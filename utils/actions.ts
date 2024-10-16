'use server';

import { profileSchema, productSchema } from './schemas';
import db from './db';
import { upload } from './upload';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWithZodSchema } from './schemas';
import { Product, ProductAttribute } from './types';

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

function processData(
  formData: FormData,
  uploadedImageUrls: string[] = []
): {
  baseData: Product;
  dynamicAttributes: ProductAttribute[];
} {
  const rawData: any = {};
  const dynamicAttributes: ProductAttribute[] = [];

  // Define all known product fields that are not dynamic
  const knownFields = [
    'name',
    'brand',
    'genderCategory',
    'category',
    'description',
    'price',
    'inventoryStatus',
    'originalPrice',
    'sellingPrice',
    'countInStock',
    'sizes',
    'colors',
    'releaseDate',
    'condition'
  ];

  formData.forEach((value, key) => {
    console.log(`Key: ${key}, Value: ${value}`); // Log each key-value pair received

    if (!(value instanceof File)) {
      // Exclude file data from processing here
      if (knownFields.includes(key)) {
        // Directly parse known fields based on their expected types
        if (key === 'releaseDate' && value) {
          rawData[key] = new Date(value.toString()).toISOString();
        } else if (
          ['price', 'originalPrice', 'sellingPrice', 'countInStock'].includes(
            key
          )
        ) {
          rawData[key] = parseFloat(value);
        } else if (['sizes', 'colors'].includes(key)) {
          if (!rawData[key]) rawData[key] = [];
          rawData[key] = rawData[key].concat(
            value
              .toString()
              .split(',')
              .map(item => item.trim())
          );
        } else {
          rawData[key] = value.toString();
        }
      } else {
        // Treat all other fields as dynamic attributes
        dynamicAttributes.push({ key, value: value.toString() });
      }
    }
  });

  // Directly set the image URLs obtained from the upload process
  rawData['imageUrls'] = uploadedImageUrls;

  console.log('Final processed data:', rawData);
  return {
    baseData: {
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
      imageUrls: rawData.imageUrls, // Ensure this is set to the actual URLs
      releaseDate: rawData.releaseDate || null,
      condition: rawData.condition || 'New'
    },
    dynamicAttributes
  };
}

async function handleImageUpload(formData: FormData): Promise<string[]> {
  const imageUrls: string[] = [];
  const file = formData.get('image');

  if (file instanceof File) {
    const newFormData = new FormData();
    newFormData.append('image', file);

    try {
      const uploadedImageUrl = await upload(undefined, newFormData);
      if (uploadedImageUrl) {
        imageUrls.push(uploadedImageUrl);
      }
    } catch (error) {
      console.error('Upload failed for image:', error);
    }
  } else {
    console.error('No file was found in FormData under the key "image".');
  }

  return imageUrls;
}

// Main function to create a new product
export const createProductAction = async (
  formData: FormData
): Promise<{ message: string; product?: any }> => {
  const user = await currentUser();
  if (!user) throw new Error('You must be logged in to access this route');

  const imageUrls = await handleImageUpload(formData);
  const { baseData, dynamicAttributes } = processData(formData, imageUrls);

  try {
    const validatedData = validateWithZodSchema(productSchema, baseData);
    console.log('Data to be Validate : ', validatedData);

    const newProduct = await db.product.create({
      data: {
        ...validatedData,
        profileId: user.id,
        attributes: {
          create: dynamicAttributes
        }
      },
      include: {
        attributes: true
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
