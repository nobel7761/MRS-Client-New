import client from "./api";

export interface SouvenirData {
  category: string;
  name: string;
  batch: string;
  group: string;
  phoneNumber: string;
  email: string;
  content: string;
  photo?: File;
}

export interface Souvenir {
  _id: string;
  category: string;
  name: string;
  batch: string;
  group: string;
  phoneNumber: string;
  email: string;
  photoUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SouvenirListResponse {
  souvenirs: Souvenir[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SouvenirFilters {
  category?: string;
  batch?: string;
  group?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const souvenirApi = {
  // Create a new souvenir with photo upload
  create: async (data: SouvenirData, photoFile: File): Promise<Souvenir> => {
    const formData = new FormData();

    // Append photo file - IMPORTANT: field name must be 'photo'
    formData.append("photo", photoFile);

    // Append text fields
    formData.append("category", data.category);
    formData.append("name", data.name);
    formData.append("batch", data.batch);
    formData.append("group", data.group);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("content", data.content); // HTML string from rich text editor

    const response = await client.post("/souvenir-management", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Get all souvenirs with optional filters
  getAll: async (filters?: SouvenirFilters): Promise<SouvenirListResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.batch) params.append("batch", filters.batch);
    if (filters?.group) params.append("group", filters.group);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await client.get(
      `/souvenir-management?${params.toString()}`
    );
    return response.data;
  },

  // Get a single souvenir by ID
  getById: async (id: string): Promise<Souvenir> => {
    const response = await client.get(`/souvenir-management/${id}`);
    return response.data;
  },

  // Update souvenir fields (without photo)
  update: async (
    id: string,
    data: Partial<SouvenirData>
  ): Promise<Souvenir> => {
    const response = await client.patch(`/souvenir-management/${id}`, data);
    return response.data;
  },

  // Update only the photo
  updatePhoto: async (id: string, photoFile: File): Promise<Souvenir> => {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const response = await client.patch(
      `/souvenir-management/${id}/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Delete a souvenir
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await client.delete(`/souvenir-management/${id}`);
    return response.data;
  },
};
