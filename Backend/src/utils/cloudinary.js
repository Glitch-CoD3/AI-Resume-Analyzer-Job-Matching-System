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
        //check if file is locally available
        if (!LocalFilePath) return null;

        //uploasd to cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            folder: "AI-Powered Resume Analyzer",  //folder name in cloudinary
            resource_type: "auto",  //jpeg, png, pdf, doc, mp4
            chunk_size: 6 * 1024 * 1024 //6MB
        })



        //console.log("File uploaded to Cloudinary successfully", response.url);
        fs.unlinkSync(LocalFilePath);  //remove file from local storage
        return response;

    } catch (error) {
        fs.unlinkSync(LocalFilePath);  //remove file from local storage if error occurs during upload
        console.error("Error uploading file to Cloudinary", error);
        return null;

    }
}


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