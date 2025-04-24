import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;


export const RegisterApi = async (userData, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Validate response.data
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format from server");
    }

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    // Handle Axios-specific errors
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed";
    console.error("Registration error:", {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      success: false,
      error: errorMessage,
      status: error.response?.status || null,
    };
  } finally {
    setLoading(false);
  }
};

export default RegisterApi;