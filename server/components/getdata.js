const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const db = require("../databaseConnection/db");

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateSignedUrl = async (key) => {
  try {
    // Ensure key is not empty and is a string
    if (!key || typeof key !== 'string') {
      console.error('Invalid key provided:', key);
      return null;
    }

    // Remove duplicate prefixes if any
    const normalizedKey = key.replace(/^profilePhotos\//, '');
    const finalKey = `profilePhotos/${normalizedKey}`;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: finalKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error generating signed URL for key:", key, error);
    return null;
  }
};

const getdata = async (req, res) => {
  try {
    const [result] = await db.execute(`
      SELECT 
      rma.id,
        rma.old_imei, 
        rma.market, 
        rma.store_id, 
        rma.store_name, 
        rma.description, 
        rma.refund_label_type, 
        rma.new_exchange_imei, 
        rma.employee_name, 
        rma.created_at, 
        rma.shipping_status,
        rma.sold_date,
        rma.tracking_details,
        im.old_imei AS image_imei, 
        im.image_url, 
        td.ups_tracking_number
      FROM 
        rma_data rma
      LEFT JOIN 
        images im ON rma.old_imei = im.old_imei
      LEFT JOIN 
        tracking_details td ON rma.old_imei = td.old_imei
    `);

    const dataWithSignedUrls = await Promise.all(
      result.map(async (row) => {
        try {
          // Use consistent field name (image_url from query)
          if (row.image_url) {
            const signedUrl = await generateSignedUrl(row.image_url);
            return {
              ...row,
              signedImageUrl: signedUrl || null
            };
          }
          return row;
        } catch (error) {
          console.error('Error processing row:', row.old_imei, error);
          return row; // Return original row if processing fails
        }
      })
    );

    res.status(200).json(dataWithSignedUrls);
  } catch (error) {
    console.error("Error in getdata:", error);
    res.status(500).json({ 
      error: "Failed to fetch data",
      details: error.message 
    });
  }
};

module.exports = { getdata };