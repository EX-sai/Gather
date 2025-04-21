import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/events';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Create a new event
export const createEvent = async (formData) => {
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    throw error;
  }
};

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
};

// Get single event by ID
export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error.response?.data || error.message);
    throw error;
  }
};

// Update an event
export const updateEvent = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error.response?.data || error.message);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.message) {
      return {
        success: true,
        message: response.data.message,
        deletedEventId: response.data.deletedEventId
      };
    }
    throw new Error('Unexpected response from server');
  } catch (error) {
    let errorMessage = 'Failed to delete event';

    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 403:
          errorMessage = error.response.data?.message || 'You are not authorized to delete this event';
          break;
        case 404:
          errorMessage = error.response.data?.message || 'Event not found';
          break;
        case 500:
          errorMessage = error.response.data?.message || 'Server error while deleting event';
          break;
        default:
          errorMessage = error.response.data?.message || 'Failed to delete event';
      }
    } else if (error.request) {
      errorMessage = 'No response received from server';
    } else {
      errorMessage = error.message || 'Error setting up the request';
    }

    console.error('Delete error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Register for an event
export const registerForEvent = async (eventId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${eventId}/register`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error registering for event:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get events by organiser
export const getEventsByOrganiser = async (organiserId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/organiser/${organiserId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching organiser events:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get registered events for current user
export const getRegisteredEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/registered`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; // Return empty array if no registrations found
    }
    console.error(
      'Error fetching registered events:',
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add this new method
export const cancelRegistration = async (eventId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/${eventId}/register`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error canceling registration:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getEvents = async ({ search = "", location = "", page = 1, limit = 10 }) => {
  const params = new URLSearchParams({ search, location, page, limit });
  const response = await axios.get(`/api/events?${params.toString()}`);
  return response.data;
};

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventsByOrganiser,
  getRegisteredEvents,
  cancelRegistration,
  getEvents
};