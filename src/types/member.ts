export interface GroupMember {
  groupId: string;
  userId: string;
  username: string;
  role: string;
  joinedAt: string;
}

export interface AddGroupMemberRequest {
  email: string;
}