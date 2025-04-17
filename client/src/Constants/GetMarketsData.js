import axios from "axios";

/**
 * Fetches market data from the API
 * @param {function} setLoading - State setter function for loading state
 * @returns {Promise<Array>} - Returns the market data array if successful
 */
const fetchMarketData = async (setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-market-image-counts`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data; // Return the data directly
    }
    throw new Error(response.data.message || "Failed to fetch market data");
  } catch (err) {
    console.error("Error fetching market data:", err.message);
    throw err; // Re-throw the error for the caller to handle
  } finally {
    setLoading(false);
  }
};

export default fetchMarketData;