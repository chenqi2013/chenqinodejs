export interface Role {
  id: number;
  name: string;
  description: string;
  image: string;
  language: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
