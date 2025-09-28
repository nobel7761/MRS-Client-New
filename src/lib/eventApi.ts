import axios from "axios";
import {
  Event,
  EventsResponse,
  CreateEventData,
  CreateEventFormData,
  EventFilters,
} from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";

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

  // Create event with file upload
  createEventWithFile: async (
    eventData: CreateEventFormData
  ): Promise<Event> => {
    const formData = new FormData();

    // Add image file
    if (eventData.bannerImage) {
      formData.append("bannerImage", eventData.bannerImage);
    }

    // Add event data
    Object.keys(eventData).forEach((key) => {
      if (key === "bannerImage") return; // Skip bannerImage as it's handled above

      if (Array.isArray(eventData[key as keyof CreateEventFormData])) {
        // Handle arrays like specialGuests, pricingRanges
        const arrayValue = eventData[key as keyof CreateEventFormData] as any[];
        arrayValue.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            // Handle pricingRanges objects
            Object.keys(item).forEach((subKey) => {
              const value = item[subKey];
              // Handle boolean and number types properly
              if (typeof value === "boolean") {
                formData.append(`${key}[${index}].${subKey}`, value.toString());
              } else if (typeof value === "number") {
                formData.append(`${key}[${index}].${subKey}`, value.toString());
              } else {
                formData.append(`${key}[${index}].${subKey}`, value);
              }
            });
          } else {
            // Handle simple arrays like specialGuests
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (
        typeof eventData[key as keyof CreateEventFormData] === "object" &&
        eventData[key as keyof CreateEventFormData] !== null
      ) {
        // Handle objects like socialMediaLinks
        const objectValue = eventData[
          key as keyof CreateEventFormData
        ] as Record<string, any>;
        Object.keys(objectValue).forEach((subKey) => {
          formData.append(`${key}.${subKey}`, objectValue[subKey]);
        });
      } else {
        const value = eventData[key as keyof CreateEventFormData];
        // Handle boolean and number types properly
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await eventApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload banner image only
  uploadBannerImage: async (
    imageFile: File
  ): Promise<{ bannerImageUrl: string }> => {
    const formData = new FormData();
    formData.append("bannerImage", imageFile);

    const response = await eventApi.post("/upload-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

  // Update event with file upload
  updateEventWithFile: async (
    id: string,
    eventData: Partial<CreateEventFormData>
  ): Promise<Event> => {
    const formData = new FormData();

    // Add image file if present
    if (eventData.bannerImage && eventData.bannerImage instanceof File) {
      formData.append("bannerImage", eventData.bannerImage);
    }

    // Add event data
    Object.keys(eventData).forEach((key) => {
      if (key === "bannerImage") return; // Skip bannerImage as it's handled above

      if (Array.isArray(eventData[key as keyof CreateEventFormData])) {
        // Handle arrays like specialGuests, pricingRanges
        const arrayValue = eventData[key as keyof CreateEventFormData] as any[];
        arrayValue.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            // Handle pricingRanges objects
            Object.keys(item).forEach((subKey) => {
              const value = item[subKey];
              // Handle boolean and number types properly
              if (typeof value === "boolean") {
                formData.append(`${key}[${index}].${subKey}`, value.toString());
              } else if (typeof value === "number") {
                formData.append(`${key}[${index}].${subKey}`, value.toString());
              } else {
                formData.append(`${key}[${index}].${subKey}`, value);
              }
            });
          } else {
            // Handle simple arrays like specialGuests
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (
        typeof eventData[key as keyof CreateEventFormData] === "object" &&
        eventData[key as keyof CreateEventFormData] !== null
      ) {
        // Handle objects like socialMediaLinks
        const objectValue = eventData[
          key as keyof CreateEventFormData
        ] as Record<string, any>;
        Object.keys(objectValue).forEach((subKey) => {
          formData.append(`${key}.${subKey}`, objectValue[subKey]);
        });
      } else {
        const value = eventData[key as keyof CreateEventFormData];
        // Handle boolean and number types properly
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await eventApi.patch(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    const response = await eventApi.delete(`/${id}`);

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
