import axios from "axios";
import auth from "@react-native-firebase/auth";

// Create an Axios instance configured with base settings
const apiClient = axios.create({
  // baseURL: "https://learnfitness.wl.r.appspot.com/", // Express backend base URL
  baseURL: "http://localhost:8080/", // localhost test
  timeout: 10000, // Set all requests to timeout after 10 seconds
});

// GET request function
export async function getBackendData(endpoint) {
  try {
    // Get the JWT and attach it to the request header
    const idToken = await auth().currentUser.getIdToken(true);
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log("Getting backend data:", response.data);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data.", error.message);
    throw error;
  }
}

// GET request with retries
export async function getBackendDataWithRetry(endpoint, maxRetries = 3,retryDelay = 2000) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const data = await getBackendData(endpoint);

      // Check if data is null and throw an error to trigger a retry
      if (data === null) {
        throw new Error("Received null data, retrying...");
      }

      return data; // Data fetched successfully, return the data
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed: ${error.message}`);

      // If all attempts are used up, throw the last error
      if (attempts >= maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

// POST request function
export async function postBackendData(endpoint, data) {
  try {
    const idToken = await auth().currentUser.getIdToken(true);
    const response = await apiClient.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error posting the data:", error);
    throw error;
  }
}

// POST data and a profile image, expects a response of the image URL
export async function createUserWithProfilePhoto(endpoint, onBoardData) {
  const idToken = await auth().currentUser.getIdToken(true);
  const formData = new FormData();

  // Append image file
  // 'image' is the field name we're looking for on the server side at multer.upload.single
  formData.append("photo", {
    uri: onBoardData.photoObject.uri,
    type: onBoardData.photoObject.mimeType,
    name: `${auth().currentUser.uid}.${
      onBoardData.photoObject.mimeType.split("/")[1]
    }`, // Profile photo name is uid + image type
  });

  // Delete local photo URL
  delete onBoardData.photoObject;

  // Append user info JSON data
  formData.append("data", JSON.stringify(onBoardData));

  try {
    console.log(formData);
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error posting the data:", error);
    throw error;
  }
}
