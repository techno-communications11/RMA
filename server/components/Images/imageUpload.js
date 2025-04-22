const { uploadFileToS3 } = require('../../multer/uploadToS3');
const db = require('../../databaseConnection/db');
const fs = require('fs').promises;

const imageUpload = async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get old_imei and ntid from the request body
    const { old_imei, ntid } = req.body;
    if (!old_imei || !ntid) {
      return res.status(400).json({ error: 'old_imei and ntid are required' });
    }

    // Log for debugging
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Flatten req.files object into an array
    const allFiles = Object.values(req.files).flat();

    // Separate image and CSV files
    const imageFiles = allFiles.filter((file) =>
      file.fieldname.match(/^image_\d+$/)
    );
    const csvFiles = allFiles.filter((file) => file.fieldname === 'csv');

    // Validate files
    if (imageFiles.length > 4) {
      return res.status(400).json({ error: 'Maximum 4 images allowed' });
    }
    if (csvFiles.length > 1) {
      return res.status(400).json({ error: 'Only one CSV file allowed' });
    }

    // Start a database transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const imageUrls = [];
      const uploadedFiles = [];

      // Process image files
      for (const file of imageFiles) {
        const imageIdMatch = file.fieldname.match(/^image_(\d+)$/);
        if (!imageIdMatch) {
          throw new Error(`Invalid fieldname: ${file.fieldname}`);
        }
        const imageId = parseInt(imageIdMatch[1], 10);
        if (imageId < 1 || imageId > 4) {
          throw new Error(`Invalid image_id: ${imageId}. Must be 1 to 4`);
        }

        // Upload to S3
        const s3FileKey = await uploadFileToS3(file);
        const imageUrl = `profilePhotos/${s3FileKey}`;

        // Insert into images table
        const insertImageQuery = `INSERT INTO images (old_imei, image_type_id, image_url, ntid) VALUES (?, ?, ?, ?)`;
        const [insertResult] = await connection.query(insertImageQuery, [
          old_imei,
          imageId,
          imageUrl,
          ntid,
        ]);

        if (insertResult.affectedRows !== 1) {
          throw new Error(`Failed to insert image URL for file: ${file.originalname}`);
        }

        imageUrls.push({ image_id: imageId, image_url: imageUrl });
        uploadedFiles.push(file.path);
      }

      

      // Commit transaction
      await connection.commit();

      // Delete uploaded files
      await Promise.all(
        uploadedFiles.map(async (filePath) => {
          try {
            await fs.unlink(filePath);
            console.log(`File deleted: ${filePath}`);
          } catch (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          }
        })
      );

      res.status(200).json({
        message: 'Files uploaded and data stored successfully',
        image_urls: imageUrls,
        csv_processed: csvFiles.length > 0,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'An error occurred while processing files' });
  }
};

module.exports = { imageUpload };