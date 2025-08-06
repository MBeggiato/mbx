import { NextRequest, NextResponse } from "next/server";
import { getGuestbookEntries, addGuestbookEntry } from "@/lib/database";
import { validateGuestbookEntry } from "@/lib/contentModeration";

export async function GET() {
  try {
    const entries = await getGuestbookEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error in GET /api/guestbook:", error);
    return NextResponse.json(
      { error: "Failed to fetch guestbook entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    // Validate content for inappropriate language and spam
    const validation = validateGuestbookEntry(name.trim(), message.trim());

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error,
          field: validation.field,
          details: validation.details,
        },
        { status: 400 }
      );
    }

    const newEntry = await addGuestbookEntry(
      name.trim(),
      email?.trim() || null,
      message.trim()
    );
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/guestbook:", error);
    return NextResponse.json(
      { error: "Failed to add guestbook entry" },
      { status: 500 }
    );
  }
}
