const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); // Import getSignedUrl
const db = require("../databaseConnection/db");

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateSignedUrl = async (key) => {
  try {
    // Ensure 'profilePhotos/' is added only once
    const finalKey = key.startsWith('profilePhotos/') ? key : `profilePhotos/${key}`;

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: finalKey,  // Correct the key before generating signed URL
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });  // URL expires in 1 hour
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

const getdata = async (req, res) => {
  try {
    const [result] = await db.execute(`
      SELECT 
        rma.serial, 
        rma.market, 
        rma.storeid, 
        rma.storename, 
        rma.empid, 
        rma.invoice, 
        rma.modelname, 
        rma.value, 
        rma.createdat, 
        ni.ntid, 
        ni.imageurl, 
        rmaud.RMADate, 
        rmaud.RMANumber, 
        rmaud.UPSTrackingNumber
      FROM 
        rmadata rma
      LEFT JOIN 
        ntid_image_url ni ON rma.serial = ni.serial
      LEFT JOIN 
        rma_upload_data rmaud ON rma.serial = rmaud.serial;
    `);

    // Generate signed URLs for images
    const dataWithSignedUrls = await Promise.all(
      result.map(async (row) => {
        if (row.imageurl) {
          // Strip the profilePhotos/ prefix if needed
          const imageUrlWithoutPrefix = row.imageurl.startsWith('profilePhotos/') 
            ? row.imageurl.replace('profilePhotos/', '') 
            : row.imageurl;

          const signedUrl = await generateSignedUrl(imageUrlWithoutPrefix);
          row.signedImageUrl = signedUrl; // Add the signed URL to the row
        }
        return row;
      })
    );

    res.status(200).json(dataWithSignedUrls);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ error: "Failed to fetch data from the database" });
  }
};

module.exports = { getdata };
