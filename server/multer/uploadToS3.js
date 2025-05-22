const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const { s3 } = require('./awsConfig'); 

// Function to upload file to S3
const uploadFileToS3 = async (file) => {
  try {
    const filePath = path.join(__dirname, '..', file.path);  // Read the file from the uploads folder
    const fileContent = fs.readFileSync(filePath); // Read the file content

    // Set the S3 key (filename) with the 'profilePhotos/' folder prefix
    const s3Key = `profilePhotos/${file.filename}`;

    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // S3 Bucket name
      Key: s3Key, // Save the file under 'profilePhotos/' folder
      Body: fileContent, // File content
      ContentType: file.mimetype, // Mime type of the file
    };

    // Upload file to S3 using the PutObjectCommand
    const command = new PutObjectCommand(params);
    const uploadResult = await s3.send(command); // Send the command to S3

    console.log('S3 Upload Result:', uploadResult); // Log the upload result
    return s3Key; // Return the file's key (path) for reference
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

module.exports = { uploadFileToS3 };
