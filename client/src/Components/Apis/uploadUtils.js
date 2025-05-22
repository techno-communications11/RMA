import axios from "axios";


export const handleUpload = async ({ file, type, onSuccess, onError, onFinally }) => {
  if (!file || !type || !type.label) {
    const errorData = { title: "Invalid Input", message: "File and type.label are required" };
    onError?.(errorData);
    return { success: false, error: errorData };
  }

  // Validate file (example: accept CSV and Excel)
  const acceptedTypes = ["text/csv", "application/vnd.ms-excel", ".csv", ".xlsx"];
  const fileValidation = validateFile(file, acceptedTypes);
  if (!fileValidation.valid) {
    const errorData = { title: "Invalid File", message: fileValidation.error };
    onError?.(errorData);
    return { success: false, error: errorData };
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type.label); // Use type.value instead of type.id

   console.log("FormData:", formData.get("file"), formData.get("type"));

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/uploaddata`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    // Validate response
    if (response.status === 200) {
      const successData = {
        title: "Upload Successful!",
        message: `${type.label} data has been uploaded successfully.`,
      };
      onSuccess?.(successData);
      return { success: true, data: successData };
    }

    const errorData = {
      title: "Upload Failed",
      message: response.data?.message || "Unexpected response status: " + response.status,
    };
    onError?.(errorData);
    return { success: false, error: errorData };
  } catch (err) {
    const errorData = {
      title: "Upload Failed",
      message: err.response?.data?.message || err.message || "Failed to process file",
    };
    console.error("Upload error:", { message: errorData.message, status: err.response?.status });
    onError?.(errorData);
    return { success: false, error: errorData };
  } finally {
    onFinally?.();
  }
};



export const validateFile = (file, acceptedTypes) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  const mimeTypes = acceptedTypes.filter((type) => type.includes("/"));
  const extensions = acceptedTypes.filter((type) => type.startsWith("."));

  const isValidMimeType = mimeTypes.length === 0 || mimeTypes.includes(file.type);
  const isValidExtension =
    extensions.length === 0 || extensions.some((ext) => file.name.toLowerCase().endsWith(ext.toLowerCase()));

  if (!isValidMimeType || !isValidExtension) {
    return { valid: false, error: "Invalid file type or extension" };
  }

  return { valid: true, error: null };
};