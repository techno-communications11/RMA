const SubmitImageApi = async (formData) => {

     console.log(formData,"dfffff")
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/imageUpload`, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type header - let the browser set it with the correct boundary
          "Accept": "application/json",
        },
        credentials: "include",
      });
  
      const contentType = response.headers.get('content-type');
      
      // Check if response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        // Use server-provided error message if available
        throw new Error(data.message || 'Request failed with status ' + response.status);
      }
  
      return {
        success: true,
        data: data,
        status: response.status
      };
  
    } catch (error) {
      console.error("Error submitting image:", error);
      
      return {
        success: false,
        message: error.message || 'Failed to submit image',
        error: error
      };
    }
  };
  
  export default SubmitImageApi;