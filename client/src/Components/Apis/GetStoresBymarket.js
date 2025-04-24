import axios from "axios";

const GetStoresBymarket = async (market, setLoading, TableName) => {
  setLoading(true);
  try {
    if (!market || !TableName) {
      throw new Error("Market and TableName are required");
    }

    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/get-stores-image-by-market`,
      {
        params: { market, TableName },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid store data format");
      }
      return response.data;
    }
    throw new Error(response.data?.message || "Failed to fetch store data");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Error fetching store data:", errorMessage);
      throw new Error(errorMessage);
    }
    console.error("Unexpected error:", err.message);
    throw new Error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export default GetStoresBymarket;