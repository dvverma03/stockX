import { v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv"

dotenv.config({
    path:"././.env"
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async(localFilePath) => {
    try{
        if (!localFilePath) return null;
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })

        // console.log("File uploaded successfully", result.url)
        fs.unlinkSync(localFilePath)
        return result;
    }catch(error){
        fs.unlinkSync(localFilePath) // remove the localy saved temp file as the upload operation fails
        return null;
    }
}

export {uploadOnCloudinary}