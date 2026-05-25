export interface Operation {
  id: string;
  type: string;
  amount: number;
  sequenceNumber: number;
  created: string;
}

export interface Balance {
  id: string;
  amount: number;
  operations: Operation[];
}

export interface BalanceList {
  id: string;
  amount: number;
}

export interface CreateBalanceRequest {
  initialAmount: number | null;
}

export interface DepositRequest {
  amount: number;
}

export interface ExpenseRequest {
  amount: number;
}
