import { api } from "./api";
import type { CreateGroupRequest, Group } from "../types/group";

export const getGroups = async () => {
  const response = await api.get<Group[]>("/groups");
  return response.data;
};

export const createGroup = async (data: CreateGroupRequest) => {
  const response = await api.post<Group>("/groups", data);
  return response.data;
};