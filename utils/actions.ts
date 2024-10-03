'use server';

import { profileSchema } from './schemas';
import db from './db';
import { upload } from './upload';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { validateWithZodSchema, imageSchema } from './schemas';

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
