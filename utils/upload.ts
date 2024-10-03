// src/actions/upload.ts
'use server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function upload(
  previousState: string | undefined | null,
  formData: FormData
) {
  // Retrieve the image file from formData
  const file = formData.get('image') as File;

  // Check if the file is not null and is an image
  if (!file) {
    throw new Error('No image file provided or the file is null.');
  }

  // Convert the file to a Buffer using arrayBuffer
  const buffer: Buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Create a base64 encoded string of the image
    const base64Image: string = `data:${file.type};base64,${buffer.toString(
      'base64'
    )}`;

    // Log the file uploading status
    console.log(`The file: ${previousState} is uploading...`);

    // Upload the image to Cloudinary with resource_type set to 'image'
    const response = await cloudinary.uploader.upload(base64Image, {
      resource_type: 'image', // Changed from 'video' to 'image'
      public_id: 'my_image' // Changed 'public_id' to something more appropriate for images
    });

    // Update the previousState with the new secure URL from the upload response
    previousState = response.secure_url;

    // Return the updated URL
    return previousState;
  } catch (error: any) {
    // Log any errors that occur during the upload
    console.error('Error during image upload:', error);
    return null; // Return null or handle the error appropriately
  }
}
