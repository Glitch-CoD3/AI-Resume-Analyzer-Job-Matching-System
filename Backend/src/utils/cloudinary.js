import { v2 as cloudinary } from 'cloudinary';

import fs from 'fs';    //file read write remove operations. fs= file system



// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



// Uploads a file to Cloudinary
const uploadAvatarToCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(LocalFilePath, {
      folder: "AI-Powered Resume Analyzer",
      resource_type: "auto",
      chunk_size: 6 * 1024 * 1024 // 6MB
    });

    // Safely remove file from temp storage after successful upload
    if (fs.existsSync(LocalFilePath)) {
      fs.unlinkSync(LocalFilePath);
    }

    return response;

  } catch (error) {
    // Safely remove file from temp storage if error occurs
    if (fs.existsSync(LocalFilePath)) {
      fs.unlinkSync(LocalFilePath);
    }
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

/**
 * Delete an image from Cloudinary using its public ID or full URL
 * @param {string} publicIdOrUrl - Cloudinary public_id or image URL
 * @returns {Promise<object>}
 */

const deleteAvatarFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const publicId = decodeURIComponent(
      imageUrl
        .split("/upload/")[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "")
    );


    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (err) {
    console.error(err);
  }
};

export { uploadAvatarToCloudinary, deleteAvatarFromCloudinary };