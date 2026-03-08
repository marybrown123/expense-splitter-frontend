import type { GroupMember } from "../types/member";
import type { Expense } from "../types/expense";
import { formatCurrency } from "../utils/formatCurrency";

interface ExpenseListProps {
  expenses: Expense[];
  members: GroupMember[];
  currency: string;
  onDelete: (id: string) => void;
}
function getUsernameById(userId: string, members: GroupMember[]) {
  return members.find((member) => member.userId === userId)?.username ?? "Unknown user";
}

function ExpenseList({ expenses, members, currency, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

  return (
    <div className="card-list">
      {expenses.map((expense) => (
        <div key={expense.id} className="card">
          <h3>{expense.title}</h3>
          <p>Amount: {formatCurrency(expense.amount, currency)}</p>
          <p>Paid by: {getUsernameById(expense.paidByUserId, members)}</p>
          <p>Date: {new Date(expense.expenseDate).toLocaleString()}</p>

          <h4>Participants</h4>

          {expense.participants.length === 0 ? (
            <p>No participants.</p>
          ) : (
            <div>
              {expense.participants.map((participant) => (
                <div key={`${expense.id}-${participant.userId}`}>
                  <p>{getUsernameById(participant.userId, members)}</p>
                  <p>Share: {formatCurrency(participant.shareAmount, currency)}</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="danger-button"
            onClick={() => onDelete(expense.id)}
          >
            Delete expense
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;