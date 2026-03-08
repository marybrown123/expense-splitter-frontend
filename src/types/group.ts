export interface Group {
  id: string;
  name: string;
  currency: string;
}

export interface CreateGroupRequest {
  name: string;
  currency: string;
}