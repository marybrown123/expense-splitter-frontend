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
    return <div className="empty-state">No expenses yet.</div>;
  }

  return (
    <div
      style={{
        maxHeight: "420px",
        overflowY: "auto",
        paddingRight: "6px",
        scrollbarGutter: "stable",
      }}
    >
      <div className="grid">
        {expenses.map((expense) => (
          <div key={expense.id} className="card">
            <div
              className="actions"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{expense.title}</h3>
                <p className="text-muted" style={{ margin: "8px 0 0" }}>
                  {new Date(expense.expenseDate).toLocaleString()}
                </p>
              </div>

              <span className="badge">
                {formatCurrency(expense.amount, currency)}
              </span>
            </div>

            <p style={{ marginTop: 0 }}>
              <strong>Paid by:</strong>{" "}
              {getUsernameById(expense.paidByUserId, members)}
            </p>

            <div className="divider" />

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginTop: 0, marginBottom: "12px" }}>Participants</h4>

              {expense.participants.length === 0 ? (
                <div className="empty-state">No participants.</div>
              ) : (
                <div className="grid">
                  {expense.participants.map((participant) => (
                    <div
                      key={`${expense.id}-${participant.userId}`}
                      className="card"
                      style={{ padding: "14px 16px" }}
                    >
                      <div
                        className="actions"
                        style={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{getUsernameById(participant.userId, members)}</span>
                        <span className="text-muted">
                          {formatCurrency(participant.shareAmount, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="actions">
              <button
                className="btn btn-danger"
                onClick={() => onDelete(expense.id)}
              >
                Delete expense
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;