import client from "./api";
import {
  SilverJubileeParticipant,
  SilverJubileeFormData,
} from "@/types/silverJubilee";

export const silverJubileeApi = {
  // Create a new participant
  createParticipant: async (
    data: SilverJubileeFormData
  ): Promise<SilverJubileeParticipant> => {
    const response = await client.post("/silver-jubilee/participants", data);
    return response.data;
  },

  // Get all participants
  getAllParticipants: async (): Promise<SilverJubileeParticipant[]> => {
    const response = await client.get("/silver-jubilee/participants");
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
};
