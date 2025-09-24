export interface PricingRange {
  batchRange: string;
  fee: number;
  description: string;
  isPopular?: boolean;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface Event {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage: string;
  date: string;
  startsTime: string;
  venue: string;
  googleMapLink?: string;
  organizerName: string;
  organizerContactInfo: string;
  specialGuests?: string[];
  isPaidEvent: boolean;
  pricingRanges?: PricingRange[];
  seatLimit: number;
  socialMediaLinks?: SocialMediaLinks;
  status: EventStatus;
  visibility: EventVisibility;
  registeredCount?: number;
  registeredUsers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export enum EventStatus {
  UPCOMING = "Upcoming",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
}

export enum EventVisibility {
  PUBLIC = "Public",
  PRIVATE = "Private",
  ALUMNI_ONLY = "Alumni-only",
}

export interface CreateEventData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage: string | File;
  date: string;
  startsTime: string;
  venue: string;
  googleMapLink?: string;
  organizerName: string;
  organizerContactInfo: string;
  specialGuests?: string[];
  isPaidEvent: boolean;
  pricingRanges?: PricingRange[];
  seatLimit: number;
  socialMediaLinks?: SocialMediaLinks;
  status?: EventStatus;
  visibility?: EventVisibility;
}

export interface CreateEventFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage: File;
  date: string;
  startsTime: string;
  venue: string;
  googleMapLink?: string;
  organizerName: string;
  organizerContactInfo: string;
  specialGuests?: string[];
  isPaidEvent: boolean;
  pricingRanges?: PricingRange[];
  seatLimit: number;
  socialMediaLinks?: SocialMediaLinks;
  status?: EventStatus;
  visibility?: EventVisibility;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventFilters {
  search?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
