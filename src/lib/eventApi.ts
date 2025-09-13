import axios from "axios";
import {
  Event,
  EventsResponse,
  CreateEventData,
  EventFilters,
} from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
console.log("Event API Base URL:", API_BASE_URL);

const eventApi = axios.create({
  baseURL: `${API_BASE_URL}/events`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
eventApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventApiService = {
  // Get all events with filters
  getEvents: async (filters?: EventFilters): Promise<EventsResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.visibility) params.append("visibility", filters.visibility);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await eventApi.get(`?${params.toString()}`);
    return response.data;
  },

  // Get single event
  getEvent: async (id: string): Promise<Event> => {
    const response = await eventApi.get(`/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const response = await eventApi.post("/", eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (
    id: string,
    eventData: Partial<CreateEventData>
  ): Promise<Event> => {
    const response = await eventApi.patch(`/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    console.log("Deleting event with ID:", id);
    console.log("Delete URL:", `${eventApi.defaults.baseURL}/${id}`);
    const response = await eventApi.delete(`/${id}`);
    console.log("Delete response:", response);
    return response.data;
  },

  // Register for event
  registerForEvent: async (id: string): Promise<Event> => {
    const response = await eventApi.post(`/${id}/register`);
    return response.data;
  },

  // Unregister from event
  unregisterFromEvent: async (id: string): Promise<Event> => {
    const response = await eventApi.post(`/${id}/unregister`);
    return response.data;
  },

  // Get user's registered events
  getUserRegisteredEvents: async (
    filters?: EventFilters
  ): Promise<EventsResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.visibility) params.append("visibility", filters.visibility);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await eventApi.get(
      `/user/registered?${params.toString()}`
    );
    return response.data;
  },

  // Get featured upcoming events
  getFeaturedUpcomingEvents: async (limit: number = 5): Promise<Event[]> => {
    const response = await eventApi.get(`/upcoming/featured?limit=${limit}`);
    return response.data;
  },
};

export default eventApiService;
