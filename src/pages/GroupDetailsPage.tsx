import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getGroupBalances,
  getGroupById,
  getSettlementSuggestions,
} from "../api/groups";
import { createExpense, deleteExpense, getExpensesByGroupId } from "../api/expenses";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";

import type { Group, GroupBalance, SettlementSuggestion } from "../types/group";
import type { CreateExpenseRequest, Expense } from "../types/expense";

import { addGroupMember, getGroupMembers } from "../api/groups";
import AddMemberForm from "../components/AddMemberForm";
import MemberList from "../components/MemberList";
import type { GroupMember } from "../types/member";
import { formatCurrency } from "../utils/formatCurrency";

function GroupDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<GroupBalance[]>([]);
  const [suggestions, setSuggestions] = useState<SettlementSuggestion[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<GroupMember[]>([]);

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
    return <p>Loading group details...</p>;
  }

  if (error && !group) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div>
        <p>Group not found.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/dashboard" className="back-link">
        Back to dashboard
      </Link>
      <div className="page-header">
        <h1>{group.name}</h1>
        <div className="meta">
          <p>Currency: {group.currency}</p>
          <p>Owner: {group.ownerName}</p>
          <p>Created at: {new Date(group.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <section>
        <h2>Balances</h2>

        {balances.length === 0 ? (
          <p>No balances yet.</p>
        ) : (
          <div>
            {balances.map((item) => (
              <div key={item.userId}>
                <h3>{item.username}</h3>
                <p>Paid: {formatCurrency(item.paid, group.currency)}</p>
                <p>Owed: {formatCurrency(item.owed, group.currency)}</p>
                <p>Balance: {formatCurrency(item.balance, group.currency)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Settlement suggestions</h2>

        {suggestions.length === 0 ? (
          <p>No settlement suggestions.</p>
        ) : (
          <div>
            {suggestions.map((item, index) => (
              <div key={`${item.fromUserId}-${item.toUserId}-${index}`}>
                <p>
                  {item.fromUsername} → {item.toUsername}
                </p>
                <p>Amount: {item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <AddExpenseForm groupId={group.id} onSubmit={handleCreateExpense} />
      </section>

      <section>
        <h2>Expenses</h2>
          <ExpenseList
            expenses={expenses}
            members={members}
            currency={group.currency}
            onDelete={handleDeleteExpense}
          />
      </section>
      <section>
        <AddMemberForm onSubmit={handleAddMember} />
        <MemberList members={members} />
      </section>
    </div>
  );
}

export default GroupDetailsPage;