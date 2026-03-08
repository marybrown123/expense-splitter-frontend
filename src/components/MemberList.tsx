import type { GroupMember } from "../types/member";

interface MemberListProps {
  members: GroupMember[];
}

function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return <p>No members yet.</p>;
  }

  return (
    <div className="card-list">
      {members.map((member) => (
        <div key={member.userId} className="card">
          <h3>{member.username}</h3>
          <p>Role: {member.role}</p>
          <p>Joined: {new Date(member.joinedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default MemberList;