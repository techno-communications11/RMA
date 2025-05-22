import axios from "axios";

const GetData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/getdata`,
      { withCredentials: true }
    );

    // Return only the data portion of the response
    return response.data;
  } catch (err) {
    // Handle Axios-specific errors (e.g., network issues, 4xx/5xx responses)
    if (axios.isAxiosError(err)) {
      console.error("Error fetching data:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to fetch data");
    }
    // Handle unexpected errors
    console.error("Unexpected error:", err);
    throw new Error("An unexpected error occurred");
  }
};

export default GetData;