import axios from "axios";

const GetStoresBymarket = async (market, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-stores-by-market?market=${market}`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      // Validate response.data
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid store data format");
      }
      return response.data; // Return only the data
    }
    throw new Error(response.data?.message || "Failed to fetch stores");
  } catch (err) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch stores";
      console.error("Error fetching stores by market:", errorMessage);
      throw new Error(errorMessage);
    }
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    throw new Error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export default GetStoresBymarket;