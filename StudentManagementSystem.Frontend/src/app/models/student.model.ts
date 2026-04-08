export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
  createdDate: string;
}

export interface CreateStudentDto {
  name: string;
  email: string;
  age: number;
  course: string;
}

export interface UpdateStudentDto {
  name: string;
  email: string;
  age: number;
  course: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  expiration: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
}
