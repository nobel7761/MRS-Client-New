export interface Category {
  _id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  _id: string;
  categoryId: string;
  category?: Category;
  question: string;
  answer: string;
  order: number;
  showHomePage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomePageFAQ {
  id: number;
  question: string;
  answer: string;
}
