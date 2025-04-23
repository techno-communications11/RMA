import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api';

const GetUserUploadedImages = async (showntid) => {
  console.log('Fetching user uploaded images for showntid:', showntid);

  const normalizedShowntid = String(showntid).trim();
  if (!normalizedShowntid) {
    console.error('Invalid showntid:', showntid);
    throw new Error('Invalid or missing showntid');
  }

  try {
    const response = await axios.get(`${API_URL}/useruploadedimage/${normalizedShowntid}`, {
      withCredentials: true,
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user uploaded images:', error);
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'Failed to fetch images';
    throw new Error(errorMessage);
  }
};

export default GetUserUploadedImages;