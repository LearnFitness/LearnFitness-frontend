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
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    throw error;
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
export async function postDataWithProfileImage(endpoint, data, imageObject) {
  const idToken = await auth().currentUser.getIdToken(true);
  const formData = new FormData();

  // Append JSON data
  formData.append("data", JSON.stringify(data));

  // Append image file
  // 'image' is the field name we're looking for on the server side at multer.upload.single
  formData.append("image", {
    uri: imageObject.uri,
    type: imageObject.mimeType,
    name: `${auth().currentUser.uid}.${imageObject.mimeType.split("/")[1]}`, // Profile photo name is uid + image type
  });

  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${idToken}`,
      },
    });
    return(response.data);
  } catch (error) {
    console.error("There was an error posting the data:", error);
    throw error;
  }
}
