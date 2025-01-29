// const { upload } = require('../multer/multerConfig'); // Import multer upload configuration
const { uploadFileToS3 } = require('../multer/uploadToS3'); // Import S3 upload function
const db = require('../databaseConnection/db'); // Import your database connection
const fs = require('fs'); // Import fs to delete the file after upload

// Handle the image upload and save URL to DB
const imageUpload = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Get serial and ntid from the request body
    const { serial, ntid } = req.body;
    if (!serial || !ntid) {
      return res.status(400).json({ error: "Serial and NTID are required" });
    }

    // Upload the image file to S3
    const s3FileKey = await uploadFileToS3(req.file);

    // Generate the image URL based on the S3 file key
    const imageUrl = `profilePhotos/${s3FileKey}`;

    // Insert the URL into the database
    const insertQuery = `INSERT INTO ntid_image_url (serial, imageurl, ntid) VALUES (?, ?, ?)`;
    const [insertResult] = await db.query(insertQuery, [serial, imageUrl, ntid]);

    if (insertResult.affectedRows === 1) {
      // File successfully uploaded and URL stored in the database
      // Now unlink (delete) the file from the 'uploads' folder
      const uploadedFilePath = req.file.path;
      fs.unlink(uploadedFilePath, (err) => {
        if (err) {
          console.error('Error deleting file from uploads folder:', err);
          // Handle error if file deletion fails
        } else {
          console.log('File successfully deleted from uploads folder');
        }
      });

      res.status(200).json({ message: "Image uploaded and URL stored successfully", imageurl: imageUrl });
    } else {
      res.status(500).json({ error: "Failed to insert data into ntid_image_url table" });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "An error occurred while uploading the image" });
  }
};

module.exports = { imageUpload };
