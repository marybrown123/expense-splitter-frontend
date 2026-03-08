export interface Group {
  id: string;
  name: string;
  currency: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

export interface CreateGroupRequest {
  name: string;
  currency: string;
}

export interface GroupBalance {
  userId: string
  username: string
  paid: number
  owed: number
  balance: number
}

export interface SettlementSuggestion {
  fromUserId: string
  fromUsername: string
  toUserId: string
  toUsername: string
  amount: number
}