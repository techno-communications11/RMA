import axios from "axios";

/**
 * Fetches market data from the API
 * @param {function} setLoading - State setter function for loading state
 * @returns {Promise<Array>} - Returns the market data array if successful
 */
const GetMarketsData = async (setLoading) => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-market-image-counts`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      // Optional: Validate response.data (e.g., ensure it's an array)
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid market data format");
      }
      return response.data; // Return the data directly
    }
    throw new Error(response.data?.message || "Failed to fetch market data");
  } catch (err) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(err)) {
      console.error("Error fetching market data:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to fetch market data");
    }
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    throw new Error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export default GetMarketsData;