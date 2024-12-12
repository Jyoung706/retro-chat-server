export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  error?: string;
  message: string;
}
