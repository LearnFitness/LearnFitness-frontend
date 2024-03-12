import axios from 'axios';
import auth from "@react-native-firebase/auth";

// Create an Axios instance configured with base settings
const apiClient = axios.create({
  baseURL: 'https://learnfitness.wl.r.appspot.com/', // Express backend base URL
  timeout: 10000, // Set all requests to timeout after 10 seconds
});

// GET request function
export const getBackendData = async (endpoint) => {
  try {
    // Get the JWT and attach it to the request header
    const idToken = await auth().currentUser.getIdToken(true);
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    throw error;
  }
};

// POST request function
export const postBackendData = async (endpoint, data) => {
  try {
    const idToken = await auth().currentUser.getIdToken(true);
    const response = await apiClient.post(endpoint, data, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("There was an error posting the data:", error);
    throw error;
  }
};
