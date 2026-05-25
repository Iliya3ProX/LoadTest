-- Create enum type for operation types
CREATE TYPE IF NOT EXISTS op_type AS ENUM ('Initial', 'Deposit', 'Expense');

-- Create balances table
CREATE TABLE IF NOT EXISTS balances (
    id UUID PRIMARY KEY,
    balance DOUBLE PRECISION NOT NULL DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create operations table
CREATE TABLE IF NOT EXISTS operations (
    id UUID PRIMARY KEY,
    balance_id UUID NOT NULL REFERENCES balances(id) ON DELETE CASCADE,
    type op_type NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    seq_n INTEGER NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on operations for faster lookups by balance_id
CREATE INDEX IF NOT EXISTS idx_operations_balance_id ON operations(balance_id);
CREATE INDEX IF NOT EXISTS idx_operations_seq_n ON operations(balance_id, seq_n);
