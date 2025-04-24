import axios from "axios";

const GetMarketsData = async (setLoading, TableName) => {
  setLoading(true);
  try {
    if (!TableName) {
      throw new Error("TableName is required");
    }

    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-market-image-counts/${TableName}`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid market data format");
      }
      return response.data;
    } else if (response.status === 404) {
      throw new Error("No data found for this table");
    }
    throw new Error(response.data?.message || "Failed to fetch market data");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error fetching market data:", errorMessage, err.stack);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error:", err.message, err.stack);
    throw new Error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export default GetMarketsData;