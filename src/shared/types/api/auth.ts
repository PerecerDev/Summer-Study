export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  gradeLevel: string;
  locale: string;
}

export interface SessionResponse {
  user: UserDto;
  isAuthenticated: boolean;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
