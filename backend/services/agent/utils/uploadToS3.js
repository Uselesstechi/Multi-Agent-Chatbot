import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../config/s3.js"

export const uploadToS3=async (filename,buffer,contentType)=>{ /*filename is the name of the file to be uploaded, 
                                                                buffer is the file data, 
                                                                contentType is the type of the file*/
 await s3.send(
    new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Body:buffer,
        Key:filename,
        ContentType:contentType
    }))
 return filename
}