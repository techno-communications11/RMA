const getImageUrl = async (req, res) => {
    try {
      const { key } = req.params; // Assume key is passed as a URL parameter
  
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Expires: 60 * 5 // URL expires in 5 minutes
      };
  
      const url = s3.getSignedUrl('getObject', params);
      
      res.status(200).json({ url });
      
    } catch (error) {
      console.error("Error getting image URL:", error);
      res.status(500).json({ error: "An error occurred while retrieving the image URL" });
    }
  };
  
  module.exports = { getImageUrl };
  