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

  useEffect(() => {
    const loadMembers = async () => {
      const data = await getGroupMembers(groupId);
      setMembers(data);

      if (data.length > 0) {
        setPaidByUserId(data[0].userId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = Number(amount);

    if (selectedParticipants.length === 0) {
      setError("Select at least one participant.");
      return;
    }

    const share = parsedAmount / selectedParticipants.length;

    const participants = selectedParticipants.map((userId) => ({
      userId,
      shareAmount: Number(share.toFixed(2)),
    }));

    try {
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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add expense</h2>

      <div className="inline-row">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Paid by</label>
        <select
          value={paidByUserId}
          onChange={(e) => setPaidByUserId(e.target.value)}
        >
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.username}
            </option>
          ))}
        </select>
      </div>

        <div className="checkbox-list">
        <label>Participants</label>
        {members.map((member) => (
    <label key={member.userId} className="checkbox-item">
    <input
        type="checkbox"
        disabled={member.userId === paidByUserId}
        checked={selectedParticipants.includes(member.userId)}
        onChange={() => toggleParticipant(member.userId)}
    />
    {member.username} {member.userId === paidByUserId && "(payer)"}
    </label>
        ))}
        </div>

      {error && <p>{error}</p>}

      <button type="submit">Create expense</button>
    </form>
  );
}

export default AddExpenseForm;