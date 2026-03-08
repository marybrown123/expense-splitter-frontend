export interface ExpenseParticipant {
  userId: string;
  shareAmount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  paidByUserId: string;
  title: string;
  amount: number;
  expenseDate: string;
  participants: ExpenseParticipant[];
}

export interface CreateExpenseParticipantRequest {
  userId: string;
  shareAmount: number;
}

export interface CreateExpenseRequest {
  groupId: string;
  paidByUserId: string;
  title: string;
  amount: number;
  expenseDate?: string;
  participants: CreateExpenseParticipantRequest[];
}