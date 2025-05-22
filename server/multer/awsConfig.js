const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();  // Load environment variables from .env

// Create an S3 client instance
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// console.log('AWS S3 Client Initialized:', s3);

module.exports = { s3 };
