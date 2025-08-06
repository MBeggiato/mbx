import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export interface GuestbookEntry {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const result = await pool.query(
      "SELECT id, name, email, message, created_at FROM guestbook_entries ORDER BY created_at DESC"
    );

    return result.rows.map((row) => ({
      ...row,
      created_at: new Date(row.created_at).toLocaleString(),
    }));
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    throw new Error("Failed to fetch guestbook entries");
  }
}

export async function addGuestbookEntry(
  name: string,
  email: string | null,
  message: string
): Promise<GuestbookEntry> {
  try {
    const result = await pool.query(
      "INSERT INTO guestbook_entries (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, message, created_at",
      [name, email || null, message]
    );

    const entry = result.rows[0];
    return {
      ...entry,
      created_at: new Date(entry.created_at).toLocaleString(),
    };
  } catch (error) {
    console.error("Error adding guestbook entry:", error);
    throw new Error("Failed to add guestbook entry");
  }
}

export default pool;
