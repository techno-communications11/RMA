import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Registers a market via the API
 * @param {Object} marketData - Market data with marketname
 * @param {Function} setLoading - State setter for loading state
 * @returns {Promise<Object>} - { success: boolean, data?: Object, error?: string, status?: number }
 */
export const RegisterMarketApi = async (marketData, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/register-market`,
      { market: marketData.marketname },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }

    throw new Error(response.data?.message || "Market registration failed");
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Market registration failed";
    console.error("Market registration error:", {
      message: errorMessage,
      status: err.response?.status,
    });
    return {
      success: false,
      error: errorMessage,
      status: err.response?.status || null,
    };
  } finally {
    setLoading(false);
  }
};

export default RegisterMarketApi;