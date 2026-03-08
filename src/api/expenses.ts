import { api } from "./api";
import type { CreateExpenseRequest, Expense } from "../types/expense";

export const getExpensesByGroupId = async (groupId: string) => {
  const response = await api.get<Expense[]>(`/expenses/group/${groupId}`);
  return response.data;
};

export const createExpense = async (data: CreateExpenseRequest) => {
  const response = await api.post<Expense>("/expenses", data);
  return response.data;
};

export const deleteExpense = async (id: string) => {
  await api.delete(`/expenses/${id}`);
};