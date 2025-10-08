-- Create Google Calendar Tokens Table
-- Run this SQL manually if migration doesn't work

CREATE TABLE IF NOT EXISTS google_calendar_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiryDate" BIGINT,
    scope VARCHAR(255),
    "tokenType" VARCHAR(50),
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "FK_google_calendar_tokens_user_id" 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS "IDX_google_calendar_tokens_user_id" ON google_calendar_tokens(user_id);
CREATE INDEX IF NOT EXISTS "IDX_google_calendar_tokens_active" ON google_calendar_tokens(user_id, "isActive");

-- Check if table was created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'google_calendar_tokens'
ORDER BY ordinal_position;