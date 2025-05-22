const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const db = require('../../databaseConnection/db');

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || (() => { throw new Error('AWS_BUCKET_REGION is not set'); })(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || (() => { throw new Error('AWS_ACCESS_KEY_ID is not set'); })(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || (() => { throw new Error('AWS_SECRET_ACCESS_KEY is not set'); })(),
  },
});

// Cache for signed URLs
const signedUrlCache = new Map();


const generateSignedUrl = async (key, retries = 3, delay = 1000) => {
  try {
    if (!key || typeof key !== 'string') {
      console.error('Invalid key provided:', key);
      return null;
    }

    const cacheKey = key;
    if (signedUrlCache.has(cacheKey)) {
      const { url, expiry } = signedUrlCache.get(cacheKey);
      if (expiry > Date.now()) {
        console.log('Returning cached signed URL for key:', key);
        return url;
      }
      signedUrlCache.delete(cacheKey);
    }

    const normalizedKey = key.replace(/^profilePhotos\//, '');
    const finalKey = `profilePhotos/${normalizedKey}`;

    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME is not set');
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: finalKey,
    });

    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        signedUrlCache.set(cacheKey, {
          url: signedUrl,
          expiry: Date.now() + (3600 - 600) * 1000,
        });
        return signedUrl;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for key ${key}:`, error.message);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  } catch (error) {
    console.error('Error generating signed URL for key:', key, error);
    return null;
  }
};

const userUploadedImage = async (req, res) => {
  const { showntid } = req.params;
  console.log('Request parameters:', req.params);
  console.log('Received showntid:', showntid);

  if (!showntid) {
    return res.status(400).json({ error: 'Invalid or missing showntid' });
  }

  try {
    const query = 'SELECT * FROM images WHERE old_imei = ?';
    const values = [showntid.trim()];
    let result;
    try {
      [result] = await db.query(query, values);
      console.log('Database query result:', result);
    } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!Array.isArray(result) || result.length === 0) {
      console.log('No images found for showntid:', showntid);
      return res.status(404).json({ error: 'No images found for the provided showntid' });
    }

    const dataWithSignedUrls = await Promise.all(
      result.map(async (row) => {
        try {
          if (!row.image_url) {
            console.warn('Missing image_url for old_imei:', row.old_imei);
            return { ...row, signedImageUrl: null };
          }
          const signedUrl = await generateSignedUrl(row.image_url);
          console.log('Generated signedImageUrl:', signedUrl);
          return { ...row, signedImageUrl: signedUrl || null };
        } catch (error) {
          console.error('Error processing row:', row.old_imei, error);
          return { ...row, signedImageUrl: null };
        }
      })
    );

    const allFailed = dataWithSignedUrls.every((row) => row.signedImageUrl === null);
    if (allFailed && dataWithSignedUrls.length > 0) {
      console.log('All signed URLs failed for showntid:', showntid);
      return res.status(500).json({ error: 'Failed to generate signed URLs for all images' });
    }

    console.log('Returning images for showntid:', showntid, dataWithSignedUrls);
    return res.status(200).json(dataWithSignedUrls);
  } catch (error) {
    console.error('Error in userUploadedImage:', error);
    return res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

module.exports = { userUploadedImage };