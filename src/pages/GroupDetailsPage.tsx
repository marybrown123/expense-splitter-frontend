import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  addGroupMember,
  getGroupBalances,
  getGroupById,
  getGroupMembers,
  getSettlementSuggestions,
} from "../api/groups";
import { createExpense, deleteExpense, getExpensesByGroupId } from "../api/expenses";

import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import AddMemberForm from "../components/AddMemberForm";
import MemberList from "../components/MemberList";

import type { Group, GroupBalance, SettlementSuggestion } from "../types/group";
import type { CreateExpenseRequest, Expense } from "../types/expense";
import type { GroupMember } from "../types/member";

import { formatCurrency } from "../utils/formatCurrency";
import { getUserIdFromToken } from "../utils/getUserFromToken";

function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [suggestions, setSuggestions] = useState<SettlementSuggestion[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = token ? getUserIdFromToken(token) : null;

  const isOwner = members.some(
    (member) => member.userId === currentUserId && member.role === "Owner"
  );

  const loadGroupData = async (groupId: string) => {
    const [groupData, balancesData, suggestionsData, expensesData, membersData] =
      await Promise.all([
        getGroupById(groupId),
        getGroupBalances(groupId),
        getSettlementSuggestions(groupId),
        getExpensesByGroupId(groupId),
        getGroupMembers(groupId),
      ]);

    setGroup(groupData);
    setBalances(balancesData);
    setSuggestions(suggestionsData);
    setExpenses(expensesData);
    setMembers(membersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Group id is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");
        await loadGroupData(id);
      } catch {
        setError("Failed to load group details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddMember = async (email: string) => {
    if (!id) return;

    try {
      setError("");
      await addGroupMember(id, { email });
      await loadGroupData(id);
    } catch {
      setError("Failed to add member.");
    }
  };

  const handleCreateExpense = async (data: CreateExpenseRequest) => {
    if (!id) return;

    try {
      setError("");
      await createExpense(data);
      await loadGroupData(id);
    } catch {
      setError("Failed to create expense.");
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!id) return;

    try {
      setError("");
      await deleteExpense(expenseId);
      await loadGroupData(id);
    } catch {
      setError("Failed to delete expense.");
    }
  };

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <p className="text-muted">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="card">
            <div className="error-box">{error}</div>

            <div className="actions" style={{ marginTop: "16px" }}>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="card">
            <p className="text-muted">Group not found.</p>

            <div className="actions" style={{ marginTop: "16px" }}>
              <Link to="/dashboard" className="btn btn-secondary">
                Back to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="actions" style={{ marginBottom: "20px" }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <div>
              <h1 className="page-title">{group.name}</h1>
              <p className="page-subtitle">
                Shared expense tracking for this group.
              </p>
            </div>

            <span className="badge">{group.currency}</span>
          </div>

          <div className="divider" />

          <div className="grid grid-3">
            <div>
              <p className="text-muted" style={{ marginBottom: "6px" }}>
                Owner
              </p>
              <strong>{group.ownerName}</strong>
            </div>

            <div>
              <p className="text-muted" style={{ marginBottom: "6px" }}>
                Created at
              </p>
              <strong>{new Date(group.createdAt).toLocaleString()}</strong>
            </div>

            <div>
              <p className="text-muted" style={{ marginBottom: "6px" }}>
                Members
              </p>
              <strong>{members.length}</strong>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: "20px" }}>
            <div className="error-box">{error}</div>
          </div>
        )}

        <div className="grid grid-2" style={{ marginBottom: "20px" }}>
          <div className="card">
            <h2 className="section-title">Balances</h2>
            <p className="section-subtitle">
              Overview of what each member paid, owes and their final balance.
            </p>

            {balances.length === 0 ? (
              <div className="empty-state">No balances yet.</div>
            ) : (
              <div
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                <div className="grid">
                  {balances.map((item) => (
                    <div key={item.userId} className="card">
                      <h3 style={{ marginTop: 0 }}>{item.username}</h3>

                      <p>
                        <strong>Paid:</strong>{" "}
                        {formatCurrency(item.paid, group.currency)}
                      </p>

                      <p>
                        <strong>Owed:</strong>{" "}
                        {formatCurrency(item.owed, group.currency)}
                      </p>

                      <p style={{ marginBottom: 0 }}>
                        <strong>Balance:</strong>{" "}
                        {formatCurrency(item.balance, group.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="section-title">Settlement suggestions</h2>
            <p className="section-subtitle">
              Suggested transfers to settle debts inside the group.
            </p>

            {suggestions.length === 0 ? (
              <div className="empty-state">No settlement suggestions.</div>
            ) : (
              <div
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                <div className="grid">
                  {suggestions.map((item, index) => (
                    <div
                      key={`${item.fromUserId}-${item.toUserId}-${index}`}
                      className="card"
                    >
                      <p style={{ marginTop: 0 }}>
                        <strong>{item.fromUsername}</strong> →{" "}
                        <strong>{item.toUsername}</strong>
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        <strong>Amount:</strong>{" "}
                        {formatCurrency(item.amount, group.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 className="section-title">Add expense</h2>
          <p className="section-subtitle">
            Add a new shared expense for this group.
          </p>

          <AddExpenseForm groupId={group.id} onSubmit={handleCreateExpense} />
        </div>

        <div className="card" style={{ marginBottom: "20px" }}>
          <h2 className="section-title">Expenses</h2>
          <p className="section-subtitle">
            All expenses added to this group.
          </p>

          <ExpenseList
            expenses={expenses}
            members={members}
            currency={group.currency}
            onDelete={handleDeleteExpense}
          />
        </div>

        <div className="card">
          <h2 className="section-title">Members</h2>
          <p className="section-subtitle">
            Group participants and their roles.
          </p>

          {isOwner ? (
            <div style={{ marginBottom: "20px" }}>
              <AddMemberForm onSubmit={handleAddMember} />
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }} className="empty-state">
              Only the group owner can add new members.
            </div>
          )}

          <MemberList members={members} />
        </div>
      </div>
    </div>
  );
}

export default GroupDetailsPage;