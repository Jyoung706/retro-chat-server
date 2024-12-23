export interface ResponseFormat<T> {
  success: boolean;
  result: T;
  error?: string;
  message: string;
}
