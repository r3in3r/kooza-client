// src/app/models/battlemetrics.models.ts
export interface Server {
  id: string;
  type: string;
  attributes: {
    name: string;
    // Add other relevant attributes here
  };
}

export interface ApiResponse {
  data: Server[];
  links?: {
    next?: string;
  };
}
