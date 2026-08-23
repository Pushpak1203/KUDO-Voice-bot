export interface AppError {
  code: string;
  source: string;
  message: string;
  recoverable: boolean;
  timestamp: number;
}
