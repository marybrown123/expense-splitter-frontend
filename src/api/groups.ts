import { api } from "./api";
import type {
  CreateGroupRequest,
  Group,
  GroupBalance,
  SettlementSuggestion,
} from "../types/group";

import type { AddGroupMemberRequest, GroupMember } from "../types/member";

export const getGroupMembers = async (groupId: string) => {
  const response = await api.get<GroupMember[]>(`/groups/${groupId}/members`);
  return response.data;
};

export const addGroupMember = async (
  groupId: string,
  data: AddGroupMemberRequest
) => {
  const response = await api.post<GroupMember>(`/groups/${groupId}/members`, data);
  return response.data;
};

export const getGroups = async () => {
  const response = await api.get<Group[]>("/groups");
  return response.data;
};

export const createGroup = async (data: CreateGroupRequest) => {
  const response = await api.post<Group>("/groups", data);
  return response.data;
};

export const getGroupById = async (id: string) => {
  const response = await api.get<Group>(`/groups/${id}`);
  return response.data;
};

export const getGroupBalances = async (id: string) => {
  const response = await api.get<GroupBalance[]>(`/groups/${id}/balances`);
  return response.data;
};

export const getSettlementSuggestions = async (id: string) => {
  const response = await api.get<SettlementSuggestion[]>(
    `/groups/${id}/settlement-suggestions`
  );
  return response.data;
};