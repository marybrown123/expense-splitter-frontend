import { useEffect, useState } from "react";
import { getGroupMembers } from "../api/groups";
import type { GroupMember } from "../types/member";
import type { CreateExpenseRequest } from "../types/expense";

interface Props {
  groupId: string;
  onSubmit: (data: CreateExpenseRequest) => Promise<void>;
}

function AddExpenseForm({ groupId, onSubmit }: Props) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByUserId, setPaidByUserId] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getGroupMembers(groupId);
        setMembers(data);

        if (data.length > 0) {
          setPaidByUserId(data[0].userId);
        }
      } catch {
        setError("Failed to load group members.");
      }
    };

    loadMembers();
  }, [groupId]);

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    const filteredParticipants = selectedParticipants.filter(
      (id) => id !== paidByUserId
    );

    if (filteredParticipants.length === 0) {
      setError("Select at least one participant.");
      return;
    }

    const share = parsedAmount / filteredParticipants.length;

    const participants = filteredParticipants.map((userId) => ({
      userId,
      shareAmount: Number(share.toFixed(2)),
    }));

    try {
      setIsSubmitting(true);

      await onSubmit({
        groupId,
        title,
        amount: parsedAmount,
        paidByUserId,
        participants,
      });

      setTitle("");
      setAmount("");
      setSelectedParticipants([]);
    } catch {
      setError("Failed to create expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="label" htmlFor="expense-title">
            Title
          </label>
          <input
            id="expense-title"
            className="input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dinner, Groceries, Taxi"
            required
          />
        </div>

        <div className="form-group">
          <label className="label" htmlFor="expense-amount">
            Amount
          </label>
          <input
            id="expense-amount"
            className="input"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="label" htmlFor="paid-by">
          Paid by
        </label>
        <select
          id="paid-by"
          className="select"
          value={paidByUserId}
          onChange={(e) => {
            const newPaidByUserId = e.target.value;
            setPaidByUserId(newPaidByUserId);
            setSelectedParticipants((prev) =>
              prev.filter((id) => id !== newPaidByUserId)
            );
          }}
        >
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.username}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="label">Participants</label>

        {members.length === 0 ? (
          <div className="empty-state">No members available.</div>
        ) : (
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            {members.map((member) => {
              const isPayer = member.userId === paidByUserId;
              const isSelected = selectedParticipants.includes(member.userId);

              return (
                <label
                  key={member.userId}
                  className="card"
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    minHeight: "72px",
                    cursor: isPayer ? "default" : "pointer",
                    opacity: isPayer ? 0.75 : 1,
                  }}
                >
                  <div
                    className="actions"
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="actions"
                      style={{
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <span>{member.username}</span>
                      {isPayer && <span className="badge">payer</span>}
                    </div>

                    {!isPayer && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleParticipant(member.userId)}
                      />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating expense..." : "Create expense"}
        </button>
      </div>
    </form>
  );
}

export default AddExpenseForm;