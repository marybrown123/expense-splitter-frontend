import type { GroupMember } from "../types/member";
import type { Expense } from "../types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  members: GroupMember[];
  onDelete: (id: string) => void;
}

function getUsernameById(userId: string, members: GroupMember[]) {
  return members.find((member) => member.userId === userId)?.username ?? "Unknown user";
}

function ExpenseList({ expenses, members, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <h3>{expense.title}</h3>
          <p>Amount: {expense.amount.toFixed(2)}</p>
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
                  <p>Share: {participant.shareAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => onDelete(expense.id)}>Delete expense</button>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;