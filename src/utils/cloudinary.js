import { v2 as cloudniary } from "cloudinary";
import fs from "fs"
         
cloudniary.config({ 
  cloud_name: process.env.CLODUNIARY_CLOUD_NAME, 
  api_key: process.env.CLODUNIARY_API_KEY, 
  api_secret: process.env.CLODUNIARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return "Could not find the path"

            //upload the file on Cloudinary
            const response = await cloudniary.uploader.upload(localFilePath, {
                resource_type : "auto"
            })

            // file uploaded successfully
            console.log("File is Successfully uploaded on cloudinary", response.url);
            return response

        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
            return null
        }
}

export {uploadOnCloudinary}