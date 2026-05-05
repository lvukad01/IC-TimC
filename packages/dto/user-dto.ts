export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  lat?: number;
  lng?: number;
};

export type UserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
};
