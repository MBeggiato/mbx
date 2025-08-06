-- Create guestbook table
CREATE TABLE IF NOT EXISTS guestbook_entries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO guestbook_entries (name, email, message, created_at) VALUES
('Sarah Johnson', 'sarah@example.com', 'Beautiful portfolio! Love the modern OS design concept.', '2024-08-01 10:30:00'),
('Mike Chen', 'mike.chen@example.com', 'Really impressive work! The window management is so smooth.', '2024-08-03 14:15:00'),
('Alex Rivera', 'alex@example.com', 'This is awesome! Can''t wait to see more projects like this.', '2024-08-04 16:45:00');
