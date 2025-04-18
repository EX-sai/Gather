import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api/events", // Adjust this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to create a new event
export const createEvent = async (eventData) => {
  const formData = new FormData();

  // Append all fields
  Object.keys(eventData).forEach((key) => {
    if (key !== "banner") {
      formData.append(key, eventData[key]);
    }
  });

  // Append file if exists
  if (eventData.banner instanceof File) {
    formData.append("banner", eventData.banner);
  }

  const response = await axios.post("http://localhost:5000/api/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Function to get all events
export const getAllEvents = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Function to get a single event by ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

// Function to update an event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Function to delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Export all functions
export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
