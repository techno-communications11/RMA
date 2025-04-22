import axios from "axios";

const GetMarkets = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-markets-data`,
      { withCredentials: true }
    );

    // Return only the data portion of the response
    return response.data;
  } catch (err) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(err)) {
      console.error("Error fetching markets data:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to fetch markets data");
    }
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    throw new Error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export default GetMarkets;