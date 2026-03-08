import { useState } from "react";

interface AddMemberFormProps {
  onSubmit: (email: string) => Promise<void>;
}

function AddMemberForm({ onSubmit }: AddMemberFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await onSubmit(email);
      setEmail("");
    } catch {
      setError("Failed to add member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add member</h2>

      <div>
        <label htmlFor="member-email">Email</label>
        <input
          id="member-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add member"}
      </button>
    </form>
  );
}

export default AddMemberForm;