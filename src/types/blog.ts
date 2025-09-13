export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface BlogMedia {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  alt?: string;
  caption?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: BlogCategory;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  tags: string[];
  media: BlogMedia[];
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface BlogFilters {
  category?: string;
  search?: string;
  author?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
