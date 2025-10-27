import client from "./api";
import {
  SilverJubileeParticipant,
  SilverJubileeFormData,
  SilverJubileeGuestSubmissionData,
  SilverJubileeBabySubmissionData,
} from "@/types/silverJubilee";

export const silverJubileeApi = {
  // Register a new participant for Silver Jubilee
  register: async (
    data:
      | SilverJubileeFormData
      | SilverJubileeGuestSubmissionData
      | SilverJubileeBabySubmissionData
  ): Promise<{
    success: boolean;
    message: string;
    data: SilverJubileeParticipant;
  }> => {
    const response = await client.post("/silver-jubilee/register", data);

    // Handle direct participant object response (backend returns participant directly)
    if (response.data._id) {
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    }

    // Handle wrapped response format
    return response.data;
  },

  // Get all registrations with optional filters
  getRegistrations: async (filters?: {
    category?: string;
    year?: number;
    group?: string;
  }): Promise<{
    success: boolean;
    data: SilverJubileeParticipant[];
    count: number;
  }> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.year) params.append("year", filters.year.toString());
    if (filters?.group) params.append("group", filters.group);

    const response = await client.get(
      `/api/silver-jubilee/register?${params.toString()}`
    );
    return response.data;
  },

  // Create a new participant
  createParticipant: async (
    data: SilverJubileeFormData | SilverJubileeGuestSubmissionData
  ): Promise<SilverJubileeParticipant> => {
    const response = await client.post("/silver-jubilee/participants", data);
    return response.data;
  },

  // Get all participants
  getAllParticipants: async (): Promise<SilverJubileeParticipant[]> => {
    const response = await client.get("/silver-jubilee");
    return response.data;
  },

  // Get participant by ID
  getParticipantById: async (id: string): Promise<SilverJubileeParticipant> => {
    const response = await client.get(`/silver-jubilee/participants/${id}`);
    return response.data;
  },

  // Update participant
  updateParticipant: async (
    id: string,
    data: Partial<SilverJubileeFormData>
  ): Promise<SilverJubileeParticipant> => {
    const response = await client.put(
      `/silver-jubilee/participants/${id}`,
      data
    );
    return response.data;
  },

  // Delete participant
  deleteParticipant: async (id: string): Promise<void> => {
    await client.delete(`/silver-jubilee/participants/${id}`);
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await client.get("/silver-jubilee/dashboard");
    return response.data;
  },

  // Get comprehensive statistics
  getStatistics: async () => {
    const response = await client.get("/silver-jubilee/statistics");
    return response.data;
  },

  // Get participants by batch and group (for guest registration)
  getParticipantsByBatchAndGroup: async (
    batch: number,
    group: string
  ): Promise<{
    batch: number;
    group: string;
    total: number;
    participants: SilverJubileeParticipant[];
  }> => {
    const response = await client.get(
      `/silver-jubilee/by-batch-group?batch=${batch}&group=${group}`
    );
    return response.data;
  },
};
