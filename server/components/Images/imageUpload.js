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
     console.log('Request body to upload images:', req.body);
    if (!old_imei || !ntid) {
      return res.status(400).json({ error: 'old_imei and ntid are required' });
    }

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
      const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

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
        const imageUrl = `${s3FileKey}`;

        // Check if image with same old_imei and image_type_id exists
        const checkExistingQuery = `
          SELECT id FROM images 
          WHERE old_imei = ? AND image_type_id = ?
        `;
        const [existingImages] = await connection.query(checkExistingQuery, [old_imei, imageId]);

        if (existingImages.length > 0) {
          // Update existing record
          const updateImageQuery = `
            UPDATE images 
            SET image_url = ?, ntid = ?, updated_at = ?
            WHERE old_imei = ? AND image_type_id = ?
          `;
          const [updateResult] = await connection.query(updateImageQuery, [
            imageUrl,
            ntid,
            currentTimestamp,
            old_imei,
            imageId
          ]);

          if (updateResult.affectedRows !== 1) {
            throw new Error(`Failed to update image URL for file: ${file.originalname}`);
          }
        } else {
          // Insert new record
          const insertImageQuery = `
            INSERT INTO images 
            (old_imei, image_type_id, image_url, ntid, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const [insertResult] = await connection.query(insertImageQuery, [
            old_imei,
            imageId,
            imageUrl,
            ntid,
            currentTimestamp,
            currentTimestamp
          ]);

          if (insertResult.affectedRows !== 1) {
            throw new Error(`Failed to insert image URL for file: ${file.originalname}`);
          }
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